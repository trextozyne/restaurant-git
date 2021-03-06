let qtyInput = null;//global element
let singleprodqtyInput  = null;
let addBtn = null;
let cartBtn =null;
let total = 0;
let bool_singleProduct = false;
let cart_item = null;
let singleCartItems = [];
let singleProductPrice = 0;
let itemSales = [];
let arraySaleNames = [];
let arraySalePrices = [];

let test = null;
let response = true;

let singleProcuctClicked = false;
let singleProcuctEdited = false;

let mainPrice = 0;
//=====================create the cart template for single products============================
function singleProductTemplate(name, singleprice, data_singleProduct, id){
    let formId = guid(15);
debugger;
    const singleProdctcart_item = document.createElement("div");
    singleProdctcart_item.classList.add("single-product");
    singleProdctcart_item.setAttribute('data-singleProduct', data_singleProduct);
    singleProdctcart_item.setAttribute('data-formId', formId);
    singleProdctcart_item.setAttribute('data-priceVal', singleprice);

    singleProdctcart_item.innerHTML = "\n" +
        // "<div class=\"single-product\" data-singleProduct=\"true\">\n" +
        "    <span class=\"quantity\">1</span>\n" +
        "    <span class=\"name\">"+ name +"</span>\n" +
        "    <span class=\"singleprice\">$"+ singleprice +"</span>\n" +
        "    <span class=\"delete\" onclick=\"deleteCartItem(this, '" + id + "', 'single-product', '" + formId + "'); \">\n" +
        "        <div class=\"icon\">\n" +
        "            <div class=\"lid\"></div>\n" +
        "            <div class=\"lidcap\"></div>\n" +
        "            <div class=\"bin\"></div>\n" +
        "        </div>\n" +
        "    </span><!--end of single product-->\n";
    // "</div>"

    if (singleProcuctEdited === false && singleProcuctClicked === true) {
        singleCartItems.push(singleProdctcart_item);

        itemSales.push({
            salesId : formId,
            quantity : !singleprodqtyInput ? 1 : parseInt(singleprodqtyInput.value),
            boolSingle : true,
            arraySaleNames : [name],
            arraySalePrices : [singleprice],
            sale: []
        })
    }


}

//==================START calcualte all the checked inputs(radio, checbox) price total and create singleProcuct cart template here===============================
function inputCheckedTotal(radios, checkboxes) {
    mainPrice = document.querySelectorAll("div.p-modal .main-price")[0].textContent.match(/[+-]?\d+(\.\d+)?/g).map(function(v) { return parseFloat(v); })[0];

    total = mainPrice;
    if((radios !== null || checkboxes !== null) && (radios.length !== 0 || checkboxes.length !== 0)) {
        radios.forEach((radio) => {
            total += parseFloat(radio.value);
        });


        if(singleProcuctClicked === true){
            singleCartItems = [];

            if(itemSales.length !== 0){
                for (let i=0; i<itemSales.length; i++)  {
                    if(itemSales[i].boolSingle) {
                        // get index of object
                        let removeIndex = itemSales.map(function(item) { return item.boolSingle; }).indexOf(true);
                        // remove object
                        itemSales.splice(removeIndex, 1);

                        i--;//decrement loop once the array is reduced in length
                    }
                }
            }
        }

        checkboxes.forEach((checkbox) => {
            debugger;
            bool_singleProduct = false;
            //get true of false if this is a single product unaffected by button activation, and total price, its a stand alone product
           if(checkbox.hasAttribute("data-singleProduct"))
               bool_singleProduct = parseBoolean(checkbox.getAttribute("data-singleProduct"));

            if(bool_singleProduct === true && checkbox.hasAttribute("data-singleProduct") && checkbox.checked) {//create object array here for cart

                let data_singleProduct = checkbox.getAttribute("data-singleProduct");
                let name = checkbox.getAttribute("data-option");
                let singleprice = checkbox.value;

                const item = {};
                item.name = name.trim();
                item.singleprice = singleprice;
                item.data_singleProduct = data_singleProduct;
                item.id = checkbox.id;

                if(singleProcuctEdited === false)
                {
                    singleProcuctEdited = false;//prevent the edit template from been put in the cart.
                    singleProcuctClicked = true;//allow the add template to be put in the cart.
                }

                singleProductTemplate(item.name, singleprice, item.data_singleProduct, item.id);
            }

            if (if_required(checkbox.parentElement.parentElement.parentElement.className.split(/\s+/)[1],
                checkbox.parentElement.parentElement.parentElement.getAttribute('data-max'), document.querySelectorAll('div.option-board[class^=option-][data-max]:not([data-max="0"]) input[type="checkbox"]:not([id^=inner-check])')) ||
                (!addBtn.hasAttribute("disabled") && typeof checkbox !== "undefined" &&
                    parseBoolean(checkbox.getAttribute("data-singleProduct")) === true) &&
                document.querySelectorAll('div.option-board[class^=option-][data-max]:not([data-max="0"]) input[id^=inner-]').length > 0)//get true of false if this is a single product unaffected by button activation, and total price, its a stand alone product
                addBtn.removeAttribute("disabled");
            else
                addBtn.setAttribute("disabled", "disabled");

            if(bool_singleProduct === false)//dont add it to total
                total += parseFloat(checkbox.value);
        });

        if(qtyInput.value === "")
            total *= 1;
        else
            total *= parseInt(qtyInput.value);
    }
    return total;
}
//==================END calcualte all the checked inputs(radio, checbox) price total and create singleProcuct cart template here===============================


function performInitialCalc() {
    let el = document.getElementsByClassName("modal-show");
    let radios = el[0].querySelectorAll("input[type='radio']:checked");
    let checkboxs = el[0].querySelectorAll("input[type='checkbox']:checked");
    printTotal(inputCheckedTotal(radios, checkboxs));
}

// function findClassOffspring (element, cls) {
//     let els = [], stop = false;
//     while (element.firstChild !== null && element && stop !== true && !element.classList.contains(cls)) {
//         els.unshift(element);
//         if (element.firstChild.nodeName !== "#document") {
//             element = element.firstChild;
//         } else
//             stop = true;
//
//     }
// }

function findClassStartsWithAncestor (element, cls) {
    let els = [], stop = false, found = false;
    debugger;
    while (element.parentNode !== null && element && stop!==true) {
        els.unshift(element);
        if(element.className.split(/\s+/).length > 1) {
            if (element.parentNode.nodeName !== "#document" && element.className.split(/\s+/)[1].startsWith(cls)) {
                stop = true;

                found = true;
            } else
                element = element.parentNode;//stop = true;
        } else
            element = element.parentNode;

    }
    return found;
}

function findClassAncestor (element, cls) {
    let els = [], stop = false;
    while (element.parentNode !== null && element && stop!==true && !element.classList.contains(cls)) {
        els.unshift(element);
        if(element.parentNode.nodeName !== "#document") {
            element = element.parentNode;
        }else
            stop = true;

    }
    return element;
}

function findDataAncestor (element, data) {

    let els = [], stop = false;
    while (element && stop!==true && !element.getAttribute(data)) {
        els.unshift(element);
        if(element.parentNode.nodeName !== "#document") {
            element = element.parentNode;
        }else
            stop = true;

    }
    return element;
}

