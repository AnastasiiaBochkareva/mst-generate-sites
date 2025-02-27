function handleResize() {
    const land = document.querySelector(".land") as HTMLElement | null;
    const bodyChildren = document.body.children;

    if (!land) return;

    if (window.innerWidth <= 768) {
        for (let i = 0; i < bodyChildren.length; i++) {
            const child = bodyChildren[i] as HTMLElement;
            if (child.tagName !== "MAIN") {
                child.style.display = "none";
            }
        }

        const main = document.querySelector("main");
        if (main) {
            const mainChildren = main.children;
            for (let i = 0; i < mainChildren.length; i++) {
                const mainChild = mainChildren[i] as HTMLElement;
                if (mainChild !== land) {
                    mainChild.style.display = "none";
                }
            }
        }

        land.style.display = "flex";
        land.style.justifyContent = "center";
        land.style.alignItems = "center";
    } else {
        for (let i = 0; i < bodyChildren.length; i++) {
            const child = bodyChildren[i] as HTMLElement;
            child.style.display = "";
        }

        const main = document.querySelector("main");
        if (main) {
            const mainChildren = main.children;
            for (let i = 0; i < mainChildren.length; i++) {
                const mainChild = mainChildren[i] as HTMLElement;
                mainChild.style.display = "";
            }
        }

        land.style.display = "";
    }
}

window.addEventListener("load", handleResize);
window.addEventListener("resize", handleResize);
