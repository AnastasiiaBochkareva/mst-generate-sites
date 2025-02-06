import "@/sites/New_v9_GrandResidence/components/header/index";
import "@/sites/New_v9_GrandResidence/components/counter/index";

document.addEventListener("DOMContentLoaded", () => {
    const movableSubtitles = document.querySelectorAll(".movable-subtitle");

    if (movableSubtitles.length > 0) {
        movableSubtitles.forEach((item, index) => {
            item.style.setProperty("--i", index + 1);
        });
    }
});
// document.addEventListener("DOMContentLoaded", () => {
//     const servicesCards = document.querySelectorAll(".services-card");

//     const options = {
//         root: null,
//         rootMargin: "0px",
//         threshold: 0.1,
//     };

//     const observer = new IntersectionObserver((entries, observer) => {
//         entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add("visible");
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, options);

//     servicesCards?.forEach((card) => {
//         observer.observe(card);
//     });

//     const serviceCards = document.querySelectorAll(".services-card");

//     serviceCards?.forEach((card) => {
//         card.addEventListener("mouseenter", () => {
//             card.classList.add("hovered");
//         });

//         card.addEventListener("mouseleave", () => {
//             card.classList.remove("hovered");
//         });
//     });
// });
// document.addEventListener("DOMContentLoaded", () => {
//     const servicesItems = document.querySelectorAll(".services-item");

//     const options = {
//         root: null,
//         rootMargin: "0px",
//         threshold: 0.1,
//     };

//     const observer = new IntersectionObserver((entries, observer) => {
//         entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//                 entry.target.classList.add("visible");
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, options);

//     servicesItems.forEach((item) => {
//         observer.observe(item);
//     });

//     const serviceIcons = document.querySelectorAll(".service-icon");

//     serviceIcons.forEach((icon) => {
//         icon.addEventListener("mouseenter", () => {
//             icon.classList.add("hovered");
//         });

//         icon.addEventListener("mouseleave", () => {
//             icon.classList.remove("hovered");
//         });
//     });
// });
document.addEventListener("DOMContentLoaded", () => {
    const servicesCards = document.querySelectorAll(".services-card");
    const servicesItems = document.querySelectorAll(".services-item");
    const serviceIcons = document.querySelectorAll(".service-icon");

    if (servicesCards.length > 0 || servicesItems.length > 0) {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const allCards = [...servicesCards, ...servicesItems];
        allCards.forEach((card) => observer.observe(card));

        allCards.forEach((card) => {
            card.addEventListener("mouseenter", () => {
                card.classList.add("hovered");
            });

            card.addEventListener("mouseleave", () => {
                card.classList.remove("hovered");
            });
        });
    }

    if (serviceIcons.length > 0) {
        serviceIcons.forEach((icon) => {
            icon.addEventListener("mouseenter", () => {
                icon.classList.add("hovered");
            });

            icon.addEventListener("mouseleave", () => {
                icon.classList.remove("hovered");
            });
        });
    }
});
