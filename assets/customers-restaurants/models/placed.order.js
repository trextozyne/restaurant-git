function Placed_order(restaurant_id, order_time, estimated_delivery_time, food_ready, actual_delivery_time, delivery_address, customer_id, price, discount, final_price, comment, timestamp) {
    return {
        id: guid(15),
        restaurant_id: restaurant_id,
        order_time: order_time,
        estimated_delivery_time: estimated_delivery_time,
        food_ready: food_ready,
        actual_delivery_time: actual_delivery_time,
        delivery_address: delivery_address,
        customer_id: customer_id,
        price: price,
        discount: discount,
        final_price: final_price,
        comment: comment,
        timestamp: timestamp
    };
}