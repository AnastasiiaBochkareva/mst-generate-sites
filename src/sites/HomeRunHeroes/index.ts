// general
import "@/components/burger/index";
import "@/components/slider/index";
import "@/components/parallax/index";
import "@/components/tabs/index";
import "@/components/dev-land/index";
import "@/components/carousel/index";
// main
import "@/sites/HomeRunHeroes/components/counter/index";
// support
import "@/sites/HomeRunHeroes/components/faq/index";
import "@/sites/HomeRunHeroes/components/inspiring/index";
import "@/sites/HomeRunHeroes/components/reveal/index";
import "@/sites/HomeRunHeroes/components/disclaimer-modal/index";

const hoverShadowElements = document.querySelectorAll(".hover-shadow");

hoverShadowElements.forEach((hoverShadowElement) => {
    hoverShadowElement.addEventListener("mousemove", (e: MouseEvent) => {
        const beforeElement = document.createElement("div");

        beforeElement.style.position = "absolute";
        beforeElement.style.width = "80px";
        beforeElement.style.height = "80px";
        beforeElement.style.background = "rgba(255, 255, 255, 0.05)";
        beforeElement.style.borderRadius = "50%";
        beforeElement.style.filter = "blur(20px)";
        beforeElement.style.pointerEvents = "none";
        beforeElement.style.opacity = "1";
        beforeElement.style.left = `${
            e.clientX - hoverShadowElement.getBoundingClientRect().left - 50
        }px`;
        beforeElement.style.top = `${
            e.clientY - hoverShadowElement.getBoundingClientRect().top - 50
        }px`;

        hoverShadowElement.appendChild(beforeElement);

        setTimeout(() => {
            if (beforeElement) {
                hoverShadowElement.removeChild(beforeElement);
            }
        }, 100);
    });
});
const listItems = document.querySelectorAll(".steps .step");
let currentIndex = 0; // Индекс текущего видимого элемента

// Скрываем все элементы, кроме первого
listItems.forEach((item, index) => {
    if (index !== currentIndex) {
        item.classList.add("hidden");
    } else {
        item.classList.add("show");
    }
});

// Обработчик кликов
listItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        // Если клик по текущему элементу
        if (index === currentIndex) {
            // Скрываем текущий элемент
            listItems[currentIndex].classList.add("hidden");
            listItems[currentIndex].classList.remove("show");

            // Показать следующий элемент (по кругу)
            currentIndex = (currentIndex + 1) % listItems.length; // Циклический индекс
            listItems[currentIndex].classList.add("show");
        }
    });
});
