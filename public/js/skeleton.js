// Loads the skeleton into html docs. 
function loadSkeleton() {
    console.log($('#navbar-container').load('/text/nav.html'));
    console.log($('#footer-container').load('/text/footer.html'));
}

loadSkeleton();