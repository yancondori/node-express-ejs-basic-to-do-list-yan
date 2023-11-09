//jshint esversion:6

// Import the express module to use its functionalities for creating the server.
const express = require("express");

// Import the body-parser module, which is used to parse incoming request bodies before your handlers,
// available under the req.body property.
const bodyParser = require("body-parser");

// Import the date module we created earlier which contains the getDate and getDay functions.
// '__dirname' is a global object in Node which returns the directory of the current module.
const date = require(__dirname + "/date.js");

// Initialize a new express application.
const app = express();

// Set EJS as the templating engine for the express application.
app.set('view engine', 'ejs');

// Use body-parser middleware to parse form data sent via HTTP POST.
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files, such as CSS or JS, from the 'public' directory.
app.use(express.static("public"));

// Items array to store the to-do list items.
//const items = ["Buy Food", "Cook Food", "Eat Food"];

// Separate array to store work-related to-do items.
//const workItems = [];
// This will be a Map instead of an array
const items = new Map();
const workItems = new Map();

// Add some initial items to the Map
items.set('1', 'Buy Food');
items.set('2', 'Cook Food');
items.set('3', 'Eat Food');

// Define a route handler for the root route (homepage).
app.get("/", function (req, res) {
  // Call the getDate function from our date module which returns the current date formatted.
  const day = date.getDate();

  // Convert the Map to an Array of objects for EJS to iterate over
  const itemList = Array.from(items, ([uid, text]) => ({ uid, text }));
  // Render the 'list' EJS template and pass in a JavaScript object containing data for the template.
  // 'listTitle' is set to the current day and 'newListItems' is set to the items in our to-do list.
  res.render("list-map", { listTitle: day, newListItems: itemList });
});

// Define a route handler for HTTP POST requests to the root route.
app.post("/", function (req, res) {
  // Retrieve the new item from the form input named 'newItem' (from the body of the POST request).
  const itemText = req.body.newItem;
  const listName = req.body.list;
  const uid = Date.now().toString(); // Simple UID generator for example purposes

  // Check if the POST request came from the 'Work' list form.

  if (listName === "Work") {
    // If it is from 'Work', add the item to the workItems array.

    workItems.set(uid, itemText);
    // Redirect to the '/work' route which will trigger the GET handler for that route.

    res.redirect("/work");
  } else {
    // If it is from the main list, add the item to the items array.

    items.set(uid, itemText);
    // Redirect back to the root route, which will trigger the GET handler for the root route.

    res.redirect("/");
  }

});

// Define a GET route handler for the '/work' route.
app.get("/work", function (req, res) {
  // Render the 'list' template with 'Work List' as the title and the workItems array for the list items.
  res.render("list-map", { listTitle: "Work List", newListItems: workItems });
});

app.post("/delete", function (req, res) {
  const uidToDelete = req.body.uid;
  if (req.body.listTitle === "Work List") {
    workItems.delete(uidToDelete);
    res.redirect("/work");
  } else {
    items.delete(uidToDelete);
    res.redirect("/");
  }
});

// Define a GET route handler for the '/about' route.
app.get("/about", function (req, res) {
  // Render the 'about' template. No data is passed to the 'about' template.
  res.render("about");
});

// Start the server on port 3000 and log a message to the console once the server is running.
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
