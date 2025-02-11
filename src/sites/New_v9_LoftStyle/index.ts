import "@/components/burger/index";
import "@/sites/New_v9_LoftStyle/components/header/index";
import "@/sites/New_v9_LoftStyle/components/banner/index";

function changeLoftStyleDecorePaddingTop() {
    const headerHeight = document.querySelector(".header")?.clientHeight;
    const loftStyleDecore = document.querySelector(
        ".loft-style-decor"
    ) as HTMLElement;
    if (headerHeight && loftStyleDecore) {
        loftStyleDecore.style.paddingTop = `${headerHeight}px`;
    }
}
changeLoftStyleDecorePaddingTop();
function changeFindUsPaddingTop() {
    const headerHeight = document.querySelector(".header")?.clientHeight;
    const loftStyleDecore = document.querySelector(".find-us") as HTMLElement;
    if (headerHeight && loftStyleDecore) {
        loftStyleDecore.style.paddingTop = `${headerHeight}px`;
    }
}
changeFindUsPaddingTop();
