async function onClickEditEquipment() {
    const form = document.querySelector('#editEquipmentModal form');
    
    const submitFunction = async () => {
        const id = form.editEquipmentID.value;
        const name = form.editEquipmentName.value;
        const rating = form.editPowerRating.value;
        const date = form.editManufacturingDate.value;
        const company = form.editCompanyID.value;
        
        if (!name || !rating || !date || !company) {
            return { successful: false };
        }
        
        return await fetch(
            "/edit?equipment&" + new URLSearchParams({
                id: id,
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
    
    await handleFormSubmit(form, submitFunction, 'editEquipmentModal');
}

async function onClickEditOperator() {
    const form = document.querySelector('#editOperatorModal form');
    
    const submitFunction = async () => {
        const id = form.editOperatorID.value;
        const name = form.editOperatorName.value;
        const occupation = form.editOccupation.value;
        const number = form.editPhoneNumber.value;
        const c_id = form.editCompanyID.value;
        
        if (!name || !occupation || !number || !c_id) {
            return { successful: false };
        }
        
        return await fetch(
            "/edit?operator&" + new URLSearchParams({
                id: id,
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
    
    await handleFormSubmit(form, submitFunction, 'editOperatorModal');
}

async function onClickEditCompany() {
    const form = document.querySelector('#editCompanyModal form');
    
    const submitFunction = async () => {
        const id = form.editCompanyID.value;
        const name = form.editCompanyName.value;
        const location = form.editLocation.value;
        const contact = form.editContact.value;
        
        if (!name || !location || !contact) {
            return { successful: false };
        }
        
        return await fetch(
            "/edit?company&" + new URLSearchParams({
                id: id,
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
    
    await handleFormSubmit(form, submitFunction, 'editCompanyModal');
}
