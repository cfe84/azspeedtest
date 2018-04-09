const generateData = (size) => {

    const generateRandomUint8 = () => Math.random() * 256 | 0;    
    const data = new Buffer(size).map(() => generateRandomUint8());
    return data;
}

module.exports = generateData;