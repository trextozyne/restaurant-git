const uuidv1 = require('uuid/v1');
var path = require('path');

var fs = require('fs');
const MenuItem = require('../models/menu-item.model');
var restaurant_order = require('../controllers/restaurant.controller');

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function getFileContent(srcPath, callback) {
    // console.log(srcPath);
    fs.readFile(srcPath, 'utf8', function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
}

function writeFileContent(savPaths, menuItem) {
    let styles = `<style>
                    body {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
                    .string { color: green; }
                    .number { color: darkorange; }
                    .boolean { color: blue; }
                    .null { color: magenta; }
                    .key { color: red; }
                </style>`;
    let jsonContent = JSON.stringify(menuItem, undefined, 4);

    let jsonHtmlContent =`<pre> ${syntaxHighlight(jsonContent)} </pre>`;
    let content = [];
    content.push(jsonContent, jsonHtmlContent);

    for (let i = 0; i < savPaths.split(',').length; i++) {
        fs.access(savPaths.split(',')[i], error => {
            if (!error) {
                getFileContent(savPaths.split(',')[0], function (data) {
                    doWriteJsonFile(data);
                });
            } else {
                if (i === 1)content[i] = styles + content[i];
                console.log(menuItem);
                fs.writeFile(savPaths.split(',')[i], content[i], function (err) {
                    if (err) throw err;
                    console.log('complete');
                });
            }
        });

        function doWriteJsonFile(data) {
            let menuItems ;
            menuItems = JSON.parse(data); //now it an object
            menuItems.menu.push(menuItem.menu[0]); //add some data

            let jsonContent = JSON.stringify(menuItems, undefined, 4);

            let jsonHtmlContent =styles + `<pre> ${syntaxHighlight(jsonContent)} </pre>`;
            content = [];
            content.push(jsonContent, jsonHtmlContent);
            fs.writeFile(savPaths.split(',')[i], content[i], function (err) {
                if (err) throw err;
                console.log('complete');
            });
        }
    }
}

exports.read = function (req, res) {
    getFileContent('./views/all-data/menu-item-data.html', function(data) {
        let json = JSON.parse(data);
        res.send(json);//.slice(0, menu-item-data.indexOf('<script>'))
    });
    console.log('complete');
};

function checkItemOrderAvailable (menuItemId){
    let boolFind = false;
    getFileContent('./views/all-data/data.html', function(data) {
        let json = JSON.parse(data);
        console.log(json.completeOrder);
        if(typeof json.completeOrder.find(item => item.menuItemId === menuItemId) !== "undefined")
            boolFind = true;
    });
    return boolFind;
}

exports.update = function (req, res) {
    getFileContent('./views/all-data/menu-item-data.html', function (data) {
        let json = JSON.parse(data);
        // res.send(json);//.slice(0, data.indexOf('<script>'))
        for (let i=0; i<json.menu.length; i++){
            if (json.menu[i].menuItemId === req.params.menuItemId) {
                //OR
                // json.menu[i] = {};
                // json.menu[i] = req.body;

                json.menu[i].itemName = req.body.itemName ? req.body.itemName : json.menu[i].itemName;
                json.menu[i].itemDescription = req.body.itemDescription ? req.body.itemDescription : json.menu[i].itemDescription;
                json.menu[i].itemIngredients = req.body.itemIngredients ? req.body.itemIngredients : json.menu[i].itemIngredients;
                json.menu[i].itemRecipe = req.body.itemRecipe ? req.body.itemRecipe : json.menu[i].itemRecipe;
                json.menu[i].itemPrice = req.body.itemPrice ? req.body.itemPrice : json.menu[i].itemPrice;
                json.menu[i].itemActive =  json.menu[i].itemActive === false ? false : checkItemOrderAvailable(req.params.menuItemId);
                json.menu[i].itemCategoryId = req.body.itemCategoryId ? req.body.itemCategoryId : json.menu[i].itemCategoryId;

                if (req.file)
                    fs.unlinkSync(json.menu[i].itemImgPath.toString());

                json.menu[i].itemImgName = req.file ? req.file.path : json.menu[i].itemImgName;
                json.menu[i].itemImgPath = req.file ? req.file.filename : json.menu[i].itemImgPath;
                break;
            }
        }

        let dir = ['./views/all-data/menu-item-data.html','./views/all-data/menu-item-json.html'];
        dir.forEach(function(filePath, index) {
            fs.access(filePath, error => {
                if (!error) {
                    fs.unlinkSync(filePath, function (error) {
                        console.log(error);
                    });
                } else {
                    console.log(error);
                }
            });
            if (index === dir.length - 1)
                setTimeout(()=>{
                    writeFileContent('./views/all-data/menu-item-data.html,./views/all-data/menu-item-json.html', json);
                }, 1000);
        });
    });
    res.send('complete');
};

exports.delete = function (req, res) {
    getFileContent('./views/all-data/menu-item-data.html', function (data) {
        let json = JSON.parse(data);
        json = json.menu.find(item => item.menuItemId === req.params.menuItemId);
        (json === "" || json === null) ? res.status(400) : res.status(200);

        if (res.statusCode === 200) {
        for (let i=0; i<json.menu.length; i++){
            if (json.menu[i].menuItemId === req.params.menuItemId) {
                json.menu.splice(i, 1);
                i--;//so it dont skip the next element
            }
        }

        let dir = ['./views/all-data/menu-item-data.html','./views/all-data/menu-item-json.html'];
        dir.forEach(function(filePath, index) {
            fs.access(filePath, error => {
                if (!error) {
                    fs.unlinkSync(filePath, function (error) {
                        console.log(error);
                    });
                } else {
                    console.log(error);
                }
            });
            if (index === dir.length - 1)
                setTimeout(()=>{
                    writeFileContent('./views/all-data/menu-item-data.html,./views/all-data/menu-item-json.html', json);
                }, 1000);
        });
        }
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });
    restaurant_order.delete(req, res);
    res.send('Deleting complete');
};

exports.find = function (req, res) {
    getFileContent('./views/all-data/menu-item-data.html', function(data) {
        let json = JSON.parse(data);
        json = json.menu.find(item => item.menuItemId === req.params.menuItemId);
        (json === "" || json === null) ? res.status(400) : res.status(200);

        if (res.statusCode === 200) return res.send(json);
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });
};


exports.write = async (req, res, next) => {
        let data = {
        menu: []
    };

    data.menu.push(
            req.body
    );
    data.menu[0].menuItemId = uuidv1();
    data.menu[0].itemImgPath = req.file.path;
    data.menu[0].itemImgName = req.file.filename;
    data.menu[0].itemActive = false;
    // let menuItem = new MenuItem(     {     } );

    writeFileContent('./views/all-data/menu-item-data.html,./views/all-data/menu-item-json.html', data,
        function (err) { if (err) { return next(err); } });

    res.send(req.body);
};