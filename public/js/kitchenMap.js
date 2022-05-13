"use strict";
var map;
var geocoder;
var addressData;

//----------------------------------------------------------------------------------------
// This function is called when the kitchenMap.html page finishes loading. It sends a
// request to the server to retrieve the addresses of the registrated pritvate kitchen
// from the database
//----------------------------------------------------------------------------------------
ready(function () {

  fetch("/map-data")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      addressData = data;
      console.log(addressData);
      geocodeAddress();
    })
    .catch(function (error) {
      console.log(error);
    })

});

//-------------------------------------------------------------------------------------------
// This initMap() function template cames from Google's maps javascript API document example.
// This function is called when the Find Private Kitchen page loads and it add a google map
// that is centered based on the geolocation of the user's device.
//-------------------------------------------------------------------------------------------
function initMap() {
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
  geocoder = new google.maps.Geocoder();

}

window.initMap = initMap;



//-------------------------------------------------------------------------------------------
// This function is called when the function initMap() is executed.  It reads the registered 
// private kitchen address of the user and geocode it into the latitude and longtitude value 
// with Google's geocoder API.  It then sets a marker on the app and a popup window event 
// listerner is also added to display the kitchen info when clicked on.
//-------------------------------------------------------------------------------------------
function geocodeAddress() {

  for (let i = 0; i < addressData.length; i++) {
    if (addressData[i] !== null) {
      geocoder.geocode({
        'address': addressData[i]
      }, function (results, status) {
        if (status == "OK") {
          console.log(status);
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          })
  
          // Display some popup info for each location marker
          const contentString =
            `<div class="card" style="width: 18rem;">
                <img src="" class="card-img-top" alt="">
                <div class="card-body">
                  <h5 class="card-title">Private Kitchen Title</h5>
                  <p class="card-text">Some description / Address.</p>
                  <a href="" class="btn btn-primary">View Details</a>
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
          console.log("Geocoding failed due to " + status);
        }
      })
    } else {
      console.log(1);
    }
  }
}


// This function checks whether page is loaded
function ready(callbackFunc) {
  if (document.readyState != "loading") {
    callbackFunc();
  } else {
    document.addEventListener("DOMContentLoaded", callbackFunc);
  }
}