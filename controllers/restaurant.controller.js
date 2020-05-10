
let path = require('path');

const uuidv1 = require('uuid/v1');

var fs = require('fs');
const Restaurant = require('../models/restaurant.model');

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
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
    fs.readFile(srcPath, 'utf8', function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
}

function writeFileContent(savPaths, restaurant) {
    let styles = `<style>
                    pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
                    .string { color: green; }
                    .number { color: darkorange; }
                    .boolean { color: blue; }
                    .null { color: magenta; }
                    .key { color: red; }
                </style>`;
    let jsonContent = JSON.stringify(restaurant, undefined, 4);

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
                console.log(restaurant);
                fs.writeFile(savPaths.split(',')[i], content[i], function (err) {
                    if (err) throw err;
                    console.log('complete');
                });
            }
        });

        function doWriteJsonFile(data) {
            let orderItems = JSON.parse(data);
            restaurant.completeOrder.length === 1 ?
                orderItems.completeOrder.push(restaurant.completeOrder[0]) :
                    orderItems = restaurant;

            let jsonContent = JSON.stringify(orderItems, undefined, 4);
            console.log(restaurant.completeOrder);
            console.log(orderItems.completeOrder);

            let jsonHtmlContent =styles + `<pre> ${syntaxHighlight(jsonContent)} </pre>`;
            content = [];
            content.push(jsonContent, jsonHtmlContent);

            fs.writeFile(savPaths.split(',')[i],  content[i], function (err) {
                if (err) throw err;
                console.log('complete');
            });
        }
    }
}

exports.read = function (req, res) {
    getFileContent('./views/all-data/data.html', function(data) {
        let json = JSON.parse(data);
        res.send(json);//.slice(0, data.indexOf('<script>'))
    });
    console.log('complete');
};

exports.find = function (req, res) {
    getFileContent('./views/all-data/data.html', function(data) {
        let json = JSON.parse(data);
        json = json.completeOrder.find(item => item.menuItemId === req.params.menuItemId);
        (json === "" || json === null) ? res.status(400) : res.status(200);

        if (res.statusCode === 200) return res.send(json);
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });
    console.log('complete');
};


exports.update = function (req, res) {
    getFileContent('./views/all-data/data.html', function (data) {
        let json = JSON.parse(data);
        console.log(json.completeOrder);
        // json = json.completeOrder.find(item => item.menuItemId === req.params.menuItemId);
        (json === "" || json === null) ? res.status(400) : res.status(200);
        // console.log(json);

        if (res.statusCode === 200) {
            // arr1.map(obj => arr2.find(o => o.id === obj.id) || obj);
            for (let i = 0; i < json.completeOrder.length; i++) {
                if (json.completeOrder[i].menuItemId === req.params.menuItemId) {
                    json.completeOrder[i] = req.body;
                    break;
                }
            }

            writeFileContent('./views/all-data/data.html,./views/all-data/json.html', json);
            let dir = ['./views/all-data/data.html', './views/all-data/json.html'];
            // dir.forEach(function (filePath, index) {
            //     fs.access(filePath, error => {
            //         if (!error) {
            //             fs.unlinkSync(filePath, function (error) {
            //                 console.log(error);
            //             });
            //         } else {
            //             console.log(error);
            //         }
            //     });
            //     if (index === dir.length - 1)
            //         setTimeout(() => {
            //
            //         }, 1000);
            // });
        }
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });
    res.send('complete');
};

exports.delete = function (req, res) {
    getFileContent('./views/all-data/data.html', function (data) {
        let json = JSON.parse(data);
        // json = json.completeOrder.find(item => item.menuItemId === req.params.menuItemId);
        (json === "" || json === null) ? res.status(400) : res.status(200);

        if (res.statusCode === 200) {
            for (let i = 0; i < json.completeOrder.length; i++) {
                if (json.completeOrder[i].menuItemId === req.params.menuItemId) {
                    json.completeOrder.splice(i, 1);
                    i--;//so it dont skip the next element
                }
            }

            let dir = ['./views/all-data/data.html', './views/all-data/json.html'];
            dir.forEach(function (filePath, index) {
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
                    setTimeout(() => {
                        writeFileContent('./views/all-data/data.html,./views/all-data/json.html', json);
                    }, 1000);
            });
        }
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });
    // return res.status(404).redirect('../../Views/not-found');
    // res.send('Deleting complete');
};

function checkItemOrderAvailable (menuItemId, callback){
    let found = false;
    getFileContent('./views/all-data/menu-item-data.html', function (data) {
        let json = JSON.parse(data);
        for (let i=0; i<json.menu.length; i++){
            if (json.menu[i].menuItemId === menuItemId) {
                json.menu[i].itemActive = true;
                found = true;
                break;
            }
        }

        let dir = ['./views/all-data/menu-item-data.html','./views/all-data/menu-item-json.html'];
        if(found === true) {
            callback(found);
            console.log(found)
            dir.forEach(function (filePath, index) {
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
                    setTimeout(() => {
                        writeFileContent('./views/all-data/menu-item-data.html,./views/all-data/menu-item-json.html', json);
                    }, 1000);
            });
        }
    });
    // console.log(found)
    // return found;
}

exports.write = function (req, res) {
    req.body.completeOrder[0].menuId = uuidv1();
    // let restaurant = new Restaurant({ completeOrder: req.body.completeOrder });
    checkItemOrderAvailable(req.body.completeOrder[0].menuItemId, function (callBack) {
        if (callBack === true) {
            writeFileContent('./views/all-data/data.html,./views/all-data/json.html', req.body);
            res.send('Added order to Item');
        } else
            res.send('Please select an Item or create an Item to add this order to.');
    });
};