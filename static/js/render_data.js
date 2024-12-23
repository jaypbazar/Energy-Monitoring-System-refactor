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
    const selectForms = document.getElementsByName('CompanyID');

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
        if (selectForm.children.length != 1) {
            let defaultOpt = selectForm.children[0];
            selectForm.innerHTML = null;
            selectForm.appendChild(defaultOpt);
        }
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
            populateCompanySelect();
            setTimeout(() => {
                form.querySelector('[name="editCompanyID"]').value = data.CompanyID;
            }, 100);
        }
        
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
    const results = await fetch(
        "/fetch?" + type.replace('Content', ''),
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then((res) => res.json());

    const orderedKeys = {
        'equipmentsContent': ['EquipmentID', 'EquipmentName', 'PowerRating', 'ManufacturingDate', 'CompanyID'],
        'operatorsContent': ['OperatorID', 'OperatorName', 'Occupation', 'PhoneNumber', 'CompanyName'],
        'companiesContent': ['CompanyID', 'CompanyName', 'Location', 'Contact'],
        'energyContent': ['EquipmentID', 'EquipmentName', 'EnergyConsumed']
    };

    const parent = document.getElementById(type);
    const table = parent.getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    for (let object of results) {
        const newRow = document.createElement('tr');
        
        for (let key of orderedKeys[type]) {
            const newRowData = document.createElement('td');
            newRowData.innerText = object[key];
            newRow.appendChild(newRowData);
        }

        // Add action buttons for equipment, operator, and company tables
        if (type !== 'energyContent') {
            const entityType = type.replace('Content', '').replace(/s$/, '');
            const actionCell = createActionButtons(entityType, object);
            newRow.appendChild(actionCell);
        }

        // Add Use button for equipment entries
        if (type === 'equipmentsContent') {
            const useButton = document.createElement('button');
            useButton.className = 'btn rounded-pill ms-2';
            useButton.style.backgroundColor = '#ffab5d';
            useButton.style.color = '#442c12';
            useButton.textContent = 'Use';
            
            useButton.addEventListener('click', async () => {
                const modal = new bootstrap.Modal(document.getElementById('equipmentUsageModal'));
                const form = document.getElementById('equipmentUsageForm');
                const timeStamp = document.getElementById('timeStamp');
                const equipmentNameSpan = document.getElementById('equipmentNameSpan');
                const operatorSelect = document.getElementById('OperatorID');
                
                form.name = `equipmentUsageForm_${object.EquipmentID}`;
                equipmentNameSpan.textContent = object.EquipmentName;
                await populateOperatorSelect(operatorSelect);
                
                const now = new Date();
                timeStamp.textContent = now.toLocaleString();
                
                modal.show();
            });
            
            newRow.lastChild.querySelector('div').appendChild(useButton);
        }

        table.appendChild(newRow);
    }
}