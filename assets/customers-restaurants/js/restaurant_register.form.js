
function getCityId(state_name, city_name, zip_code, callback) {

    let city = new City(state_name, city_name, zip_code);

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        let response = {};

        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                response.id = city.id;
                response.error = false;
            } else {
                response.id = "An error has occured";
                response.error = true;
            }

            callback(response);
        }

    });

    xhr.open("POST", "/citys/write");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("postman-token", "752f3217-3efa-7e1f-e4ec-9718b799d789");

    xhr.send(JSON.stringify(city));
}


// Get the data from the form by using FormData objects.
document.getElementById("register").addEventListener("click", (e)=> {
    debugger;
    e.preventDefault();
    if(document.getElementById("file").files.length > 0 && document.RegisterAccount.querySelectorAll(".invalid").length === 0) {
        document.getElementById("file").parentElement.parentElement.nextElementSibling.style.visibility = "hidden";


        let user_name = document.RegisterAccount.user_name.value.trim();
        let restaurant_name = document.RegisterAccount.restaurant_name.value.trim();
        let address = document.RegisterAccount.address.value.trim();
        let state_name = document.RegisterAccount.state.value.trim();
        let city_name = document.RegisterAccount.city.value.trim();
        let zip_code = document.RegisterAccount.zip_code.value.trim();
        let contact_phone = document.RegisterAccount.contact_phone.value.trim();

        getCityId(state_name, city_name, zip_code, function (city) {
            if(!city.error) {
                let city_id = city.id;

                let restaurant = new Restaurant_account(user_name, restaurant_name, address, contact_phone, city_id);

                let form_data = new FormData();

                for (let key in restaurant) {
                    form_data.append(key, restaurant[key]);
                }

                form_data.append("file", document.getElementById("file").files[0]);

                let xhr = new XMLHttpRequest();
                xhr.withCredentials = true;

                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        let response = this.responseText;
                        if (this.status >= 200 && this.status < 400) {
                            let alert = alertModal(response);
                            if (document.querySelectorAll('.md-modal').length < 1)
                                document.body.insertAdjacentHTML('beforeend', alert);
                        } else { // image not found
                            let alert = alertModal(response);
                            if (document.querySelectorAll('.md-modal').length < 1)
                                document.body.insertAdjacentHTML('beforeend', alert);
                        }
                    }
                    // } else { // image not found
                    //     let alert = alertModal(this.responseText);
                    //     if (document.querySelectorAll('.md-modal').length < 1)
                    //         document.body.insertAdjacentHTML('beforeend', alert);
                    // }
                });

                xhr.open("POST", "/restaurant_register/write");
                xhr.setRequestHeader("cache-control", "no-cache");
                xhr.setRequestHeader("postman-token", "f1957c4b-d449-8afc-4bf0-7afd598990b0");

                xhr.send(form_data);

                console.log(restaurant);
            }
            // else {
            //     let alert = alertModal(city.response);
            //     if (document.querySelectorAll('.md-modal').length < 1)
            //         document.body.insertAdjacentHTML('beforeend', alert);
            // }
        });

    } else {
        document.getElementById("file").parentElement.parentElement.nextElementSibling.style.visibility = "visible";

        let alert = alertModal("There are errors that exist, provide information before proceeding");
        if(document.querySelectorAll('.md-modal').length < 1)
            document.body.insertAdjacentHTML('beforeend', alert);
    }
});



document.addEventListener('focusout', function(e) {
    debugger;
    if(e.target.type === "text" || e.target.type === "tel") {
        if (!e.target.validity.valid) {
            e.target.nextElementSibling.style.visibility = "visible";
            e.target.classList.add("invalid");
        } else {
            e.target.nextElementSibling.style.visibility = "hidden";
            e.target.classList.remove("invalid");
        }
    }
});


/**
 * @return {boolean}
 */
function CheckPassword(inputtxt)
{
    let decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    return !!inputtxt.value.match(decimal);
}

function checkPasswordMatch(e) {
    if (e.target.value.trim() === document.getElementById("password").value.trim()) {
        e.target.nextElementSibling.style.visibility = "visible";
        e.target.classList.add("invalid");
        e.target.nextElementSibling.textContent = "match";
        setTimeout(() => {
            e.target.nextElementSibling.style.visibility = "hidden";
            e.target.classList.remove("invalid");
        }, 2000)
    } else {
        e.target.nextElementSibling.style.visibility = "visible";
        e.target.classList.add("invalid");
        e.target.nextElementSibling.textContent = "not match";
    }
}

function checkforblank($this) {
    var location = $this;
    var invalid = location.textContent.trim() === "Select City" || location.textContent.trim() === "Select State";

    if (invalid) {
        location.parentElement.nextElementSibling.style.visibility = "visible";
        location.classList.add("invalid");
    } else {
        location.parentElement.nextElementSibling.style.visibility = "hidden";
        location.classList.remove("invalid");
    }
    return !invalid;
}

let select = document.getElementsByTagName("select");
Array.from(select).forEach((el, i)=>{
    checkforblank(el);
});

document.addEventListener('input', function(e) {
    debugger;
    if (!e.target.validity.valid && (e.target.type === "text" || e.target.type === "password" || e.target.type === "tel")) {
        e.target.nextElementSibling.style.visibility = "visible";
        e.target.classList.add("invalid");
    } else if (e.target.type !== "select-one") {
        e.target.nextElementSibling.style.visibility = "hidden";
        e.target.classList.remove("invalid");
    }
    if (e.target.name === "password") {
        if (CheckPassword(e.target)) {
            e.target.nextElementSibling.style.visibility = "hidden";
            e.target.classList.remove("invalid");
        } else {
            e.target.nextElementSibling.style.visibility = "visible";
            e.target.classList.add("invalid");
        }
    }
    if (e.target.name === "password-repeat") {
        checkPasswordMatch(e)
    }
});