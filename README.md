## Title: A Bite of Home
* [Project Description](#project-description)
* [Technologies Used](#technologies-used)
* [File Contents](#file-contents)
* [How to work on the project](#how-to-work-on-the-project)
* [Resources and Reference](#resources-and-reference)
* [Contact](#contact)

## Project Description
A Bite of Home is a web application that helps home chefs to start their private kitchen business easily and share their secret recipes and to help busy people purchase and enjoy homemade meals.
	
## Technologies Used
Technologies used for this project:
* HTML, CSS
* Bootstrap
* JavaScript
* Node.js and Express
* MySQL database
* HeroKu
* Fetch API
* Google Maps Javascript API
* Google Geocoding API
* Geolocation API
* JSON
	
## File Contents
Content of the project folder:

```
 Top level of project folder and files: 

├── app         # Folder for html and data folder

        ├── html        # Folder for html files
        
                ├── login.html                  # the login page, it prompts the user to log in
                ├── signUp.html                 # the sign up page, it prompts the user to create an account
                ├── profile.html                # the landing profile page after the user is logged in
                ├── kitchenMap.html             # the private kitchen map page, the user can view registered kitchens on a Google map
                ├── kitchenRegistration.html    # the private kitchen registration page, it prompts the user to register a private kitchen
                ├── upload.html                 # the recipe/dish upload page, it asks the user to upload recipes/dishes for the registered private kitchen
                ├── kitchenDetails.html         # the private kitchen detail page, it shows the list of recipes and dishes
                ├── addToCart.html              # the dish detail page, it prompts the user to add the dish item(s) to the shopping cart
                ├── myCart.html                 # the shopping cart page, shows a list of the current shopping cart and the history order
                ├── kitchenOrder.html           # the private kitchen order page, it shows a list of the dish items ordered by the customers
                ├── contact.html                # the contact page, it shows the deveoper information

├── public      # Folder for font, img, mp3, css, js, and text folder

        ├── font        # Folder for font data

                ├── lato_light          # lato_light font data
                ├── on_my_way           # on_my_way font data

        ├── img        # Folder for images used and uploaded

                ├── avatar_d.png
                ├── avatar_testing.png
                ├── defaultAvatar.jpg
                ├── knife.png:          https://www.kindpng.com/imgv/ommTxh_transparent-knives-png-kitchen-knife-png-transparent-png/
                ├── Logo.PNG
                ├── spices.jpg:         https://unsplash.com/photos/vA1L1jRTM70?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink
                ├── chefHat.png:        http://www.qcustomclothing.com/white-chef-hat/374830/p
                ├── trash.jpg:          https://www.flaticon.com/free-icon/trash_3096673?term=trash&page=1&position=1&page=1&position=1&related_id=3096673&origin=tag
                ├── add.png:            https://www.flaticon.com/premium-icon/add_3024515?term=add&page=1&position=9&page=1&position=9&related_id=3024515&origin=search
                ├── subtract.png:       https://www.flaticon.com/premium-icon/minimize_3024571?related_id=3024571&origin=pack

        ├── mp3        # Folder for mp3 audio used

                ├── crunch.mp3          # crunch sound

        ├── css        # Folder for css files

                ├── font.css                   # font style for all html pages
                ├── navbarFooter.css           # navbar and footer styles
                ├── login.css                  # login page style
                ├── signUp.css                 # sign up page style
                ├── profiel.css                # profile page style
                ├── kitchenMap.css             # private kitchen map page style
                ├── kitchenRegistration.css    # private kitchen registration page style
                ├── upload.css                 # recipe/dish upload page style
                ├── kitchenDetails.css         # private kitchen detial page style
                ├── addToCart.css              # recipe/dish detail page style
                ├── myCart.css                 # shopping cart page style
                ├── kitchenOrder.css           # private kitchen order page style
                ├── contact.css                # contact page style

        ├── js        # Folder for client-side JavaScript files

                ├── client.js           # sign in page function
                ├── loginSkeleton.js    # loads the login page navbar and footer templates
                ├── skeleton.js         # loads the navbar and footer templates for pages other than the login page
                ├── signUp.js           # sign up page function
                ├── profiel.js          # profile page function
                ├── avatarUpload.js     # profile image upload function
                ├── kitchenMap.js       # private kitchen map page function
                ├── registerKitchen.js  # private kitchen registration page function
                ├── upload.js           # recipe/dish upload page function
                ├── kitchenDetails.js   # private kitchen detial page function
                ├── addToCart.js        # recipe/dish detail page pfunction
                ├── shoppingCart.js     # shopping cart page function
                ├── contact.js          # Easter eggs on the contact page

        ├── text        # Folder for Nav and footer layout.

                ├── footer.html         # footer layout for the overall page
                ├── loginNav.html       # navigation bar for the login page
                ├── nav.html            # navigation bar for pages other than the login page

├── sql      # Folder for sql files

        ├── comp2800.sql       # database and table schemas for the app
        ├── addUser.sql        # add user data to the database table

├── .git                     # Folder for git repo

├── server.js           # the express server JavaScript file
├── hosting.js          # a duplicate of the server.js file to run on Heroku with clearDB database
├── Procfile            # execute the entry hosting.js fro the deployed app
├── .gitignore          # Git ignore file
└── README.md           # woah, you're reading this now!
```

## How to work on the project

1. Tools or softwares needed:
* language(s): JavaScript, CSS, HTML
* IDEs: choose one of your choice 
* Database(s): MySQL and clearDB
* Web server: Node.js and Express.js
* Hosting: Heroku      


2. Node.js packages required:
* express
* express-session
* mysql2/promise
* fs
* jsdom
* multer

3. APIs used:
* Fetch API
* Geolocation API
* Google Maps JavaScript API
* Google Geocoding API

4. Instruction steps:
        a. Clone the repo to your local computer
        b. Download and install Node.js
        c. npm install the required node packages as listed above
        d. Download, install, and configure MySQl (or use a software distribution platform such as XAMPP)
        e. Run the sql file to set up the database and tables
        f. Download and isntall Heroku and add the clearDB adds-on
        e. Follow the hosting instruction when deploying the app on Heroku (<a href="https://docs.google.com/document/d/1OnuuTzOxSyabAC3ZbcVcGcFtAuglWvNnpsQ0b0NmYnI/edit?usp=sharing">hosting instruction</a>)

5. Test logs:
* <a href="https://docs.google.com/spreadsheets/d/1BaGcirS0AbYg3EW1lw9u5DNY-KnCG-EgBnTn_Z_cFP0/edit?usp=sharing">Testing history</a>

## How to use the product features
* Find private kitchens: 
Click on the "Find Recipe/Dish" button to redirect to the kitchen map page.  A google map is diplayed and centered based on the logged-in user's device lcoation.  Click on the markers to look at the private kitchen name and address detail.  Click on the "View Detail" button to see the private kitchen detail.

* Register private kitchen: 
Click on the "Register My Private Kitchen" to redirect to the kitchen registration page.  Fill in the form to register your private kitchen.  Your private kitchen address will now be displayed as a marker on the map.

* Upload recipe/dish: 
Click on the "View My Private Kitchen's Details" button to redirect to your kitchen detail page.  Click on the "Add Recipe/dish" button to redirect to the recipe/dish upload page.  Fill in the form to upload recipe/dish.

* Order dish: 
Go to the private kitchen map and select a private kithen to view its list of dishes availiable to order.  Click on the "View" button to see the dish detail.  Select the dish quantity and click on the "Add to cart" button to add the dish to the shopping cart.

* Edit shopping cart: 
Click on the +/- button to adjust the item quantity.  Click on the trash can button to delete one item.  Click on the "Delete Cart" button to delete the entire shopping cart. Click on the "Checkout" button to submit the order.

* View order history: 
View your order history list on the "My Cart History" section on the shopping cart page.  Click on the "View" button on each row to expand a window that displays the order details.  Click on the "View" button again to collapse the window.

* View incoming dish order:  
If you are a registered private kitchen owner, click on the "My Private Kitchen's Orders" button to see a list of the dishes ordered by the customers.

* Signup: 
Click on the sign up button to redirec to the sign up page.  Fill in the form to create a new account.  

* Signin: 
Sign in with your credentials to use the app. 

* Update profile: 
Click on the "Choose Files" button to selet an image to be uploaded.  Click on the "Upload" button to upload the image.  Click on "Edit" button to edit the user information.  Click on the "Save" button to save the information.

* Admin user function: 
View a user dashboard list on the profile page.  Use the "Add User" card to create a new user.  Use the "Admin User" toggle button to set the new user as admin or not.  Click on the "Add User" button to submit the form.  Click on the "Edit" button on each row of the dashboard list to update the username and password of that user.  Click on the "Save" button the submit the information.  Click on the "Delete" button to delete that user.

* View contact: 
Click on the Contact text on the footer to redirect to the contact page and see the developer information

* Easter egg: 
Click on the Contact text on the footer to redirect to the contact page.  Click on the "Bite" word on the title 4 times to see a chef hat added to the developers' profile photo and a crucnh sound is made.

## Resources and Reference
- In-app icons from Feather v4.28.0 (Open Source https://feathericons.com/)
- Wood Pattern background: "https://www.transparenttextures.com/patterns/wood-pattern.png"

## Contact 
* Justin Ng - jng193@my.bcit.ca - https://github.com/Katsumac
* JinRong Jian (Lucas) - jrong8018@gmail.com - https://github.com/lucasj8018
* Owen George - owengeorge@outlook.com - https://github.com/ogeorge03
* Sarah Dong - sarahdn13@icloud.com - https://github.com/SarahDong123 

## Acknowledgements 
* <a href="https://fontawesome.com/">Font Awesome</a>
* <a href="https://fonts.adobe.com/">Adobe Fonts</a> 
* <a href="https://fonts.google.com/">Google Fonts</a>