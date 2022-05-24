// Loads the skeleton into html docs. 
"use strict";

//-------------------------------------------------------------------------------------------
// This function is called to lod the login navbar and footer to the login.html doc.
//-------------------------------------------------------------------------------------------
function loadLoginSkeleton() {
    $('#login_navbar').load('/text/loginNav.html');
    $('#footer').load('/text/footer.html');
}

loadLoginSkeleton();