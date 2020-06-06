// img = req.file.path;
// imgName = req.file.filename;

var menuItemCategoryId = null;
var menuItemId = null;
let menuImageItem = document.getElementById('item-image');
(function () {
    getMenuItem();//get all and place in modal, use todolist.js to create categorie form.

    let menuItemName = document.getElementById('item-name');
    let menuItemDescription = document.getElementById('item-description');
    let menuItemIngredients = document.getElementById('ingredients');
    let menuItemRecipe = document.getElementById('recipe');
    let menuItemPrice = document.getElementById('price');
    let menuItemIsActive = document.getElementById('item-active');

    let addMenuItemBtn = document.getElementsByClassName('add-menu-item')[0];

    addMenuItemBtn.addEventListener('click', (event) => {
        if(event.target.innerText === 'Submit') {
            if (menuItemCategoryId !== null && !!menuItemName.value && !!menuItemDescription.value && menuImageItem.files.length > 0
                && !!menuItemIngredients.value && !!menuItemRecipe.value && !!menuItemPrice.value)
                saveMenuItem(menuItemName.value, menuItemDescription.value
                    , menuItemIngredients.value, menuItemRecipe.value, menuItemPrice.value, menuItemIsActive.checked, menuItemCategoryId, "submit", null);
            else {
                let alert = alertModal('Please select a category in the left hand box and/or never leave a field above empty, wont work');
                if (document.querySelectorAll('.md-modal').length < 1)
                    document.body.insertAdjacentHTML('beforeend', alert);
            }
        }

        if(event.target.innerText === 'Update') {
            if (menuItemCategoryId !== null && !!menuItemName.value && !!menuItemDescription.value && menuImageItem.files.length > 0
                && !!menuItemIngredients.value && !!menuItemRecipe.value && !!menuItemPrice.value)
                saveMenuItem(menuItemName.value, menuItemDescription.value
                    , menuItemIngredients.value, menuItemRecipe.value, menuItemPrice.value, menuItemIsActive.checked, menuItemCategoryId, "update", menuItemId);
            else {
                let alert = alertModal('Please select a category in the left hand box and/or never leave a field above empty, wont work');
                if (document.querySelectorAll('.md-modal').length < 1)
                    document.body.insertAdjacentHTML('beforeend', alert);
            }
        }
    });
})();

function autofill($this){
    let itemTitle = document.getElementById('item-name-order');
    itemTitle.innerText = "For " + $this.value;
}

function getCategoryId($this) {debugger;
    menuItemCategoryId = $this.value;
}


function getMenuItemId($this) {debugger;
debugger;
    if($this.parentElement.innerText.includes(' (NA)')) {
        let itemTitle = document.getElementById('item-name-order');
        itemTitle.innerText = "For " + $this.parentElement.innerText;
        menuItemId = $this.value;
    }else {
        let alert = alertModal(`This Item is Active or has order created, please create a new Item to add a new order to OR if you're trying to edit the order, please click edit at the side of
         the Menu Item you want Edited`);
        if(document.querySelectorAll('.md-modal').length < 1)
            document.body.insertAdjacentHTML('beforeend', alert);
        $this.checked = false;
    }
}
//
function saveMenuItem(menu_item_name, menu_item_descr, menu_item_ingredient, menu_item_recipe, menu_item_price,
                      menu_item_is_active, itemCategoryId, status, id) {
    debugger;
    let form = new FormData();
    form.append("itemName", menu_item_name);
    form.append("itemDescription", menu_item_descr);
    form.append("itemIngredients", menu_item_ingredient);
    form.append("itemRecipe", menu_item_recipe);
    form.append("itemPrice", menu_item_price);
    form.append("itemActive", menu_item_is_active);
    if(itemCategoryId !== null || itemCategoryId !== "")
        form.append("itemCategoryId", itemCategoryId);
    form.append("file", menuImageItem.files[0]);

    if(status === "submit") {
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:1987/menu-item/write",
            "method": "POST",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "7a3a13d3-29c1-49ad-62b3-4d24b6549a8c"
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            response = JSON.parse(response);
            debugger;

            let menuItemAllList = document.getElementsByClassName("todo-list")[1];
            setTimeout(() => {
                debugger;
                let length = menuItemAllList.querySelectorAll('input[type="radio"]').length - 1 || 0;
                menuItemAllList.querySelectorAll('input[type="radio"]')[length].setAttribute('value', response.menuItemId);
                menuItemAllList.querySelectorAll('.removeMenuItem')[length].setAttribute('data-deleteid', response.menuItemId);
                menuItemAllList.querySelectorAll('.editMenuItem')[length].setAttribute('data-editid', response.menuItemId);
                menuItemAllList.querySelectorAll('label')[length].innerHTML += ' (NA)';

                activateMenuItemEdit_DeleteBtn();
            }, 400);
        });
        let alert = alertModal("This Product would be inactive regardless, until you provide it with the Order below.");
        if(document.querySelectorAll('.md-modal').length < 1)
            document.body.insertAdjacentHTML('beforeend', alert);
    }

    if (status === "update"){
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:1987/menu-item/update/"+ id,
            "method": "PUT",
            "headers": {
                "cache-control": "no-cache",
                "postman-token": "ba5e5919-6424-42d1-566d-969f65763853"
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
        });
        // setTimeout(() => {
            //reload menu item list
            getMenuItem();
            document.getElementsByClassName('add-menu-item')[0].innerText = 'Submit'
        // }, 400);
    }
}