//===============creates the modal wrapper where createModalData(response) inserts its innerHTML==================

// =================Beginning of initiateInputsChecked(radios, checkboxs) {...}==============================
function getCheckboxCount(data_max, inputs1) {//checkbox or radio input
    let total_data_max = 0;
    debugger;
    //sum all the parent element datamax thats what to compare against
    document.querySelectorAll('.option-board').forEach((optionDiv)=> {
        if(optionDiv.hasAttribute('data-max'))
            total_data_max += parseInt(optionDiv.getAttribute('data-max'));
    });
    let parents = document.querySelectorAll('div.option-board[data-max]:not([data-max="0"])');
    let countBothChecked = 0;
    let countCheckboxChecked = 0;
    let hasInnerInputCheck = true;
    let innerInputCheckedOnce = false;
    arraySaleNames = [];
    arraySalePrices = [];

    "use strict";
    parents.forEach((parent)=>{
        Array.from(inputs1).forEach((input1) => {
            if(input1.hasAttribute("data-singleProduct"))
                if(parseBoolean(input1.getAttribute("data-singleProduct")) === false) {
                    let inputs2 = typeof input1.parentElement.children[2] !== 'undefined'
                        ? input1.parentElement.querySelectorAll(`input[type='${parseBoolean(input1.parentElement.getAttribute("data-multiple")) ? "checkbox" : "radio"}'][id^=inner-]`) : [];
                    Array.from(inputs2).forEach((input2) => {
                        if (innerInputCheckedOnce === false && input1.checked && input2.checked && parent.isSameNode(findClassAncestor(input1, "option-board")) &&
                            parent.isSameNode(findClassAncestor(input2, "option-board"))) {
                            countBothChecked++;

                            innerInputCheckedOnce = true;//the inner input of that block(div.inner-..or family is checked at least once satisfies condition
                        }

                        if (input2.checked && parent.isSameNode(findClassAncestor(input2, "option-board"))) {
                            arraySaleNames.push(input2.getAttribute("data-option").trim());
                            arraySalePrices.push(input2.value.trim());
                        }

                        hasInnerInputCheck = true;

                        data_max = findClassAncestor(input2, "inner-option-board").className.split(/\s+/)[1].startsWith("inner-option-") ?
                            findClassAncestor(input2, "option-board").getAttribute('data-max') : data_max;
                    });
                    if (input1.checked && parent.isSameNode(findClassAncestor(input1, "option-board"))) {
                        countCheckboxChecked++;
                        arraySaleNames.push(input1.getAttribute("data-option").trim());
                        arraySalePrices.push(input1.value.trim());
                    }
                    if (input1.checked && countCheckboxChecked === parseInt(data_max) && hasInnerInputCheck === false && countBothChecked !== 0 && parent.isSameNode(findClassAncestor(input1, "option-board")))
                        countBothChecked = countCheckboxChecked;

                    hasInnerInputCheck = false;
                    innerInputCheckedOnce = false;
                }
        });
    });

    document.querySelectorAll('div.option-board[class^=option-]:first-child input').forEach((input)=>{
        arraySaleNames.push(input.getAttribute("data-option").trim());
        arraySalePrices.push(input.value.trim());
    });


    return countCheckboxChecked === countBothChecked && countBothChecked === total_data_max && countCheckboxChecked === total_data_max ? countBothChecked : 0;
}

function getParentDataMax(element) {
    let els = [];
    let data = null;
    if(typeof element !== "undefined")
        if (element.classList)
            while (element.nodeType === 1 ) {
                try {
                    if (element.hasAttribute('data-max')) {
                        data = element.getAttribute('data-max');
                    }
                    els.unshift(element);
                    element = element.parentNode;
                } catch (err) {
                    console.log(err);
                    els.unshift(element);
                    element = element.parentNode;
                }
            }
    debugger;
    return data;
}

function checkOptionClassExistence() {
    let elClass = [];
    elClass = [...document.querySelector("button.add-btn").classList];
    debugger;
    let arrClass = listOfOptionClasses.filter(function(item){
        return elClass.indexOf(item) === -1;
    });

    if(arrClass.length > 0)
        arrClass.forEach((item)=>{
            document.querySelector("button.add-btn").classList.add(item);
        })
}

function if_required(option_board_class, data_max, element) {
    //=========first check if button has all option classes, not then return them=============
    checkOptionClassExistence();
//if multiple then radio here cause checkbox is for multiple nd radio for datamax
    return (addBtn.classList.contains(option_board_class) &&
        (parseInt(getParentDataMax(element[0])) === 0 && !addBtn.hasAttribute("disabled")) || (parseInt(getParentDataMax(element[0])) !== 0 &&
            parseInt(getParentDataMax(element[0])) === getCheckboxCount(data_max, document.querySelectorAll('div.option-board[class^=option-][data-max]:not([data-max="0"]) input[type="checkbox"]:not([id^=inner-check])'))) &&
        element[0].type === "checkbox") || (addBtn.classList.contains(option_board_class) && (
        (getParentDataMax(element) === null && getCheckboxCount(data_max, document.querySelectorAll('div.option-board[class^=option-][data-max]:not([data-max="0"]) input[type="checkbox"]:not([id^=inner-check])')) !== 0) ||
        parseInt(getParentDataMax(element)) === getCheckboxCount(data_max, document.querySelectorAll('div.option-board[class^=option-][data-max]:not([data-max="0"]) input[type="checkbox"]:not([id^=inner-check])'))));
}

function printTotal(total){
    document.getElementById('item-add-value').textContent = "Add to bag : $" + parseFloat(total).toFixed(2);
}

function initiateInputsChecked(inputCheckElement1, inputCheckElement2){
    let boolRadioOrCheckbox = true;
    let inputsCheckList = [];
    debugger;
    // if the first input element has data-multiple, the unlocking depends on the first elemen parent data multiple attr.
    if(inputCheckElement1.length === 0 || parseBoolean(findClassAncestor(inputCheckElement2[0], "checkbox").getAttribute("data-multiple"))) {

        inputsCheckList.push(...inputCheckElement2);

        boolRadioOrCheckbox =false;
    }

    if(inputCheckElement1.length > 0){

        inputsCheckList.push(...inputCheckElement1);

    }

    if(boolRadioOrCheckbox === false) {

        let inputs = document.querySelectorAll('div.option-board[class^=option-][data-max]:not([data-max="0"]) input[id^=inner-]');
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].type === "radio") {
                inputsCheckList.push(inputs[i]);
            }
        }
    }

    for (let i = 0; i < inputsCheckList.length; i++) {
        inputsCheckList[i].addEventListener('change', function(event) {

            if (!event.target.checked) {
                let inputCheckElement = typeof event.target.parentElement.children[2] !== 'undefined'
                    ? event.target.parentElement.children[2].querySelectorAll("input") : [];
                Array.from(inputCheckElement).forEach((inputElement) => {
                    if (inputElement.checked)
                        inputElement.checked = false;
                });
            }

            inputCheckElement2.forEach((inputCheck) => {
                inputCheck.removeAttribute("disabled");
                inputCheck.onclick = function () {
                    debugger;

                    printTotal(inputCheckedTotal(document.querySelectorAll("input[type='radio']:checked"),
                        document.querySelectorAll("input[type='checkbox']:checked")));
                }
            });
            debugger;

            printTotal(inputCheckedTotal(document.querySelectorAll("input[type='radio']:checked"),
                document.querySelectorAll("input[type='checkbox']:checked")));

            let bool_outer_inputCheck_element = findClassStartsWithAncestor(inputsCheckList[i], "option-");
            let bool_inner_inputCheck_element = findClassStartsWithAncestor(inputsCheckList[i], "inner-option-");

            let inputElement_Max = inputsCheckList[i].parentElement.parentElement.parentElement.getAttribute('data-max');

            if((bool_outer_inputCheck_element || bool_inner_inputCheck_element) && inputsCheckList[i].id.startsWith("inner-")) {
                if (if_required(inputsCheckList[i].parentElement.parentElement.parentElement.className.split(/\s+/)[1],
                    inputElement_Max, inputsCheckList[i]) && document.querySelectorAll(`div.option-1 div.option-list  input[${boolRadioOrCheckbox ? "type='radio']:checked" : "type='checkbox']:checked"}`).length > 0)//if loophole on html, check would still work//set data-max in radio to zero("0") if there'll be requied no. of input to activate button and 1 since one radio click anyway
                    addBtn.removeAttribute("disabled");
                else
                    addBtn.setAttribute("disabled", "disabled");
            }
            //end radio&check if option require another before button is enabled
        })
    }
}
// =================End of initiateInputsChecked(inputCheckElement1, inputCheckElement2) {...}==============================


