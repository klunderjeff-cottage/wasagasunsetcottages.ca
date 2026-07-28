async function fetchIcal(url) {
    const res = await fetch(url);
    return res.text();
}

function parseIcal(text) {
    const booked = [];
    const events = text.split("BEGIN:VEVENT");

    events.forEach(event => {
        const startMatch = event.match(/DTSTART;VALUE=DATE:(\d{8})/);
        const endMatch = event.match(/DTEND;VALUE=DATE:(\d{8})/);

        if (startMatch && endMatch) {
            const start = startMatch[1];
            const end = endMatch[1];

            const startDate = new Date(
                start.substring(0,4),
                start.substring(4,6) - 1,
                start.substring(6,8)
            );
            const endDate = new Date(
                end.substring(0,4),
                end.substring(4,6) - 1,
                end.substring(6,8)
            );

            let current = new Date(startDate);
            while (current <= endDate) {
                const y = current.getFullYear();
                const m = current.getMonth() + 1;
                const d = current.getDate();
                const key = `${y}-${m}-${d}`;
                if (!booked.includes(key)) booked.push(key);
                current.setDate(current.getDate() + 1);
            }
        }
    });

    return booked;
}