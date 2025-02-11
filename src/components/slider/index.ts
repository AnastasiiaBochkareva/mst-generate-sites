let currentBlockIndex = 0;
const blocks = document.querySelectorAll(".slider-block");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

if (blocks.length > 0) {
    blocks[currentBlockIndex].classList.add("active");
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
        if (blocks.length > 0) {
            blocks[currentBlockIndex].classList.remove("active");

            currentBlockIndex = (currentBlockIndex + 1) % blocks.length;

            blocks[currentBlockIndex].classList.add("active");
        }
    });

    prevBtn.addEventListener("click", () => {
        if (blocks.length > 0) {
            blocks[currentBlockIndex].classList.remove("active");

            currentBlockIndex =
                (currentBlockIndex - 1 + blocks.length) % blocks.length;

            blocks[currentBlockIndex].classList.add("active");
        }
    });
}