//======Begin perform all cart item click operation for edit and single product add button===========
 //=======trigger click===========
function triggerClick(target) {
    let events = ["click"];//"mousemove", "mouseover", "focus", "mousedown", "mouseup",
    let eventObject = new Event(events[0], {"bubbles": true, "cancelable": false});
    target.dispatchEvent(eventObject);
}

function triggerChange(target) {
    let events = ["input"];//"mousemove", "mouseover", "focus", "mousedown", "mouseup",
    let eventObject = new Event(events[0], {"bubbles": true, "cancelable": false});
    target.dispatchEvent(eventObject);
}

function initializeSingleProductAddBtn() {

    let singleProductBtn = document.getElementById("add-singleproduct-btn");
    let increaseSingleProductBtn = document.getElementById("singleProd-increase");

    singleProductBtn.addEventListener('click', function (event) {
        triggerClick(increaseSingleProductBtn);
        document.getElementById("singleProd-decrease").disabled = false;
debugger;
        singleCartItems = [];

        singleProcuctEdited = true;//allow the Edit template to be put in the cart.
        singleProcuctClicked = false;//prevent the normal add template from been put in the cart

        let cartParent = null;

        let modal = findClassAncestor(event.target, "p-modal");
        let formId = modal.getAttribute("data-formId");

        let cart_Item = null;

        let cartItemList = document.getElementsByClassName("cart-item");
        'use strict';//Create modal for single product here if any modal has existed just replace the values with single products vals
        Array.from(cartItemList).forEach((cartItem)=>{
            cartItem.querySelectorAll(".single-product").forEach((singleProduct)=>{
                //===only keep single cart item data that have the same parntt===
                if(findClassAncestor(singleProduct, "cart-item").querySelector(`div.single-product[data-formId='${formId}']`) && cartParent === null)
                    cartParent = findClassAncestor(singleProduct, "cart-item");

                if(singleProduct.hasAttribute("data-formId") && singleProduct.getAttribute("data-formId") === formId){

                    let modalParentEl =  findClassAncestor(event.target, "order-wrapper");
                    let singleProductQtty = modalParentEl.children[1].children[0].children[2];
                    singleProduct.children[0].textContent = singleProductQtty.value;
                    singleProduct.children[2].textContent = "$" + singleProductBtn.textContent.match(/[+-]?\d+(\.\d+)?/g).map(function(v) { return parseFloat(v); })[0].toString();

                    cart_Item = singleProduct;
                }

                //===only keep single cart item data that have the same parntt===
                if(cartParent !== null)
                    if(cartParent.isSameNode(findClassAncestor(singleProduct, "cart-item")))
                        singleCartItems.push(singleProduct);
            })
        });

        document.getElementById("total").textContent = "$" + getTotalPrice();

        cacheSaveCartItemData(modal, formId, cart_Item, true);
        // singleCartItems = [];
    });
}

function createEditHtmlForSingleProduct(formId, name, price, quantity) {
    price = price.match(/[+-]?\d+(\.\d+)?/g).map(function (v) {
        return parseFloat(v);
    })[0].toString();
    let html = `
                    <a href="javascript:void(0);" id="singleProdclose-modal" class="close">
                    </a>
                    <div class="order-wrapper">
                        <div class="image-wrapper">
                            <div class="mbr-figure" style="height: 250px;">
                                <img src="../images/Placeholder.png" alt="restaurant" title="product">
                                <!--food display title-->
                                <div class="img-caption">
                                    <p class="mbr-fonts-style align-left mbr-white display-5 mbr-figure ">
                                        ${name}
                                    </p>
                                    <h3 class="mbr-fonts-style align-left main-price mbr-white display-5 mbr-figure ">
                                        $${price}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        <!--<div class="mbr-overlay"></div>-->
                        <div class="inner-wrapper">
                            
                            <div class="quantity-wrapper">
                                <p>Quantity</p>
                                <button id="singleProd-decrease" class="decrease" onclick="changesingleProdValue('decrease', '$${price}')" style="color: blue;"></button>
                                <input id="singleProd-quantity" type="number" value="${quantity}" min="1" max="1000" pattern="\\d*" class="quantity-input changed">
                                <button id="singleProd-increase" class="increase" onclick="changesingleProdValue('increase', '$${price}')"></button>
                            </div>
                        </div>
                        
                        <footer class="inner-footer">
                            <div class="add-button-wrapper">
                                <button id="add-singleproduct-btn" class="add-btn" data-item="1">
                                    <span id="add-singleproduct-value" class="s-btn">Add to bag : $${price}</span>
                                </button>
                            </div>
                        </footer>
                    </div>
                        `;
    //<div class=" modal-show">
    let modals = document.getElementsByClassName("p-modal");
    if (modals.length === 0) {
        const modal = document.createElement("div");
        modal.classList.add("p-modal");
        modal.classList.add("modal-show");
        modal.setAttribute('data-formId', formId);
        //id="close-modal"
        modal.innerHTML = html;

        document.body.appendChild(modal);
    } else
        for (let i = 0; i < modals.length; i++) {

            if (modals[i].hasAttribute("data-formId") && modals[i].children.length > 0 && modals[i].children[0].getAttribute('id') === 'singleProdclose-modal') {
                modals[i].innerHTML = html;
                modals[i].classList.add("modal-show");
                modals[i].setAttribute("data-formId", formId);
            }
            if (modals[i].hasAttribute("data-formId") && modals.length === 1) {
                const modal = document.createElement("div");
                modal.classList.add("p-modal");
                modal.classList.add("modal-show");
                modal.setAttribute("data-formId", formId);

                document.body.appendChild(modal);
                modal.innerHTML = html;
            }
        }
}

function activateCloseModalForm() {
    debugger;
    let modalClosingIds = document.querySelectorAll("#close-modal, #singleProdclose-modal");

    modalClosingIds.forEach((id) => {
        id.addEventListener('click', (event) => {
            let pModal = findClassAncestor(event.target, 'p-modal');

            if(pModal.firstElementChild.id === "singleProdclose-modal")
                pModal.remove();
            else
                pModal.classList.remove("modal-show");
        });
    });
}

