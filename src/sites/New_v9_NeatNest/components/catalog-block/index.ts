const initializeSlider = () => {
    const slider = document.querySelector(".slider") as HTMLElement | null;
    const slides = document.querySelectorAll(
        ".slide"
    ) as NodeListOf<HTMLElement>;
    const prevArrow = document.querySelector(
        ".prev-arrow"
    ) as HTMLElement | null;
    const nextArrow = document.querySelector(
        ".next-arrow"
    ) as HTMLElement | null;

    if (!slider || slides.length === 0 || !prevArrow || !nextArrow) {
        return;
    }

    let currentIndex = 0;
    const totalSlides = slides.length;

    const moveToSlide = (index: number) => {
        slider.style.transform = `translateX(-${index * 100}%)`;
    };

    const moveToPrevSlide = () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        moveToSlide(currentIndex);
    };

    const moveToNextSlide = () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        moveToSlide(currentIndex);
    };

    prevArrow.addEventListener("click", moveToPrevSlide);
    nextArrow.addEventListener("click", moveToNextSlide);
};

document.addEventListener("DOMContentLoaded", () => {
    initializeSlider();
});
