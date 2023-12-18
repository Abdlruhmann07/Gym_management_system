function generateTransactionId  () {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 1000).toString();
    const transactionId = timestamp + randomNum;
    return transactionId;
}
module.exports = generateTransactionId;