function setModalInputs(modalInputs, cartMenuData) {
    let clickedModalInputs = cartMenuData.childNodes[0].querySelectorAll("input");//[i].replaceChild(input);
    modalInputs.forEach(function (modalInput, indx) {
        if (modalInput.id === cartMenuData.firstChild.getAttribute("data-formId")) {
            modalInput.inputs.forEach(function (inputs, index) {
                clickedModalInputs.forEach(function (input, index) {
                    if (inputs.type === input.type && (inputs.type === "checkbox" || inputs.type === "radio") && index === inputs.position && inputs.id === input.id)
                        cartMenuData.childNodes[0].querySelectorAll("input")[index].checked = inputs.status;
                    if (inputs.type === input.type && inputs.type === "number" && index === inputs.position && inputs.id === input.id)
                        cartMenuData.childNodes[0].querySelectorAll("input")[index].value = inputs.value;
                });
            });
        }
    });
    return cartMenuData;
}

function loadShoppingCartMenu(element) {
    debugger;
    if(localStorage.getItem('cart-modal')) {

        const cartMenu = JSON.parse(localStorage.getItem('cart-modal'));
        let modals = document.getElementsByClassName("p-modal");

        cartMenu.forEach((cartMenuData) => {
            cartMenuData = setModalInputs(JSON.parse(localStorage.getItem('cart-modal-input')), createNodeElement(cartMenuData));

            if(cartMenuData.firstChild.getAttribute("data-formId") === element.getAttribute('data-formId').trim()) {
                for (let i = 0; i < modals.length; i++) {
                    if (modals[i].hasAttribute("data-formId") && modals[i].children.length > 0 && modals[i].children[0].getAttribute('id') === 'close-modal') {
                        document.body.removeChild(modals[i]);
                    }
                }
                cartMenuData.firstChild.classList.add("cached");
                document.body.appendChild(cartMenuData);
            }
        });
    }
}

//===============based of item selected, close single product modal(if edit main order is clicked) else close main modal(if single is clicked)=========================
function doEdit(clickedElement) {
    for (let i = 0; i < clickedElement.length; i++) {
        clickedElement[i].addEventListener('click', function() {debugger;
            let formId = clickedElement[i].getAttribute("data-formId").trim();
            if ((clickedElement[i].classList.contains("cart-product") ||
                clickedElement[i].classList.contains("cart-description"))) {
                if(!findClassAncestor(clickedElement[i], "cached") && document.querySelectorAll('.p-modal').length > 0)
                    document.querySelectorAll('.p-modal').forEach((element)=> {
                        if (element.hasAttribute('data-formId') && element.getAttribute('data-formId').trim() === formId) {
                            if (document.getElementById("close-modal"))
                                triggerClick(document.getElementById("close-modal"));
                            if (document.getElementById("singleProdclose-modal"))
                                triggerClick(document.getElementById("singleProdclose-modal"));

                            element.classList.add('modal-show');
                        } else
                            loadShoppingCartMenu(clickedElement[i]);
                    });
                else
                    loadShoppingCartMenu(clickedElement[i]);

                activeMenuElements();

                response = true;//incase it became false make possible to activeMenuElements();
            }else {
                singleProductPrice = 0; //reset the price for other singleproduct

                if(document.getElementById("close-modal"))
                    triggerClick(document.getElementById("close-modal"));
                if(document.getElementById("singleProdclose-modal"))
                    triggerClick(document.getElementById("singleProdclose-modal"));

                createEditHtmlForSingleProduct(formId, clickedElement[i].children[1].textContent, clickedElement[i].getAttribute("data-priceVal"),
                    clickedElement[i].children[0].textContent);
                initializeSingleProductAddBtn();
                activateCloseModalForm();
            }
        });
    }
}
//======Begin perform all cart item click operation for edit and single product add button===================

//==============Begin initialization of AddToCart Button and all its functions============================

function getTotalItem() {//total shown in icon on shop cart
    const total = [];
    const items = document.querySelectorAll(".quantity");
    items.forEach(function (item) {
        total.push(parseInt(item.textContent));
    });

    return total.reduce(function (total, item) {
        total += item;
        return total;
    }, 0);
}

function getTotalPrice() {
    const total = [];
    const items = document.querySelectorAll(".subtotal");
    const singleitems = document.querySelectorAll(".singleprice");

    singleitems.forEach(function (item) {
        total.push(item.textContent.match(/[+-]?\d+(\.\d+)?/g).map(function (v) {
            return parseFloat(v);
        })[0]);
    });
    items.forEach(function (item) {
        total.push(item.textContent.match(/[+-]?\d+(\.\d+)?/g).map(function (v) {
            return parseFloat(v);
        })[0]);
    });

    const totalPrice = total.reduce(function (total, item) {
        total += item;
        return total;
    }, 0);
    return totalPrice.toFixed(2);
}

//======START delete saved/cahed menu item modal/cart item============================================
function deleteCartItem($this, id, status, formId) {
    debugger;
    event.stopPropagation();

    let parentEl =  $this.parentElement.classList.contains("cart-item") ? "" : $this.parentElement.parentElement;

    $this.parentElement.remove();

    let cartItems = [], cartModal = [], savedModalInputs = [];

    if(localStorage.getItem('cart'))
        cartItems = JSON.parse(localStorage.getItem('cart'));

    if(localStorage.getItem('cart-modal'))
        cartModal = JSON.parse(localStorage.getItem('cart-modal'));

    if(localStorage.getItem('cart-modal-input'))
        savedModalInputs = JSON.parse(localStorage.getItem('cart-modal-input'));

    cartItems.forEach((cartData, outerindex)=>{
        let cart = createNodeElement(cartData).firstChild.querySelectorAll('[data-formId][data-formid]');
        cart.forEach((cartelement, index)=> {
            if (cartelement.getAttribute("data-formid") === formId) {
                cartItems.splice(outerindex, 1);

                if(parentEl !== "")
                    cartItems.push(parentEl.outerHTML);
            }
        });
    });

    cartModal.forEach((cartModalData, index)=>{
        if (createNodeElement(cartModalData).firstChild.getAttribute("data-formid") === formId && status === "full-product") {
            cartModal.splice(index, 1);
        }
    });

    savedModalInputs.forEach((modalInput, index)=> {
        modalInput.inputs.forEach(function (inputs, index) {
            if ((inputs.type === "checkbox") && status === "single-product" && inputs.id === id)
                inputs.status = false;
        });

        if (modalInput.id === formId && status === "full-product")
            savedModalInputs.splice(index, 1);
    });

    localStorage.setItem('cart-modal-input', JSON.stringify(savedModalInputs));

    localStorage.setItem('cart', JSON.stringify(cartItems));

    localStorage.setItem('cart-modal', JSON.stringify(cartModal));

    if(document.querySelectorAll("div.p-modal #close-modal").length !== 0)
        triggerClick(document.querySelectorAll("div.p-modal #close-modal")[0]);

    document.getElementById("total-purchase").textContent = getTotalItem();
}
//======END delete saved/cahed menu item modal/cart item============================================

