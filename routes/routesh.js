const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const windowSize = 10;
let numberWindow = [];

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    const validIds = {
        'p': 'primes',
        'f': 'fibonacci',
        'e': 'even',
        'r': 'random'
    };
    
    if (!validIds.hasOwnProperty(numberid)) {
        return res.status(400).send({ error: 'Invalid number ID' });
    }
    
    const testServerUrl = `http://20.244.56.144/test/${validIds[numberid]}`;
    
    try {
        const response = await axios.get(testServerUrl, { timeout: 500 });
        const newNumbers = response.data.numbers;
        const uniqueNumbers = [...new Set(newNumbers)];
        
        const prevState = [...numberWindow];
        
        uniqueNumbers.forEach(number => {
            if (!numberWindow.includes(number)) {
                numberWindow.push(number);
            }
            if (numberWindow.length > windowSize) {
                numberWindow.shift();
            }
        });
        
        const currentState = [...numberWindow];
        const avg = currentState.reduce((acc, val) => acc + val, 0) / currentState.length;
        
        res.json({
            numbers: uniqueNumbers,
            windowPrevState: prevState,
            windowCurrState: currentState,
            avg: avg.toFixed(2)
        });
    } catch (error) {
        console.error('Error fetching numbers from test server:', error.message);
        res.status(500).send({ error: 'Failed to fetch numbers from test server' });
    }
});

app.listen(port, () => {
    console.log(`Average Calculator service running on http://localhost:${port}`);
});
