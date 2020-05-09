const uuidv1 = require('uuid/v1');

var fs = require('fs');
const Category = require('../models/category.model');

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
    fs.readFile(srcPath, 'utf8', function (err, data) {
            if (err) throw err;
            callback(data);
        }
    );
}

function writeFileContent(savPaths, category) {
    let styles = `<style>
                    body {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
                    .string { color: green; }
                    .number { color: darkorange; }
                    .boolean { color: blue; }
                    .null { color: magenta; }
                    .key { color: red; }
                </style>`;
    let jsonContent = JSON.stringify(category, undefined, 4);

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
                console.log(category);
                fs.writeFile(savPaths.split(',')[i], content[i], function (err) {
                    if (err) throw err;
                    console.log('complete');
                });
            }
        });

        function doWriteJsonFile(data) {
            let categories ;
            categories = JSON.parse(data); //now it an object

            if(category.length === 1)
                categories.category.push(category.category[0]); //add some data
            else
                categories = category;

            let jsonContent = JSON.stringify(categories, undefined, 4);

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
    getFileContent('./views/all-data/category-data.html', function(data) {
        let json = JSON.parse(data);
        res.send(json);//.slice(0, data.indexOf('<script>'))
    });
    console.log('complete');
};

exports.update = function (req, res) {
    getFileContent('./views/all-data/category-data.html', function (data) {
        let json = JSON.parse(data);
        // res.send(json);//.slice(0, data.indexOf('<script>'))
        const categoryname = req.body.category[0].categoryName;
        console.log(categoryname)
        console.log(json)
        for (let i=0; i<json.category.length; i++){
            if (json.category[i].categoryId === req.params.categoryId) {
                json.category[i].categoryName = categoryname;
                break;
            }
        }
        console.log(json)

        writeFileContent('./views/all-data/category-data.html,./views/all-data/category-json.html', json);
        // let dir = ['./views/all-data/category-data.html','./views/all-data/category-json.html'];
        // dir.forEach(function(filePath, index) {
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
        //         setTimeout(()=>{
        //             writeFileContent('./views/all-data/category-data.html,./views/all-data/category-json.html', json);
        //         }, 1000);
        // });
    });
    res.send('complete');
};

exports.delete = function (req, res) {
    getFileContent('./views/all-data/category-data.html', function (data) {
        let json = JSON.parse(data);

        for (let i=0; i<json.category.length; i++){
            if (json.category[i].categoryId === req.params.categoryId) {
                json.category.splice(i, 1);
                i--;//so it dont skip the next element
            }
        }
        writeFileContent('./views/all-data/category-data.html,./views/all-data/category-json.html', json);

        // let dir = ['./views/all-data/category-data.html','./views/all-data/category-json.html'];
        // dir.forEach(function(filePath, index) {
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
        //         setTimeout(()=>{
        //             writeFileContent('./views/all-data/category-data.html,./views/all-data/category-json.html', json);
        //         }, 1000);
        // });
    });
    res.send('Deleting complete');
};

exports.find = function (req, res) {
    getFileContent('./views/all-data/category-data.html', function(data) {
        let json = JSON.parse(data);
        res.send(json.category.find(item => item.categoryId === req.params.categoryId));
    });
    console.log('complete');
};


exports.write = function (req, res) {
    req.body.category[0].categoryId= uuidv1();
    console.log(req.body.category);
    // let category = new Category({  });

    writeFileContent('./views/all-data/category-data.html,./views/all-data/category-json.html', req.body);
    res.send(req.body.category);
};