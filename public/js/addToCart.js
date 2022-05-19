"use strict";

$(document).ready(function() {
    var quantity = 0;

    $('#plus').click(function(e) {
        e.preventDefault();
        quantity = parseInt($('#quantity').val());
        quantity += 1;
        $('#quantity').val(quantity);
    })

    $('#minus').click(function(e) {
        if (quantity == 0) {
            //change to darker colour
        }
        if (quantity > 0) {
            e.preventDefault();
            quantity = parseInt($('#quantity').val());
            quantity -= 1;
            $('#quantity').val(quantity);
            
        }
    })
});