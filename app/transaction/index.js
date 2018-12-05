class Transaction {
    constructor(currency, amount, baseUrl, query) {
        this.date = new Date().toISOString();
        this.baseUrl = baseUrl;
        this.query = query;
        this.currency = currency[0];
        this.currencyRate = currency[1];
        this.amount = amount;
    }
    convertAmount() {
        return (this.amount/this.currencyRate).toFixed(4);
    }
    calculateCheckSum() {
        return 333333;
    }
    init() {
        return {
            "createdAt": this.date,
            "currency": this.currency,
            "amount": this.amount,
            "convertedAmount": this.convertAmount(),
            "exchangeUrl": this.baseUrl + this.query,
            "checksum": this.calculateCheckSum()
        };
    }
}

module.exports = Transaction;