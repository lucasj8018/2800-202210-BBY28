"use strict";

//-----------------------------------------------------------------------------------
// This function is called when the profile page first loads. It gets the user data 
// and populate on the profile card.  It displays the user list dashboard if it logged
// in as an admin user.  It also listens to post request to send updated profile data
// or dashboard updates to the server and save to the database.
//-----------------------------------------------------------------------------------
"use strict";
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

      let receipeDishDetails = "";
      receipeDishDetails = `<div id="dish-description">
        <div class="card">
            <img src=./img/` + data[0].recipePath + ` class="card-img-top" alt="" id="dish-photo">
            <div class="card-body">
                <h5 class="dish-name"><b>` + data[0].name + `</b></h5>
                <p class="dish-description">` + data[0].description + `</p>
            </div>`

      if (data[0].purchaseable == 1) {
        receipeDishDetails += `<ul class="list-group list-group-flush" id="addToCartDiv">
                <li class="list-group-item" id="dish-price">Price($CAD):  ` + (Math.round(data[0].price * 100) / 100).toFixed(2) + `<span id="numberOfDishes"><a type="button"><img src="/img/subtract.png" id="subtract" class="quantityButton"
                alt="subtractSign"></a><span id="quantity">1</span><a type="button"><img src="/img/add.png"
                id="add" class="quantityButton" alt="addSign"></a></span><span id="add-to-cart"><button type="button" class="btn btn-number" id="addToCartButtonLabel">Add to Cart</button></span></li>
                <li class="list-group-item"><span>Subtotal($CAD): </span><span id="subtotal"></span></li></div>
            </ul>`

      } else {
        receipeDishDetails += `<ul class="list-group list-group-flush">
            <li class="list-group-item" id="dish-price">Price($CAD): N/A</li>
            </ul></div>`
      }

      document.getElementById("recipeDishDetails").innerHTML = receipeDishDetails;

      dishName = data[0].name;
      unitPrice = (Math.round(data[0].price * 100) / 100);
      unitPrice = unitPrice.toFixed(2)
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
    })
    .catch(function (error) {
      console.log(error);
    })

});

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
