
function scrollFunction() {
    debugger;
    if (document.getElementsByClassName("order-wrapper")[0].scrollTop > 20){//} || document.documentElement.scrollTop > 20) {
        document.getElementsByClassName("navbar-res")[0].style.top = "80px";
        document.getElementsByClassName("navbar-res")[0].style.zIndex = 9;
        document.getElementById("close-modal").setAttribute("style", "background: #fff; border: 2px solid #000; border-radius: 5px;");
    } else {
        document.getElementById("close-modal").removeAttribute("style");
        document.getElementsByClassName("navbar-res")[0].style.top = "-50px";
    }
}