const daysTag = document.querySelector(".days");
const currentDate = document.querySelector(".current-date");
const prevNextIcon = document.querySelectorAll(".icons span");
const selectedDateElement = document.getElementById("selected-date");
const bookButton = document.getElementById("book-button");
const broadcastCheckBox = document.getElementById("broadcast-checkbox");
const platformFields = document.getElementById("platform-fields");
const platformSelect = document.getElementById("platform-select");
const techSupportCheckBox = document.getElementById("tech-checkbox");
const eventList = document.getElementById("event-list-container");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();
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
    const firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayOfMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
        const isToday =
            i === date.getDate() &&
                currMonth === new Date().getMonth() &&
                currYear === new Date().getFullYear()
                ? "active"
                : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    const days = document.querySelectorAll(".days li");
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
};

const fetchEvents = (selectedDate, currMonth, currYear) => {
    const month = currMonth + 1;
    const formattedDate = `${currYear}-${month < 10 ? '0' + month : month}-${selectedDate < 10 ? '0' + selectedDate : selectedDate}`;
    const url = `/Home/GetEvents?selectedDate=${formattedDate}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const eventTable = document.querySelector(".event-table");
            eventTable.innerHTML = "";

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

        if (selectedHall === eventHall) {
            if ((selectedTimeEnd > eventTimeEnd) || (selectedTime > eventTimeStart && selectedTimeEnd <= eventTimeEnd)) {
                return false;
            }
        }
    }

    return true;
};

const handleTechSupportCheckboxChange = () => {
    const techSupport = techSupportCheckBox.checked ? 1 : 0;
    console.log("tech support =", techSupport);
};

const handleBroadcastCheckboxChange = () => {
    platformFields.style.display = broadcastCheckBox.checked ? "block" : "none";
};

const handleBookButtonClick = () => {
    const selectedDate = selectedDateElement.textContent;
    const selectedTime = document.getElementById("booking-time-start").value;
    const selectedTimeEnd = document.getElementById("booking-time-end").value;
    const selectedHall = document.getElementById("booking-hall").value;
    const selectedHallByName = document.getElementById("hall+" + selectedHall).innerHTML;

    if (!checkBookingAvailability(selectedTime, selectedTimeEnd, selectedHallByName)) {
        console.log("Booking not available for the selected time and hall.");
        return;
    }

    const techSupport = techSupportCheckBox.checked ? 1 : 0;
    const selectedPlatform = broadcastCheckBox.checked ? platformSelect.value : 0;
    const selectedBroadcast = broadcastCheckBox.checked ? document.getElementById("broadcast-select").value : 0;

    const dateParts = selectedDate.split(" ");
    const month = months.indexOf(dateParts[1]);
    const day = parseInt(dateParts[0]);
    const year = parseInt(dateParts[2]);
    const timeZoneOffset = new Date().getTimezoneOffset();

    const adjustedDate = new Date(year, month, day + 1);
    adjustedDate.setMinutes(adjustedDate.getMinutes() + timeZoneOffset);

    const selectedDateTime = adjustedDate.toISOString();

    const eventData = {
        Date: selectedDateTime,
        TimeStart: String(selectedTime),
        TimeEnd: String(selectedTimeEnd),
        TechSupport: techSupport,
        PlatformId: parseInt(selectedPlatform),
        BroadcastId: selectedBroadcast,
        HallId: selectedHall
    };

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
    };

    fetch('/Home/AddEvent', requestOptions)
        .then(response => {
            if (response.ok) {
                console.log('Event added successfully.');
            } else {
                console.error('Error adding event.');
            }
        })
        .catch(error => {
            console.error(error);
        });
};

const handlePrevNextIconClick = (icon) => {
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

    if (currMonth < 0 || currMonth > 11) {
        date = new Date(currYear, currMonth, new Date().getDate());
        currYear = date.getFullYear();
        currMonth = date.getMonth();
    } else {
        date = new Date();
    }

    renderCalendar();
};

techSupportCheckBox.addEventListener("change", handleTechSupportCheckboxChange);
broadcastCheckBox.addEventListener("change", handleBroadcastCheckboxChange);
bookButton.addEventListener("click", handleBookButtonClick);
prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => handlePrevNextIconClick(icon));
});

renderCalendar();