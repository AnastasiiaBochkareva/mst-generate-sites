document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal") as HTMLElement | null;
    const confirmBtn = modal?.querySelector(
        "#confirm-btn"
    ) as HTMLElement | null;

    if (!modal) return;

    function checkModalDisplay() {
        if (!localStorage.getItem("modalClosed")) {
            modal.classList.add("active");
            document.documentElement.classList.add("no-scroll");
        } else {
            modal.classList.remove("active");
            document.documentElement.classList.remove("no-scroll");
        }
    }

    checkModalDisplay();

    window.addEventListener("resize", checkModalDisplay);

    if (confirmBtn) {
        confirmBtn.onclick = function () {
            modal.classList.remove("active");
            document.documentElement.classList.remove("no-scroll");
            localStorage.setItem("modalClosed", "true");
        };
    }
});
