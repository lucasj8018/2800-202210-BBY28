"use strict";


ready(async function () {

  fetch("/displayShoppingCart")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (data[0].recipePath == "EmptyShoppingCart"){
      // If the shopping cart is empty it will prompt the user to go to the map to add items.
      document.getElementById("shoppingCart").innerHTML = "<p id='emptyCartMsg'>Shopping Cart is Empty.</p><h2><a id='mapLink' href='/map'>Head to the map to add some items!</a></h2>";
    } else {
      // Populates shopping cart table with items the user has added
      let shoppingCartTable = "<table id='cartTable'>";
      shoppingCartTable += "<tr id='tableHeader'><td id='imageCol'><b>Image</b></td><td id='dishCol'><b>Dish</b></td><td id='priceCol'><b>Price</b></td><td id='quantityCol'><b>Quantity</b></td><td id='deleteCol'></td></tr>";
      for (let i = 0; i < data.length; i++){
        shoppingCartTable += "<tr>" +
        "<td><img src='./img/" + data[i].recipePath + "' id='image' alt='cartImg'></td>" +
        "<td id='dish' class='name'>" + data[i].name + "</td>" +
        "<td id='price' class='money' name='itemPrice'>$" + data[i].price + "</td>" +
        "<td><input type='image' src='/img/subtract.png' id='subtract' class='quantityButton' alt='subtractSign' name=" + data[i].cookID + "_" + data[i].recipeID + "' onclick='subQuantity(this.name)'><span class='quantity' name='quantity'>" + data[i].quantity +
        "</span><input type='image' src='/img/add.png' id='add' class='quantityButton' alt='addSign' name='" + data[i].cookID + "_" + data[i].recipeID + "' onclick='addQuantity(this.name)'>" +
        "<br/><div id='" + data[i].cookID + "_" + data[i].recipeID + "_sub'></div></td>" +
        "<td><input type='image' src='/img/trash.png' class='itemDelete' name='" + data[i].cookID + "_" + data[i].recipeID + "' onclick='deleteItemClicked(this.name)'></td>" +
        "</tr>"
      }

      shoppingCartTable += "</table><div id='cartMenu'><p id='total'><span id='totalItems'></span><span id='totalPrice'></span></p>" +
      "<div id='checkoutDiv'><button type='button' id='deleteCartButton' class='btn btn-outline-info'>Delete Cart</button>" +
      "<p class='cartStatus'>Status: <span id='completion' class='status'>Incomplete</span></p>" +
          "<button type='button' id='checkout' class='btn btn-outline-info'>Checkout</button>" +
      "</div>";

      shoppingCartTable += "<p id='totalItems'></p><p id='totalPrice'></p>";
      document.getElementById("shoppingCart").innerHTML = shoppingCartTable;

    document.getElementById("deleteCartButton").addEventListener("click", function (){
      document.getElementById("cartMenu").innerHTML = "<span id='deleteCartMsg'>Delete Shopping Cart?</span><br/><br/>";
      let confirmButton = document.createElement('button');
      confirmButton.innerText = "Confirm";
      confirmButton.className = 'btn btn-success'
      confirmButton.onclick = function(){
        postDeleteItem({
          cookID: -1,
          recipeID: -1
        });
      };
      document.getElementById("cartMenu").appendChild(confirmButton);


      let cancelButton = document.createElement('button');
      cancelButton.innerText = "Cancel";
      cancelButton.className = 'btn btn-danger'
      cancelButton.onclick = function(){
        location.reload();
      };
      document.getElementById("cartMenu").appendChild(cancelButton);

    });
    document.getElementById('checkout').addEventListener("click", function (){
      document.getElementById("cartMenu").innerHTML = "<span id='checkoutMsg'>Checkout?</span><br/><br/>";
      let confirmButton = document.createElement('a');
      confirmButton.innerText = "Confirm";
      confirmButton.className = 'btn btn-success'
      confirmButton.href = "/checkoutCart"
      document.getElementById("cartMenu").appendChild(confirmButton);


      let cancelButton = document.createElement('button');
      cancelButton.innerText = "Cancel";
      cancelButton.className = 'btn btn-danger'
      cancelButton.onclick = function(){
        location.reload();
      };
      document.getElementById("cartMenu").appendChild(cancelButton);
    });

    let prices = document.getElementsByName("itemPrice");
    let totalPrice = 0;
    let quantities = document.getElementsByName("quantity");
    let totalQuantity = 0;

    for (let i = 0; i < prices.length; i++){
      let price = prices[i].innerText;
      price = price.substring(1);
      totalPrice += parseFloat(price) * parseInt(quantities[i].innerText);
      totalQuantity += parseInt(quantities[i].innerText);
    }

    totalPrice = Math.ceil(totalPrice * 100) / 100;
    totalPrice = totalPrice.toFixed(2);
    document.getElementById("totalPrice").innerText = "Total Price: $" + totalPrice;
    document.getElementById("totalItems").innerText = "Total Items: " + totalQuantity;
    }

  })
  .catch (function (error){
    console.log(error);
  })

  fetch("/displayPreviousCarts")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let prevcart = `<table id="cartHistoryTable">
    <tr id="tableHistoryHeader">
        <td id="dateCol"><b>Date</b></td>
        <td id="statusCol"><b>Status</b></td>
        <td id="viewCol"></td>
    </tr>`;
    for (let i = 0; i < data.length; i++){
      prevcart += `<tr><td>` + data[i].timestamp + `</td>
      <td class='status'>Complete</td>
      <td>
      <p>
      <button class="btn btn-danger" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample`+ data[i].historyID +`" 
      aria-expanded="false" aria-controls="collapseExample" name=`+ data[i].historyID +` id="button`+ data[i].historyID +`" onclick="displayPreviousOrder(this.name)">
        View
      </button>
      </p>      
      </td>
      </tr>
      <tr><td colspan="3">
      <div class="collapse" id="collapseExample`+ data[i].historyID +`">
      <div class="card card-body" id="prevOrder`+ data[i].historyID +`"></div>
      </div>
      </td></tr>`
    }
    prevcart += `</table>`;
    document.getElementById("shoppingCartHistory").innerHTML = prevcart;
  })
  .catch (function (error){
    console.log(error);
  })
});

