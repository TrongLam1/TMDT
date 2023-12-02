var loginEmail = document.getElementById('loginEmail');
var loginPassword = document.getElementById('loginPassword');
var loginButton = document.querySelector('.loginButton');
var registrationEmail = document.getElementById('registrationEmail');
var registrationPassword = document.getElementById('registrationPassword');
var registrationPhone = document.getElementById('registrationPhone');
var confirmPassword = document.getElementById('confirmPassword');
var registrationButton = document.querySelector('.registrationButton');
const loginForm = document.querySelector('.loginForm');
const registrationForm = document.querySelector('.registrationForm');

function login() {
    fetch("http://localhost:8080/login/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: loginEmail.value, password: loginPassword.value })
    })
        .then(response => response.json())
        .then(data => {
            if (data.body.token) {
                // Authentication successful, store the JWT in local storage
                localStorage.setItem('name', data.body.name);
                localStorage.setItem('email', data.body.email);
                localStorage.setItem('role', data.body.role);
                localStorage.setItem('token', data.body.token);
                // Redirect to the success page
                window.location.href = "index.html";
            } else {
                // Authentication failed, display an error message
                document.getElementById("error-message").textContent = "Login failed. Please check your credentials.";
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

async function registration() {
    try {
        const response = await axios.post("http://localhost:8080/login/signup", {
            email: registrationEmail.value,
            password: registrationPassword.value,
            phone: registrationPhone.value
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.data.statusCodeValue == 200) {
            console.log(response);
            clearRegistrationForm();
            showSuccessToast();
        } else {
            let mess = response.data.body.message;
            clearRegistrationForm();
            showErrorToast(mess);
        }
    } catch (error) {
        console.error(error);
    }
}

function clearRegistrationForm() {
    registrationEmail.value = "";
    registrationPassword.value = "";
    registrationPhone.value = "";
    confirmPassword.value = "";
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let validationLoginStatus = true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailPattern.test(loginEmail.value);
    let errorMessage = loginForm.querySelectorAll('.error-message');
    if (!isValidEmail) {
        validationLoginStatus = false;
        errorMessage[0].innerHTML = "Please enter a valid email";
    } else {
        errorMessage[0].innerHTML = "";
    }

    if (loginPassword.value.length < 8) {
        validationLoginStatus = false;
        errorMessage[1].innerHTML = "Please enter a valid password";
    } else {
        errorMessage[1].innerHTML = "";
    }

    if (validationLoginStatus) {
        login();
    }
});

registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let validationRegistrationStatus = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValidEmail = emailPattern.test(registrationEmail.value);
    let errorMessage = registrationForm.querySelectorAll('.error-message');

    if (!isValidEmail) {
        validationRegistrationStatus = false;
        errorMessage[0].innerHTML = 'Please enter a valid email';
    } else {
        errorMessage[0].innerHTML = "";
    }

    if (registrationPhone.value.length !== 10) {
        validationRegistrationStatus = false;
        errorMessage[1].innerHTML = 'Phone number must be 10 characters long'
    } else {
        errorMessage[1].innerHTML = "";
    }

    if (registrationPassword.value.length < 8) {
        validationRegistrationStatus = false;
        errorMessage[2].innerHTML = 'Password must be at least 8 characters long';
    } else {
        errorMessage[2].innerHTML = "";
    }

    if (registrationPassword.value != confirmPassword.value) {
        validationRegistrationStatus = false;
        errorMessage[3].innerHTML = 'Confirm Password is incorrect';
    } else {
        errorMessage[3].innerHTML = "";
    }

    if (validationRegistrationStatus) {
        registration();
    }
});

// --------------------------------- Toast message --------------------------------------
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            error: "fas fa-exclamation-circle"
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
                    <div class="toast__icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="toast__body">
                        <h3 class="toast__title">${title}</h3>
                        <p class="toast__msg">${message}</p>
                    </div>
                    <div class="toast__close">
                        <i class="fas fa-times"></i>
                    </div>
                `;
        main.appendChild(toast);
    }
}

function showSuccessToast() {
    toast({
        title: "Thành công!",
        message: "Bạn đã đăng ký tài khoản thành công.",
        type: "success",
        duration: 3000
    });
}

function showErrorToast(mess) {
    toast({
        title: "Thất bại!",
        message: mess,
        type: "error",
        duration: 5000
    });
}