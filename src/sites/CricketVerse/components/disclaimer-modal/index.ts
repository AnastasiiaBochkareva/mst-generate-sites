// Ожидаем, пока страница полностью загрузится
window.onload = function () {
    // Находим модальное окно и кнопки
    var modal = document.getElementById("modal");
    var confirmBtn = document.getElementById("confirm-btn");

    // Показываем модальное окно
    modal.style.display = "block";

    // Добавляем класс .no-scroll к body, чтобы заблокировать прокрутку
    document.body.classList.add("no-scroll");

    // Закрыть окно при нажатии на кнопку "Подтвердить" и удалить класс .no-scroll
    confirmBtn.onclick = function () {
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
    };
};
