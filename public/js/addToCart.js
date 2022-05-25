"use strict";

//----------------------------------------------------------------------------------------------
// This function is called when the recipe/dish detail page first loads. It adds a quantity
// selection and subtotal field for the dish detail. It adds listeners to the plus and minus buttons
// to allow user to add or minus quantity and display the subtotal accordingly. When the user clicks
// the "Add to Cart" button, it will post the dish name, quantity, and subtotal to the server and
// redirect to the kitchenDetails page. If it is a recipe instead of a dish, the price and add to 
// cart functions will not appear. It also has a "Go Back" button to redirect the user back to the
// kitchenDetails page. 
//-----------------------------------------------------------------------------------------------
ready(async function () {
  var url = document.URL;
  const id = url.substring(url.lastIndexOf('=') + 1).split("/");
  var userId = id[0];
  var recipeDishId = id[1];
  var unitPrice;
  var dishName;

  fetch("/recipe-dish-data?id=" + userId + "/" + recipeDishId)
    .then((response) => {
      return response.json();
    })
    .then((data) => {

      document.getElementById("foodTitle").innerHTML = data[0].name

      let recipeDishDetails = "";
      recipeDishDetails = `<div id="dish-description">
        <div class="card">
            <img src=./img/` + data[0].recipePath + ` class="card-img-top" alt="No image" id="dish-photo">
            <div class="card-body">
                <p class="dish-name"><b>` + data[0].name + `</b></p>
                <p class="dish-description">` + data[0].description + `</p>
            </div>`

      if (data[0].purchaseable == 1) {
        recipeDishDetails += `<ul class="list-group list-group-flush" id="addToCartDiv">
                <li class="list-group-item" id="dish-price">Price($CAD):  ` + (Math.round(data[0].price * 100) / 100).toFixed(2) + `<span id="numberOfDishes"><a type="button"><img src="/img/subtract.png" id="subtract" class="quantityButton"
                alt="subtractSign"></a><span id="quantity">1</span><a type="button"><img src="/img/add.png"
                id="add" class="quantityButton" alt="addSign"></a></span><div id="add-to-cart"><button type="button" class="btn btn-number" id="addToCartButtonLabel">Add to Cart</button></div></li>
                <li class="list-group-item"><span id="subtitleLabel">Subtotal($CAD): </span><span id="subtotal"></span><span id="goBack"><button type="button" class="btn btn-number" id="goBackButton">Go Back</button></span></li></div>
            </ul>`
        document.getElementById("recipeDishDetails").innerHTML = recipeDishDetails;

        dishName = data[0].name;
        unitPrice = (Math.ceil(data[0].price * 100) / 100);
        unitPrice = parseFloat(unitPrice).toFixed(2)
        document.getElementById("subtotal").innerHTML = unitPrice;

        var qty = 0;
        var subtotal;

        document.getElementById("add").addEventListener("click", function (e) {
          e.preventDefault();
          if (qty <= 100) {
            qty++;
            subtotal = unitPrice * qty;
            document.getElementById("quantity").innerHTML = qty;
            document.getElementById("subtotal").innerHTML = subtotal;
          }
        })

        document.getElementById("subtract").addEventListener("click", function (e) {
          e.preventDefault();
          if (qty > 1) {
            qty--;
            subtotal = unitPrice * qty;
            document.getElementById("quantity").innerHTML = qty;
            document.getElementById("subtotal").innerHTML = subtotal;
          }
        })

        document.getElementById("add-to-cart").addEventListener("click", function (e) {
          e.preventDefault();

          postData({
            cookId: userId,
            recipeId: recipeDishId,
            qty: qty
          })

          window.location.href = "/kitchenDetails?id=" + userId;
        })

      } else {
        recipeDishDetails += `<ul class="list-group list-group-flush">
            <li class="list-group-item" id="dish-price"><span id="goBack"><button type="button" class="btn btn-number" id="goBackButton">Go Back</button></span></li>
            </ul></div>`

        document.getElementById("recipeDishDetails").innerHTML = recipeDishDetails;
      }

      document.getElementById("goBackButton").addEventListener("click", function (e) {
        e.preventDefault();

        postData({
          cookId: userId,
          recipeId: recipeDishId,
          qty: qty + 1
        })

        window.location.href = "/kitchenDetails?id=" + userId;
      })

    })
    .catch(function (error) {
      console.log(error);
    })

});

//----------------------------------------------------------------------------------------------
// This function listens to a post request to send the dish name, quantity, and subtotal data to
// the server.  It is called when the user clicks the add to cart button on the dish detail page.
//-----------------------------------------------------------------------------------------------
async function postData(data) {
  try {
    let resObject = await fetch("/add-to-shoppingcart", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    })
    let parsedData = await resObject.json();
  } catch (error) {
    console.log(error);
  }
}

//----------------------------------------------------------------------------------------------
// This function checks whether page is loaded.
//-----------------------------------------------------------------------------------------------
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}