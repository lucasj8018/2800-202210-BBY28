"use strict";
function round() {
    let price = document.getElementById("inputPrice").value;
    if ((price * 100) % 1 != 0) {
        let roundedPrice = Math.round(price * 100) / 100;
        document.getElementById("inputPrice").value = roundedPrice;
    }
};