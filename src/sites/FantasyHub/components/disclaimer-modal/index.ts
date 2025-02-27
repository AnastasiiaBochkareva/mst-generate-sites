window.onload = function () {
    const modal = document.getElementById("modal");
    const confirmBtn = document.getElementById("confirm-btn");

    if (!modal || !confirmBtn) return;

    function checkModalDisplay() {
        if (window.innerWidth >= 468 && !localStorage.getItem("modalClosed")) {
            modal.style.display = "block";
            document.body.classList.add("no-scroll");
        } else {
            modal.style.display = "none";
            document.body.classList.remove("no-scroll");
        }
    }

    checkModalDisplay();

    window.addEventListener("resize", checkModalDisplay);

    confirmBtn.onclick = function () {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
        localStorage.setItem("modalClosed", "true");
    };
};
