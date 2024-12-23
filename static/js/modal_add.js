function onClickClearFormAlerts() {
    const alerts = document.querySelectorAll('.alert');
    for (let alert of alerts) {
        if (alert.parentElement.tagName == 'FORM') {
            alert.remove();
        }
    }
}

function onClickAddLog() {
    const form = document.getElementById('equipmentUsageForm');
    var equipment_id = form.name.split('equipmentUsageForm_')[1];
    (async() => await addLog(equipment_id, form))();
}

function onClickAddCompany() {
    const modal = document.getElementById('newCompanyModal');
    const form = modal.getElementsByTagName('form')[0];
    (async() => await addCompany(form))();
}

function onClickAddEquipment() {
    const modal = document.getElementById('newEquipmentModal');
    const form = modal.getElementsByTagName('form')[0];
    (async() => await addEquipment(form))();
}

function onClickAddOperator() {
    const modal = document.getElementById('newOperatorModal');
    const form = modal.getElementsByTagName('form')[0];
    (async() => await addOperator(form))();
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