async function postDeleteItem(data){
  try {
    let resObject = await fetch("/deleteCartItem", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedData = await resObject.json();
    if (parsedData.status == "success"){
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

async function postSubQuantity(data){
  try {
    let resObject = await fetch("/subQuantity", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedData = await resObject.json();
    if (parsedData.status == "success"){
      location.reload();
    } else {
      document.getElementById(parsedData.id).innerHTML = "Cannot have a quantity less than zero.";
    }
  } catch (error) {
    console.log(error);
  }
}

async function postAddQuantity(data){
  try {
    let resObject = await fetch("/addQuantity", {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(data)
    });
    let parsedData = await resObject.json();
    if (parsedData.status == "success"){
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

function deleteItemClicked(name){
  let ids = name.split('_');
  let cook = ids[0];
  let recipe = ids[1];
  postDeleteItem({
    cookID: cook,
    recipeID: recipe
  });
}

function subQuantity(name){
  let ids = name.split('_');
  let cook = ids[0];
  let recipe = ids[1];
  postSubQuantity({
    cookID: cook,
    recipeID: recipe
  })
}

function addQuantity(name){
  let ids = name.split('_');
  let cook = ids[0];
  let recipe = ids[1];
  postAddQuantity({
    cookID: cook,
    recipeID: recipe
  })
}

//----------------------------------------------------------------------------------------------
// This function listens to a get request to populate the order history as a list.  Each list 
// item has the total price and quantity of the entire order and eahc dish item has teh image,
// name, unit price, and ordered quantity.  This function is called when the user clicks the 
// view button for each order.
//----------------------------------------------------------------------------------------------
function displayPreviousOrder(name) {
  fetch("/displayPreviousOrder?id=" + name)
  .then((response) => {
    return response.json();
  })
  .then((data) => {

    let orderId = data[0].orderId;
    let totalPrice = 0;
    let totalQty = 0;

    // Populates the previous shopping cart table with the dish items that the user has added
    let previousCartTable = "<table id='cartTable2' class='table table-light table-striped'>";
    previousCartTable += "<tr><th>Image</th><th>Name</th><th>Price</th><th>Quantity</th></tr>";
    for (let i = 0; i < data.length; i++){
      totalQty += parseInt(data[i].quantity);
      totalPrice += data[i].price * data[i].quantity;

      previousCartTable += "<tr>" +
      "<td><img src='./img/" + data[i].recipePath + "' width='100' height='100' alt='cartImg'></td>" +
      "<td>" + data[i].name + "</td>" +
      "<td>$" + data[i].price + "</td>" +
      "<td>" + data[i].quantity + "</td>" +
      "</tr>"
    }
    previousCartTable += "</table>";
    let orderInfo = "<h2>Your Order</h2><h2>Total Price: $"+ totalPrice.toFixed(2) +"</h2><h2>Total Items: "+ totalQty +"</h2>";
    orderInfo += previousCartTable;

    document.getElementById("prevOrder" + orderId).innerHTML = orderInfo;
    
  })
  .catch (function (error){
    console.log(error);
  })
}

//----------------------------------------------------------------------------------------------
// This function checks whether page is loaded.
//----------------------------------------------------------------------------------------------
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}
