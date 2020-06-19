const uuidv1 = require('uuid/v1');
var path = require('path');

var fs = require('fs');
const Restaurant_Register = require('../models/restaurant_register.model');
// var restaurant_order = require('../controllers/restaurant.controller');

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

function writeFileContent(savPaths, restaurant_register) {
    let styles = `<style>
                    body {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
                    .string { color: green; }
                    .number { color: darkorange; }
                    .boolean { color: blue; }
                    .null { color: magenta; }
                    .key { color: red; }
                </style>`;
    let jsonContent = JSON.stringify(restaurant_register, undefined, 4);

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
                console.log(restaurant_register);
                fs.writeFile(savPaths.split(',')[i], content[i], function (err) {
                    if (err) throw err;
                    console.log('complete');
                });
            }
        });

        function doWriteJsonFile(data) {
            let Restaurant_Registers ;
            Restaurant_Registers = JSON.parse(data); //now it an object
            console.log(Restaurant_Registers.restaurant_register.length);
            console.log(restaurant_register.restaurant_register.length);
            if(restaurant_register.restaurant_register.length === 1)
                Restaurant_Registers.restaurant_register.push(restaurant_register.restaurant_register[0]); //add some data
            else
                Restaurant_Registers = restaurant_register;

            let jsonContent = JSON.stringify(Restaurant_Registers, undefined, 4);

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
    getFileContent('./views/all-data/restaurant_register-data.html', function(data) {
        let json = JSON.parse(data);
        res.send(json);//.slice(0, restaurant_register-data.indexOf('<script>'))
    });
    console.log('complete');
};

exports.update = function (req, res) {
    getFileContent('./views/all-data/restaurant_register-data.html', function (data) {
        let json = JSON.parse(data);

        for (let i = 0; i < json.restaurant_register.length; i++) {
            // console.log(i);
            if (json.restaurant_register[i].id === req.params.id) {
                //OR
                // json.restaurant_register[i] = {};
                // json.restaurant_register[i] = req.body;
                console.log(json.restaurant_register[i]);

                json.restaurant_register[i].restaurant_register_name = req.body.restaurant_register_name ? req.body.restaurant_register_name : json.restaurant_register[i].restaurant_register_name;
                json.restaurant_register[i].city_id = req.body.city_id ? req.body.city_id : json.restaurant_register[i].city_id;
                json.restaurant_register[i].address = req.body.address ? req.body.address : json.restaurant_register[i].address;
                json.restaurant_register[i].contact_phone = req.body.contact_phone ? req.body.contact_phone : json.restaurant_register[i].contact_phone;
                json.restaurant_register[i].id = req.body.id ? req.body.id : json.restaurant_register[i].id;

                if (req.file)
                    fs.unlinkSync(json.restaurant_register[i].restaurant_registerImgPath.toString());

                json.restaurant_register[i].restaurant_registerImgName = req.file ? req.file.filename : json.restaurant_register[i].restaurant_registerImgName;
                json.restaurant_register[i].restaurant_registerImgPath = req.file ? req.file.path : json.restaurant_register[i].restaurant_registerImgPath;
                break;
            }
        }


        let dir = ['./views/all-data/restaurant_register-data.html', './views/all-data/restaurant_register-json.html'];
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
                    writeFileContent('./views/all-data/restaurant_register-data.html,./views/all-data/restaurant_register-json.html', json);
                }, 1000);
        });
    });
    res.send('complete');
};

exports.delete = function (req, res) {
    getFileContent('./views/all-data/restaurant_register-data.html', function (data) {
        let json = JSON.parse(data);
        // json = json.menu.find(item => item.id === req.params.id);
        (json === "" || json === null) ? res.status(400) : res.status(200);

        if (res.statusCode === 200) {
        for (let i=0; i<json.restaurant_register.length; i++){
            if (json.restaurant_register[i].id === req.params.id) {
                json.restaurant_register.splice(i, 1);
                i--;//so it dont skip the next element
            }
        }

        let dir = ['./views/all-data/restaurant_register-data.html','./views/all-data/restaurant_register-json.html'];
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
                    writeFileContent('./views/all-data/restaurant_register-data.html,./views/all-data/restaurant_register-json.html', json);
                }, 1000);
        });
        }
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });

    res.send('Deleting complete');
};

exports.find = function (req, res) {
    getFileContent('./views/all-data/restaurant_register-data.html', function(data) {
        let json = JSON.parse(data);
        json = json.restaurant_register.find(item => item.id === req.params.id);
        (json === "" || json === null) ? res.status(400) : res.status(200);

        if (res.statusCode === 200) return res.send(json);
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });
};


exports.write = async (req, res, next) => {
    console.log(req.file);

    let data = {
        restaurant_register: []
    };

    data.restaurant_register.push(
            req.body
    );
    let response;
    if(req.file) {
        data.restaurant_register[0].itemImgPath = req.file.path;
        data.restaurant_register[0].itemImgName = req.file.filename;

        response = "Successful";
    } else {
        response = "error, no image";
    }

    writeFileContent('./views/all-data/restaurant_register-data.html,./views/all-data/restaurant_register-json.html', data,
        function (err) { if (err) { return next(err); } });

    res.send(response);
};