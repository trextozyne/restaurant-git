

var totalInputItems = null;
var preventContinous = true;
let items = 'Items here: ';
let prices = '\r\nPrices here: ';
let boolfirstAdd = false;
let saveBtn = document.getElementById('submit-options');
let singleProductChecked = false;
let createdDivs = [];
let boolMultipleArray = [];

var data = {
    completeOrder: []
};

function previousElemnt(elementId) {

    let div = document.getElementById(elementId).parentElement;
    let prevSibling = div.previousSibling;
    while(prevSibling && prevSibling.nodeType !== 1) {//
        prevSibling = prevSibling.previousSibling
    }
    return prevSibling.children[1];
}

String.prototype.replaceText = function(start, pre_end, end, what) {
    return this.substring(0, start) + what + this.substring(pre_end, end);
};

function preventKeys(e) {
    preventContinous = true;
    if ((e.keyCode || e.which) === 13) {
        e.preventDefault();
    }

    let alphaNumeric = /^[-0-9a-zA-Z., ]+$/;
    let numeric = /^[0-9., ]+$/;


    let str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!alphaNumeric.test(str)) {
        e.preventDefault();
    }

    if (!numeric.test(str) && e.target.value.match(/\n/g)) {
        e.preventDefault();
    }
}

function preventFutherInputEntry(id) {
    let element = document.getElementById(id);
    let optionInput = previousElemnt(id);

    element.addEventListener('keypress', function (e) {

            preventKeys(e);

            if ((e.key || e.keyCode || e.which) === ',') {
                //====do first check(items) after number of ",", and prepend price text here=========
                if (parseInt(optionInput.value) === this.value.split(',').length && !this.value.match(/\n/g) && preventContinous === true) {
                    let alert = alertModal('Maximum Items supplied reached: ' + optionInput.value);
                    if(document.querySelectorAll('.md-modal').length < 1)
                        document.body.insertAdjacentHTML('beforeend', alert);

                    this.value += prices;
                    setTimeout(() => {
                        this.value = this.value.substring(0, this.value.length - 1);
                    }, 500);
                    preventContinous = false;
                }
                //====do second check(prices) after number of ",", and finalize here=========
                if ((parseInt(optionInput.value) * 2) === textareaVal(this.value, items, prices).split(',').length && this.value.match(/\n/g) && preventContinous === true) {
                    let alert = alertModal('Maximum Prices supplied to items reached: ' + optionInput.value);
                    if(document.querySelectorAll('.md-modal').length < 1)
                        document.body.insertAdjacentHTML('beforeend', alert);

                    e.preventDefault();
                    preventContinous = false;

                    let querylength = document.querySelectorAll(".inner-optionList").length;
                    let counter = 1;
                    for (let i=0; i < querylength; i++){
                        if(document.querySelectorAll(".inner-optionList")[i].value === "")
                            return;
                        else if(counter === querylength && document.querySelectorAll(".inner-optionList")[i].value !== ""){
                            singleProductChecked = true;
                        }
                        counter++;
                    }
                }
            }
        }
    );

    element.addEventListener('input', function (e) {
        let textVal;
        preventKeys(e);
        if (this.value.indexOf(items) === -1 && !this.value.match(/\n/g)) {

            this.value = items;
            preventContinous = true;
        }else if (this.value.indexOf(items) === -1 && this.value.match(/\n/g)) {

            textVal = this.value.replaceText(0, items.length - 1, this.value.length, items);
            this.value = textVal;
            preventContinous = true;
        }
        if (this.value.replace(/(\r\n|\n|\r)/gm, " ").indexOf(prices.replace(/(\r\n|\n|\r)/gm, " ")) === -1 && this.value.match(/\n/g)) {

            for (let pos = this.value.indexOf("\n"); pos !== -1; pos = this.value.indexOf("\n", pos + 1)) {
                textVal = this.value.replaceText(pos, pos + prices.replace(/(\r\n|\n|\r)/gm, '').length, this.value.length, prices);
                this.value = textVal;
            }
            preventContinous = true;
        }
    });
}

