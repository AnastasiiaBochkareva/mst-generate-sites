function toggleHeaderScrolledClass() {
    const header = document.querySelector(".header");
    if (header) {
        if (window.scrollY > 0) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
}

toggleHeaderScrolledClass();

window.addEventListener("scroll", toggleHeaderScrolledClass);
