// Определение интерфейса для DOM элементов
interface DOMElements {
    tabsNav: HTMLElement | null;
    tabsNavItems: NodeListOf<HTMLElement>;
    panels: NodeListOf<HTMLElement>;
}

// Инициализация объекта DOM с правильными типами
const DOM: DOMElements = {
    tabsNav: document.querySelector(".tabs__nav"),
    tabsNavItems: document.querySelectorAll(".tabs__nav-item"),
    panels: document.querySelectorAll(".tabs__panel"),
};

// Устанавливаем активный элемент в навигации
const setActiveItem = (elem: HTMLElement): void => {
    DOM.tabsNavItems.forEach((el) => {
        el.classList.remove("active");
    });
    elem.classList.add("active");
};

// Устанавливаем активную панель
const setActivePanel = (index: number): void => {
    DOM.panels.forEach((panel) => {
        panel.classList.remove("active");
    });
    if (DOM.panels[index]) {
        DOM.panels[index].classList.add("active");
    }
};

// Обработчик клика по элементам навигации
const handleNavItemClick = (e: MouseEvent): void => {
    const navElemClass = "tabs__nav-item";
    const clickedTab = e.target as HTMLElement;

    // Проверяем, что клик был по элементу навигации
    if (clickedTab && clickedTab.classList.contains(navElemClass)) {
        const activeItemIndex = Array.from(DOM.tabsNavItems).indexOf(
            clickedTab
        );

        // Устанавливаем активный элемент и панель
        setActiveItem(clickedTab);
        setActivePanel(activeItemIndex);
    }
};

// Устанавливаем активный элемент и панель при загрузке страницы
window.addEventListener("load", () => {
    if (
        !DOM.tabsNav ||
        DOM.tabsNavItems.length === 0 ||
        DOM.panels.length === 0
    )
        return;

    // Устанавливаем активные элементы при загрузке
    setActiveItem(DOM.tabsNavItems[0]); // Например, первый элемент
    setActivePanel(0); // Первая панель
});

// Навешиваем обработчик события на навигацию
DOM.tabsNav?.addEventListener("click", handleNavItemClick);
