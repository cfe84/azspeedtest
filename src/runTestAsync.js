const timer = require("./time");
const units = require("./units")


const calculateSpeedPerS = (transferredSize, elapsedMs, unit = units.KILOBYTE) => ((transferredSize / elapsedMs) / unit) * 1000


const runTestAsync = async (testName, generatedSize, cbAsync) => {
    const time = timer();
    try {
        process.stdout.write(`${testName}: Uploading...`);
        time.start();
        await cbAsync();
        time.stop();
        const speed = calculateSpeedPerS(generatedSize, time.elapsedMs(), units.MEGABYTE);
        process.stdout.write(`\r${testName}: ${speed.toFixed(2)} Mb/s\n`);
        return {
            sizeMb: generatedSize / units.MEGABYTE,
            timeMs: time.elapsedMs,
            speedMbps: speed
        };
    }
    catch(err) {
        console.error(`Error: ${err.stack}`);
    }
}

module.exports = runTestAsync;