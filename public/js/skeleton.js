// Loads the skeleton into HTML docs. 
"use strict";

//-------------------------------------------------------------------------------------------
// This function is called to load the navbar and footer skeletons into the html docs.
//-------------------------------------------------------------------------------------------
function loadSkeleton() {
   $('#navbar').load('/text/nav.html');
   $('#footer').load('/text/footer.html');
}

loadSkeleton();