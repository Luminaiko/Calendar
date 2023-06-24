﻿const daysTag = document.querySelector(".days");
const currentDate = document.querySelector(".current-date");
const prevNextIcon = document.querySelectorAll(".icons span");
const selectedDateElement = document.getElementById("selected-date");
const bookButton = document.getElementById("book-button");

// Получение новой даты, текущего года и месяца
let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

// Сохранение полного названия всех месяцев в массиве
const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
];

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
    let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday =
            i === date.getDate() &&
                currMonth === new Date().getMonth() &&
                currYear === new Date().getFullYear()
                ? "active"
                : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    // Добавляем обработчик событий для выбора даты
    const days = document.querySelectorAll(".days li");
    days.forEach(day => {
        day.addEventListener("click", () => {
            if (!day.classList.contains("inactive")) {
                const selectedDate = day.textContent;
                const selectedMonth = months[currMonth];
                selectedDateElement.textContent = `${selectedDate} ${selectedMonth} ${currYear}`;
            }
        });
    });
};

renderCalendar();

bookButton.addEventListener("click", () => {
    const selectedDate = selectedDateElement.textContent;
    const selectedTime = document.getElementById("booking-time-start").value;
    console.log(selectedTime);
    const selectedTimeEnd = document.getElementById("booking-time-end").value;
    console.log(selectedTimeEnd);
    const selectedRoom = document.getElementById("booking-room").value;

    // Выполните нужные действия при нажатии на кнопку "Забронировать"
    // Например, отправка данных на сервер или другие операции
});

prevNextIcon.forEach((icon) => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});