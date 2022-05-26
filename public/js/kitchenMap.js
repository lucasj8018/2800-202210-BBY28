"use strict";
var map;
var geocoder;
var addressData;
var google;

//----------------------------------------------------------------------------------------
// This function is called when the kitchenMap.html page finishes loading. It sends a
// request to the server to retrieve the addresses of the registrated private kitchen
// from the database
//----------------------------------------------------------------------------------------
ready(function () {

  window.initMap = initMap;

  fetch("/map-data")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      addressData = data;
      geocodeAddress();
    })
    .catch(function (error) {
      console.log(error);
    })

});

//-------------------------------------------------------------------------------------------
// This initMap() function template cames from Google's Map JavaScript API document example.
// This function is called when the Find Private Kitchen page loads and it add a Google map
// that is centered based on the geolocation of the user's device.
//-------------------------------------------------------------------------------------------
async function initMap() {
  
  geocoder = new google.maps.Geocoder();

  var location = {
    lat: 49.1887857,
    lng: -122.742487
  };

  var options = {
    center: location,
    zoom: 14
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (loc) {
      location.lat = loc.coords.latitude;
      location.lng = loc.coords.longitude;
      map = new google.maps.Map(document.getElementById("map"), options);

    })
  } else {
    console.log("geolocation not supported");
    map = new google.maps.Map(document.getElementById("map"), options);
  }

}

//-------------------------------------------------------------------------------------------
// This function is called when the function initMap() is executed. It reads the registered 
// private kitchen address of the user and geocode it into the latitude and longtitude value 
// with Google's geocoder API. It then sets a marker on the app and a popup window event 
// listener is also added to display the kitchen info when clicked on.
//-------------------------------------------------------------------------------------------
function geocodeAddress() {

  for (let i = 0; i < addressData.length; i++) {
    if (addressData[i].location !== null) {
      geocoder.geocode({
        'address': addressData[i].location
      }, function (results, status) {
        if (status == "OK") {
          // map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          })
  
          // Display some popup info for each location marker
          const contentString =
            `<div class="card" style="width: 18rem;">
                <img src="" class="card-img-top" alt="">
                <div class="card-body">
                  <h5 class="card-title">` + addressData[i].kitchenName + `</h5>
                  <p class="card-text">` + addressData[i].location + `</p>
                  <a href="/kitchenDetails?id=` + addressData[i].id + `" class="btn btn-danger">View Kitchen</a>
                </div>
                </div>`;
  
          const infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
  
          marker.addListener("click", function () {
            infowindow.open({
              anchor: marker,
              map,
              shouldFocus: false,
            });
          });
  
        } else {
        }
      })
    } else {
    }
  }
}

//-------------------------------------------------------------------------------------------
// This function is called to check whether the page is loaded.
//-------------------------------------------------------------------------------------------
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}