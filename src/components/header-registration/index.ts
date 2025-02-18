const registerBtn = document.getElementById(
    "register-btn"
) as HTMLButtonElement;
const loginBtn = document.getElementById("login-btn") as HTMLButtonElement;
const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
const welcomeMsg = document.getElementById("welcome-msg") as HTMLSpanElement;
const userNameSpan = document.getElementById("user-name") as HTMLElement;
const registerModal = document.getElementById(
    "register-modal"
) as HTMLDivElement;
const loginModal = document.getElementById("login-modal") as HTMLDivElement;
const modalRegisterBtn = document.getElementById(
    "modal-register-btn"
) as HTMLButtonElement;
const modalLoginBtn = document.getElementById(
    "modal-login-btn"
) as HTMLButtonElement;

let isAuthenticate: boolean = JSON.parse(
    localStorage.getItem("isAuthenticate") || "false"
);
let user: { name: string; email: string; password: string } | null = JSON.parse(
    localStorage.getItem("user") || "null"
);

// Function to check for spaces
function containsSpaces(value: string): boolean {
    return /\s/.test(value);
}

// Update UI based on authentication state
function updateUI() {
    if (isAuthenticate && user) {
        if (userNameSpan) {
            userNameSpan.innerText = user.name;
        }

        welcomeMsg.classList.remove("hidden");
        logoutBtn.classList.remove("hidden");
        registerBtn.classList.add("hidden");
        loginBtn.classList.add("hidden");
    } else {
        registerBtn.classList.remove("hidden");
        loginBtn.classList.remove("hidden");
        welcomeMsg.classList.add("hidden");
        logoutBtn.classList.add("hidden");
    }
}

// Open modal
function openModal(modal: HTMLElement) {
    modal?.classList.add("active");
    document.body.classList.add("no-scroll"); // Add no-scroll class to body
    console.log("Body class list:", document.body.classList);
}

// Close modal
function closeModal(modal: HTMLElement) {
    modal?.classList.remove("active");
    document.body.classList.remove("no-scroll"); // Remove no-scroll class from body
}

// Register user
modalRegisterBtn?.addEventListener("click", () => {
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
        .value;
    const confirmPassword = (
        document.getElementById("confirm-password") as HTMLInputElement
    ).value;

    // Check for spaces in password and email
    if (containsSpaces(password) || containsSpaces(email)) {
        alert("Email and password must not contain spaces!");
        return;
    }

    if (
        name &&
        email &&
        password &&
        confirmPassword &&
        password === confirmPassword
    ) {
        // Save user data in localStorage
        user = { name, email, password };
        localStorage.setItem("user", JSON.stringify(user));
        isAuthenticate = true;
        localStorage.setItem("isAuthenticate", JSON.stringify(isAuthenticate));

        closeModal(registerModal);
        updateUI();
    } else {
        alert("Please fill all fields correctly.");
    }
});

// Login user
modalLoginBtn?.addEventListener("click", () => {
    const loginName = (
        document.getElementById("login-name") as HTMLInputElement
    ).value;
    const loginPassword = (
        document.getElementById("login-password") as HTMLInputElement
    ).value;

    // Check for spaces in password
    if (containsSpaces(loginPassword)) {
        alert("Password must not contain spaces!");
        return;
    }

    if (user && loginName === user.name && loginPassword === user.password) {
        isAuthenticate = true;
        localStorage.setItem("isAuthenticate", JSON.stringify(isAuthenticate));

        closeModal(loginModal);
        updateUI();
    } else {
        alert("Invalid credentials");
    }
});

// Logout user
logoutBtn?.addEventListener("click", () => {
    isAuthenticate = false;
    localStorage.setItem("isAuthenticate", JSON.stringify(isAuthenticate));
    updateUI();
});

// Open modals
registerBtn?.addEventListener("click", () => openModal(registerModal));
loginBtn?.addEventListener("click", () => openModal(loginModal));

// Close modals on click outside the form
// document.addEventListener("click", (event) => {

// });

document.addEventListener("click", (event) => {
    if (event.target === registerModal) closeModal(registerModal);
    if (event.target === loginModal) closeModal(loginModal);

    const target = event.target as HTMLElement;
    if (target.classList.contains("btn-close")) {
        // Closest modal for the button
        const modal = target.closest(".modal");
        if (modal) closeModal(modal as HTMLElement);
    }
});
const learnMoreBtns = document.querySelectorAll(".learn-more-btn");

learnMoreBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        if (!user) {
            event.preventDefault();
            alert("Registration is required.");
        } else if (!isAuthenticate) {
            event.preventDefault();
            alert("Please log in to continue.");
        }
    });
});
// Initialize UI on page load
updateUI();
