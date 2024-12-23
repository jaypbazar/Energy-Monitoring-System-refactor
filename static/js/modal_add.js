// Helper function to create flash message
function createFlashMessage(message, type) {
    const flash = document.createElement('div');
    flash.className = `alert alert-${type} position-fixed`;
    flash.style.right = '20px';
    flash.style.top = '20px';
    flash.style.zIndex = '9999';
    flash.innerText = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');
    flash.appendChild(closeButton);
    
    document.body.appendChild(flash);
    
    // Auto-remove after 5 seconds
    setTimeout(() => flash.remove(), 5000);
}

// Helper function to validate and handle form submission
async function handleFormSubmit(form, submitFunction, modalId) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Check all required fields
    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) {
        createFlashMessage('Please fill in all required fields', 'danger');
        return false;
    }
    
    try {
        const status = await submitFunction();
        
        if (status.successful) {
            createFlashMessage('Operation completed successfully', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
            modal.hide();
            form.reset();
            // Refresh the data display after successful submission
            if (modalId === 'newCompanyModal') {
                renderData('companiesContent');
            } else if (modalId === 'newEquipmentModal') {
                renderData('equipmentsContent');
            } else if (modalId === 'newOperatorModal') {
                renderData('operatorsContent');
            }
            return true;
        } else {
            createFlashMessage('Operation failed. Please check your input and try again.', 'danger');
            return false;
        }
    } catch (error) {
        console.error('Submission error:', error);
        createFlashMessage('An error occurred. Please try again.', 'danger');
        return false;
    }
}

async function onClickAddLog() {
    const form = document.getElementById('equipmentUsageForm');
    const equipment_id = form.name.split('equipmentUsageForm_')[1];
    
    const submitFunction = async () => {
        const o_id = form.OperatorID.value;
        const e_con = form.EnergyConsumed.value;
        
        if (!o_id || !e_con) {
            return { successful: false };
        }
        
        return await fetch(
            "/add?log&" + new URLSearchParams({
                id: equipment_id,
                o_id: o_id,
                e_con: e_con
            }),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => res.json());
    };
    
    await handleFormSubmit(form, submitFunction, 'equipmentUsageModal');
}

async function onClickAddCompany() {
    const form = document.querySelector('#newCompanyModal form');
    
    const submitFunction = async () => {
        const name = form.CompanyName.value;
        const location = form.Location.value;
        const contact = form.Contact.value;
        
        if (!name || !location || !contact) {
            return { successful: false };
        }
        
        return await fetch(
            "/add?company&" + new URLSearchParams({
                name: name,
                location: location,
                contact: contact
            }),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => res.json());
    };
    
    await handleFormSubmit(form, submitFunction, 'newCompanyModal');
}

async function onClickAddEquipment() {
    const form = document.querySelector('#newEquipmentModal form');
    
    const submitFunction = async () => {
        const name = form.EquipmentName.value;
        const rating = form.PowerRating.value;
        const date = form.ManufacturingDate.value;
        const company = form.CompanyID.value;
        
        if (!name || !rating || !date || !company) {
            return { successful: false };
        }
        
        return await fetch(
            "/add?equipment&" + new URLSearchParams({
                name: name,
                rating: rating,
                date: date,
                company: company
            }),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => res.json());
    };
    
    await handleFormSubmit(form, submitFunction, 'newEquipmentModal');
}

async function onClickAddOperator() {
    const form = document.querySelector('#newOperatorModal form');
    
    const submitFunction = async () => {
        const name = form.OperatorName.value;
        const occupation = form.Occupation.value;
        const number = form.PhoneNumber.value;
        const c_id = form.CompanyID.value;
        
        if (!name || !occupation || !number || !c_id) {
            return { successful: false };
        }
        
        return await fetch(
            "/add?operator&" + new URLSearchParams({
                name: name,
                occupation: occupation,
                number: number,
                c_id: c_id
            }),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => res.json());
    };
    
    await handleFormSubmit(form, submitFunction, 'newOperatorModal');
}

// Remove existing alerts when closing modal
function onClickClearFormAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => alert.remove());
}