function mainProductTemplate(image, name, price, data_formId, quantity, arraySaleNames) {
    cart_item = document.createElement("li");
    cart_item.classList.add("cart-item");
    cart_item.setAttribute("data-formId", data_formId);

    cart_item.innerHTML = `
             <span class="delete" onclick= "deleteCartItem(this, 'null', 'full-product', '${data_formId}');">
                    <div class="icon">
                        <div class="lid"></div>
                            <div class="lidcap"></div>
                        <div class="bin"></div>
                    </div>
             </span>
                    <div data-formId="${data_formId}" class="cart-product quantity" style="background-image: url('${image}')">
                    ${quantity}
                    </div>
                    <div data-formId="${data_formId}" class="cart-description">
                    <h3>${name}</h3>
                    <span>includes: ${arraySaleNames.join(", ")}</span>
                <span class="subtotal">$${price}</span>
                    </div><!-- /.cart-item -->`;

    //===add any existing single product to cart html========
    debugger;
    singleCartItems.forEach((singleCartItem)=>{
        cart_item.innerHTML += singleCartItem.outerHTML;
    });

    if(itemSales.length !== 0){
        for (let i=0; i<itemSales.length; i++) {
            if(!itemSales[i].boolSingle) {
                // get index of object
                let removeIndex = itemSales.map(function(item) { return item.id; }).indexOf(data_formId);
                // remove object
                itemSales.splice(removeIndex, 1);

                i--;//decrement loop once the array is reduced in length
            }
        }
    }

    itemSales.push({
        salesId : data_formId,
        quantity : parseInt(quantity),
        boolSingle : false,
        arraySaleNames : arraySaleNames,
        arraySalePrices : arraySalePrices,
        sale: []
    });

    return cart_item;
}

function finalCheckOnAddtoCart(inputCheckElement1, inputCheckElement2){
    let boolRadioOrCheckbox = true;
    let inputsCheckList = [];
    debugger;
    // if the first input element has data-multiple, the unlocking depends on the first elemen parent data multiple attr.
    if(inputCheckElement1.length === 0 || parseBoolean(findClassAncestor(inputCheckElement2[0], "checkbox").getAttribute("data-multiple"))) {

        inputsCheckList.push(...inputCheckElement2);

        boolRadioOrCheckbox =false;
    }

    if(inputCheckElement1.length > 0){

        inputsCheckList.push(...inputCheckElement1);

    }

    if(boolRadioOrCheckbox === false) {

        let inputs = document.querySelectorAll('div.option-board[class^=option-][data-max]:not([data-max="0"]) input[id^=inner-]');
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].type === "radio") {
                inputsCheckList.push(inputs[i]);
            }
        }
    }

    for (let i = 0; i < inputsCheckList.length; i++) {
        let bool_outer_inputCheck_element = findClassStartsWithAncestor(inputsCheckList[i], "option-");
        let bool_inner_inputCheck_element = findClassStartsWithAncestor(inputsCheckList[i], "inner-option-");

        let inputElement_Max = inputsCheckList[i].parentElement.parentElement.parentElement.getAttribute('data-max');

        if((bool_outer_inputCheck_element || bool_inner_inputCheck_element) && inputsCheckList[i].id.startsWith("inner-")) {
            if (if_required(inputsCheckList[i].parentElement.parentElement.parentElement.className.split(/\s+/)[1],
                inputElement_Max, inputsCheckList[i]) && document.querySelectorAll(`div.option-1 div.option-list  input[${boolRadioOrCheckbox ? "type='radio']:checked" : "type='checkbox']:checked"}`).length > 0)//if loophole on html, check would still work//set data-max in radio to zero("0") if there'll be requied no. of input to activate button and 1 since one radio click anyway
                addBtn.removeAttribute("disabled");
            else
                addBtn.setAttribute("disabled", "disabled");
        }
        //end radio&check if option require another before button is enabled
    }
}

function createNodeElement(element){
    return document.createRange().createContextualFragment(element);
}

function activateCartDataBtn() {
    let cartProduct1 = document.getElementsByClassName("cart-product");
    let cartProduct2 = document.getElementsByClassName("cart-description");
    let singleproduct = document.getElementsByClassName("single-product");
    doEdit(cartProduct1);
    doEdit(cartProduct2);
    doEdit(singleproduct);
}

function createmodalInputsJSON(modalInputs, modalInputsJSON) {
    modalInputs.forEach(function (input, index) {
        switch (input.type) {
            case "checkbox":
                modalInputsJSON.inputs.push({"type": "checkbox", "id":input.id, "status":input.checked, "position": index});
                break;
            case 'radio':
                modalInputsJSON.inputs.push({"type": "radio", "id":input.id, "status":input.checked, "position": index});
                break;
            case 'number':
                modalInputsJSON.inputs.push({"type": "number", "id":input.id, "value":input.value, "position": index});
                break;
        }
    });
    return modalInputsJSON;
}

function cacheSaveCartItemData(getModal, data_formId, cart_item, boolSingle) {
    let counterDel = 0;
    debugger;
    let cartSales = [], cartItems = [], cartModal = [], cartModalInputStatus = [];

    if(localStorage.getItem('sales'))
        cartSales = JSON.parse(localStorage.getItem('sales'));

    if(localStorage.getItem('cart'))
        cartItems = JSON.parse(localStorage.getItem('cart'));

    if(localStorage.getItem('cart-modal'))
        cartModal = JSON.parse(localStorage.getItem('cart-modal'));

    if(localStorage.getItem('cart-modal-input'))
        cartModalInputStatus = JSON.parse(localStorage.getItem('cart-modal-input'));

    for (let i=0; i<cartSales.length; i++) {
        let cartEls = cart_item.querySelectorAll(`div.single-product[data-formid], div.cart-description[data-formid]`);
        cartEls.forEach((els, jIndex) => {
            if (typeof cartSales[i] !== "undefined")
                if (cartSales[i].salesId === els.getAttribute("data-formId")) {
                    cartSales.splice(i, 1);
                    i--;
                }
        });
    }

    // counterDel = 0;
    cartItems.forEach((cartData, index)=>{
        if(boolSingle === true) {
            if (createNodeElement(cartData).firstChild.getAttribute("data-formId") === cart_item.parentElement.getAttribute("data-formId")) {
                cartItems.splice(index - counterDel, 1);
                counterDel++;
            }
        } else {
            if (createNodeElement(cartData).firstChild.getAttribute("data-formId") === cart_item.getAttribute("data-formId")) {
                cartItems.splice(index - counterDel, 1);
                counterDel++;
            }
        }
    });

    counterDel = 0;
    cartModal.forEach((cartModalData, index)=>{
        if(createNodeElement(cartModalData).firstChild.getAttribute("data-formId") === cart_item.getAttribute("data-formId")){
            cartModal.splice(index - counterDel, 1);
            counterDel++;
        }
    });

    counterDel = 0;
    cartModalInputStatus.forEach((cartModalStatusData, index)=>{
        if(cartModalStatusData.id === cart_item.getAttribute("data-formId")){
            cartModalInputStatus.splice(index - counterDel, 1);
            counterDel++;
        }
    });


    let modalInputs = document.querySelectorAll(`div.p-modal[data-formId='${data_formId}'] input`);
    let modalInputsJSON = {};
    modalInputsJSON.id = data_formId;
    modalInputsJSON.inputs = [];

    modalInputsJSON = createmodalInputsJSON(modalInputs, modalInputsJSON);

    boolSingle === true ?
        cart_item = document.querySelector(`.cart-items li[data-formId='${cart_item.parentElement.getAttribute("data-formId")}']`) :
            cart_item

    cartModalInputStatus.push(modalInputsJSON);
    localStorage.setItem('cart-modal-input', JSON.stringify(cartModalInputStatus));

    cartItems.push(cart_item.outerHTML);
    localStorage.setItem('cart', JSON.stringify(cartItems));


    document.getElementsByClassName("navbar-res")[0].style.top = "-50px";
    cartModal.push(getModal.outerHTML);
    localStorage.setItem('cart-modal', JSON.stringify(cartModal));

    for (let i=0; i<itemSales.length; i++) {
        itemSales[i].sale = [];

        itemSales[i].arraySaleNames.forEach((name, index) => {
            itemSales[i].arraySalePrices.forEach((price, jIndex) => {
                if (index === jIndex) {
                    if(itemSales[i].boolSingle) {
                        if(singleprodqtyInput)
                            if(findClassAncestor(singleprodqtyInput, "p-modal").getAttribute("data-formid") === itemSales[i].salesId) itemSales[i].quantity = parseInt(singleprodqtyInput.value);
                    }else  {
                        itemSales[i].quantity = parseInt(qtyInput.value);
                    }

                    itemSales[i].sale.push({ "productName": name, "productPrice": price });
                }
            });
        });
    }

    cartSales = itemSales;
    localStorage.setItem('sales', JSON.stringify(cartSales));
}

