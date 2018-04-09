const argv = require('argv');

const COMMANDS = {
    CONTAINER_URL: "url",
    SIZE: "size",
    CHUNKS: "chunks",
    NODELETE: "nocleanup"
}

const options = argv.option([
    { name: COMMANDS.CONTAINER_URL, description: "Container url with SAS", alias: "u", type: "string" },
    { name: COMMANDS.SIZE, description: "Upload size in MB", alias: "s", type: "int" },
    { name: COMMANDS.CHUNKS, description: "Number of chunks and files for parallelized tests", alias: "c", type: "int" },
    { name: COMMANDS.NODELETE, description: "Don't cleanup after test", alias: "n", type: "bool" }
]);

const commands = options.run(process.argv);

module.exports = {
    parse: () => commands,
    commands: COMMANDS
}