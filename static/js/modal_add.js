function onClickAddLog() {
    const form = document.getElementById('equipmentUsageForm');
    var equipment_id = form.name.split('equipmentUsageForm_')[1];
    (async() => await addLog(equipment_id, form))();
}

// Add log async function after submitting form from modal
async function addLog(e_id, form) {
    var o_id = form.OperatorID.value;
    var e_con = form.EnergyConsumed.value;

    const status = await fetch(
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

    form.name = '';

    return status['successful'];
}

function onClickAddCompany() {
    const modal = document.getElementById('newCompanyModal');
    const form = modal.getElementsByTagName('form')[0];
    (async() => await addCompany(form))();
}

async function addCompany(form) {
    var name = form.CompanyName.value;
    var location = form.Location.value;
    var contact = form.Contact.value;

    const status = await fetch(
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

    return status['successful'];
}

function onClickAddEquipment() {
    const modal = document.getElementById('newEquipmentModal');
    const form = modal.getElementsByTagName('form')[0];
    (async() => await addEquipment(form))();
}

async function addEquipment(form) {
    var name = form.EquipmentName.value;
    var rating = form.PowerRating.value;
    var date = form.ManufacturingDate.value;
    var company = form.CompanyID.value;

    const status = await fetch(
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

    return status['successful'];
}

function onClickAddOperator() {
    const modal = document.getElementById('newOperatorModal');
    const form = modal.getElementsByTagName('form')[0];
    (async() => await addOperator(form))();
}

async function addOperator(form) {
    var name = form.OperatorName.value;
    var occupation = form.Occupation.value;
    var number = form.PhoneNumber.value;
    var c_id = form.CompanyID.value;

    const status = await fetch(
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

    return status['successful'];
}