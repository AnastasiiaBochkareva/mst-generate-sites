import "@/components/burger/index";
import "@/components/slider/index";
import "@/sites/ChickenGame/components/reveal/index";
import "@/sites/ChickenGame/components/disclaimer-modal/index";
import "@/sites/ChickenGame/components/faq/index";

window.onload = function () {
    const themeToggle = document.getElementById("theme-toggle");
    const isLightTheme = localStorage.getItem("lightTheme") === "true";
    if (isLightTheme) {
        document.body.classList.add("light-theme");
        themeToggle.textContent = "Dark Mode";
    }

    themeToggle.onclick = function () {
        document.body.classList.toggle("light-theme");
        const isNowLight = document.body.classList.contains("light-theme");
        themeToggle.textContent = isNowLight ? "Dark Mode" : "Light Mode";
        localStorage.setItem("lightTheme", isNowLight.toString());
    };
};