function initiateAddToCartButton(cartBtn){
    cartBtn.forEach(function (btn) {
        btn.addEventListener('click', function (event) {debugger;
            let radios = document.querySelectorAll("input[type='radio']"); // or document.querySelectorAll("li");
            let checkboxs = document.querySelectorAll("input[type='checkbox']"); // or document.querySelectorAll("li");

            finalCheckOnAddtoCart(radios, checkboxs);

            if (event.target.parentElement.classList.contains("add-btn") && !document.getElementById("add-btn").getAttribute("disabled")) {//event.target.parentElement.classList.contains("add-button-wrapper") ||
                let fullPath =event.target.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].src;
                let positn = fullPath.indexOf("images") + 6;

                let partialPath = fullPath.slice(positn);
                let name = event.target.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[1].children[0].textContent.trim();
                let initialCost = event.target.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[1].children[1].textContent.trim();

                let price = event.target.textContent.match(/[+-]?\d+(\.\d+)?/g).map(function(v) { return parseFloat(v); })[0].toString();

                let quantity =
                    event.target.parentElement.parentElement.parentElement.parentElement.children[1].children[1].children[2].value;

                // ----get the checked data option to set on the cart list-------------------
                // let data_option = document.querySelector('input[name^="radio"]:checked').getAttribute('data-option');

                // ----get the modal data formId to set on the cart list description or image-------------------
                let getModal = findClassAncestor(event.target, 'p-modal');
                let data_formId = getModal.getAttribute('data-formId');

                const item = {};
                item.image = `../images${partialPath}`;
                item.name = name;
                item.price = price;
                item.data_formId = data_formId;
                // item.data_option = data_option;

                const cart_item = mainProductTemplate(item.image, item.name, item.price, item.data_formId, quantity, arraySaleNames);

                //===put the menu initial name and price as first
                arraySaleNames.unshift(name);
                arraySalePrices.unshift(initialCost);

                const cart = document.getElementById("cart");

                const checkout = document.querySelector(".checkout-total");
                // ---------------check if cart item already exist-----------------
                let cartItemData = document.querySelector(`.cart-items li[data-formId='${data_formId}']`);
                if (cartItemData !== null && cartItemData.getAttribute("data-formId") === cart_item.getAttribute("data-formId"))
                    cartItemData.parentNode.replaceChild(cart_item, cartItemData);

                if (cartItemData === null){
                    cart.insertBefore(cart_item, checkout);
                    //remove changed class from qtty input
                    RemoveClass(qtyInput, "changed");RemoveClass(qtyInput, "touched");
                }else {debugger;
                    if ((!qtyInput.classList.contains("changed") || qtyInput.classList.contains("changed")) && !qtyInput.classList.contains("touched")) { //continuos button click just adds 1 total item
                        qtyInput.value = parseInt(qtyInput.value) + 1;
                        document.getElementById("decrease").disabled = false;

                        cartItemData.children[2].children[1].innerText = "includes: " + arraySaleNames.join(", ");

                        singleProcuctEdited = true;
                        singleProcuctClicked = false;

                        triggerChange(qtyInput);
                    }
                    if (qtyInput.classList.contains("touched")) {

                        document.querySelectorAll(".quantity")[0].innerText = '' + parseInt(quantity)+1;
                        cartItemData.children[2].children[1].innerText = "includes: " + arraySaleNames.join(", ");
                        //remove changed class from qtty input
                        RemoveClass(qtyInput, "changed");RemoveClass(qtyInput, "touched");
                    }
                    cartItemData.children[2].children[2].innerText = "$" + document.getElementById('item-add-value').textContent.match(/[+-]?\d+(\.\d+)?/g).map(function(v) { return parseFloat(v); })[0].toString();
                }

                cacheSaveCartItemData(getModal, data_formId, cart_item, false);
     // ---------------check if cart item already exist-----------------

                document.getElementById("total").textContent = "$" + getTotalPrice();
                document.getElementById("total-purchase").textContent = getTotalItem();

               activateCartDataBtn();
            }
        });

    });
}
//==============End intialization of AddToCart Button and all its functions============================

//============Begin of creating the modal wrapper befor passing in the HTML fom database of predetermined(as in case of test)=======

  // ==============increase or decrease input value=================== changeValue
function changesingleProdValue(val, price){
    singleprodqtyInput = document.getElementById('singleProd-quantity');//global element
    let value = parseInt(singleprodqtyInput.value, 10);
    value = isNaN(value) ? 0 : value;
    if(val === "decrease")
        value--;
    else
        value++;

    singleprodqtyInput.value = value;
    document.getElementById('add-singleproduct-value').textContent = "Add to bag : $" + price.match(/[+-]?\d+(\.\d+)?/g).
    map(function(v)  {
        return parseFloat(v)*value;
    })[0].toFixed(2);
}

function changeValue(val){
    let value = parseInt(qtyInput.value, 10);
    value = isNaN(value) ? 0 : value;
    if(val === "decrease")
        value--;
    else
        value++;

    qtyInput.value = value;
    document.getElementById('item-add-value').textContent = "Add to bag : $" + inputCheckedTotal(document.querySelectorAll("input[type='radio']:checked"),
        document.querySelectorAll("input[type='checkbox']:checked")).toFixed(2);



    if(value > 1)//add require class to the option list to let it know b4 button is active it requires another option from check button option
    {
        document.getElementById("decrease").disabled = false;
        document.getElementById("decrease").style.color = "blue";
    }

    if(value <= 1)
    {
        document.getElementById("decrease").disabled = true;
        document.getElementById("decrease").style.color = "rgba(0, 0, 0, 0.16)";
    }
}
  // ==============increase or decrease input value=================== changeValue

