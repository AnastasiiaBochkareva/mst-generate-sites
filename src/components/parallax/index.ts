window.addEventListener("scroll", () => {
    const parallaxElements = document.querySelectorAll<HTMLElement>(
        ".parallax-container"
    );

    if (parallaxElements.length === 0) return;

    parallaxElements.forEach((parallax) => {
        const rect = parallax.getBoundingClientRect();
        const offset = rect.top * -0.3;

        parallax.style.setProperty("--parallax-offset", `${offset}px`);
        parallax.style.transform = `translateY(${offset}px)`;
    });
});
