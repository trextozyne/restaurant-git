let checkout = null;

checkout = document.getElementById("checkout");

function totalPurchase() {
    let number = 0;
    debugger;
    let total = null;

    document.querySelectorAll("div.sale").forEach((sale, i) => {
        let match = /\d+(\.\d+)?(\*[a-zA-Z]+\d+)?/.exec(sale.textContent.replace(/\(|\)|\ |\$|\:|\=/g, ""));
        if(match) number =  match[0].replace(/(\*[a-zA-Z]+)/, '*').split("*");

        total = parseFloat(number[0]) * parseFloat(number[1]);

        sale.querySelector(".total").textContent = total;
    })
    // return total;
}

checkout.addEventListener("click", (event)=>{
    debugger;

    let cartSales = null;
    let sales = "<div class='sales'>";

    if(localStorage.getItem('sales'))
        cartSales = JSON.parse(localStorage.getItem('sales'));

    for(let i=0; i<cartSales.length; i++) {
        for (let j in cartSales[i].sale) {
            sales += `<div class="sale">${cartSales[i].sale[j].productName} ($${cartSales[i].sale[j].productPrice.replace(/\$/g, "")}) * (Qty: ${cartSales[i].quantity}) = <span class="total"></span></div><br>`;
        }
    }

    sales += "</div>";

    let alert = alertModal(sales);

    document.body.insertAdjacentHTML('beforeend', alert);

    totalPurchase();
});