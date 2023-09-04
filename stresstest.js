import http, { request } from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';



export const options = {

    stages: [
        { duration: '5s', target: 5 },
        { duration: '5s', target: 5 },
        { duration: '10s', target: 50 },
        { duration: '10s', target: 50 },
        { duration: '5s', target: 0 }
    ],
    thresholds: {
        'http_req_failed{group:::Teste1}': ['rate === 0.00'],
        'http_req_failed{group:::Teste2}': ['rate === 0.00'],
        'http_req_duration{group:::Teste1}': ['p(100) < 450'],
        'http_req_duration{group:::Teste2}': ['p(100) < 450'],
        checks: ['rate === 1.00']
    }

}

const csvData = new SharedArray('Ler dados', function () {
    return papaparse.parse(open('./usuarios.csv'), { header: true }).data
})

const myRate = new Rate('Status code 200');

export default function () {


    group('Teste1', function () {

        const BASE_URL = 'https://test-api.k6.io/';
        const user = csvData[Math.floor(Math.random() * csvData.length)].email
        const pass = 'user123';

        console.log(user)

        const req1 = http.post(`${BASE_URL}auth/token/login/`, {
            email: user,
            password: pass
        });

        myRate.add(req1.status === 200);

        check(req1, {
            'Status code 200': (r) => r.status == 200,
            'Token gerado': (r) => r.json('acess') != ''
        })

        sleep(1)
    })

    group('Teste2', function () {
        const req2 = http.get('http://test.k6.io');


        myRate.add(req2.status === 200);

        check(req2, {
            'Status code 200': (r) => r.status == 200
        })

        sleep(1)
    })
}