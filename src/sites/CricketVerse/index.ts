import "@/components/burger/index";
import "@/components/slider/index";
import "@/sites/CricketVerse/components/reveal/index";
import "@/sites/CricketVerse/components/counter/index";
import "@/sites/CricketVerse/components/disclaimer-modal/index";
import "@/sites/CricketVerse/components/faq/index";

document.addEventListener("DOMContentLoaded", function () {
    const blockedStates = [
        "Andhra Pradesh",
        "Assam",
        "Nagaland",
        "Odisha",
        "Sikkim",
        "Telangana",
    ];

    const blockedStatesTimeZones = {
        "Asia/Kolkata": blockedStates,
    };

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (blockedStatesTimeZones[userTimeZone]) {
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = "rgba(0, 0, 0, 0.8)";
        overlay.style.zIndex = "9999";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        const messageBox = document.createElement("div");
        messageBox.style.background = "#fff";
        messageBox.style.color = "#333";
        messageBox.style.padding = "20px";
        messageBox.style.borderRadius = "8px";
        messageBox.style.textAlign = "center";
        messageBox.style.maxWidth = "80%";
        messageBox.innerHTML = `
            <h2>Access Restricted</h2>
            <p>For your region, access to this website is restricted.</p>
        `;

        overlay.appendChild(messageBox);
        document.body.appendChild(overlay);
    }
});
