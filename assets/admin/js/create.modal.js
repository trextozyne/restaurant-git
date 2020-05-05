
let menuItem = [];
let categoryList = [];
let counter = 0;
let container = null;
let sectionContainer = null;
let categoryRow = null;

function createItemListHtml(menu_item, curr_index){
    if(menuItem[curr_index === 0 ? 0 : curr_index-1].itemCategoryId !== menu_item.itemCategoryId || counter === 0
        ) {
        sectionContainer = document.createElement('section');
        sectionContainer.classList.add('services6', 'itemCategoryArea');
        //======container=====
        container = document.createElement('div');
        container.classList.add('container');
        categoryRow = document.createElement('div');
        categoryRow.classList.add('row');
        // <!!--Titles-->
        let categoryTitle = document.createElement('div');
        categoryTitle.classList.add('title', 'col-12');
        let categoryName = document.createElement('h2');
        categoryName.classList.add('align-left', 'mbr-fonts-style', 'do-upper', 'm-0', 'display-5');
        categoryName.innerHTML = `<strong>${categoryList.find(categoryItem =>
            categoryItem.categoryId === menu_item.itemCategoryId).categoryName}</strong>`;

        categoryTitle.appendChild(categoryName);
        categoryRow.appendChild(categoryTitle);

        container.appendChild(categoryRow);
    }

    //=    <!!--Card-1-->
    let menuItemCard = document.createElement('div');
    menuItemCard.classList.add('card', 'col-12', 'pb-5');
    let menuItemCardWrapper = document.createElement('div');
    menuItemCardWrapper.classList.add('card-wrapper', 'toggle', 'media-container-row', 'media-container-row');
    menuItemCardWrapper.setAttribute('data-id', `${menu_item.menuItemId}`);
    let menuItemCardBox = document.createElement('div');
    menuItemCardBox.classList.add('card-box');
    let menuItemRow = document.createElement('div');
    menuItemRow.classList.add('row');
    let menuItemContainer = document.createElement('div');
    menuItemContainer.classList.add('col-12', 'col-md-2');
    let menuItemImageContainer = document.createElement('div');
    menuItemImageContainer.classList.add('mbr-figure');
    // <!!--Image-->
    let menuItemImage = document.createElement('img');
    menuItemImage.setAttribute('src', `../images/gallery/${menu_item.itemImgName}`);
    menuItemImage.setAttribute('alt', 'restaurantItem');
    menuItemImage.setAttribute('title', `${menu_item.itemImgName}`);

    menuItemImageContainer.appendChild(menuItemImage);
    menuItemContainer.appendChild(menuItemImageContainer);

    let menuItemInfoContainer = document.createElement('div');
    menuItemInfoContainer.classList.add('col-12', 'col-md-10');
    let menuItemInfoWrapper = document.createElement('div');
    menuItemInfoWrapper.classList.add('wrapper');
    let menuItemInfoTitle = document.createElement('div');
    menuItemInfoTitle.classList.add('top-line', 'pb-3');
    let menuItemName = document.createElement('h4');
    menuItemName.classList.add('card-title', 'mbr-fonts-style', 'display-5');
    menuItemName.innerText = menu_item.itemName;
    let menuItemCost = document.createElement('p');
    menuItemCost.classList.add('mbr-text', 'cost', 'mbr-fonts-style', 'm-0', 'display-5');
    menuItemCost.innerText = '$' +menu_item.itemPrice;

    menuItemInfoTitle.appendChild(menuItemName);
    menuItemInfoTitle.appendChild(menuItemCost);

    let menuItemInfoDescription = document.createElement('div');
    menuItemInfoDescription.classList.add('bottom-line');
    let menuItemDescription = document.createElement('p');
    menuItemDescription.classList.add('mbr-text', 'description', 'mbr-fonts-style', 'display-7');
    menuItemDescription.innerText = menu_item.itemDescription;

    menuItemInfoDescription.appendChild(menuItemDescription);

    menuItemInfoWrapper.appendChild(menuItemInfoTitle);
    menuItemInfoWrapper.appendChild(menuItemInfoDescription);

    menuItemInfoContainer.appendChild(menuItemInfoWrapper);

    menuItemRow.appendChild(menuItemContainer);
    menuItemRow.appendChild(menuItemInfoContainer);

    menuItemCardBox.appendChild(menuItemRow);
    menuItemCardWrapper.appendChild(menuItemCardBox);
    menuItemCard.appendChild(menuItemCardWrapper);

    categoryRow.appendChild(menuItemCard);

    container.appendChild(categoryRow);

    sectionContainer.appendChild(container);


    if(menuItem[curr_index === 0 ? 0 : curr_index-1].itemCategoryId !== menu_item.itemCategoryId || counter === 0)
    {
        let targetElement = document.getElementById('menu1-g');
        targetElement.insertAdjacentElement('afterend', sectionContainer);
    }

    // ===================Divider==========================
    if(menuItem[curr_index === 0 ? 0 : curr_index-1].itemCategoryId !== menu_item.itemCategoryId)
    {
        let sectionBreaker = document.createElement('section');
        sectionBreaker.classList.add('mbr-section', 'article', 'content10', 'cid-rAI0fqDoJ9');
        sectionBreaker.id = "content10-u";
        let breakerContainer = document.createElement('div');
        breakerContainer.classList.add('inner-container');
        breakerContainer.setAttribute('style', "width: 74%;");
        let divBreaker = document.createElement('div');
        divBreaker.classList.add('section-text', 'align-center', 'mbr-white', 'mbr-fonts-style', 'display-5');
        let spanBreaker1 = document.createElement('span');
        spanBreaker1.classList.add('mbr-iconfont', 'mbri-more-horizontal');
        let spanBreaker2 = document.createElement('span');
        spanBreaker2.classList.add('mbr-iconfont', 'mbri-more-horizontal');

        divBreaker.appendChild(spanBreaker1);
        divBreaker.appendChild(spanBreaker2);

        breakerContainer.appendChild(divBreaker);

        sectionBreaker.appendChild(breakerContainer);

        sectionContainer.insertAdjacentElement('afterend', sectionBreaker);
    }
    counter++;
}

