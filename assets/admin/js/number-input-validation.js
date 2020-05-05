// onload =function(){
//     let inputElement = document.querySelectorAll('input[type="number"]');
// debugger;
//     inputElement.forEach((input)=> {
//         input.onkeypress = function (e) {
//             if (isNaN(e.target.value + "" + String.fromCharCode(e.charCode)))
//                 return false;
//         };
//
//         input.onpaste = function(e){
//             e.preventDefault();
//         }
//     });
// };

$(function(){
    document.addEventListener('keyup',function(e) {
        if(e.target.value!=='-' && e.target.classList.contains('numbers-only'))
            while(isNaN(e.target.value))
                e.target.value = e.target.value.split('').reverse().join('').replace(/[\D]/i,'')
                    .split('').reverse().join('');
    })
    document.addEventListener("cut copy paste",function(e) {
        if (e.target.type === 'number')
            e.preventDefault();
    });

});