"use strict";
//-------------------------------------------------------------------------------
// This function is called when the recipe/dish upload page first loads. It listens 
// to request on recipe or dish upload and it will then post the upload form data to 
// the server.
//--------------------------------------------------------------------------------
ready(function () {

  let isRecipeOrDish;
  let isPurchaseable = document.getElementById("inputPrice");

  document.getElementById("recipeChoice").addEventListener("change", function (e) {
    e.preventDefault();
    if (document.getElementById("recipeChoice").checked) {
      isPurchaseable.disabled = true;
      isRecipeOrDish = "recipe";
    }
  })

  document.getElementById("dishChoice").addEventListener("change", function (e) {
    e.preventDefault();
    if (document.getElementById("dishChoice").checked) {
      isPurchaseable.disabled = false;
      isRecipeOrDish = "dish";
    }
  })

  const upLoadRecipeDishForm = document.getElementById("upload-recipeDish-form");
  upLoadRecipeDishForm.addEventListener("submit", uploadRecipeDish);

  document.getElementById("finishButton").addEventListener("click", function (e) {
    e.preventDefault();

    let foodPrice = document.getElementById("inputPrice").value;
    let foodName = document.getElementById("inputName").value;
    let foodIngredients = document.getElementById("inputIngredients").value;
    let foodDescription = document.getElementById("inputDescription").value;
    console.log(foodName);

    if (document.getElementById("recipeChoice").checked) {
      if (foodName == "" || foodDescription == "") {
        document.getElementById("uploadForm-status").innerHTML = "Please enter your recipe name and description.";

      } else {
        postData({
          name: foodName,
          description: foodDescription,
          recipeOrDish: isRecipeOrDish,
          ingredient: foodIngredients
        })
        window.location.replace("/kitchenDetails?id=loggedinUser");
      }
    } else if (document.getElementById("dishChoice").checked) {
      if (foodName == "" || foodDescription == "" || foodPrice == "") {
        document.getElementById("uploadForm-status").innerHTML = "Please enter your dish name, price, and description.";

      } else {
        postData({
          name: foodName,
          price: foodPrice,
          description: foodDescription,
          recipeOrDish: isRecipeOrDish
        })
        window.location.replace("/kitchenDetails?id=loggedinUser");
      }
    } else {
      document.getElementById("uploadForm-status").innerHTML = "Please selet uploding a recipe / dish.";
    }

  });
})

//-------------------------------------------------------------------------------------------
// This function rounds the input price field on the recipe/dish upload form to two decimal
// places.  It is called when the user enter a price on the price field.
//-------------------------------------------------------------------------------------------
function round() {
  let price = document.getElementById("inputPrice").value;
  if ((price * 100) % 1 != 0) {
    let roundedPrice = Math.round(price * 100) / 100;
    document.getElementById("inputPrice").value = roundedPrice;
  }
};

//-------------------------------------------------------------------------------------------
// This function listens to a post request to send the recipe/dish upload form data to the 
// server.  It is called when the user clicks the finish button on the recipe/dish upload page.
//-------------------------------------------------------------------------------------------
async function postData(data) {
  try {
    let resObject = await fetch("/upload-recipe-dish", {
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

//-------------------------------------------------------------------------------------------
// This function listens to a post request to send the uploaded image file data to the server.
// It is called when the user clicks the upload photo button on the recipe/dish upload page.
//-------------------------------------------------------------------------------------------
async function uploadRecipeDish(e) {
  e.preventDefault();

  const recipeDishUpload = document.querySelector('#recipeDish-upload');
  const recipeDishForm = new FormData();

  for (let i = 0; i < recipeDishUpload.files.length; i++) {
    recipeDishForm.append("files", recipeDishUpload.files[i]);
  }

  const options = {
    method: 'POST',
    body: recipeDishForm
  };

  fetch("/upload-recipe-dish-photo", options).then(async function (res) {
    let parsedData = await res.json();
    if (parsedData.status == "success") {
      document.getElementById("upload-status").innerHTML = parsedData.msg;
    }
  }).catch(function (err) {
    ("Error:", err)
  });

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