const tpl = require("async");

const runParallel = (tasks) => {
    return new Promise((resolve, reject) => {
        tpl.parallel(tasks, (err, res) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        })
    })
}

module.exports = runParallel;