function getCategoryBy(_categoryId) {
    let settings = {
        "url": "http://localhost:1987/category/find/" + _categoryId,
        "method": "GET"
    };

    $.ajax(settings).done(function (response) {

        menuItem.sort(function (a, b) {
            return a.itemCategoryId < b.itemCategoryId ? -1
                : a.itemCategoryId > b.itemCategoryId ? 1 : 0;
        });
        menuItem.sort(function (a, b) {
            return b.itemActive.toString() < a.itemActive.toString() ? -1
                : b.itemActive.toString() > a.itemActive.toString() ? 1 : 0;
        });

        categoryList.push(response);

        if(categoryList.length === menuItem.length){
            //===same categories in categoryList filter them to 1=====
            categoryList = categoryList.filter((categoryItem, index, self) =>
                index === self.findIndex((t) => (
                    t.categoryId === categoryItem.categoryId && t.categoryName === categoryItem.categoryName
                ))
            );

            menuItem.forEach((menu_item, index)=> {
                categoryList.forEach((categoryItem, jIndex)=> {debugger;

                    if(menu_item.itemCategoryId.trim() === categoryItem.categoryId.trim() && menu_item.itemActive === true) {
                        createItemListHtml(menu_item, index);
                    }
                });
            });

        }
    });
}
function createMenuItems() {
    var settings = {
        "url": "http://localhost:1987/menu-item/read",
        "method": "GET"
    };

    $.ajax(settings).done(function (response) {
        Object.keys(response).forEach(function (key) {
            response[key].forEach(function (item, index) {
                menuItem.push(item);
            });
        });

        menuItem.forEach(function (item, index) {
            getCategoryBy(item.itemCategoryId)
        })
    });
}

// ============================================create modal========================================
(function () {
    createMenuItems();
})();

function getMenuData(menuItemId, callback) {
    let settings = {
        "url": "http://localhost:1987/restaurant/find/" + menuItemId.trim(),
        "method": "GET",
        success: callback
    };

    $.ajax(settings)
}

