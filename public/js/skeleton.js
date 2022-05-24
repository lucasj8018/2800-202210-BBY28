"use strict";

//-------------------------------------------------------------------------------------------
// This function is called to loads the navbar and footer skeletons into the html docs.
//-------------------------------------------------------------------------------------------
function loadSkeleton() {
   $('#navbar').load('/text/nav.html');
   $('#footer').load('/text/footer.html');
}

loadSkeleton();