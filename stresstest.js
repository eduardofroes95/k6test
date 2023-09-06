import http, { request } from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";



export const options = {

    stages: [
        { duration: '5s', target: 5 },
        // { duration: '10s', target: 20 },
        // { duration: '10s', target: 50 },
        // { duration: '15s', target: 70 },
        // { duration: '10s', target: 90 },
        // { duration: '15s', target: 0 },
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

        const data = {
            email: user,
            password: pass
        }

        const req1 = http.post(`${BASE_URL}auth/token/login/`, data)

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


export function handleSummary(data) {
    return {
      "result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }


  //Verifica o comportamento do sistema em condições extremas
  //Verifica a capacidade máxima de usuários
  //Verifica o ponto de ruptura
  //Verifica se após estressar a aplicação e diminuir a carga o sistema se recupera sem intervenção manual