document.addEventListener("keyup", function(e) {
    if(e.target && e.target.id === 'options' || e.target.id.startsWith("inner-option"))
        totalInputItems = e.target.value;
    if (e.target && (e.target.id === 'optionList' || e.target.id.startsWith("inner-optionList")) && previousElemnt(e.target.id).value !== '')
        preventFutherInputEntry(e.target.id);

    if (e.target && e.target.id.startsWith("inner-optionList") && document.getElementById('options').value !== '' &&
        document.getElementById('optionList').value !== '' &&
        textareaVal(document.getElementById('optionList').value, items, prices).split(',').length === parseInt(document.getElementById('options').value)*2)
        preventFutherInputEntry(e.target.id);

});

function operationButtonStatusOnEmptyField(elementButton) {
    var inputs, textarea, index;

    inputs = document.getElementsByTagName('input');
    for (index = 0; index < inputs.length; ++index) {
        // deal with inputs[index] element.
        if ((inputs[index].type === 'input' && inputs[index].value === '') || (inputs[index].type === 'checkbox' && inputs[index].checked)) {
            elementButton.forEach((id) => {
                document.getElementById(id).disabled = true;
            })
        }else {
            elementButton.forEach((id) => {
                document.getElementById(id).disabled = false;
            })
        }
    }

    textarea = document.getElementsByTagName('textarea');
    for (index = 0; index < textarea.length; ++index) {
        // deal with inputs[index] element.
        if ((textarea[index].type === 'textarea' && inputs[index].textContent.trim() === '')) {
            elementButton.forEach((id) => {
                document.getElementById(id).disabled = true;
            })
        }else {
            elementButton.forEach((id) => {
                document.getElementById(id).disabled = false;
            })
        }
    }
}

function extraOptionInputs(productInfo, intChoices) {
    for (let i = 0; i < intChoices; i++) {
        let div = null;
        if(i === 0) {
            let div = document.createElement('div');
            div.innerHTML = `<h3>Add the Extra Menu-Item here.</h3>`;
            document.getElementById('addProductForm').appendChild(div);
            createdDivs.push(div);
        }
        div = document.createElement('div');
        div.innerHTML = `<label for="inner-optionTotal${(i + 1)}">How many options or choices for product ${arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt('optionList'))[i]}</label>
            <input name="innerOption" type="text" class="numbers-only form-control col-md-3 inner-option" id="inner-option${(i + 1)}"" placeholder="Options or Choices" min="1" max="100">`;
        document.getElementById('addProductForm').appendChild(div);
        createdDivs.push(div);
        div = document.createElement('div');
        div.classList.add('form-group');
        div.innerHTML = ` <label for="inner-optionList${(i + 1)}">List Available Option & prices(separated by commas) for product ${arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt('optionList'))[i]}</label>
            <textarea data-gramm_editor="false" name="inneroptionList" class="form-control inner-optionList" id="inner-optionList${(i + 1)}" rows="4"></textarea>`;
        document.getElementById('addProductForm').appendChild(div);
        createdDivs.push(div);
    }
}

function createExtraOptionInputs(intChoices) {
    debugger;
    let productInfo = document.getElementById('optionList').value;

    if (document.getElementsByClassName('inner-optionList').length === 0) {
        extraOptionInputs(productInfo, intChoices);
    } else {
        debugger;
        const removeElements = (elms) => elms.forEach(el => el.remove());

        removeElements(createdDivs);
        createdDivs = [];

        extraOptionInputs(productInfo, intChoices);
    }
}

function createOptionRequiredList(id, optionInput) {
    let  select = document.getElementById(id);
    if(select !== null) {
        select.innerHTML = '';
        for (let i = 0; i <= parseInt(optionInput.value || optionInput); i++) {
            let opt = document.createElement('option');
            opt.value = i.toString();
            opt.innerHTML = i.toString();
            select.appendChild(opt);
        }
    }
}

