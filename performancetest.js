import http, { request } from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";



export const options = {

    stages: [
        {duration: '1m', target: 15},
        {duration: '5m', target:40},
        {duration: '10m', target:60},
        {duration: '5m', target:0},
    ],
    thresholds: {
        'http_req_failed{group:::Teste1}': ['rate === 0.00'],
        'http_req_failed{group:::Teste2}': ['rate === 0.00'],
        'http_req_duration{group:::Teste1}': ['p(100) < 450'],
        'http_req_duration{group:::Teste2}': ['p(100) < 450'],
        checks: ['rate === 1.00']
    }

}


const myRate = new Rate('Status code 200');

export default function () {


    group('Teste1', function () {

        const BASE_URL = 'https://test-api.k6.io/';
        const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
        const user = `${randomSixDigitNumber}@mail.com`;
        const pass = 'user123';

        const data = {
            username: user,
            first_name: "Crocodilo",
            last_name: "Dino",
            email: user,
            password: pass
        }


        const req1 = http.post(`${BASE_URL}user/register/`, data)
        myRate.add(req1.status === 201);

        check(req1, {
            'Status code 201': (r) => r.status == 201
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

export function handleSummary(data) {
    return {
      "result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }



  //Compara o tempo de resposta entre os estágios de carga baixa e carga nominal
  //Teste deve ser realizado com carga média de 70% da capacidade do servidor e período curto