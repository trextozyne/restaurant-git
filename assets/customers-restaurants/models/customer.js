function Account(user_name, customer_name, city_id, address, contact_phone, email, password) {
    return {
        id: guid(15),
        user_name: customer_name,
        customer_name: customer_name,
        city_id: city_id,
        address: address,
        contact_phone: contact_phone,
        email: email,
        confirmation_code: guid(7),
        password: password,
        time_joined: Math.floor(Date.now() / 1000)
    };
}