document.addEventListener('focusout', function(e) {//    let cloneMultipleCheckbox = document.getElementById("myList2").lastChild.cloneNode(true);
    if(e.target && (e.target.id === 'options' || e.target.id === 'optionList') && e.target.value !== '' && boolfirstAdd === true) {
        totalInputItems = previousElemnt('optionList');
        if(previousElemnt('optionList').value !=='' && !document.getElementById('addProductForm').children[0].classList.contains('single-items')) {
            createOptionRequiredList('requiredOption', previousElemnt('optionList'));
            if (e.target.id === 'options')
                createExtraOptionInputs(parseInt(e.target.value));

            if (e.target.id === 'optionList') {
                let productInfo = document.getElementById('optionList').value;

                if (arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt('optionList')).length === parseInt(document.getElementById("options").value)) {
                    document.getElementById("checkboxMultiple").innerHTML = "";

                    for (let i = 0; i < parseInt(document.getElementById("options").value); i++) {
                        let multipleHtml = `<div class="form-check form-check-flat form-check-primary">
                                                <label class="form-check-label">                      
                                                    <input type="checkbox" id="multiple${i + 1}" class="form-check-input multiple">
                                                    Multiple Selection for ${arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt('optionList'))[i]}(Leave unchecked if its single selection) Items
                                                    <i class="input-helper"></i>
                                                </label>
                                            </div>`;

                        document.getElementById("checkboxMultiple").innerHTML += multipleHtml;
                    }
                }
            }
        } else {
            let select = document.getElementById("requiredOption");
            if(select !== null) {
                select.innerHTML = '';
                let opt = document.createElement('option');
                opt.value = "nil";
                opt.innerHTML = "Options are available after you supply option";
                select.appendChild(opt);
            }
        }
    }
});

function arrayItemNames(textAreaVal, optionInput) {
    let arrayProduct = textAreaVal.split(',');
    let arrayItemNames = [];
    for (let i=0; i<arrayProduct.length; i++){
        if(i < parseInt(optionInput.value))
            arrayItemNames.push(arrayProduct[i]);
    }
    return arrayItemNames;
}

function arrayItemPrices(textAreaVal, optionInput) {
    let arrayProduct = textAreaVal.split(',');
    let arrayItemPrices = [];
    for (let i=0; i<arrayProduct.length; i++){
        if(i >= parseInt(optionInput.value) && i <= (parseInt(optionInput.value)*2)-1)
            arrayItemPrices.push(arrayProduct[i]);
    }
    return arrayItemPrices;
}

function createSingleItemsInputs() {
    document.getElementById('addProductForm').innerHTML = "";

    let div = document.createElement('div');
    div.classList.add('form-group', 'single-items');
    div.innerHTML = `<h3>Add the single Menu-Item here.</h3>`;
    document.getElementById('addProductForm').appendChild(div);
    createdDivs.push(div)

    div = document.createElement('div');
    div.classList.add('form-group');
    div.innerHTML = `<label for="optionDescription">Option Description</label>
    <input type="text" name="optionDescription" class="form-control" id="optionDescription" placeholder="Enter the option description i.e choose your size/You can add extras">`;
    document.getElementById('addProductForm').appendChild(div);
    createdDivs.push(div)

    div = document.createElement('div');
    div.classList.add('form-group');
    div.innerHTML = `<label for="options">How many options or choices</label>
    <input type="text" name="optionTotal" class="numbers-only form-control col-md-3" id="options" placeholder="Options or Choices" min="1" max="100">`;
    document.getElementById('addProductForm').appendChild(div);
    createdDivs.push(div);

    div = document.createElement('div');
    div.classList.add('form-group');
    div.innerHTML = `<label for="optionList">List Available Option & prices(separated by commas)</label>
    <textarea data-gramm_editor="false" name="productInfo" class="form-control" id="optionList" rows="4"></textarea>`;
    document.getElementById('addProductForm').appendChild(div);
    createdDivs.push(div);
}


function doneAdding() {
    let alert = alertModal('Added!!!, and You\'re donee with : ' + document.getElementById('item-name-order').textContent);
    if (document.querySelectorAll('.md-modal').length < 1)
        document.body.insertAdjacentHTML('beforeend', alert);
}