function createModalWrapper($this, html, id) {
    let imgSrc = $this.children[0].children[0].children[0].children[0].children[0].src.trim();
    let productName = $this.children[0].children[0].children[1].children[0].children[0].children[0].textContent.trim();
    let productCost = $this.children[0].children[0].children[1].children[0].children[0].children[1].textContent.trim();
    let productDesc = $this.children[0].children[0].children[1].children[0].children[1].children[0].textContent.trim();

    const navWrapper = document.createElement("div");
    navWrapper.classList.add("navbar-res");
    const navDescr = document.createElement("p");
    navDescr.classList.add("navDescr");
    navDescr.textContent = productName;
    navWrapper.appendChild(navDescr);

    const orderWrapper = document.createElement("div");
    orderWrapper.classList.add("order-wrapper");
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    imageWrapper.innerHTML = `
            <div class="mbr-figure">
                <img src="${imgSrc}" alt="Mobirise" title="product">
                <!--<div>food display title</div>-->
                <div class="img-caption">
                    <p class="mbr-fonts-style align-left mbr-white display-5 mbr-figure ">
                        ${productName}
                    </p>
                    <h3 class="mbr-fonts-style align-left main-price mbr-white display-5 mbr-figure ">
                        ${productCost}
                    </h3>
                </div>
            </div>
                            `;
    orderWrapper.appendChild(imageWrapper);
    const innerWrapper = document.createElement("div");
    innerWrapper.classList.add("inner-wrapper");
    innerWrapper.innerHTML = `
            <p>${productDesc}</p>
            <div class="quantity-wrapper">
                <p>Quantity</p>
                <button id="decrease" class="decrease" disabled="disabled" onclick="changeValue('decrease')"></button>
                <input id="quantity" type="number" value="1" min="1" max="1000" pattern="\\d*" class="quantity-input">
                <button id="increase" class="increase" onclick="changeValue('increase')"></button>
            </div>
                            `;
    orderWrapper.appendChild(innerWrapper);
    const optionWrapper = document.createElement("div");
    optionWrapper.classList.add("option-wrapper");
    optionWrapper.innerHTML = html;

    orderWrapper.appendChild(optionWrapper);
    const innerFooter = document.createElement("footer");
    innerFooter.classList.add("inner-footer");

    function removeDuplicates(data) {
        return data.filter((value, index) => data.indexOf(value) === index)
    }
    listOfOptionClasses = removeDuplicates(listOfOptionClasses);

    let optionClasses = "";

    test === 'test' ? optionClasses = "add-btn option-1 option-2 option-3 inner-option-1 inner-option-2" :
        listOfOptionClasses.forEach((option) => {
            optionClasses += (option + " ");
        });
debugger;
    innerFooter.innerHTML = `
            <div class="add-button-wrapper">
                <button id="add-btn" class="add-btn ${optionClasses.trim()}" disabled="" data-item="1"><!--option-1 option-2 option-3 inner-option-1 inner-option-2"-->
                    <span id="item-add-value" class="s-btn">Add to bag : $0.00</span>
                </button>
            </div>

                            `;
    orderWrapper.appendChild(innerFooter);
    orderWrapper.appendChild(navWrapper);

    let modals = document.getElementsByClassName("p-modal");
    //

    if (modals.length === 0) {
        const modal = document.createElement("div");
        modal.classList.add("p-modal");
        modal.classList.add("modal-show");
        modal.setAttribute('data-formId', id);
        //id="close-modal"
        modal.innerHTML = `<a href="javascript:void(0);" id="close-modal" class="close"></a>`;

        modal.appendChild(orderWrapper);
        document.body.appendChild(modal);
    } else {
        for (let i=0; i<modals.length; i++) {
            if (modals[i].hasAttribute("data-formId") && modals[i].children.length > 0 && modals[i].children[0].getAttribute('id') === 'close-modal') {
                modals[i].innerHTML = `<a href="javascript:void(0);" id="close-modal" class="close"></a>`;
                modals[i].classList.add("modal-show");
                modals[i].setAttribute("data-formId", id);
                modals[i].appendChild(orderWrapper);
            }
        }
    }
}
//============End of creating the modal wrapper befor passing in the HTML fom database of predetermined(as in case of test)=======

function activeMenuElements(){
    // createModalWrapper(parentItem, orderModalHtml, id);
    qtyInput = document.getElementById('quantity');
    addBtn = document.getElementById("add-btn");
    cartBtn = document.querySelectorAll(".add-btn");

    performInitialCalc();


    let radios = document.querySelectorAll("input[type='radio']"); // or document.querySelectorAll("li");
    let checkboxs = document.querySelectorAll("input[type='checkbox']"); // or document.querySelectorAll("li");

    initiateInputsChecked(radios, checkboxs);

    initiateAddToCartButton(cartBtn);

    activateCloseModalForm();

    // When the user scrolls down 20px from the top of the document, slide down the navbar
    document.getElementsByClassName("order-wrapper")[0].onscroll = function() {scrollFunction()};
}
//=============End of creates the modal wrapper where createModalData(response) inserts its innerHTML=====================

function doModalFunctions(orderModalHtml, parentItem, id, test) {
 //=====the test(createModalHtml()) would be removed later, its just as it sounds the oiginal one creted to test against the other ones if accurate=====//
    test === 'test' ? orderModalHtml = createModalHtml() : getMenuData(id, function (response) {//===getmenudata gets the data saved and passes to createModalData(response)
        orderModalHtml = createModalData(response);
        createModalWrapper(parentItem, orderModalHtml, id);//===creates the modal wrapper where createModalData(response) inserts its innerHTML
        activeMenuElements();//====activate or initialise all menu-modal controls

   //==========================remove any extra font some stupid app adds to it./==========================
        var text =  document.getElementById("add-btn").innerHTML;
        text.replace(/<span([^>]*)><\/span><font[^>]*>(.+?)<\/font>/gi,'<span$1>$2</span>')
        document.getElementById("add-btn").innerHTML = text;
        console.log(text);
    });
    if (test !== null) {
        createModalWrapper(parentItem, orderModalHtml, id);//===creates the modal wrapper where createModalData(response) inserts its innerHTML
        activeMenuElements();//====activate or initialise all menu-modal controls
    }
}

//==================create modal on product card/div click============================
function doCreateModal(parentItem, pModal, id, test) {
    let modals = [], orderModalHtml = null;
//=========create modal if it dont exist===============
    if (pModal.length === 0) {
   //======cretae modal data or test data example=============
        doModalFunctions(orderModalHtml, parentItem, id, test);
    } else {
  //=======else if modals exist(on product card.div click) check if we don't have to recreate the same one(avoid errors and time waste)
  //============else create a new modal
        for (let i = 0; i < pModal.length; i++) {
            modals.push({"id": pModal[i].getAttribute("data-formid")});
            if (parentItem.getAttribute("data-id") === pModal[i].getAttribute("data-formid"))
                pModal[i].classList.add('modal-show');
        }
        if (!modals.find(item => item.id === parentItem.getAttribute("data-id"))) {
      //======cretae modal data or test data example=============
            doModalFunctions(orderModalHtml, parentItem, id, test);
        }
    }
}

