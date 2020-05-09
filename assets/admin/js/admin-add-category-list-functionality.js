let id = null;

(function () {
    getAllCategories();

    let categoryName = document.getElementById('categoryName');

    let addCategoryBtn = document.getElementById('add-task');

    addCategoryBtn.addEventListener('click', (event) => {
        debugger;
        if(event.target.innerText === 'Add' && categoryName.value !== "") {
            saveUpdateCategory(categoryName.value, "Add");
        }

        if(event.target.innerText === 'Update' && categoryName.value !== "") {
            saveUpdateCategory(categoryName.value, "Update");
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
                id = event.target.getAttribute("data-editId");
            });

            document.getElementsByClassName('add-category')[0].innerText = 'Update';

            // findMenuItemOrder(event.target.getAttribute("data-editId"))
        })
    }
    for (let i = 0; i < removeBtn.length; i++) {
        removeBtn[i].addEventListener("click", function (event) {
            deleteMenuItem(event.target.getAttribute("data-deleteId"));
            event.target.parentNode.parentNode.removeChild(event.target.parentNode);
            id = event.target.getAttribute("data-deleteId");
        })
    }
}

function saveUpdateCategory(category_name, status) {
    let data ={
        category: []
    };
    data.category.push({categoryName: category_name});
    if(status === "Add") {
        let settings = {
            "url": "http://localhost:1987/category/write",
            "method": "POST",
            "data": JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            // response = JSON.parse(response);
            let categoryAllList = document.getElementsByClassName("todo-list")[0];

            setTimeout(() => {
                debugger;
                let length = categoryAllList.querySelectorAll('input[type="radio"]').length - 1 || 0;
                categoryAllList.querySelectorAll('input[type="radio"]')[length].setAttribute('value', response[0].categoryId);
                let editlength = categoryAllList.querySelectorAll('.editCategory').length - 1 || 0;//get last added input
                categoryAllList.querySelectorAll('.editCategory')[editlength].setAttribute('data-editid', response[0].categoryId);
                let removelength = categoryAllList.querySelectorAll('.removeCategory').length - 1 || 0;//get last added input
                categoryAllList.querySelectorAll('.removeCategory')[removelength].setAttribute('data-deleteId', response[0].categoryId);

                activateCategoryItemnEdit_DeleteBtn();
            }, 400);
        });
    }

    if (status === "Update"){
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:1987/category/update/"+ id,
            "method": "PUT",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
        });

        setTimeout(() => {
            document.getElementsByClassName("todo-list")[0].innerHTML = "";
            document.getElementById('categoryName').value = "";
            //reload category list
            getAllCategories();
            document.getElementsByClassName('add-category')[0].innerText = 'Add'
        }, 400);

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
            remove.setAttribute('data-deleteId', category.categoryId);
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