// Add log async function after submitting form from modal
async function addLog(e_id, form) {
    var o_id = form.OperatorID.value;
    var e_con = form.EnergyConsumed.value;
    var status;

    if (o_id != '' && e_con != '') {
        status = await fetch(
            "/add?log&" + new URLSearchParams(
                {
                    id: e_id,
                    o_id: o_id,
                    e_con: e_con
                }
            ),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => res.json());
    } else {
        status = {'successful': false};
    }

    form.name = '';

    // Check if some alerts did not get removed prior
    var existingAlert = form.querySelector('.alert');
    if (existingAlert) existingAlert.remove();

    const newAlert = document.createElement('div');
    newAlert.classList.add('alert');

    if (status['successful']) {
        newAlert.classList.add('alert-success');
        newAlert.innerText = "Successfully added a new log.";
    } else {
        newAlert.classList.add('alert-danger');
        newAlert.innerText = "Failed to add a new log.";
        if (o_id == '' | e_con == '') {
            newAlert.innerText += " Some required fields were left empty.";
        } else {
            newAlert.innerText += " Check console for details.";
        }
    }

    form.insertBefore(newAlert, form.firstChild);
}

async function addCompany(form) {
    var name = form.CompanyName.value;
    var location = form.Location.value;
    var contact = form.Contact.value;
    var status;

    if (name != '' && location != '' && contact != '') {
        status = await fetch(
            "/add?company&" + new URLSearchParams(
                {
                    name: name,
                    location: location,
                    contact: contact
                }
            ),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => res.json());
    } else {
        status = {'successful': false};
    }
    

    // Check if some alerts did not get removed prior
    var existingAlert = form.querySelector('.alert');
    if (existingAlert) existingAlert.remove();

    const newAlert = document.createElement('div');
    newAlert.classList.add('alert');

    if (status['successful']) {
        newAlert.classList.add('alert-success');
        newAlert.innerText = "Successfully added a new log.";
    } else {
        newAlert.classList.add('alert-danger');
        newAlert.innerText = "Failed to add a new log.";
        if (name != '' | location != '' | contact != '') {
            newAlert.innerText += " Some required fields were left empty.";
        } else {
            newAlert.innerText += " Check console for details.";
        }
    }

    form.insertBefore(newAlert, form.firstChild);
}

async function addEquipment(form) {
    var name = form.EquipmentName.value;
    var rating = form.PowerRating.value;
    var date = form.ManufacturingDate.value;
    var company = form.CompanyID.value;
    var status;

    if (name != '' && rating != '' && date != '' && company != '') {
        status = await fetch(
            "/add?equipment&" + new URLSearchParams(
                {
                    name: name,
                    rating: rating,
                    date: date,
                    company: company
                }
            ),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => res.json());
    } else {
        status = {'successful': false};
    }

    // Check if some alerts did not get removed prior
    var existingAlert = form.querySelector('.alert');
    if (existingAlert) existingAlert.remove();

    const newAlert = document.createElement('div');
    newAlert.classList.add('alert');

    if (status['successful']) {
        newAlert.classList.add('alert-success');
        newAlert.innerText = "Successfully added a new log.";
    } else {
        newAlert.classList.add('alert-danger');
        newAlert.innerText = "Failed to add a new log.";
        if (name != '' | rating != '' | date != '' | company != '') {
            newAlert.innerText += " Some required fields were left empty.";
        } else {
            newAlert.innerText += " Check console for details.";
        }
    }

    form.insertBefore(newAlert, form.firstChild);
}

async function addOperator(form) {
    var name = form.OperatorName.value;
    var occupation = form.Occupation.value;
    var number = form.PhoneNumber.value;
    var c_id = form.CompanyID.value;
    var status;

    if (name != '' && occupation != '' && number != '' && c_id != '') {
        status = await fetch(
            "/add?operator&" + new URLSearchParams(
                {
                    name: name,
                    occupation: occupation,
                    number: number,
                    c_id: c_id
                }
            ),
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then((res) => res.json());
    } else {
        status = {'successful': false};
    }

    // Check if some alerts did not get removed prior
    var existingAlert = form.querySelector('.alert');
    if (existingAlert) existingAlert.remove();

    const newAlert = document.createElement('div');
    newAlert.classList.add('alert');

    if (status['successful']) {
        newAlert.classList.add('alert-success');
        newAlert.innerText = "Successfully added a new log.";
    } else {
        newAlert.classList.add('alert-danger');
        newAlert.innerText = "Failed to add a new log.";
        if (name != '' | occupation != '' | number != '' | c_id != '') {
            newAlert.innerText += " Some required fields were left empty.";
        } else {
            newAlert.innerText += " Check console for details.";
        }
    }

    form.insertBefore(newAlert, form.firstChild);
}