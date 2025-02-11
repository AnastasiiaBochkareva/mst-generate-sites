function changeBannerPaddingTop() {
    const headerHeight = document.querySelector(".header")?.clientHeight;
    const banner = document.querySelector(".banner") as HTMLElement;
    if (headerHeight && banner) {
        banner.style.paddingTop = `${headerHeight}px`;
    }
}
changeBannerPaddingTop();
