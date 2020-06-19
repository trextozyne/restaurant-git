const uuidv1 = require('uuid/v1');
var path = require('path');

var fs = require('fs');
const Customer = require('../models/customer.model');
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

function writeFileContent(savPaths, customer) {
    let styles = `<style>
                    body {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
                    .string { color: green; }
                    .number { color: darkorange; }
                    .boolean { color: blue; }
                    .null { color: magenta; }
                    .key { color: red; }
                </style>`;
    let jsonContent = JSON.stringify(customer, undefined, 4);

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
                console.log(customer);
                fs.writeFile(savPaths.split(',')[i], content[i], function (err) {
                    if (err) throw err;
                    console.log('complete');
                });
            }
        });

        function doWriteJsonFile(data) {
            let Customers ;
            Customers = JSON.parse(data); //now it an object
            console.log(Customers.customer.length);
            console.log(customer.customer.length);
            if(customer.customer.length === 1)
                Customers.customer.push(customer.customer[0]); //add some data
            else
                Customers = customer;

            let jsonContent = JSON.stringify(Customers, undefined, 4);

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
    getFileContent('./views/all-data/customer-data.html', function(data) {
        let json = JSON.parse(data);
        res.send(json);//.slice(0, customer-data.indexOf('<script>'))
    });
    console.log('complete');
};

exports.update = function (req, res) {
    getFileContent('./views/all-data/customer-data.html', function (data) {
        let json = JSON.parse(data);

        for (let i = 0; i < json.customer.length; i++) {
            // console.log(i);
            if (json.customer[i].id === req.params.id) {
                //OR
                // json.customer[i] = {};
                // json.customer[i] = req.body;
                console.log(json.customer[i]);

                json.customer[i].customer_name = req.body.customer_name ? req.body.customer_name : json.customer[i].customer_name;
                json.customer[i].city_id = req.body.city_id ? req.body.city_id : json.customer[i].city_id;
                json.customer[i].address = req.body.address ? req.body.address : json.customer[i].address;
                json.customer[i].contact_phone = req.body.contact_phone ? req.body.contact_phone : json.customer[i].contact_phone;
                json.customer[i].email = req.body.email ? req.body.email : json.customer[i].email;
                json.customer[i].password = req.body.password ? req.body.password : json.customer[i].password;
                json.customer[i].id = req.body.id ? req.body.id : json.customer[i].id;

                if (req.file)
                    fs.unlinkSync(json.customer[i].customerImgPath.toString());

                json.customer[i].customerImgName = req.file ? req.file.filename : json.customer[i].customerImgName;
                json.customer[i].customerImgPath = req.file ? req.file.path : json.customer[i].customerImgPath;
                break;
            }
        }


        let dir = ['./views/all-data/customer-data.html', './views/all-data/customer-json.html'];
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
                    writeFileContent('./views/all-data/customer-data.html,./views/all-data/customer-json.html', json);
                }, 1000);
        });
    });
    res.send('complete');
};

exports.delete = function (req, res) {
    getFileContent('./views/all-data/customer-data.html', function (data) {
        let json = JSON.parse(data);
        // json = json.menu.find(item => item.id === req.params.id);
        (json === "" || json === null) ? res.status(400) : res.status(200);

        if (res.statusCode === 200) {
        for (let i=0; i<json.customer.length; i++){
            if (json.customer[i].id === req.params.id) {
                json.customer.splice(i, 1);
                i--;//so it dont skip the next element
            }
        }

        let dir = ['./views/all-data/customer-data.html','./views/all-data/customer-json.html'];
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
                    writeFileContent('./views/all-data/customer-data.html,./views/all-data/customer-json.html', json);
                }, 1000);
        });
        }
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });

    res.send('Deleting complete');
};

exports.find = function (req, res) {
    getFileContent('./views/all-data/customer-data.html', function(data) {
        let json = JSON.parse(data);
        json = json.customer.find(item => item.id === req.params.id);
        (json === "" || json === null) ? res.status(400) : res.status(200);

        if (res.statusCode === 200) return res.send(json);
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });
};


exports.write = async (req, res, next) => {
    let data = {
        customer: []
    };

    data.customer.push(
            req.body
    );
    let response;
    if(req.file) {
        data.customer[0].itemImgPath = req.file.path;
        data.customer[0].itemImgName = req.file.filename;

        response = "Successful";
    } else {
        response = "error, no image";
    }

    writeFileContent('./views/all-data/customer-data.html,./views/all-data/customer-json.html', data,
        function (err) { if (err) { return next(err); } });

    res.send(response);
};