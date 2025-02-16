// document.addEventListener("DOMContentLoaded", function () {
//     // Получаем элементы
//     const registerBtn = document.getElementById("register-btn")!;
//     const loginBtn = document.getElementById("login-btn")!;
//     const logoutBtn = document.getElementById("logout-btn")!;
//     const welcomeMsg = document.getElementById("welcome-msg")!;
//     const registerModal = document.getElementById("register-modal")!;
//     const loginModal = document.getElementById("login-modal")!;
//     const closeBtns = document.querySelectorAll(".close-btn")!;
//     const registerForm = document.getElementById("register-form")!;
//     const loginForm = document.getElementById("login-form")!;

//     // Функция проверки авторизации
//     function checkAuth() {
//         const user = JSON.parse(localStorage.getItem("user") || "null");
//         const loggedIn = localStorage.getItem("loggedIn");

//         if (user && loggedIn === "true") {
//             welcomeMsg.textContent = `Welcome, ${user.username}!`;
//             welcomeMsg.classList.add("active");
//             logoutBtn.classList.add("active");
//             registerBtn.classList.add("hidden");
//             loginBtn.classList.add("hidden");
//             // welcomeMsg.style.display = "block";
//             // logoutBtn.style.display = "block";
//             // registerBtn.style.display = "none";
//             // loginBtn.style.display = "none";
//         } else {
//             welcomeMsg.classList.remove("active");
//             logoutBtn.classList.remove("active");
//             registerBtn.classList.remove("hidden");
//             loginBtn.classList.remove("hidden");
//             // welcomeMsg.style.display = "none";
//             // logoutBtn.style.display = "none";
//             // registerBtn.style.display = "block";
//             // loginBtn.style.display = "block";
//         }
//     }

//     // Открытие модалок
//     registerBtn?.addEventListener("click", () =>
//         registerModal.classList.add("register-modal")
//     );
//     loginBtn?.addEventListener(
//         "click",
//         () => (loginModal.style.display = "block")
//     );

//     // Закрытие модалок
//     closeBtns?.forEach((btn) =>
//         btn.addEventListener("click", () => {
//             registerModal.style.display = "none";
//             loginModal.style.display = "none";
//         })
//     );

//     // Регистрация
//     registerForm?.addEventListener("submit", (event) => {
//         event.preventDefault();
//         const username = (
//             document.getElementById("reg-username") as HTMLInputElement
//         ).value;
//         const email = (document.getElementById("reg-email") as HTMLInputElement)
//             .value;
//         const password = (
//             document.getElementById("reg-password") as HTMLInputElement
//         ).value;
//         const confirmPassword = (
//             document.getElementById("reg-confirm-password") as HTMLInputElement
//         ).value;
//         const errorMsg = document.getElementById("error-msg")!;

//         if (password !== confirmPassword) {
//             errorMsg.textContent = "Passwords do not match!";
//             return;
//         }

//         localStorage.setItem(
//             "user",
//             JSON.stringify({ username, email, password })
//         );
//         localStorage.setItem("loggedIn", "true");

//         alert("Registration successful!");
//         registerModal.style.display = "none";
//         checkAuth();
//     });

//     // Авторизация
//     loginForm?.addEventListener("submit", (event) => {
//         event.preventDefault();
//         const email = (
//             document.getElementById("login-email") as HTMLInputElement
//         ).value;
//         const password = (
//             document.getElementById("login-password") as HTMLInputElement
//         ).value;
//         const loginError = document.getElementById("login-error")!;

//         const user = JSON.parse(localStorage.getItem("user") || "null");

//         if (user && user.email === email && user.password === password) {
//             localStorage.setItem("loggedIn", "true");
//             alert("Login successful!");
//             loginModal.style.display = "none";
//             checkAuth();
//         } else {
//             loginError.textContent = "Invalid email or password!";
//         }
//     });

//     // Выход
//     logoutBtn?.addEventListener("click", () => {
//         localStorage.removeItem("loggedIn");
//         checkAuth();
//     });

//     // Проверяем авторизацию при загрузке страницы
//     checkAuth();
// });
