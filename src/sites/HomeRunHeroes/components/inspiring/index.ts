window.addEventListener("scroll", () => {
    const container = document.querySelector(
        ".inspiring__container"
    ) as HTMLElement | null;
    if (!container) return;

    const imgSection = container.querySelector(".img") as HTMLElement | null;
    const movingText = imgSection?.querySelector("p") as HTMLElement | null;
    if (!imgSection || !movingText) return;

    const rect = imgSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollOffset = ((windowHeight - rect.top) / windowHeight) * 200;
        movingText.style.transform = `translateY(${scrollOffset}px)`;
    }
});
