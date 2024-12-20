document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.querySelector('form[action="/signup"]');
    const passwordInput = document.getElementById('inputPassword');
    const confirmPasswordInput = document.getElementById('inputPassword2');

    // Function to validate password strength
    function validatePasswordStrength() {
        const password = passwordInput.value;
        const requirements = [
            { regex: /.{8,}/, message: 'Password must be at least 8 characters long' },
            { regex: /[A-Z]/, message: 'Password must contain at least one capital letter' },
            { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
            { regex: /[0-9]/, message: 'Password must contain at least one number' },
            { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, message: 'Password must contain at least one special character' }
        ];

        for (let req of requirements) {
            if (!req.regex.test(password)) {
                passwordInput.setCustomValidity(req.message);
                return false;
            }
        }

        passwordInput.setCustomValidity('');
        return true;
    }

    // Function to validate password match
    function validatePasswordMatch() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
            return false;
        } else {
            confirmPasswordInput.setCustomValidity('');
            return true;
        }
    }

    // Function to display validation error in a modal
    function showValidationError(message) {
        const modal = document.createElement('div');
        modal.classList.add('modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const errorMessage = document.createElement('p');
        errorMessage.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'OK';
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };

        modalContent.appendChild(errorMessage);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    // Add event listeners for real-time validation
    passwordInput.addEventListener('input', function() {
        validatePasswordStrength();
        validatePasswordMatch();
    });
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    // Add form submission validation
    form.addEventListener('submit', function(event) {
        if (!validatePasswordStrength() || !validatePasswordMatch() || !validateEmailDomain()) {
            event.preventDefault(); // Prevent form submission if validation fails

            if (!validatePasswordStrength()) {
                const failedRequirement = [
                    { regex: /.{8,}/, message: 'Password must be at least 8 characters long' },
                    { regex: /[A-Z]/, message: 'Password must contain at least one capital letter' },
                    { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
                    { regex: /[0-9]/, message: 'Password must contain at least one number' },
                    { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, message: 'Password must contain at least one special character' }
                ].find(req => !req.regex.test(passwordInput.value));

                showValidationError(failedRequirement.message);
            } else if (!validatePasswordMatch()) {
                showValidationError('Passwords do not match');
            } 
        }
    });
});