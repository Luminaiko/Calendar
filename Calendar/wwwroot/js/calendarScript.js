const daysTag = document.querySelector(".days");
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

                //По клику посмотреть время на которое занято
                days.forEach(day => {
                    day.addEventListener("click", () => {
                        if (!day.classList.contains("inactive")) {
                            const selectedDate = day.textContent;
                            const selectedMonth = months[currMonth];
                            selectedDateElement.textContent = `${selectedDate} ${selectedMonth} ${currYear}`;
                            fetchEvents(selectedDate, currMonth, currYear);
                        }
                    });
                });
            }
        });
    });


};

renderCalendar();

//ОБЯЗАТЕЛЬНОЕ ПОЛЕ ОБРАБОТКИ СОБЫТИЙ ЧАСОВ И ТД///////////////////

const broadcastCheckBox = document.getElementById("broadcast-checkbox");
const platformFields = document.getElementById("platform-fields");
const platformSelect = document.getElementById("platform-select");
const techSupportCheckBox = document.getElementById("tech-checkbox");


techSupportCheckBox.addEventListener("change", () => {
    if (techSupportCheckBox.checked) {
        techSupport = 1;
        console.log(techSupport + "pressed");
    } else {
        techSupport = 0;
        console.log(techSupport + "not pressed");
    }
})

broadcastCheckBox.addEventListener("change", () => {
    if (broadcastCheckBox.checked) {
        platformFields.style.display = "block";
    } else {
        platformFields.style.display = "none";
    }
});

bookButton.addEventListener("click", () => {

    const selectedDate = selectedDateElement.textContent;
    console.log("selectedDate = " + selectedDate);

    const selectedTime = document.getElementById("booking-time-start").value;
    console.log("selectedTime = " + selectedTime);

    const selectedTimeEnd = document.getElementById("booking-time-end").value;
    console.log("selectedTimeEnd = " + selectedTimeEnd);

    const selectedHall = document.getElementById("booking-hall").value;
    console.log("selectedHall = " + selectedHall);

    const selectedHallByName = document.getElementById("hall+" + selectedHall).innerHTML;

    // Проверка доступности бронирования
    if (!checkBookingAvailability(selectedTime, selectedTimeEnd, selectedHallByName)) {
        console.log("Booking not available for the selected time and hall.");
        return; // Прерываем выполнение функции, если бронирование недоступно
    }

    let techSupport;
    let selectedPlatform;
    let selectedBroadcast;

    if (techSupportCheckBox.checked) {
        techSupport = 1;
        console.log("tech support = " + techSupport)
    } else {
        techSupport = 0;
        console.log("tech support = " + techSupport)
    }

    if (broadcastCheckBox.checked) {
        selectedPlatform = document.getElementById("platform-select").value;
        console.log("selectedPlatform = " + selectedPlatform);

        selectedBroadcast = document.getElementById("broadcast-select").value;
        console.log("selectedBroadcast = " + selectedBroadcast);
    } else {
        selectedPlatform = 0;
        console.log("selectedPlatform = " + selectedPlatform);

        selectedBroadcast = 0;
        console.log("selectedBroadcast = " + selectedBroadcast);
    }


    //Правильно конвертированная дата
    const dateParts = selectedDate.split(" ");
    const month = months.indexOf(dateParts[1]);
    const day = parseInt(dateParts[0]);
    const year = parseInt(dateParts[2]);
    const timeZoneOffset = new Date().getTimezoneOffset();
    // Apply the time zone offset to adjust the date
    const adjustedDate = new Date(year, month, day + 1);
    adjustedDate.setMinutes(adjustedDate.getMinutes() + timeZoneOffset);

    const selectedDateTime = adjustedDate.toISOString(); //Работающая дата в формате DateTime

    

    // Создание объекта с данными для отправки на сервер
    const eventData = {
        Date: selectedDateTime,
        TimeStart: String(selectedTime),
        TimeEnd: String(selectedTimeEnd),
        TechSupport: techSupport,
        PlatformId: parseInt(selectedPlatform),
        BroadcastId: selectedBroadcast,
        HallId: selectedHall
    };

    // Опции для запроса
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
    };

    // Выполнение запроса
    fetch('/Home/AddEvent', requestOptions)
        .then(response => {
            if (response.ok) {
                // Обработка успешного ответа от сервера
                console.log('Event added successfully.');
            } else {
                // Обработка ошибки
                console.error('Error adding event.');
            }
        })
        .catch(error => {
            // Обработка ошибки
            console.error(error);
        });

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

const eventList = document.getElementById("event-list-container");

const fetchEvents = (selectedDate, currMonth, currYear) => {
    const month = currMonth + 1;
    const formattedDate = `${currYear}-${month < 10 ? '0' + month : month}-${selectedDate < 10 ? '0' + selectedDate : selectedDate}`;
    const url = `/Home/GetEvents?selectedDate=${formattedDate}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const eventTable = document.querySelector(".event-table");
            eventTable.innerHTML = ""; // Очистка содержимого таблицы

            data.forEach(event => {
                const row = document.createElement("tr");
                const timeStartCell = document.createElement("td");
                const timeEndCell = document.createElement("td");
                const hallCell = document.createElement("td");

                timeStartCell.textContent = event.timeStart;
                timeEndCell.textContent = event.timeEnd;
                hallCell.textContent = event.hallName;

                row.appendChild(timeStartCell);
                row.appendChild(timeEndCell);
                row.appendChild(hallCell);

                eventTable.appendChild(row);
            });
        })
        .catch(error => console.error(error));
};

const checkBookingAvailability = (selectedTime, selectedTimeEnd, selectedHall) => {
    const eventTable = document.querySelector(".event-table");
    const rows = eventTable.querySelectorAll("tr");

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const timeStartCell = row.querySelector("td:first-child");
        const timeEndCell = row.querySelector("td:nth-child(2)");
        const hallCell = row.querySelector("td:nth-child(3)");

        const eventTimeStart = timeStartCell.textContent;
        const eventTimeEnd = timeEndCell.textContent;
        const eventHall = hallCell.textContent;

        console.log(selectedTime === eventTimeStart);
        if (selectedHall === eventHall) {
            // Проверка пересечения комнаты
            if ((selectedTimeEnd > eventTimeEnd) || (selectedTime > eventTimeStart && selectedTimeEnd <= eventTimeEnd)) { 
                return false; // Бронирование недоступно
            }
        }
    }

    return true; // Бронирование доступно
}; 