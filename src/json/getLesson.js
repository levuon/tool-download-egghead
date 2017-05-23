const fs = require('fs');
const path = require('path');

let dir = process.cwd();
let txtDir = path.join(dir, '/egghead');
let jsonDir = path.join(dir, '/src/json');
let txtFiles = fs.readdirSync(txtDir);
let jsonFiles = fs.readdirSync(jsonDir);
let txtFileName = [];

txtFiles.map(file => {
    let idx = file.indexOf('txt');
    if (idx > 0) {
        txtFileName.push(file.slice(0, idx - 1))
    }
})

jsonFiles.map(file => {
    let idx = file.indexOf('json');
    if (idx >= 0) {
        let name = file.slice(0, idx - 1);

        if (txtFileName.indexOf(name) < 0) {
            let data = require('./' + file);
            var lessons = data.list.lessons;
            var ret = []
            lessons.map(lesson => (ret.push(lesson.lesson_http_url), ret.push('\r\n')));

            fs.writeFile(`${dir}/egghead/${name}.txt`, ret, {
                flag: 'a'
            }, function(err) {
                if (err)
                    throw err;
                console.log("done!")
            });
        }

    }
})
