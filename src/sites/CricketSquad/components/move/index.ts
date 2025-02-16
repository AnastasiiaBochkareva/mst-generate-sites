document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll("[class*='move-']");

    function handleScroll() {
        elements?.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                el.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();
});
