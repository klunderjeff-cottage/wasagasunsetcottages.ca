/* ============================
   RENDER CALENDAR (UI)
   ============================ */
function renderCalendar(bookedEvents = [], elementId = "calendar", monthOffset = 0, monthLabelId = null) {
    const calendar = document.getElementById(elementId);
    if (!calendar) return;

    const today = new Date();
    const baseYear = today.getFullYear();
    const baseMonth = today.getMonth();

    const targetDate = new Date(baseYear, baseMonth + monthOffset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    if (monthLabelId) {
        const labelEl = document.getElementById(monthLabelId);
        if (labelEl) {
            labelEl.textContent = `${targetDate.toLocaleString('default', { month: 'long' })} ${year}`;
        }
    }

    let html = `<div class="cal-grid">`;

    for (let i = 0; i < firstDay; i++) {
        html += `<div class="cal-empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${month + 1}-${day}`;
        const eventsForDay = bookedEvents.filter(ev => ev.date === dateStr);

        const isBooked = eventsForDay.length > 0;
        const sources = eventsForDay.map(ev => ev.source);

        // ⭐ TODAY CHECK (added)
        const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

        // Determine class based on source
        let sourceClass = "";
        if (isBooked) {
            if (sources.includes("Airbnb")) {
                sourceClass = "booked airbnb";
            } else {
                sourceClass = "booked direct";
            }
        }

        html += `
            <div class="cal-day ${sourceClass} ${isToday ? 'today' : ''}"
                 data-date="${dateStr}"
                 title="${isBooked ? 'Booked via: ' + sources.join(', ') : ''}">
                ${day}
            </div>`;
    }

    html += `</div>`;
    calendar.innerHTML = html;
}


/* ============================
   MANUAL BOOKINGS (JSON FILE)
   ============================ */
async function loadManualBookings() {
    try {
        const res = await fetch("js/bookings.json");
        return await res.json();
    } catch (err) {
        console.error("Manual bookings failed to load:", err);
        return [];
    }
}

/* ============================
   MERGE AIRBNB + MANUAL
   ============================ */
async function loadMergedCalendar(icalUrls, calendarElementId, cottageId, monthOffset = 0, monthLabelId = null) {
    const calendarElement = document.getElementById(calendarElementId);
    if (!calendarElement) return;

    const allEvents = [];

    const sources = ["Airbnb"];

    // Load Airbnb iCal
    for (let i = 0; i < icalUrls.length; i++) {
        const url = icalUrls[i];
        const sourceName = sources[i];

        if (!url) continue;

        try {
            const res = await fetch(url);
            const text = await res.text();
            const bookedDates = parseIcal(text);

            bookedDates.forEach(date => {
                allEvents.push({
                    date: date,
                    source: sourceName
                });
            });

        } catch (err) {
            console.error("Failed to load iCal:", url, err);
        }
    }

    // Load manual bookings
    const manualBookings = await loadManualBookings();

    manualBookings
        .filter(b => b.cottageId === cottageId)
        .forEach(b => {
           /* const start = new Date(b.start);
            const end = new Date(b.end);
            let current = new Date(start); */

            function parseLocalDate(str) {
                const [y, m, d] = str.split("-").map(Number);
                return new Date(y, m - 1, d); // local date, no timezone shift
            }

            const start = parseLocalDate(b.start);
            const end = parseLocalDate(b.end);
            let current = new Date(start);


            while (current <= end) {
                const y = current.getFullYear();
                const m = current.getMonth() + 1;
                const d = current.getDate();
                const key = `${y}-${m}-${d}`;

                allEvents.push({
                    date: key,
                    source: "Direct Booking"
                });

                current.setDate(current.getDate() + 1);
            }
        });

    renderCalendar(allEvents, calendarElementId, monthOffset, monthLabelId);
}
