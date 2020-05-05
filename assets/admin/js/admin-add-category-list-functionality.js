
(function () {
    getAllCategories();

    let categoryName = document.getElementById('categoryName');

    let addCategoryBtn = document.getElementById('add-task');

    addCategoryBtn.addEventListener('click', (event) => {
        debugger;
        if(event.target.innerText === 'Submit') {
            saveCategory(categoryName.value, "submit");
        }

        if(event.target.innerText === 'Update') {
            saveCategory(categoryName.value, "update");
        }
    });
})();


function activateCategoryItemnEdit_DeleteBtn(){
    let editBtn = document.getElementsByClassName('editCategory');
    let removeBtn = document.getElementsByClassName('removeCategory');
    for (let i = 0; i < editBtn.length; i++) {
        editBtn[i].addEventListener("click", function (event) {debugger
            findMenuItem(event.target.getAttribute("data-editId"), "category", function (response) {debugger;
                document.getElementById('categoryName').value = response.categoryName;
            });

            document.getElementsByClassName('add-Category')[0].innerText = 'Update';

            // findMenuItemOrder(event.target.getAttribute("data-editId"))
        })
    }
    for (let i = 0; i < removeBtn.length; i++) {
        removeBtn[i].addEventListener("click", function (event) {
            deleteMenuItem(event.target.getAttribute("data-deleteId"));
            event.target.parentNode.parentNode.removeChild(event.target.parentNode);
        })
    }
}

function saveCategory(category_name, status) {
    let data ={
        category: []
    };
    data.category.push({categoryName: category_name});
    if(status === "submit") {
        let settings = {
            "url": "http://localhost:1987/category/write",
            "method": "POST",
            "data": JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
        };

        $.ajax(settings).done(function (response) {
            console.log(response)
            // response = JSON.parse(response);
            let categoryAllList = document.getElementsByClassName("todo-list")[0];

            setTimeout(() => {
                debugger;
                let length = categoryAllList.querySelectorAll('input[type="radio"]').length - 1 || 0;
                categoryAllList.querySelectorAll('input[type="radio"]')[length].setAttribute('value', response.categoryId);
                let ilength = categoryAllList.querySelectorAll('.editCategory').length - 1 || 0;
                categoryAllList.querySelectorAll('.editCategory')[ilength].setAttribute('data-editid', response.categoryId);

                activateCategoryItemnEdit_DeleteBtn();
            }, 400);
        });
    }

    if (status === "update"){
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:1987/category/update/"+ id,
            "method": "PUT",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "ba5e5919-6424-42d1-566d-969f65763853"
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": JSON.stringify(data)
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
        });

        document.getElementsByClassName("todo-list")[0].innerHTML = "";
        //reload category list
        getAllCategories();
        document.getElementsByClassName('add-Category')[0].innerText = 'Submit'
    }
}

function getAllCategories(){
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:1987/category/read",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "7ee0efe3-10fe-837a-fb7e-77fb89603caf"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        let categories = response.category;
        categories.forEach((category) => {
            let categoryAllList = document.getElementsByClassName("todo-list")[0];
            let li = document.createElement('li');
            let div = document.createElement('div');
            div.classList.add("form-check");
            let label = document.createElement('label');
            label.classList.add("form-check-label");
            let input = document.createElement('input');
            input.classList.add("radio");
            input.setAttribute('value', category.categoryId);
            input.setAttribute('name', 'radio');
            input.setAttribute('type', 'radio');
            input.setAttribute('onchange', 'getCategoryId(this)');
            let textNode = document.createTextNode(`${category.categoryName}`);
            let input_helper = document.createElement('i');
            input_helper.classList.add("input-helper");
            let remove = document.createElement('i');
            remove.classList.add("removeCategory", "mdi", "mdi-close-circle-outline");
            let edit = document.createElement('i');
            edit.classList.add("editCategory", "mdi", "mdi-pencil-outline");
            edit.setAttribute('data-editid', category.categoryId);
            label.appendChild(textNode);
            label.appendChild(input);
            label.appendChild(input_helper);
            div.appendChild(label);
            li.appendChild(div);
            li.appendChild(remove);
            li.appendChild(edit);

            categoryAllList.appendChild(li);
        });
        activateCategoryItemnEdit_DeleteBtn();
    });
}

function filterCategory() {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("searchCategory");
    filter = input.value.toUpperCase();
    ul = document.getElementsByClassName("todo-list")[0];
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        // a = li[i].getElementsByTagName("input")[0];
        txtValue = li[i].textContent || li[i].innerText;
        debugger;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].setAttribute( 'style',"display: flex !important");
        } else {
            li[i].setAttribute( 'style', "display: none !important");
        }
    }
}