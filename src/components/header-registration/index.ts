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
const registerForm = document.getElementById(
    "register-form"
) as HTMLFormElement;
const loginForm = document.getElementById("login-form") as HTMLFormElement;

let isAuthenticate = JSON.parse(
    localStorage.getItem("isAuthenticate") || "false"
);

let user: { name: string; email: string; password: string } | null = JSON.parse(
    localStorage.getItem("user") || "null"
);

// Обновляем отображение кнопок в зависимости от состояния пользователя
function updateUI() {
    if (isAuthenticate === true) {
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

// Открытие модалки
function openModal(modal: HTMLElement) {
    modal?.classList.add("active");
}

// Закрытие модалки
function closeModal(modal: HTMLElement) {
    modal?.classList.remove("active");
}

// Валидация пароля (без пробелов)
function isValidPassword(password: string): boolean {
    return !/\s/.test(password);
}

// Регистрация
registerForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
        .value;
    const confirmPassword = (
        document.getElementById("confirm-password") as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
        alert("Пароли не совпадают");
        return;
    }

    if (!isValidPassword(password)) {
        alert("Пароль не должен содержать пробелы!");
        return;
    }

    // Сохраняем данные пользователя включая пароль
    user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));
    isAuthenticate = true;
    localStorage.setItem("isAuthenticate", JSON.stringify(isAuthenticate));

    closeModal(registerModal);
    updateUI();
});

// Вход
loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const loginName = (
        document.getElementById("login-name") as HTMLInputElement
    ).value;
    const loginPassword = (
        document.getElementById("login-password") as HTMLInputElement
    ).value;
    // Проверка имени и пароля
    if (user && loginName === user.name && loginPassword === user.password) {
        isAuthenticate = true;
        localStorage.setItem("isAuthenticate", JSON.stringify(isAuthenticate));
        closeModal(loginModal);
        updateUI();
    } else {
        alert("Неверные данные");
    }
});

// Обработчики событий для кнопок
document.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).id === "register-btn")
        openModal(registerModal);

    if ((event.target as HTMLElement).id === "login-btn") openModal(loginModal);

    // Выход
    if ((event.target as HTMLElement).id === "logout-btn") {
        isAuthenticate = false;
        localStorage.setItem("isAuthenticate", JSON.stringify(isAuthenticate));
        updateUI();
    }

    if (event.target === registerModal) closeModal(registerModal);
    if (event.target === loginModal) closeModal(loginModal);
});

// Инициализация UI при загрузке
updateUI();
