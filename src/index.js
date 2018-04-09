const generateData = require("./generateData");
const commandLineParser = require("./commandLineParser");
const blobUploader = require("./blobUploader");
const deleteBlobAsync = require("./deleteBlobAsync");
const units = require("./units");
const runTestAsync = require("./runTestAsync");
const runParallel = require("./runParallel");

const commands = commandLineParser.parse();
const containerUrl = commands.options[commandLineParser.commands.CONTAINER_URL]
const sizeInMb = commands.options[commandLineParser.commands.SIZE] || 10;
const chunkCount = commands.options[commandLineParser.commands.CHUNKS] || 4;

const generatedSize = sizeInMb * units.MEGABYTE;

const results = [];
const createdFiles = [];

const runTestsAsync = async () => {
    // Single file
    const data = generateData(generatedSize);
    const singleFilename = "test-single.bin"
    createdFiles.push(singleFilename);
    const uploaderSingle = blobUploader(containerUrl, singleFilename);
    const uploadSingleFile = async () => await uploaderSingle.uploadAsync(data);    
    results.push(await runTestAsync(`Upload one ${sizeInMb}MB file as a block`, generatedSize, uploadSingleFile));

    // Single file, multiple chunks
    const chunks = [];
    const multipleFilename = "test-chunks.bin"
    for(let i = 0; i < chunkCount; i++) {
        const uploader = blobUploader(containerUrl, multipleFilename, `&comp=block&blockid=${new Buffer(`chunk-${i}`).toString('base64')}`);    
        const chunk = generateData(generatedSize / chunkCount);
        chunks.push(async () => await uploader.uploadAsync(chunk));
    }
    createdFiles.push(multipleFilename);
    const uploadMultipleChunks = async() => await runParallel(chunks);
    results.push(await runTestAsync(`Upload one ${sizeInMb}MB file in ${chunkCount} chunks`, generatedSize, uploadMultipleChunks));

    // Several files
    const filesCount = chunkCount, files = [];
    for(let i = 0; i < filesCount; i++) {
        const filename = `test-multiple-${i}.bin`;
        const uploader = blobUploader(containerUrl, filename);
        createdFiles.push(filename);
        const file = generateData(generatedSize / filesCount);
        files.push(async () => await uploader.uploadAsync(file));
    }
    const uploadMultipleFiles = async() => await runParallel(files);
    results.push(await runTestAsync(`Upload ${filesCount} x ${sizeInMb / filesCount}MB files in parallel`, generatedSize, uploadMultipleFiles));

    // Uploading results
    const uploader = blobUploader(containerUrl, `results-${Date.now()}.json`);
    const resultObject = {
        parameters: {
            url: containerUrl,
            sizeInMb: sizeInMb,
            chunkCount: chunkCount
        },
        environment: {
            nodeVersion: process.version
        },
        results: results
    };
    process.stdout.write("Upload results...");
    await uploader.uploadAsync(JSON.stringify(resultObject, null, 2));
    if (!commands.options[commandLineParser.commands.NODELETE]) {
        process.stdout.write("\rCleaning up test artifacts...");
        for(let filename of createdFiles)
            await deleteBlobAsync(containerUrl, filename);
    }
    process.stdout.write("\rDone                           .\n");
};

runTestsAsync();