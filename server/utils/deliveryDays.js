const calculateUpcomingDeliveryDates = (deliveryDays, weeks) => {
    const today = new Date();
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const deliveryDayIndexes = deliveryDays.map((day) =>
        daysOfWeek.indexOf(day.trim())
    );

    if (deliveryDayIndexes.some((index) => index === -1)) {
        throw new Error("Invalid delivery day provided.");
    }

    const dates = [];
    for (let i = 0; i < weeks; i++) {
        for (const dayIndex of deliveryDayIndexes) {
            const nextDate = new Date(today);
            const daysUntilNextDelivery =
                ((dayIndex - today.getDay() + 7) % 7) + i * 7;
            nextDate.setDate(today.getDate() + daysUntilNextDelivery);
            dates.push(nextDate.toISOString()); // Ensure valid ISO string format
        }
    }
    return dates;
};

module.exports = calculateUpcomingDeliveryDates;