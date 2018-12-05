const express = require('express');
const httpClient = require('./api');
const axios = require('axios');
const Transaction = require('./transaction');
const { baseUrl } = require('./config');
const { setRandomCurrency, setRandomAmount } = require('./utils')

const app = express();

app.get('/', async (req, res) => {

    const query = 'base=EUR';

    let data = await getCurrenciesRates(axios, query);

    data = makeRandomTransactions(baseUrl, query, data);

    postProcessTransactions();

    res.status(200).send(data);
});

async function getCurrenciesRates(client, query) {

    const data = await httpClient.fetchExchangeRatesApi.getRates(client, query);
    
    return data;
};

function makeRandomTransactions(baseUrl, query, data) {

    let transactions = [];
    
    for (let i=0; i<10; i++) {
        const currency = setRandomCurrency(Object.entries(data.rates));
        console.log(currency)
        const amount = setRandomAmount(100, 1000);
        const transaction = new Transaction(
            currency,
            amount,
            baseUrl, 
            query
        );
        transactions.push(transaction.init())
    }
    return transactions;
};

function postProcessTransactions() {

};

module.exports = app;