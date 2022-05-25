// Loads the login skeleton into HTML docs. 
"use strict";

//-------------------------------------------------------------------------------------------
// This function is called to load the login navbar and footer to the login.html doc.
//-------------------------------------------------------------------------------------------
function loadLoginSkeleton() {
    $('#login_navbar').load('/text/loginNav.html');
    $('#footer').load('/text/footer.html');
}

loadLoginSkeleton();