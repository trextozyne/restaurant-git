function Offer(date_active_from, time_active_from,date_active_to,  time_active_to, offer_price) {
    return {
        id: guid(15),
        date_active_from: date_active_from,
        time_active_from: time_active_from,
        date_active_to: date_active_to,
        time_active_to: time_active_to,
        offer_price: offer_price
    };
}