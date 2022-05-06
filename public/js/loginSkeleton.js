// Loads the skeleton into html docs. 
"use strict";
function loadLoginSkeleton() {
    console.log($('#login_navbar').load('/text/loginNav.html'));
    console.log($('#footer').load('/text/footer.html'));
}

loadLoginSkeleton();