function getMenuItem() {
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:1987/menu-item/read",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "5d1242ea-aeeb-856f-b8df-15f8dc43d058"
        }
    };

    $.ajax(settings).done(function (response) {
        document.getElementsByClassName("todo-list")[1].innerHTML = "";
        // console.log(response);
        let menuItems = response.menu;
        menuItems.forEach((menuItem) => {
            let menuItemAllList = document.getElementsByClassName("todo-list")[1];
            let li = document.createElement('li');
            let div = document.createElement('div');
            div.classList.add("form-check");
            let label = document.createElement('label');
            label.classList.add("form-check-label");
            let input = document.createElement('input');
            input.classList.add("radio");
            input.setAttribute('value', menuItem.menuItemId);
            input.setAttribute('name', 'radio');
            input.setAttribute('type', 'radio');
            input.setAttribute('onchange', 'getMenuItemId(this)');
            let textNode = document.createTextNode(`${menuItem.itemName} ${menuItem.itemActive===false ? "(NA)" : "(A)"}`);
            let input_helper = document.createElement('i');
            input_helper.classList.add("input-helper");
            let remove = document.createElement('i');
            remove.classList.add("removeMenuItem", "mdi", "mdi-close-circle-outline");
            remove.setAttribute("data-deleteId", menuItem.menuItemId);
            let edit = document.createElement('i');
            edit.classList.add("editMenuItem", "mdi", "mdi-pencil-outline");
            edit.setAttribute("data-editId", menuItem.menuItemId);
            label.appendChild(textNode);
            label.appendChild(input);
            label.appendChild(input_helper);
            div.appendChild(label);
            li.appendChild(div);
            li.appendChild(remove);
            li.appendChild(edit);

            menuItemAllList.appendChild(li);

        });
        activateMenuItemEdit_DeleteBtn();
    });
}

function deleteMenuItem(id) {
    debugger;
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:1987/menu-item/delete/"+ id,
        "method": "delete",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "5d1242ea-aeeb-856f-b8df-15f8dc43d058"
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    })
}

function findMenuItem(id, data, callback) {
    menuItemId = id;

    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:1987/" + data + "/find/"+ id,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "5a14b90e-227e-ae51-6508-206cc6611d16"
        },
         success: callback
    };

    $.ajax(settings);
}


function findMenuItemOrder(id) {
    let resp = null;
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:1987/restaurant/find/" + id,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache",
            "postman-token": "5d1242ea-aeeb-856f-b8df-15f8dc43d058"
        }
    };

    $.ajax(settings).done(function (response) {
        if (response !== "") addHtmlToResponse(response);
        resp = response;
    });
    return resp;
}

