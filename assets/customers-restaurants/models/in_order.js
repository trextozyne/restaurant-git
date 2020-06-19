function In_order(placed_order_id, offer_id, menu_item_id, quantity, item_price, price, comment) {
    return {
        id: guid(15),
        placed_order_id: placed_order_id,
        offer_id: offer_id,
        menu_item_id: menu_item_id,
        quantity: quantity,
        item_price: item_price,
        price: price,
        comment: comment
    };
}