document.addEventListener("DOMContentLoaded", () => {
    const counters = [
        { id: "counter1", target: 500 },
        { id: "counter2", target: 120 },
        { id: "counter3", target: 350 },
    ];

    counters.forEach((counter) => {
        let element = document.getElementById(counter.id);
        if (element) {
            let target = counter.target;
            let current = 0;
            let increment = target / 200;

            const animateCounter = () => {
                if (current < target) {
                    current += increment;
                    element.innerText = Math.ceil(current);
                    requestAnimationFrame(animateCounter);
                } else {
                    element.innerText = `${target}+`;
                }
            };

            animateCounter();
        }
    });
});
