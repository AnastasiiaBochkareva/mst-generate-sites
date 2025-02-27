function showModal() {
    const modal = document.getElementById("modal");
    const confirmBtn = document.getElementById("confirm-btn");

    if (!modal || !confirmBtn) return;

    if (window.innerWidth >= 768 && !localStorage.getItem("modalClosed")) {
        modal.style.display = "block";
        document.body.classList.add("no-scroll");
    } else {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
    }

    confirmBtn.onclick = function () {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
        localStorage.setItem("modalClosed", "true");
    };
}

window.onload = showModal;

window.onresize = showModal;
