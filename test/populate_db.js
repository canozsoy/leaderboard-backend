import axios from 'axios';
import * as crypto from 'crypto';

(async () => {
    try {
        const emptyArray = Array(1000).fill(undefined);
        const requests = emptyArray.map(() => axios.post('http://127.0.0.1:3000/api/v1/populate', {
            name: crypto.randomBytes(10).toString('hex'),
            country: 'Turkey',
            score: Math.round(Math.random() * 10000),
        }));
        await Promise.all(requests);
    } catch (error) {
        console.error(error);
    }
})();
