document.addEventListener('DOMContentLoaded', function() {
    const mainContainer = document.getElementById('mainContainer');
    const optionsGrid = document.getElementById('optionsGrid');
    const options = document.querySelectorAll('.option-container');
    let isGridTransformed = false;

    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isGridTransformed) {
                // Transform grid to sidebar
                optionsGrid.classList.add('sidebar-mode');
                mainContainer.classList.add('sidebar-active');
                isGridTransformed = true;

                // Remove active class from all options and add to clicked one
                options.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Show content area
                const contentType = this.getAttribute('data-content');
                const contentArea = document.getElementById(contentType + 'Content');
                document.querySelectorAll('.content-area').forEach(area => {
                    area.classList.remove('active');
                });
                contentArea.classList.add('active');
                (async() => await renderData(contentArea.id))();

            } else {
                // Just switch content if already in sidebar mode
                options.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const contentType = this.getAttribute('data-content');
                const contentArea = document.getElementById(contentType + 'Content');
                document.querySelectorAll('.content-area').forEach(area => {
                    area.classList.remove('active');
                });
                contentArea.classList.add('active');
                (async() => await renderData(contentArea.id))();
            }
        });
    });
});

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

    for (let object of results) {
        const newRow = document.createElement('tr');
        
        for (let key of orderedKeys[type]) {
            const newRowData = document.createElement('td');
            newRowData.innerText = object[key];
            newRow.appendChild(newRowData);
        }

        table.appendChild(newRow);
    }
}