function addHtmlToResponse(response) {
    let str = response;
    function tagLiteral(obj)
    {
        for (let i in obj)
        {
            if (typeof obj[i] === "object")
            {
                tagLiteral(obj[i]);
            }
            else
            {
                obj[i] = `<span>${obj[i]}</span>`;
            }
        }
    }

    tagLiteral(str);
    console.log ( JSON.stringify (str).replace (/,/g, "\n" ) );
    let taggedLiteral =  JSON.stringify (str).replace (/\,/g, "<br>" );
    taggedLiteral =  taggedLiteral.replace (/({"c)/g, "<p>{</p>\"c" ).replace (/(\[{)/g, "<p>[{</p>" ).replace (/(:\[)/g, ":[<br>" )
        .replace (/("])/g, "\"<p>]</p>" ).replace (/(}])/g, "<p>}]</p>" );
    document.getElementById('editOrderForm').innerHTML = taggedLiteral;

    document.getElementById('menu-item-order-edit').addEventListener("click", (e)=>{
        let allspanTags = e.target.parentElement.parentElement.parentElement.querySelectorAll('span');
        allspanTags.forEach((p, i)=>{debugger;
            let input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('value', p.innerText);
            input.classList.add('menuItemOrder','required');

            p.parentNode.replaceChild(input, p);
        });
        document.getElementsByClassName('editDone')[0].removeAttribute('hidden');
    });
    document.getElementsByClassName('editDone')[0].onclick = function (e) {
    // document.getElementsByClassName('editDone')[0].addEventListener("click", (e)=>{
        let allInput = e.target.parentElement.parentElement.parentElement.querySelectorAll('input');
        allInput.forEach((input, i)=>{
            let text = document.createTextNode(input.value);
            input.parentNode.replaceChild(text, input);
        });
        debugger;
        setTimeout(()=>{
            document.getElementById('editOrder').classList.remove('filled');
            document.getElementById('order').classList.remove('hide');
            e.target.setAttribute('hidden', 'hidden');
        }, 700);

        let jsonOrderData = JSON.parse(stripHtml(document.getElementById('editOrderForm').innerHTML.replace (/<br>/g, "," )
                                    .replace (/(:\[,)/g, ":[")));//
        let complete_order = JSON.stringify(jsonOrderData);
debugger;
        updateOrder(complete_order, jsonOrderData);
    };

    function stripHtml(html)
    {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    document.getElementById('editOrder').classList.add('filled');
    document.getElementById('order').classList.add('hide');
}

function updateOrder(complete_order, jsonOrderData) {
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:1987/restaurant/update/"+ jsonOrderData.menuItemId,
        "method": "PUT",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "postman-token": "f0fe5ffb-558d-1f13-49f6-91468f65ac2b"
        },
        "processData": false,
        data: complete_order
    };

    $.ajax(settings).done(function (response) {
        // alert(response);
    });
}

function filterMenuItem() {
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

function activateMenuItemEdit_DeleteBtn(){
    let editBtn = document.getElementsByClassName('editMenuItem');
    let removeBtn = document.getElementsByClassName('removeMenuItem');
    for (let i = 0; i < editBtn.length; i++) {
        editBtn[i].addEventListener("click", function (event) {debugger
            findMenuItem(event.target.getAttribute("data-editId"), "menu-item", function (response) {debugger;
                menuItemCategoryId = response.itemCategoryId;
                document.getElementById('item-name').value = response.itemName;
                document.getElementById('item-description').value = response.itemDescription;
                document.getElementById('ingredients').value = response.itemIngredients;
                document.getElementById('recipe').value = response.itemRecipe;
                document.getElementById('price').value = response.itemPrice;
                document.getElementById('item-active').setAttribute("checked", response.itemActive);
            });


            document.getElementsByClassName('add-menu-item')[0].innerText = 'Update';

            findMenuItemOrder(event.target.getAttribute("data-editId"))
        })
    }
    for (let i = 0; i < removeBtn.length; i++) {
        removeBtn[i].addEventListener("click", function (event) {
            deleteMenuItem(event.target.getAttribute("data-deleteId"));
            event.target.parentNode.parentNode.removeChild(event.target.parentNode);
        })
    }
}

