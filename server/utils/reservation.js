// Given a reservation date and time (as "HH:mm"), returns the reservation DateTime and expiry DateTime.
function getReservationAndExpiry(dateInput, timeInput) {
    // Create a Date object from the date input
    const reservationDate = new Date(dateInput);
    // Assume timeInput is in "HH:mm" format
    const [hours, minutes] = timeInput.split(":").map(Number);
    reservationDate.setHours(hours, minutes, 0, 0);

    // Expiry is 2 hours after the reservation start
    const expiryDate = new Date(reservationDate.getTime() + 2 * 60 * 60 * 1000);

    return { reservationDateTime: reservationDate, expiryDateTime: expiryDate };
}
