//-----------------------------------------------------------------------------------
// 
//-----------------------------------------------------------------------------------
"use strict";
ready(async function () {
  var url = document.URL;
  var id = url.substring(url.lastIndexOf('=') + 1);

  fetch("/kitchen-details?id=" + id)
    .then((response) => {
      return response.json();
    })
    .then((data) => {

      if (id == data[data.length - 1].loggedinId || id == "loggedinUser") {
        document.getElementById("addButtonDIV").innerHTML = "<a id='addButton' href='/upload'>Add recipe/dish</a>"
      }

      let recipeTable = "";
      let dishTable = "";
       recipeTable = "<p id='dishesTitle'>Recipes</p><table>"
       dishTable = "<p id='dishesTitle'>Dishes</p><table>"

      for (let i = 0; i < data.length - 1; i++) {
        if (data[i].purchaseable == 0) {
          recipeTable += "<tr>" +
            "<td><img src='./img/" + data[i].recipePath + "' width='100' height='100' class='foodImg' alt='dishImg'></td>" +
            "<td><p class='name'>" + data[i].name + "</p></td>" +
            "<td><a class='viewButton' href='#'>View Dish</a></td>" +
            "</tr>";

        } else if (data[i].purchaseable == 1) {
          dishTable += "<tr>" +
            "<td><img src='./img/" + data[i].recipePath + "' width='100' height='100' class='foodImg' alt='dishImg'></td>" +
            "<td><p class='name'>" + data[i].name + "</p></td>" +
            "<td><a class='viewButton' href='#'>View Dish</a></td>" +
            "</tr>";

        }
      }
      recipeTable += "</table>";
      dishTable += "</table>";

      document.getElementById("recipes").innerHTML = recipeTable;
      document.getElementById("dishes").innerHTML = dishTable;

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
