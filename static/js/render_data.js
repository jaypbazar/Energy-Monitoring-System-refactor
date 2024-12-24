// Cache for operators data
let operatorsCache = null;

// Fetch operators data
async function fetchOperators() {
    if (operatorsCache === null) {
        const response = await fetch("/fetch?operators", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        operatorsCache = await response.json();
    }
    return operatorsCache;
}

// Fetch equipment logs
async function fetchEquipmentLogs() {
    const response = await fetch("/fetch?logs", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

// Populate logs table
async function populateLogsTable() {
    const logs = await fetchEquipmentLogs();
    const tbody = document.getElementById('logsTableBody');
    tbody.innerHTML = ''; // Clear existing content

    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.EquipmentName}</td>
            <td>${log.OperatorName}</td>
            <td>${log.EnergyConsumed}</td>
            <td>${new Date(log.TimeStamp).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Populate company options
async function populateCompanySelect() {
    const selectForms = document.querySelectorAll('select[name="CompanyID"], select[name="editCompanyID"]');
    
    const results = await fetch(
        "/fetch?companies",
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then((res) => res.json());

    for (let selectForm of selectForms) {
        // Keep the first option (placeholder)
        if (selectForm.children.length != 1) {
            let defaultOpt = selectForm.children[0];
            selectForm.innerHTML = null;
            selectForm.appendChild(defaultOpt);
        }
        // Add company options
        for (let company of results) {
            let newOption = document.createElement('option');
            newOption.value = company['CompanyID'];
            newOption.innerText = company['CompanyID'] + " - " + company['CompanyName'];
            selectForm.appendChild(newOption);
        }
    }
}

// Add event listener for logs modal
document.getElementById('equipmentLogsModal').addEventListener('show.bs.modal', populateLogsTable);

// Populate operator select dropdown
async function populateOperatorSelect(selectElement) {
    const operators = await fetchOperators();
    
    // Clear existing options except the first disabled one
    selectElement.innerHTML = '<option value="" disabled selected>-- Select an Operator --</option>';
    
    // Add operator options
    operators.forEach(operator => {
        const option = document.createElement('option');
        option.value = operator.OperatorID;
        option.textContent = `${operator.OperatorID} - ${operator.OperatorName}`;
        selectElement.appendChild(option);
    });
}

// Function to create action buttons
function createActionButtons(type, data) {
    switch(type){
        case 'equipment': type = 'Equipment'; break;
        case 'operator': type = 'Operator'; break;
        case 'companie': type = 'Company'; break;
    }

    const actionCell = document.createElement('td');
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-flex gap-2';

    // Edit button
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-sm btn-success rounded-pill';
    editButton.textContent = 'Edit';
    
    editButton.addEventListener('click', () => {
        // Get the modal element and create a new Modal instance
        const modalElement = document.getElementById(`edit${type}Modal`);
        const modal = new bootstrap.Modal(modalElement);
        const form = document.getElementById(`edit${type}Form`);
        
        // Set form data
        for (const key in data) {
            const input = form.querySelector(`[name="edit${key}"]`);
            if (input) {
                input.value = data[key];
            }
        }
        
        // For company select fields
        if (form.querySelector('[name="editCompanyID"]')) {
            setTimeout(() => {
                form.querySelector('[name="editCompanyID"]').value = data.CompanyID;
            }, 100);
        }
        populateCompanySelect();
        
        // Store ID for submission
        form.dataset.id = data[`${type}ID`];
        
        modal.show();
    });

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm btn-danger rounded-pill';
    deleteButton.textContent = 'Delete';
    
    deleteButton.addEventListener('click', () => {
        // Show delete confirmation modal
        const modalElement = document.getElementById('deleteConfirmationModal');
        const modal = new bootstrap.Modal(modalElement);
        const confirmButton = document.getElementById('confirmDeleteButton');
        
        // Update modal content
        document.getElementById('deleteItemType').textContent = type;
        document.getElementById('deleteItemName').textContent = data[`${type}Name`];
        
        // Set up confirmation button
        confirmButton.onclick = async () => {
            try {
                const response = await fetch(`/delete?${type.toLowerCase()}&id=${data[`${type}ID`]}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const result = await response.json();
                if (result.successful) {
                    modal.hide();
                    // Refresh the table
                    renderData(`${type.toLowerCase()}sContent`);
                    // Clear cache if deleting an operator
                    if (type === 'Operator') {
                        operatorsCache = null;
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        
        modal.show();
    });

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    actionCell.appendChild(buttonContainer);
    return actionCell;
}

// Render table entries asynchronously
async function renderData(type) {
    try {
        const contentDiv = document.getElementById(type);
        if (!contentDiv) {
            console.error(`Container ${type} not found`);
            return;
        }

        const tbody = contentDiv.querySelector('tbody');
        if (!tbody) {
            console.error(`Table body not found in ${type}`);
            return;
        }

        const response = await fetch(`/fetch?${type.replace('Content', '')}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        const results = await response.json();

        const orderedKeys = {
            'equipmentsContent': ['EquipmentID', 'EquipmentName', 'PowerRating', 'ManufacturingDate', 'CompanyID'],
            'operatorsContent': ['OperatorID', 'OperatorName', 'Occupation', 'PhoneNumber', 'CompanyName'],
            'companiesContent': ['CompanyID', 'CompanyName', 'Location', 'Contact'],
            'energyContent': ['EquipmentID', 'EquipmentName', 'EnergyConsumed']
        };

        if (!orderedKeys[type]) {
            console.error(`Invalid content type: ${type}`);
            return;
        }

        tbody.innerHTML = '';
        
        results.forEach(object => {
            if (!object) return;
            
            const row = document.createElement('tr');
            
            orderedKeys[type].forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = object[key] ?? '';
                row.appendChild(cell);
            });

            if (type !== 'energyContent') {
                const entityType = type.replace('Content', '').replace(/s$/, '');
                row.appendChild(createActionButtons(entityType, object));
            }

            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Render error:', error);
        createFlashMessage('Failed to load data', 'danger');
    }
}