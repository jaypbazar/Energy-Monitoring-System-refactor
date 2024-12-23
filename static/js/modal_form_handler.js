// Function to validate and handle form submission
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

// Function to create flash message
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