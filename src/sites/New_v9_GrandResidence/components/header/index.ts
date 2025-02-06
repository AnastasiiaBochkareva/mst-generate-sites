document.addEventListener("DOMContentLoaded", function () {
    const burger = document.querySelector(".burger");
    const menu = document.querySelector(".menu") as HTMLElement;
    const closeBtn = document.querySelector(".menu__close");

    function toggleMenu() {
        menu.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
    }

    burger.addEventListener("click", toggleMenu);
    closeBtn.addEventListener("click", toggleMenu);

    menu.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target?.closest(".menu__content")) {
            menu.classList.remove("active");
            document.body.classList.remove("no-scroll");
        }
    });

    const featureBlocks = document.querySelectorAll(".why-us__list-item");

    function checkVisibility() {
        featureBlocks.forEach((block) => {
            const rect = block.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                block.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", checkVisibility);
    checkVisibility();
});