function createMenuData(objData, i) {
    let menuOptionBoards = [];
    let optionBoard, innerOptionBoard, title, innerTitle, requiredTitle, innerRequiredTitle, optionList, innerOptionList, divRadio, divCheckbox, radioInput, checkboxInput, label4Input, divChecker;
//replace i with o for first, the other i's would be a count from 1 then count++ so long as they are less than exteaoptions.lengt or something
    let count = 0;
    optionBoard = createElement('div', ['option-board', 'option-'], '', [], [], '', '', count, '', '', '', '');
    title = createElement('span', [], '', [], [], '', objData.optionDescription, count, '', '', '', '');
    requiredTitle = createElement('p', [], '', [], [], '', `Required Field - Choose 1.`, count, '', '', '', '');//createElement('p', [], '', '', '', `Required Field - Choose ${objData.}`, count);
    optionList = createElement('div', ['option-list'], '', [], [], '', '', count, '', '', '', '');
    objData.name.forEach((name, iIndex)=>{
        objData.price.forEach((price, jIndex)=>{
            if(iIndex === jIndex) {
                divRadio = createElement('div', ['radio'], '', [], [], '', '', count, '', '', '', '');
                radioInput = createElement('input', [], `radio${iIndex+1}`, ['data-option'], [name], '', '', count, 'radio', name, price, 'radio');
                label4Input = createElement('label', [], `radio${iIndex+1}`, [], [], '', '', count, 'for', '', '', '');
                divChecker = createElement('div', ["checker"], ``, [], [], '', '', count, '', '', '', '');
                label4Input.appendChild(divChecker);
                label4Input.appendChild(document.createTextNode(name));
                divRadio.appendChild(radioInput);
                divRadio.appendChild(label4Input);

                optionList.appendChild(divRadio);
                optionBoard.appendChild(title);
                optionBoard.appendChild(requiredTitle);

                var quotient = Math.floor(objData.name.length/3 || objData.price.length/3);
                let remainder = objData.name.length % 3 || objData.price.length % 3;
                if (quotient === 0 && (iIndex + 1) === remainder)
                    optionBoard.appendChild(optionList);
                if (quotient > 0){
                    if (remainder === 0 && (iIndex + 1)%3 === 0)
                        optionBoard.appendChild(optionList);
                    if(remainder !== 0 && (iIndex + 1)%3 === 0)
                        optionBoard.appendChild(optionList);
                    if(remainder !== 0 && (iIndex + 1)%3 === remainder)
                        optionBoard.appendChild(optionList);
                }
            }
        })
    });
    console.log(optionBoard);
    menuOptionBoards.push(optionBoard.outerHTML);
    if (objData.extraOptions){
        for (let i = 0; i < objData.extraOptions.length; i ++) {
            count++;
            optionBoard = createElement('div', ['option-board', 'option-'], '', ['data-max'], [(count+1)], '', '', count, '', '', '', '');
            title = createElement('span', [], '', [], [], '', 'Would you like to add extras?', count, '', '', '', '');
            requiredTitle = createElement('p', [], '', [], [], '', `Required Field - Choose ${objData.extraOptions[0].dataMax}.`, count, '', '', '', '');//createElement('p', [], '', '', '', `Required Field - Choose ${objData.extraOptions[0].}`, count);
            optionList = createElement('div', ['option-list', 'option-horizontal'], '', [], [], '', '', '', '', '', '', '');
            objData.extraOptions[0].name.forEach((name, iIndex)=> {
                objData.extraOptions[0].price.forEach((price, jIndex) => {
                    if(iIndex === jIndex) {
                        divCheckbox = createElement('div', ['checkbox'], '', [], [], '', '', count, '', '', '', '');;
                        checkboxInput = createElement('input', [], `check${iIndex + 1}`, ['data-singleproduct', 'data-option'], [objData.extraOptions[0].dataSingleproduct, name], '', '', count, 'checkbox', name, price, 'checkbox');
                        label4Input = createElement('label', [], `check${iIndex + 1}`, [], [], '', '', count, 'for', '', '', '');
                        divChecker = createElement('div', ["checker"], ``, [], [], '', '', count, '', '', '', '');

                        label4Input.appendChild(divChecker);
                        label4Input.appendChild(document.createTextNode(name));
                        divCheckbox.appendChild(checkboxInput);
                        divCheckbox.appendChild(label4Input);

                        if(objData.extraOptions[0].innerOptions.length > 0){
                            innerOptionBoard = createElement('div', ['inner-option-board', 'inner-option-'], '', [], [], '', '', count-1, '', '', '', '');
                            innerTitle = createElement('span', [], '', [], [], '', 'Choose your size', count-1, '', '', '', '');
                            innerRequiredTitle = createElement('p', [], '', [], [], '', `Required Field - Choose 1.`, count-1, '', '', '', '');//createElement('p', [], '', '', '', `Required Field - Choose ${objData.extraOptions[0].}`, count);

                            let radioList = optionList.querySelectorAll('input[type="radio"]');//help assign id
                            for (let x = 0; x < objData.extraOptions[0].innerOptions.length; x++) {
                                let divRadioArray = [];

                                let radioCount = radioList.length;//help assign id

                                objData.extraOptions[0].innerOptions[x].name.forEach((innerName, inner_iIndex) => {
                                    objData.extraOptions[0].innerOptions[x].price.forEach((innerPrice, inner_jIndex) => {
                                        if (inner_iIndex === inner_jIndex) {
                                            divRadio = createElement('div', ['radio'], '', [], [], '', '', count-1, '', '', '', '');
                                            radioInput = createElement('input', [], `inner-radio${radioCount + 1}`, ['data-option'], [innerName], '', '', count-1, 'radio', innerName, innerPrice, `checkbox${iIndex + 1}`);
                                            label4Input = createElement('label', [], `inner-radio${radioCount + 1}`, [], [], '', '', count-1, 'for', '', '', '');
                                            divChecker = createElement('div', ["checker"], ``, [], [], '', '', count-1, '', '', '', '');
                                            label4Input.appendChild(divChecker);
                                            label4Input.appendChild(document.createTextNode(innerName));
                                            divRadio.appendChild(radioInput);
                                            divRadio.appendChild(label4Input);

                                            innerOptionBoard.appendChild(innerTitle);
                                            innerOptionBoard.appendChild(innerRequiredTitle);


                                            divRadioArray.push(divRadio);
                                            radioCount++;

                                            let quotient = Math.floor(objData.extraOptions[0].innerOptions[x].name.length / 3 || objData.extraOptions[0].innerOptions[x].price.length / 3);
                                            let remainder = objData.extraOptions[0].innerOptions[x].name.length % 3 || objData.extraOptions[0].innerOptions[x].price.length % 3;
                                            // if (quotient === 0 && (inner_iIndex + 1) === remainder % 3 && iIndex === x) {
                                            //     innerOptionList = createElement('div', ['option-list'], '', [], [], '', '', count-1, '', '', '', '');
                                            //     divRadioArray.forEach((radioDiv)=>{
                                            //         innerOptionList.appendChild(radioDiv);
                                            //     });
                                            //
                                            //     innerOptionBoard.appendChild(innerOptionList);
                                            // }
                                            // // if (quotient > 0) {
                                            if ((remainder === 0 && (inner_iIndex + 1) % 3 === 0)  &&
                                                iIndex === x){
                                                innerOptionList = createElement('div', ['option-list'], '', [], [], '', '', count-1, '', '', '', '');
                                                divRadioArray.forEach((radioDiv)=>{
                                                    innerOptionList.appendChild(radioDiv);
                                                });
                                                innerOptionBoard.appendChild(innerOptionList);
                                            }
                                            if ((remainder !== 0 && (inner_iIndex + 1) % 3 === 0) &&
                                                iIndex === x){
                                                innerOptionList = createElement('div', ['option-list'], '', [], [], '', '', count-1, '', '', '', '');
                                                divRadioArray.forEach((radioDiv)=>{
                                                    innerOptionList.appendChild(radioDiv);
                                                });
                                                innerOptionBoard.appendChild(innerOptionList);
                                            }
                                            if ((remainder !== 0 && (inner_iIndex + 1) % 3 === remainder) &&
                                                iIndex === x){
                                                innerOptionList = createElement('div', ['option-list'], '', [], [], '', '', count-1, '', '', '', '');
                                                divRadioArray.forEach((radioDiv)=>{
                                                    innerOptionList.appendChild(radioDiv);
                                                });
                                                innerOptionBoard.appendChild(innerOptionList);
                                            }
                                            // }
                                        }
                                    })
                                })
                            }
                        }

                        if(innerOptionBoard.children[0].classList.contains('option-list')) {
                            let arr = [1,2,0];
                            let items = innerOptionBoard.children;
                            let elements = document.createDocumentFragment();

                            arr.forEach(function (idx) {
                                elements.appendChild(items[idx].cloneNode(true));
                            });

                            while (innerOptionBoard.firstChild) {
                                innerOptionBoard.removeChild(innerOptionBoard.firstChild);
                            }
                            innerOptionBoard.appendChild(elements);
                        }

                        divCheckbox.appendChild(innerOptionBoard);
                        optionList.appendChild(divCheckbox);
                        optionBoard.appendChild(title);
                        optionBoard.appendChild(requiredTitle);

                        var quotient = Math.floor(objData.extraOptions[0].name.length/3 || objData.extraOptions[0].price.length/3);
                        let remainder = objData.extraOptions[0].name.length % 3 || objData.extraOptions[0].price.length % 3;
                        if (quotient === 0 && (iIndex + 1) === remainder)
                            optionBoard.appendChild(optionList);
                        if (quotient > 0){
                            if (remainder === 0 && (iIndex + 1)%3 === 0)
                                optionBoard.appendChild(optionList);
                            if(remainder !== 0 && (iIndex + 1)%3 === 0)
                                optionBoard.appendChild(optionList);
                            if(remainder !== 0 && (iIndex + 1)%3 === remainder)
                                optionBoard.appendChild(optionList);
                        }
                    }
                })
            });
            console.log(optionBoard);
            menuOptionBoards.push(optionBoard.outerHTML);
            menuOptionBoards = ('' + [...menuOptionBoards]).replace(/,/g , "");
            return menuOptionBoards;

        }
    }

    let textAreaOptionBoard = document.createElement('div');
    textAreaOptionBoard.classList.add("option-board");
    textAreaOptionBoard.innerHTML = `
                 <span>Special instructions</span>
                 <div class="option-list">
                  <textarea name="instructions" id="instructions" placeholder="Dressing on the side? No pickles? Let us know here."
                  cols="100" rows="4" style="padding: 5px; border-radius: 5px; margin-top: 5px"></textarea>
                  </div>`;
    menuOptionBoards.push(textAreaOptionBoard.outerHTML);
    let optionBoardsClone = [];
    menuOptionBoards.forEach((options, index)=>{
        let optionBoardSpacer = document.createElement('div');
        optionBoardSpacer.setAttribute("style", "margin: 10px;");
        optionBoardsClone.push(options);
        if(index < menuOptionBoards.length-1){
            optionBoardsClone.push(optionBoardSpacer.outerHTML)
        }
    });
    menuOptionBoards = optionBoardsClone;
    // console.log(optionBoards); return optionBoards;

    console.log(menuOptionBoards)
    // }
}

