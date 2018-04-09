const url = require("url");
const https = require("https");

const deleteBlobAsync = (containerUrl, name) => {
    
    const parsedUrl = url.parse(containerUrl);
    const requestOptions = {
        method: "DELETE",
        hostname: parsedUrl.hostname,
        path: `${parsedUrl.pathname}/${name}?${parsedUrl.query}`,
        headers: {
            "Content-Type": "application/binary",
            "x-ms-blob-type": "BlockBlob",
            "x-ms-version": "2017-07-29"
        }
    }
    const promise = new Promise((resolve, reject) => {
        const client = https.request(requestOptions, (res) => {
            if (res.statusCode >= 400) {
                reject(Error(`Delete failed with code ${res.statusCode}`));
            }
            else {
                resolve();
            }
       }).on("error", (err) => console.error(err));
       client.end();
       
    });
    return promise;
}

module.exports = deleteBlobAsync;