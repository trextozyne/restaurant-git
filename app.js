// app.js
const express = require('express');
const bodyParser = require('body-parser');
// var multer = require('multer');
const cors = require('cors');
let path = require('path');

const restaurant = require('./routes/restaurant.route'); // Imports routes for the restaurants
const menuItem = require('./routes/menu-item.route'); // Imports routes for the restaurants
const category = require('./routes/category.route'); // Imports routes for the restaurants
// initialize our express app
const app = express();

app.use(cors());


app.use(express.static(path.join(__dirname, 'Views')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'not-found')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use('/restaurant', restaurant);
app.use('/category', category);
app.use('/menu-item', menuItem);

//handle 400
app.use((req, res)=> {
    res.status(400);
    res.sendFile(path.resolve('./Views', 'not-found.html'));
});
//handlle 500
app.use((error, req, res, next)=> {
    res.status(500);
    res.sendFile(path.resolve('./Views', 'error-not-found.html'));
});


const port = process.env.PORT || 1987;
app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
