let buttons = document.querySelectorAll("#submit-options, #add-options");

function checkFormValid() {
    let form = document.getElementById('orderForm');
    let inputs = form.querySelectorAll('input[type=text], input[type=number], textarea, select');
    let formValid = true;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].classList.contains('required') && !inputs[i].parentElement.hasAttribute('hidden') && formValid) formValid = false;
    }
    return formValid;
}

function createErrorInfo(innertext) {
    let span = document.createElement('span');
    span.classList.add('error-info');
    span.innerText = innertext
    return span;
}

function textareaVal($this, items, prices) {
    return $this.replace(/(\r\n|\n|\r)/gm, ',').replace(items, '').replace((prices.replace(/(\r\n|\n|\r)/gm, '')), '');
}

buttons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            let form = document.getElementById('orderForm');
            let inputs = form.querySelectorAll('input[type=text], input[type=number], textarea, select');
            for (let i = 0; i < inputs.length; i++) {
                if ((inputs[i].value.trim() === '' && (inputs[i].nodeName === "INPUT" || inputs[i].nodeName === "TEXTAREA")) ||
                    (inputs[i].textContent.trim() === 'Options are available after you supply option' && inputs[i].nodeName === "SELECT")) {
                    inputs[i].style.border = '1px solid #ff4c4c';

                    // Add a class that defines an animation
                    inputs[i].classList.add('error', 'required');
                    inputs[i].insertAdjacentHTML('afterEnd', createErrorInfo("This field cannot be empty!!!").outerHTML);
                    // inputs[i].parentNode.insertBefore(createErrorInfo("This field cannot be empty!!!"), inputs[i].nextSibling);

                    // remove the class after the animation completes
                    setTimeout(function () {
                        inputs[i].classList.remove('error');
                        let spanEl = document.querySelectorAll('.error-info');
                        spanEl.forEach((el) => {

                            el.parentElement.removeChild(el);
                        });
                    }, 5000);

                    event.preventDefault();
                }
            }
        });
});

document.addEventListener("focusout", function(event) {
    if (event.target.nodeName === "INPUT" || event.target.nodeName === "TEXTAREA") {
        if (event.target.value.trim() !== '') {
            event.target.style.border = '1px solid #ebedf2';
            event.target.classList.remove('required');
        } else {
            event.target.style.border = '1px solid #ff4c4c';
            // Add a class that defines an animation
            event.target.classList.add('error', 'required');
            event.target.insertAdjacentHTML('afterEnd', createErrorInfo("This field cannot be empty!!!").outerHTML);
            // remove the class after the animation completes
            let input = event.target;
            setTimeout(function () {
                input.classList.remove('error');
                let spanEl = input.nextElementSibling;
                spanEl.parentElement.removeChild(spanEl);
            }, 5000);
        }
    }
    if (event.target.nodeName === "SELECT") {
        if (event.target.textContent.trim() !== '' || event.target.textContent.trim() !== 'Options are available after you supply option') {
            event.target.style.border = '1px solid #ebedf2';
            event.target.classList.remove('required');
        } else {
            event.target.style.border = '1px solid #ff4c4c';
            // Add a class that defines an animation
            event.target.classList.add('error', 'required');
            event.target.insertAdjacentHTML('afterEnd', createErrorInfo("This field cannot be empty!!!").outerHTML);
            // remove the class after the animation completes
            let input = event.target;
            setTimeout(function () {
                input.classList.remove('error');
                let spanEl = input.nextElementSibling;
                spanEl.parentElement.removeChild(spanEl);
            }, 5000);
        }
    }
//
    if (event.target.nodeName === "TEXTAREA") {
        if (event.target.value.trim() !== "" && textareaVal(document.getElementById('optionList').value, items, prices).split(',').length !== parseInt(document.getElementById('options').value) * 2) {
            document.getElementById('options').value === '' ?
                event.target.insertAdjacentHTML('afterEnd', createErrorInfo('The number of choice or options field can\'t be empty').outerHTML) :
            event.target.insertAdjacentHTML('afterEnd', createErrorInfo('Number of items or prices supplied in here ' +
                'cannot be lesser than the amount provided in choice/options box').outerHTML);
            // e.target.value = '';

            event.target.style.border = '1px solid #ff4c4c';
            // Add a class that defines an animation
            event.target.classList.add('error', 'required');
            // remove the class after the animation completes
            let input = event.target;
            setTimeout(function () {
                input.classList.remove('error');
                let spanEl = input.nextElementSibling;
                spanEl.parentElement.removeChild(spanEl);
            }, 5000);
        } else if (event.target.textContent.trim() !== '' && textareaVal(document.getElementById('optionList').value, items, prices).split(',').length === parseInt(document.getElementById('options').value) * 2) {
            event.target.style.border = '1px solid #ebedf2';
            event.target.classList.remove('required');
        }
    }
});

document.addEventListener("keydown", function(e) {

});