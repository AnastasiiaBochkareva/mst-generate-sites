window.onload = function () {
    const modal = document.getElementById("modal");
    const confirmBtn = document.getElementById("confirm-btn");

    if (!modal || !confirmBtn) return;

    if (window.innerWidth >= 425 && !localStorage.getItem("modalClosed")) {
        modal.style.display = "block";
        document.body.classList.add("no-scroll");
    }

    confirmBtn.onclick = function () {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
        localStorage.setItem("modalClosed", "true");
    };
};
