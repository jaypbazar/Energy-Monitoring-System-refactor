const passwordInput = document.getElementById('inputPassword');
const passwordViewBtn = document.getElementById('password-view-btn');

passwordViewBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordViewBtn.innerHTML = '<img src="../../static/images/eye_open.png" width="30" height="20">';
    } else {
        passwordInput.type = 'password';
        passwordViewBtn.innerHTML = '<img src="../../static/images/eye_close.png" width="30" height="20">';
    }
});