document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('md-ok')) {
        boolMultipleArray.push(false);

        boolfirstAdd = true;

        createSingleItemsInputs();

        singleProductChecked = false;
    }
    if (e.target && e.target.classList.contains('md-cancel')) {
        singleProductChecked = false;

        boolfirstAdd = true;

        doneAdding();
    }
    debugger;

    if (e.target && e.target.id === 'add-options' && checkFormValid() === true && menuItemId !== null) {
        let checkboxMultiple = document.querySelectorAll("input.multiple[type='checkbox']");
        checkboxMultiple.forEach((checkbox, i) => {
            boolMultipleArray.push(checkbox.checked);
        });

        addProduct(e.target.parentElement);
        if (boolfirstAdd === false) {
            let alert = alertModal('Added!!!, Fill the form to add other choices to customers orders for that product: ' + document.getElementById('item-name-order').textContent);
            if (document.querySelectorAll('.md-modal').length < 1)
                document.body.insertAdjacentHTML('beforeend', alert);

            boolfirstAdd = true;
        } else if (singleProductChecked === true) {
            singleProductChecked = false;
            doneAdding();
        }

        if (e.target && (e.target.id === 'options' || e.target.id === 'optionList') && e.target.value !== '' && boolfirstAdd === true) {
            createOptionRequiredList('requiredOption', totalInputItems);
            if(e.target.id === 'options' && !document.getElementById('addProductForm').children.classList.contains('single-items'))
                createExtraOptionInputs(parseInt(e.target.value));
        }
debugger;
        document.querySelector(['div[id="addProductForm"]']).children[6].removeAttribute('hidden');

        e.preventDefault()
    }

    if (e.target.id === 'add-options' && checkFormValid() === false) {
        let alert = alertModal('Form is not valid');
        if (document.querySelectorAll('.md-modal').length < 1)
            document.body.insertAdjacentHTML('beforeend', alert);
    }

    if (e.target.id === 'add-options' && checkFormValid() === true && menuItemId === null) {
        let alert = alertModal('Please select an existing item from the item list above');
        if (document.querySelectorAll('.md-modal').length < 1)
            document.body.insertAdjacentHTML('beforeend', alert);
    }
});

//=============START:: Preview Modal Creted=================================
let modalPreview = document.getElementsByClassName("preview")[0];

function activateCloseModalForm() {
    debugger;
    let modalClosingIds = document.querySelectorAll("#close-modal");

    modalClosingIds.forEach((id) => {
        id.addEventListener('click', (event) => {
            let pModal = document.getElementsByClassName('p-modal')[0];

            pModal.classList.remove("modal-show");
        });
    });
}

