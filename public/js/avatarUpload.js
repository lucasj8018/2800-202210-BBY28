//----------------------------------------------------------------------------------
// This function is called when the private kitchen registration page first loads. 
// It posts the registration form data to the server.
//----------------------------------------------------------------------------------
"use strict";
ready(function () {

  const upLoadAvatarForm = document.getElementById("upload-avatar-form");
  upLoadAvatarForm.addEventListener("submit", uploadAvatar);

  function uploadAvatar(e) {
    e.preventDefault();

    const avatarUpload = document.querySelector('#avatar-upload');
    const avatarFormData = new FormData();

    if (avatarUpload.files.length != 0) {
      for (let i = 0; i < avatarUpload.files.length; i++) {
        // put the images from the input into the form data
        avatarFormData.append("files", avatarUpload.files[i]);
      }
  
      const options = {
        method: 'POST',
        body: avatarFormData
      };
  
      fetch("/upload-avatar", options).then(async function (res) {
        let parsedData = await res.json();
        if (parsedData.status == "success") {
          window.location.replace("/profile");
        }
      }).catch(function (err) {
        ("Error:", err)
      });

    } else {
      document.getElementById("upload-status").innerHTML = "Please select an image first";
    }
  }
});

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