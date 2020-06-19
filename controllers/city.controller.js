const uuidv1 = require('uuid/v1');
var path = require('path');

var fs = require('fs');
const City = require('../models/city.model');
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

function writeFileContent(savPaths, city) {
    let styles = `<style>
                    body {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
                    .string { color: green; }
                    .number { color: darkorange; }
                    .boolean { color: blue; }
                    .null { color: magenta; }
                    .key { color: red; }
                </style>`;
    let jsonContent = JSON.stringify(city, undefined, 4);

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
                console.log(city);
                fs.writeFile(savPaths.split(',')[i], content[i], function (err) {
                    if (err) throw err;
                    console.log('complete');
                });
            }
        });

        function doWriteJsonFile(data) {
            let Citys ;
            Citys = JSON.parse(data); //now it an object
            console.log(Citys.city.length);
            console.log(city.city.length);
            if(city.city.length === 1)
                Citys.city.push(city.city[0]); //add some data
            else
                Citys = city;

            let jsonContent = JSON.stringify(Citys, undefined, 4);

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
    getFileContent('./views/all-data/city-data.html', function(data) {
        let json = JSON.parse(data);
        res.send(json);//.slice(0, city-data.indexOf('<script>'))
    });
    console.log('complete');
};

exports.update = function (req, res) {
    getFileContent('./views/all-data/city-data.html', function (data) {
        let json = JSON.parse(data);

        for (let i = 0; i < json.city.length; i++) {
            // console.log(i);
            if (json.city[i].id === req.params.id) {
                //OR
                // json.city[i] = {};
                // json.city[i] = req.body;
                console.log(json.city[i]);

                json.city[i].city_name = req.body.city_name ? req.body.city_name : json.city[i].city_name;
                json.city[i].state_name = req.body.state_name ? req.body.state_name : json.city[i].state_name;
                json.city[i].zip_code = req.body.zip_code ? req.body.zip_code : json.city[i].zip_code;

                break;
            }
        }


        let dir = ['./views/all-data/city-data.html', './views/all-data/city-json.html'];
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
                    writeFileContent('./views/all-data/city-data.html,./views/all-data/city-json.html', json);
                }, 1000);
        });
    });
    res.send('complete');
};

exports.delete = function (req, res) {
    getFileContent('./views/all-data/city-data.html', function (data) {
        let json = JSON.parse(data);
        // json = json.menu.find(item => item.id === req.params.id);
        (json === "" || json === null) ? res.status(400) : res.status(200);

        if (res.statusCode === 200) {
            for (let i=0; i<json.city.length; i++){
                if (json.city[i].id === req.params.id) {
                    json.city.splice(i, 1);
                    i--;//so it dont skip the next element
                }
            }

            let dir = ['./views/all-data/city-data.html','./views/all-data/city-json.html'];
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
                        writeFileContent('./views/all-data/city-data.html,./views/all-data/city-json.html', json);
                    }, 1000);
            });
        }
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });

    res.send('Deleting complete');
};

exports.find = function (req, res) {
    getFileContent('./views/all-data/city-data.html', function(data) {
        let json = JSON.parse(data);
        json = json.city.find(item => item.id === req.params.id);
        (json === "" || json === null) ? res.status(400) : res.status(200);

        if (res.statusCode === 200) return res.send(json);
        else if (res.statusCode === 404) return res.status(404).redirect('../../Views/not-found');
        else return res.status(500).redirect('../../Views/error-not-found');
    });
};


exports.write = async (req, res, next) => {
    let data = {
        city: []
    };

    data.city.push(
        req.body
    );

    console.log(req.body)

    writeFileContent('./views/all-data/city-data.html,./views/all-data/city-json.html', data,
        function (err) { if (err) { return next(err); } });

    res.send("Successful");
};