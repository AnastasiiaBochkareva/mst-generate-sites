function handleResizeLand() {
    const land = document.querySelector(".dev-land") as HTMLElement | null;

    if (!land) return;

    if (window.innerWidth <= 767) {
        land.style.display = "flex";
        land.style.justifyContent = "center";
        land.style.alignItems = "center";
    } else {
        land.style.display = "";
    }
}

window.addEventListener("load", handleResizeLand);
window.addEventListener("resize", handleResizeLand);
handleResizeLand();
