

var totalInputItems = null;
var preventContinous = true;
let items = 'Items here: ';
let prices = '\r\nPrices here: ';
let boolfirstAdd = false;
let saveBtn = document.getElementById('submit-options');

var data = {
    completeOrder: []
};

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

function createOptionRequiredList(id, optionInput) {
    let select = document.getElementById(id);
    select.innerHTML = '';
    for (let i = 0; i<=parseInt(optionInput.value||optionInput); i++){
        let opt = document.createElement('option');
        opt.value = i.toString();
        opt.innerHTML = i.toString();
        select.appendChild(opt);
    }
}

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


// && document.getElementById('requiredOption').classList.contains('required') !== true
document.addEventListener('focusout', function(e) {
    if(e.target && (e.target.id === 'options' || e.target.id === 'optionList') && e.target.value !== '' && boolfirstAdd === true) {
        totalInputItems = previousElemnt('optionList');
        if(previousElemnt('optionList').value !=='')
            createOptionRequiredList('requiredOption', previousElemnt('optionList'));
        else {
            let select = document.getElementById("requiredOption");
            select.innerHTML = '';
            let opt = document.createElement('option');
            opt.value = "nil";
            opt.innerHTML = "Options are available after you supply option";
            select.appendChild(opt);
        }
    }
});

document.addEventListener('click', function (e) {
    if(e.target && e.target.id === 'add-options' && checkFormValid() === true && menuItemId !== null){
        addProduct(e.target.parentElement);
debugger;
        if (boolfirstAdd === false) {
            let alert = alertModal('Added!!!, Fill the form to add other choices to cutomers orders for that product: ' + document.getElementById('item-name-order').textContent);
            if (document.querySelectorAll('.md-modal').length < 1)
                document.body.insertAdjacentHTML('beforeend', alert);

            boolfirstAdd = true;
        }else if (boolfirstAdd === true) {
            let alert = alertModal('Added!!!, and You\'re donee with : ' + document.getElementById('item-name-order').textContent);
            if (document.querySelectorAll('.md-modal').length < 1)
                document.body.insertAdjacentHTML('beforeend', alert);
        }

        if(e.target && (e.target.id === 'options' || e.target.id === 'optionList') && e.target.value !== '' && boolfirstAdd === true)
            createOptionRequiredList('requiredOption', totalInputItems);

        e.target.parentElement.children[0].children[1].removeAttribute('hidden');
        e.target.parentElement.children[0].children[4].removeAttribute('hidden');
        e.target.parentElement.children[0].children[5].removeAttribute('hidden');
        // make them visible, required field and option reqd to proceed select field

        e.preventDefault()
    }
    if (e.target.id === 'add-options' && checkFormValid() === false){
        let alert = alertModal('Form is not valid');
        if(document.querySelectorAll('.md-modal').length < 1)
            document.body.insertAdjacentHTML('beforeend', alert);
    }
    if(e.target.id === 'add-options' && checkFormValid() === true && menuItemId === null) {
        let alert = alertModal('Please select an existing item from the item list above');
        if (document.querySelectorAll('.md-modal').length < 1)
            document.body.insertAdjacentHTML('beforeend', alert);
    }
});

function addProduct(form) {
    debugger;
    let orderCount = data.completeOrder.length;
    let optionDescription = form.optionDescription.value;
    let required = form.required.checked;
    let optionTotal = form.optionTotal.value;
    let productInfo = form.productInfo.value;
    let innerProductInfo = document.querySelectorAll('*[id^="inner-optionList"]');

    let dataMax = form.dataMax.value;
    let innerOptionRequired = form.innerOptionRequired.checked;
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
            dataMax: parseInt(dataMax),
            name: arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt(form.productInfo.id)),
            price: arrayItemPrices(textareaVal(productInfo, items, prices), previousElemnt(form.productInfo.id)),
            require: required,
            dataSingleproduct: dataMax === 0,
            innerOptions: listOfProductInfo,
            extraOptions: [],
            menuItemId: menuItemId
        });

        document.getElementById('orderForm').reset();
    }else if (orderCount > 0 && menuItemId !== null) {
        data.completeOrder[0].extraOptions.push({
            optionDescription: optionDescription,
            optionTotal: parseInt(optionTotal),
            dataMax: parseInt(dataMax),
            name: arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt(form.productInfo.id)),
            price: arrayItemPrices(textareaVal(productInfo, items, prices), previousElemnt(form.productInfo.id)),
            require: required,
            dataSingleproduct: dataMax === 0,
            innerOptions: listOfProductInfo
        });

        saveBtn.removeAttribute('hidden');
        saveBtn.addEventListener("click", (e)=>{
            save();
        });
    }
    // orderCount++;
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

function previousElemnt(elementId) {

    let div = document.getElementById(elementId).parentElement;
    let prevSibling = div.previousSibling;
    while(prevSibling && prevSibling.nodeType !== 1) {//
        prevSibling = prevSibling.previousSibling
    }
    return prevSibling.children[1];
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

function alertModal(alert) {
    return `<div class="md-modal md-effect-12 md-show">
    <div class="md-content">
        <h3>${alert}</h3>
        <div>
            <button class="md-close">Close</button>
        </div>
    </div>
</div>

<div class="md-overlay"></div>`
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

let createdDivs = []
function toggleInnerOptions($this) {
    let options = $this.parentElement.parentElement.parentElement.children[2].children[1];
    let optionList = $this.parentElement.parentElement.parentElement.children[3].children[1];
    if((options.value === '' || optionList.value === '') && $this.checked){
        let alert = alertModal('The fields above cannot be empty');
        if (document.querySelectorAll('.md-modal').length < 1)
            document.body.insertAdjacentHTML('beforeend', alert);
    }else {
        if (document.getElementsByClassName('inner-optionList').length === 0) {
            // innerOptions.style.display = "block";
            // innerOptionList.style.display = "block";

            let productInfo = document.getElementById('optionList').value;
            // let parentDiv = document.createElement('div');
            // parentDiv.id = "inner-option-elements";
            for (let i = 0; i < arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt('optionList')).length; i++) {
                let div = document.createElement('div');
                div.innerHTML = `<label for="inner-optionTotal${(i + 1)}">How many options or choices for product ${arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt('optionList'))[i]}</label>
            <input name="innerOption" type="text" class="numbers-only form-control col-md-3 inner-option" id="inner-option${(i + 1)}"" placeholder="Options or Choices" min="1" max="100">`;
                document.getElementById('addProductForm').appendChild(div);
                createdDivs.push(div);
                div = document.createElement('div');
                div.classList.add('form-group');
                div.innerHTML = ` <label for="inner-optionList${(i + 1)}">List Available Option & prices(separated by commas) for product ${arrayItemNames(textareaVal(productInfo, items, prices), previousElemnt('optionList'))[i]}</label>
            <textarea name="inneroptionList" class="form-control inner-optionList" id="inner-optionList${(i + 1)}" rows="4"></textarea>`;
                document.getElementById('addProductForm').appendChild(div);
                createdDivs.push(div);
            }
        } else {
            const removeElements = (elms) => elms.forEach(el => el.remove());

            removeElements(createdDivs);
            createdDivs = [];
        }
    }
}


