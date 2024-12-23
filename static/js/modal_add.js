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