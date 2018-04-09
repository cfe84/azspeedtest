const url = require("url");
const https = require("https");

const blobUploader = (containerUrl, name, comp = "") => {
    
    const parsedUrl = url.parse(containerUrl);
    const requestOptions = {
        method: "PUT",
        hostname: parsedUrl.hostname,
        path: `${parsedUrl.pathname}/${name}?${parsedUrl.query}${comp}`,
        headers: {
            "Content-Type": "application/binary",
            "x-ms-blob-type": "BlockBlob",
            "x-ms-version": "2017-07-29"
        }
    }

    return {
        uploadAsync: (content) => {
            const promise = new Promise((resolve, reject) => {
                const client = https.request(requestOptions, (res) => {
                    if (res.statusCode >= 400) {
                        reject(Error(`Upload failed with code ${res.statusCode}`));
                    }
                    else {
                        resolve();
                    }
               }).on("error", (err) => console.error(err));
               client.end(content);
               
            });
            return promise;
        }
    }
}

module.exports = blobUploader;