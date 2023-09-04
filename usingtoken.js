import http, { request } from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';



export const options = {

    stages: [{ duration: '10s', target: 100 }],
    thresholds: {
        'http_req_failed{group:::Teste1}': ['rate === 0.00'],
        'http_req_duration{group:::Teste1}': ['p(100) < 650'],
        checks: ['rate === 1.00']
    }

}

const BASE_URL = 'https://test-api.k6.io/';

export function setup() {
    const loginRes = http.post('https://test-api.k6.io/auth/token/login/', {
        username: '299867@mail.com',
        password: 'user123'
    })
    const generateToken = loginRes.json('access');
    return generateToken;
}


const myRate = new Rate('Status code 200');

export default function (generateToken) {
    const BASE_URL = 'https://test-api.k6.io/';


    group('Teste1', function () {
        const params = {
            headers: {
                Authorization: `Bearer ${generateToken}`,
                'Content-Type': 'application/json'
            }
        }

        const req1 = http.get(`${BASE_URL}my/crocodiles`, params);
        myRate.add(req1.status === 200);

        check(req1, {
            'Status code 200': (r) => r.status == 200
        })

        sleep(1)

    })

}