function createMpdalPreview(modalHtml) {
    const orderWrapper = document.createElement("div");
    orderWrapper.classList.add("order-wrapper");
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("image-wrapper");
    imageWrapper.innerHTML = `
            <div class="mbr-figure">
                <img src="../images/Placeholder.png" alt="restaurant" title="product">
                <!--<div>food display title</div>-->
                <div class="img-caption">
                    <p class="mbr-fonts-style align-left mbr-white display-5 mbr-figure ">
                        productName
                    </p>
                    <h3 class="mbr-fonts-style align-left main-price mbr-white display-5 mbr-figure ">
                        productCost
                    </h3>
                </div>
            </div>
                            `;
    orderWrapper.appendChild(imageWrapper);
    const innerWrapper = document.createElement("div");
    innerWrapper.classList.add("inner-wrapper");
    innerWrapper.innerHTML = `
            <p>productDesc</p>
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
    optionWrapper.innerHTML = modalHtml;

    orderWrapper.appendChild(optionWrapper);

    let modals = document.getElementsByClassName("p-modal");

    if (modals.length === 0) {
        const modal = document.createElement("div");
        modal.classList.add("p-modal");
        modal.classList.add("modal-show");
        
        modal.innerHTML = `<a href="javascript:void(0);" id="close-modal" class="close"></a>`;

        modal.appendChild(orderWrapper);
        document.body.appendChild(modal);
    } else {
        for (let i = 0; i < modals.length; i++) {
            modals[i].innerHTML = `<a href="javascript:void(0);" id="close-modal" class="close"></a>`;
            modals[i].classList.add("modal-show");
            modals[i].setAttribute("data-formId", id);
            modals[i].appendChild(orderWrapper);
        }
    }

    activateCloseModalForm();
}

modalPreview.addEventListener("click", (event)=>{
    if(data.completeOrder.length !== 0) {
        let modalHtml = createModalData(data.completeOrder[0]);

        createMpdalPreview(modalHtml);
    }else{

        let alert = alertModal("You Need To Add Something in Order to Preview It");
        if(document.querySelectorAll('.md-modal').length < 1)
            document.body.insertAdjacentHTML('beforeend', alert);
    }
});
//=============END:: Preview Modal Creted=================================

function addProduct(form) {
    debugger;
    let orderCount = data.completeOrder.length;
    let optionDescription = form.optionDescription.value;
    // let required = form.required.checked;
    let optionTotal = form.optionTotal.value;
    let productInfo = form.productInfo.value;
    let innerProductInfo = document.querySelectorAll('*[id^="inner-optionList"]');
//
    let dataMax =  typeof(form.dataMax) === "undefined" ? 0 : form.dataMax.selectedIndex;
    // let innerOptionRequired = form.innerOptionRequired.checked;
    // let innerOptionTotal = form.innerOptionTotal.value;

    let listOfProductInfo = [];
    innerProductInfo.forEach((product_info) => {

        listOfProductInfo.push({
            name: arrayItemNames(textareaVal(product_info.value, items, prices), previousElemnt(product_info.id)),
            price: arrayItemPrices(textareaVal(product_info.value, items, prices), previousElemnt(product_info.id)),
        })
    });

    if (orderCount === 0) {
        data.completeOrder.push({
            optionDescription: optionDescription,
            optionTotal: parseInt(optionTotal),
            multiple: boolMultipleArray,
            dataMax: parseInt(dataMax),
            name: arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt(form.productInfo.id)),
            price: arrayItemPrices(textareaVal(productInfo, items, prices), previousElemnt(form.productInfo.id)),
            require: true,
            dataSingleproduct: "false",
            innerOptions: listOfProductInfo,
            extraOptions: [],
            menuItemId: menuItemId
        });

        document.getElementById('orderForm').reset();
    }else if (orderCount > 0 && menuItemId !== null) {
        data.completeOrder[0].extraOptions.push({
            optionDescription: optionDescription,
            optionTotal: parseInt(optionTotal),
            multiple: boolMultipleArray,
            dataMax: parseInt(dataMax),
            name: arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt(form.productInfo.id)),
            price: arrayItemPrices(textareaVal(productInfo, items, prices), previousElemnt(form.productInfo.id)),
            require: true,
            dataSingleproduct: dataMax === 0,
            innerOptions: listOfProductInfo
        });

        if (!singleProductChecked) {
            saveBtn.removeAttribute('hidden');
            saveBtn.addEventListener("click", (e) => {
                save();
            });
        } else {
            let alert = alertConfirmModal('Would you be adding single items?');

            if (document.querySelectorAll('.md-modal').length < 1)
                document.body.insertAdjacentHTML('beforeend', alert);
        }

        singleProductChecked = false;
    }

    boolMultipleArray = [];

    if(document.getElementById("multiple") && orderCount === 0)
        document.getElementById("multiple").setAttribute("hidden", "hidden");

    let checkboxMultiple = document.querySelectorAll("input.multiple[type='checkbox']");
    checkboxMultiple.forEach((checkbox, i) => {
        checkbox.checked = false;
    });
}

function save() {
debugger;
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:1987/restaurant/write",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "postman-token": "f0fe5ffb-558d-1f13-49f6-91468f65ac2b"
        },
        "processData": false,
        data: JSON.stringify(data)
    };

    if(checkFormValid() === true && data.completeOrder !== []) {
        $.ajax(settings).done(function (response) {
            let alert = alertModal(response);
            if(document.querySelectorAll('.md-modal').length < 1)
                document.body.insertAdjacentHTML('beforeend', alert);

            let menuItemAllList = document.getElementsByClassName("todo-list")[1];
            let length = menuItemAllList.querySelectorAll('input[type="radio"]').length - 1 || 0;
            // menuItemAllList.querySelectorAll('label')[length].innerText = menuItemAllList.querySelectorAll('label')[length].innerText.replace(' (NA)','');
        });

        data = {
            completeOrder: []
        };

        saveBtn.setAttribute('hidden', 'hidden');
        document.getElementById('orderForm').reset();
    }else {
        let alert = alertModal("There seems to be something wrong with form, please check and try a gain, or reload page");
        if(document.querySelectorAll('.md-modal').length < 1)
            document.body.insertAdjacentHTML('beforeend', alert);
    }

    boolfirstAdd = false;
}