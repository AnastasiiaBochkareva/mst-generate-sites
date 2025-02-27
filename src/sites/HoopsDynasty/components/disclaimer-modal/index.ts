document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal") as HTMLElement | null;
    const confirmBtn = modal?.querySelector(
        "#confirm-btn"
    ) as HTMLElement | null;

    if (!modal) return;

    function checkModalDisplay() {
        if (window.innerWidth > 767 && !localStorage.getItem("modalClosed")) {
            modal.classList.add("active");
            document.body.classList.add("no-scroll");
        } else {
            modal.classList.remove("active");
            document.body.classList.remove("no-scroll");
        }
    }

    checkModalDisplay();

    window.addEventListener("resize", checkModalDisplay);

    if (confirmBtn) {
        confirmBtn.onclick = function () {
            modal.classList.remove("active");
            document.body.classList.remove("no-scroll");
            localStorage.setItem("modalClosed", "true");
        };
    }
});
