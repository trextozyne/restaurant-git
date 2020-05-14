// (function($) {
//   'use strict';
//   $(function() {
//     var todoListItem = $('.todo-list');
//     var todoListInput = $('.todo-list-input');
//     $('.todo-list-add-btn').on("click", function(event) {
//       event.preventDefault();
//
//       var item = $(this).prevAll('.todo-list-input').val();
//
//
//       if (item) {
//         todoListItem.append(`<li><div class='form-check'><label class='form-check-label'><input onchange='getCheckBoxValue(this)' class='radio' name='radio' type='radio'/>` + item + "<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i></li>");
//         todoListInput.val("");
//       }
//
//     });
//
//     todoListItem.on('change', '.radio', function() {
//       if ($(this).attr('checked')) {
//         $(this).removeAttr('checked');
//       } else {
//         $(this).attr('checked', 'checked');
//       }
//
//       // $(this).closest("li").toggleClass('completed');
//
//     });
//
//     todoListItem.on('click', '.remove', function() {
//       $(this).parent().remove();
//     });
//
//   });
// })(jQuery);

(function($) {
    'use strict';
    $(function() {
        debugger;
        var categoryListItem = $('.todo-list')[0];//ul
        var menuItemListItem = $('.todo-list')[1];//ul
        // var categoryListInput = $('.todo-list-input');//input
        // var menuItemListInput = $('#item-name');

        $('.todo-list-add-btn').on("click", function(event) {
            event.preventDefault();

            var item = $(this).prevAll('.todo-list-input').val();


            if (item) {
                let li = document.createElement('li');
                li.innerHTML =`<div class='form-check'><label class='form-check-label'><input onchange='getCategoryId(this)' class='radio' name='radio' type='radio'/>` + item +
                    `<i class='input-helper'></i></label></div><i class='remove mdi mdi-close-circle-outline'></i><i class='edit mdi mdi-pencil-outline'></i>`;
                categoryListItem.appendChild(li);
            }

        });

        $('.add-menu-item').on("click", function(event) {
            debugger
            event.preventDefault();

            let menuItemName = document.getElementById('item-name');
            let menuItemDescription = document.getElementById('item-description');
            let menuItemIngredients = document.getElementById('ingredients');
            let menuItemRecipe = document.getElementById('recipe');
            let menuItemPrice = document.getElementById('price');
            //
            // let addMenuItemBtn = document.getElementsByClassName('add-menu-item')[0];
            //
            // addMenuItemBtn.addEventListener('click', (event) => {
            //     if(event.target.innerText === 'Submit') {
           if (menuItemCategoryId !== null && !!menuItemName.value && !!menuItemDescription.value && menuImageItem.files.length > 0
                        && !!menuItemIngredients.value && !!menuItemRecipe.value && !!menuItemPrice.value) {
               debugger;
               let li = document.createElement('li');
               li.innerHTML = `<div class='form-check'><label class='form-check-label'><input onchange='getMenuItemId(this)' class='radio' name='radio' type='radio'/>` + menuItemName.value +
                   `<i class='input-helper'></i></label></div><i class='removeMenuItem mdi mdi-close-circle-outline'></i><i class='editMenuItem mdi mdi-pencil-outline'></i>`
               menuItemListItem.appendChild(li);

               document.getElementById("menuForm").reset();

               menuItemCategoryId = null;
           }


        });



        $(`body`).on('change', '.radio', function() {
            if ($(this).attr('checked')) {
                $(this).removeAttr('checked');
            } else {
                $(this).attr('checked', 'checked');
            }

            // $(this).closest("li").toggleClass('completed');

        });

        // $("body").on('click', '.remove', function() {debugger;
        // $(this).parent().remove();
        // });

    });
})(jQuery);