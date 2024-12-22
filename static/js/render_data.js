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

// Render table entries asynchronously
async function renderData(type) {
    // Get data from /fetch endpoint
    const results = await fetch(
        "/fetch?" + type.replace('Content', ''),
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then(
        (res)=>res.json()
    );

    const orderedKeys = {
        'equipmentsContent': ['EquipmentID', 'EquipmentName', 'PowerRating', 'ManufacturingDate', 'CompanyID'],
        'operatorsContent': ['OperatorID', 'OperatorName', 'Occupation', 'PhoneNumber', 'CompanyName'],
        'companiesContent': ['CompanyID', 'CompanyName', 'Location', 'Contact'],
        'energyContent': ['EquipmentID', 'EquipmentName', 'EnergyConsumed']
    }

    const parent = document.getElementById(type);
    const table = parent.getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear existing content

    for (let object of results) {
        const newRow = document.createElement('tr');
        
        for (let key of orderedKeys[type]) {
            const newRowData = document.createElement('td');
            newRowData.innerText = object[key];
            newRow.appendChild(newRowData);
        }

        // Add Use button for equipment entries
        if (type === 'equipmentsContent') {
            const actionCell = document.createElement('td');
            const useButton = document.createElement('button');
            useButton.className = 'btn rounded-pill';
            useButton.style.backgroundColor = '#ffab5d';
            useButton.style.color = '#442c12';
            useButton.textContent = 'Use';
            
            useButton.addEventListener('click', async () => {
                const modal = new bootstrap.Modal(document.getElementById('equipmentUsageModal'));
                const form = document.getElementById('equipmentUsageForm');
                const timeStamp = document.getElementById('timeStamp');
                const equipmentNameSpan = document.getElementById('equipmentNameSpan');
                const operatorSelect = document.getElementById('OperatorID');
                
                // Update form action and equipment name
                form.action = `/equipment_${object.EquipmentID}/add_log`;
                equipmentNameSpan.textContent = object.EquipmentName;
                
                // Populate operator select
                await populateOperatorSelect(operatorSelect);
                
                // Set current timestamp
                const now = new Date();
                timeStamp.textContent = now.toLocaleString();
                
                modal.show();
            });
            
            actionCell.appendChild(useButton);
            newRow.appendChild(actionCell);
        }

        table.appendChild(newRow);
    }
}