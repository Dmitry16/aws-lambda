const express = require('express');
const httpClient = require('./api');
const axios = require('axios');
const Transaction = require('./transaction');
const { baseUrl } = require('./config');
const { setRandomCurrency, setRandomAmount } = require('./utils')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


app.get('/', async (req, res) => {

    const query = 'base=EUR';

    let data = await getCurrenciesRates(axios, query);

    data = generateRandomTransactions(baseUrl, query, data);

    let convertedTransactions = convertTransactions(data);

    await postProcessTransactions(convertedTransactions);

    res.status(200).send(data);
});

app.post('/', (req, res) => {
    // console.log('post::', req.body)
    const response = {
        "success": true,
        "passed": 1,
        "failed": 0
    };
    res.send(response);
});

function postProcessTransactions(convertedTransactions) {

    axios({
        method: 'post',
        url: 'http://localhost:3000',
        data: convertedTransactions,
    });
};

async function getCurrenciesRates(client, query) {

    const data = await httpClient.fetchExchangeRatesApi.getRates(client, query);
    
    return data;
};

function convertTransactions(data) {

    return data.reduce((acc, key, ind) => {
        acc.push({
            "createdAt": key.createdAt,
            "currency": "EUR",
            "convertedAmount": key.convertedAmount,
            "checksum": key.checksum
        });
        return acc;
    },[]);
}

function generateRandomTransactions(baseUrl, query, data) {

    let transactions = [];
    
    for (let i=0; i<10; i++) {
        const currency = setRandomCurrency(Object.entries(data.rates));
        const amount = setRandomAmount(100, 1000);
        const transaction = new Transaction(currency, amount, baseUrl, query, i);
        transactions.push(transaction.init());
    }
    return transactions;
};

module.exports = app;