function createElement(Element, $class, id, data, dataVal, innerHtml, innerText, index, type, name, value, eleName) {
    let htmlElement = document.createElement(Element);
    if(id !== '' && Element !== 'label')
        htmlElement.id = id;
    if ($class !== [])
        $class.forEach((cl)=>{
            if ((cl.startsWith("option-")|| cl.startsWith("inner-option-")) && (cl !== "inner-option-board" && cl !== "option-board" && cl !== "option-list" && cl !== "option-horizontal")) {
                htmlElement.classList.add(cl+(index+1));
            }else
                htmlElement.classList.add(cl);
        });
    if(type !== '' && name !== '') {
        htmlElement.setAttribute("type", type);
        htmlElement.setAttribute("name", eleName);
    } else  if(type === 'for')
        htmlElement.setAttribute("for", id);
    if(type === "checkbox" && dataVal[0] === false)
        htmlElement.setAttribute("disabled", "disabled");


    if (data !== [])
        data.forEach(($data, i)=> {
            htmlElement.setAttribute($data, dataVal[i]);
        });
    if (value !== '')
        htmlElement.setAttribute("value", value);
    if (innerHtml !== '')
        htmlElement.innerHTML = innerHtml;
    if (innerText !== '')
        htmlElement.innerText = innerText;

    return htmlElement;
}