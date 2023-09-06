import http, { request } from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";



export const options = {

    stages: [
        { duration: '10s', target: 15 },
        // { duration: '5m', target: 35 },
        // { duration: '50ms', target: 35 },
        // { duration: '500m', target: 35 },
        // { duration: '5ms', target: 35 },
    ],
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

export function handleSummary(data) {
    return {
      "result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }


  //Utiliza-se 80% da capacidade da aplicação
  //Encontrar bugs relacionados a "condições de corrida" que aparecem esporadicamente, como: vazamento de memória e armazenamento no banco de dados