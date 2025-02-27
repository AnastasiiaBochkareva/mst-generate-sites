interface CarouselItem extends HTMLElement {
    dataset: {
        pos: string;
    };
}

const carouselList = document.querySelector(
    ".carousel__list"
) as HTMLElement | null;
const carouselItems = document.querySelectorAll(
    ".carousel__item"
) as NodeListOf<CarouselItem>;

if (carouselList && carouselItems.length > 0) {
    const elems: CarouselItem[] = Array.from(carouselItems);

    carouselList.addEventListener("click", function (event: Event) {
        const target = event.target as HTMLElement;
        const newActive = target.closest(
            ".carousel__item"
        ) as CarouselItem | null;

        if (
            !newActive ||
            newActive.classList.contains("carousel__item_active")
        ) {
            return;
        }

        update(newActive);
    });

    const update = (newActive: CarouselItem) => {
        const newActivePos = parseInt(newActive.dataset.pos, 10);

        const current = elems.find(
            (elem) => parseInt(elem.dataset.pos, 10) === 0
        );
        const prev = elems.find(
            (elem) => parseInt(elem.dataset.pos, 10) === -1
        );
        const next = elems.find((elem) => parseInt(elem.dataset.pos, 10) === 1);
        const first = elems.find(
            (elem) => parseInt(elem.dataset.pos, 10) === -2
        );
        const last = elems.find((elem) => parseInt(elem.dataset.pos, 10) === 2);

        if (!current || !prev || !next || !first || !last) {
            return;
        }

        current.classList.remove("carousel__item_active");

        [current, prev, next, first, last].forEach((item) => {
            const itemPos = parseInt(item.dataset.pos, 10);
            item.dataset.pos = getPos(itemPos, newActivePos).toString();
        });
    };

    const getPos = (current: number, active: number): number => {
        const diff = current - active;

        return Math.abs(diff) > 2 ? -current : diff;
    };
}
