function Comment (placed_order_id, customer_id, comment_text, timestamp, is_commplaint, is_praise){
    return {
        id: guid(15),
        placed_order_id: placed_order_id,
        customer_id: customer_id,
        comment_text: comment_text,
        timestamp: timestamp,
        is_commplaint: is_commplaint,
        is_praise: is_praise
    };
}