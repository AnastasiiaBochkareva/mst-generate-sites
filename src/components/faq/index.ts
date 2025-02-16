document
    .querySelectorAll(".accordion-header")
    .forEach((header: HTMLElement) => {
        header.addEventListener("click", () => {
            const body = header.nextElementSibling as HTMLElement;

            if (body.style.display === "block") {
                body.style.display = "none";
            } else {
                body.style.display = "block";
            }
        });
    });
