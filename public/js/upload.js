//-------------------------------------------------------------------------------
// This function is called when the recipe/dish upload page first loads. It listens 
// to request on recipe or dish uplad and it will then post the upload form data to 
// the server.
//--------------------------------------------------------------------------------
"use strict";
ready(function () {

    let isRecipeOrDish;
    let isPurchaseable = document.getElementById("inputPrice");

    document.getElementById("recipeChoice").addEventListener("change", function(e) {
        e.preventDefault();
        if (document.getElementById("recipeChoice").checked) {
            isPurchaseable.disabled = true;
            isRecipeOrDish= "recipe";
        } 
    })

    document.getElementById("dishChoice").addEventListener("change", function(e) {
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
            postData({
                name: foodName,
                description: foodDescription,
                recipeOrDish: isRecipeOrDish
            })

        } else if (document.getElementById("dishChoice").checked) {
            postData({
                name: foodName,
                price: foodPrice,
                description: foodDescription,
                recipeOrDish: isRecipeOrDish
            })
        }
        window.location.replace("/kitchenDetails?id=loggedinUser");

    });
})

function round() {
    let price = document.getElementById("inputPrice").value;
    if ((price * 100) % 1 != 0) {
        let roundedPrice = Math.round(price * 100) / 100;
        document.getElementById("inputPrice").value = roundedPrice;
    }
};


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

  async function uploadRecipeDish(e) {
    e.preventDefault();

    const recipeDishUpload = document.querySelector('#recipeDish-upload');
    const recipeDishForm = new FormData();

    for (let i = 0; i < recipeDishUpload.files.length; i++) {
      // put the images from the input into the form data
      recipeDishForm.append("files", recipeDishUpload.files[i]);
    }

    const options = {
      method: 'POST',
      body: recipeDishForm
    };

    document.getElementById("upload-status").innerHTML = "Photo uploaded"

    fetch("/upload-recipe-dish-photo", options).then(function (res) {
    }).catch(function (err) {
      ("Error:", err)
    });

  }


  // This function checks whether page is loaded
function ready(callbackFunc) {
    if (document.readyState != "loading") {
        callbackFunc();
    } else {
        document.addEventListener("DOMContentLoaded", callbackFunc);
    }
}