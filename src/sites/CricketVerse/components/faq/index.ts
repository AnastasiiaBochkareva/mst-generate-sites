document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
        const answer = item.querySelector(".answer") as HTMLElement | null;
        if (answer) {
            answer.classList.toggle("hidden");
        }
    });
});
