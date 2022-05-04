// Loads the skeleton into html docs. 
function loadLoginSkeleton() {
    console.log($('#navbar').load('/text/nav.html'));
    console.log($('#footer').load('/text/footer.html'));
}

loadLoginSkeleton();