// Show modal
(function(){
    // let id = guid(15);
    let id = "1YPKTW5EbqX0tcn";
    let menuCardTarget = null;

    document.getElementById('test').setAttribute('data-id', id);
    // toggles.forEach((toggle)=>{
        document.addEventListener('click', (event)=> {
            let pModal = document.querySelectorAll('.p-modal');
            test = null;
            debugger;
            let parentItem = findClassAncestor(event.target, 'toggle');
 //==========================if product card/div is clicked=============================
            if (findClassAncestor(event.target, 'toggle').classList.contains('toggle') && !document.querySelector(`.cart-items li[data-formId='${parentItem.getAttribute('data-id')}']`)) {

                //===only keep single cart item data that have the same parntt===
                if(menuCardTarget !== null)
                    if(!findClassAncestor(event.target, 'toggle').isSameNode(menuCardTarget)){
                    singleProcuctEdited = false;//prevent the edit template from been put in the cart.
                    singleProcuctClicked = true;//allow the add template to be put in the cart.

                    singleCartItems = [];

                    if(itemSales.length !== 0) {
                        for (let i=0; i<itemSales.length; i++) {
                            if (itemSales[i].boolSingle) {
                                // get index of object
                                let removeIndex = itemSales.map(function (item) {return item.boolSingle;}).indexOf(true);
                                // remove object
                                itemSales.splice(removeIndex, 1);

                                i--;//decrement loop once the array is reduced in length
                            }
                        }
                    }
                }

                menuCardTarget = findClassAncestor(event.target, 'toggle');
                //===only keep single cart item data that have the same parntt===

                if (parentItem.getAttribute('data-id').length === 15)
                //====for test=============
                    test = 'test';

                id = parentItem.getAttribute('data-id');
                doCreateModal(parentItem, pModal, id, test);

                parentItem.classList.toggle('toggled');

                let item = document.querySelector('.toggled');
                item.classList.remove("toggled");
            }
            if(document.querySelector(`.cart-items li[data-formId='${parentItem.getAttribute('data-id')}']`)){
                let cart_list_item = document.querySelector(`.cart-product[data-formId='${parentItem.getAttribute('data-id')}']`);//cart-product quantity
                triggerClick(cart_list_item);
            }

        });

    document.addEventListener("keyup", function(e) {
        debugger;
        if(e.key === "Escape"){
            let modal = document.querySelectorAll(".p-modal");
            modal.forEach((target) => {
                target.classList.remove("modal-show");
            });

            if(document.querySelector('.toggled'))
                document.querySelector('.toggled').classList.remove("toggled");
        }
    });

    let $drawerRight = document.querySelector('.cart-drawer-right');
    let $cart_list = document.querySelectorAll('.cart-btn, .close-icon');
    $cart_list.forEach((el) => {
        el.addEventListener('click', (event) => {
            debugger;
            (event.target).classList.toggle('active');
            document.getElementsByClassName('cart-drawer-push')[0].classList.toggle('cart-drawer-pushtoleft');
            $drawerRight.classList.toggle('cart-drawer-open');
        });
    });
})();

window.parseBoolean = function(string) {
    let bool;
    if(string !== null)
        bool = (function() {
            switch (false) {
                case string.toLowerCase() !== 'true':
                    return true;
                case string.toLowerCase() !== 'false':
                    return false;
            }
        })();
    else
        return bool = false;
    if (typeof bool === "boolean") {
        return bool;
    }
    return void 0;
};

function RemoveClass(elem, newClass) {
    elem.className = elem.className.replace(new RegExp('(\\s|^)'+newClass+'(\\s|$)'), " ").trim();
}

function loadShoppingCart() {
    if (!localStorage.getItem('cart')) {
        return;
    }
    const cartItems = JSON.parse(localStorage.getItem('cart'));
    const cart = document.getElementById("cart");
    const checkout = document.querySelector(".checkout-total");
    cartItems.forEach((cartData) => {
        cartData = createNodeElement(cartData);
        cartData.firstChild.classList.add("cached");
        cart.insertBefore(cartData, checkout);
    });
    document.getElementById("total").textContent = "$" + getTotalPrice();
    document.getElementById("total-purchase").textContent = getTotalItem();
}

(function () {
    //===========Load cart with saved purcase data=======================
    loadShoppingCart();
    activateCartDataBtn();
    //=============================Listen to Quantity input changes==================

    document.addEventListener('focus', function(e) {
        if(!e.target.classList.contains("touched") && (e.target && e.target.id === 'quantity'))
            e.target.className += " touched";
    });

    document.addEventListener('focusout', function(e) {
        // RemoveClass(this, "touched");
    });

    document.addEventListener("change", function(e) {
        if(!e.target.classList.contains("changed") && (e.target && e.target.id === 'quantity'))
            e.target.className += " changed";
    });

    document.addEventListener("input", function(e) {debugger;
        if(!e.target.classList.contains("changed") && (e.target && e.target.id === 'quantity'))
            e.target.className += " changed";

        // ----get the modal data formId to set on the cart list description or image-------------------
        let getModal = findClassAncestor(event.target, 'p-modal');
        let data_formId = getModal.getAttribute('data-formId');
        // ---------------check if cart item already exist-----------------
        let cartItemData = document.querySelector(`.cart-items li[data-formId='${data_formId}']`);
        if (cartItemData !== null) {
            cartItemData.children[1].textContent = parseInt(qtyInput.value === "" ? "1" : qtyInput.value).toString();
        }

        if (cartItemData === null && document.querySelector(`.cart-items .single-product[data-formId='${data_formId}']`) !== null) {
            cartItemData = document.querySelector(`.cart-items .single-product[data-formId='${data_formId}']`);

            if(singleProductPrice === 0)// cache each single product price , effective during inpit value change
                singleProductPrice = cartItemData.children[2].textContent;

            let singleProductQtty =  parseInt(document.getElementById('singleProd-quantity').value === "" ? "1" : document.getElementById('singleProd-quantity').value);
            cartItemData.children[0].textContent = singleProductQtty.toString();
            document.getElementById('add-singleproduct-value').textContent = "Add to bag : $" + singleProductPrice.match(/[+-]?\d+(\.\d+)?/g).
            map(function(v)  {
                return parseFloat(v)*singleProductQtty;
            })[0].toFixed(2);
        }

        printTotal(inputCheckedTotal(document.querySelectorAll("input[type='radio']:checked"),
            document.querySelectorAll("input[type='checkbox']:checked")));

        if (cartItemData !== null && cartItemData.isSameNode(document.querySelector(`.cart-items .single-product[data-formId='${data_formId}']`))) {
            cartItemData.children[2].textContent = "$" +
                document.getElementById('add-singleproduct-value').textContent.match(/[+-]?\d+(\.\d+)?/g).map(function(v)
                { return parseFloat(v); })[0].toString();

            cartItemData = null;
        }

        if (cartItemData !== null && cartItemData.isSameNode(document.querySelector(`.cart-items li[data-formId='${data_formId}']`))) {
            cartItemData.children[2].children[2].textContent = "$" +
                document.getElementById('item-add-value').textContent.match(/[+-]?\d+(\.\d+)?/g).map(function(v)
                { return parseFloat(v); })[0].toString();
        }

        document.getElementById("total").textContent = "$" + getTotalPrice();
        document.getElementById("total-purchase").textContent = getTotalItem();
    });
})();