function toggleHeaderScrolledClass() {
    const header: HTMLElement | null = document.querySelector(".header");
    if (header) {
        if (window.scrollY > 0) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    toggleHeaderScrolledClass();
});

window.addEventListener("scroll", (event: Event) => {
    toggleHeaderScrolledClass();
});
