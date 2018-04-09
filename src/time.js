const time = () => {
    let start;
    let finish;

    return {
        start: () => start = Date.now(),
        stop: () => finish = Date.now(),
        elapsedMs: () => finish - start
    }
}

module.exports = time;