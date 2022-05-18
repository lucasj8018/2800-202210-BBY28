"use strict";
ready(async function () {

  fetch("/displayShoppingCart")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (data[0].recipePath == "EmptyShoppingCart"){
      // If the shopping cart is empty it will prompt the user to go to the map to add items.
      document.getElementById("shoppingCart").innerHTML = "<h1>Shopping Cart is Empty.</h1><h2><a href='/map'>Head to the map to add some items!</a></h2>";

    } else {
      // Populates shopping cart table with items the user has added
      let shoppingCartTable = "<h1>Your Order</h1><table id='cartTable' class='table table-light table-striped'>";
      shoppingCartTable += "<tr><th>Image</th><th>Name</th><th>Price</th><th>Quantity</th><th></th></tr>";
      for (let i = 0; i < data.length; i++){
        shoppingCartTable += "<tr>" +
        "<td><img src='./img/" + data[i].recipePath + "' width='100' height='100' alt='cartImg'></td>" +
        "<td>" + data[i].name + "</td>" +
        "<td>$" + data[i].price + "</td>" +
        "<td><button name='" + data[i].cookID + "_" + data[i].recipeID + "' onclick='subQuantity(this.name)'>-</button> " + data[i].quantity +
        " <button name='" + data[i].cookID + "_" + data[i].recipeID + "' onclick='addQuantity(this.name)'>+</button>" +
        "<br/><div id='" + data[i].cookID + "_" + data[i].recipeID + "_sub'></div></td>" +
        "<td><button name='" + data[i].cookID + "_" + data[i].recipeID + "' onclick='deleteItemClicked(this.name)'>Delete</button></td>" +
        "</tr>"
      }
      shoppingCartTable += "</table>";

      document.getElementById("shoppingCart").innerHTML = shoppingCartTable;
    }


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
      console.log(parsedData.id);
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
// This function checks whether page is loaded.
//-----------------------------------------------------------------------------------------------
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}