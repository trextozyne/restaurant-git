$(function () {
    document.addEventListener('click', (e)=> {
        if(e.target && e.target.classList.contains('md-close')) {
            let md = document.querySelector('.md-modal');
            let mdOverlay = document.querySelector('.md-overlay');
            RemoveClass(md, 'md-show');
            md.parentNode.removeChild(md);
            mdOverlay.parentNode.removeChild(mdOverlay);
        }
    })
});

function RemoveClass(elem, newClass) {
    elem.className = elem.className.replace(new RegExp('(\\s|^)'+newClass+'(\\s|$)'), " ").trim();
}