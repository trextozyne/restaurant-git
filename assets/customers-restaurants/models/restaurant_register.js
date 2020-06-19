function Restaurant_account(user_name, restaurant_name, address, contact_phone, city_id) {
    return {
        id: guid(15),
        user_name: user_name,
        restaurant_name: restaurant_name,
        address: address,
        contact_phone: contact_phone,
        city_id: city_id
    };
}