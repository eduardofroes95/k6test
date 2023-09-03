import http, { request } from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';



export const options = {

 stages: [
    {duration: '10s', target:10},
    {duration: '10s', target:10},
    {duration: '10s', target:0},
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

    const BASE_URL = 'https://test-api.k6.io/public/crocodiles/1';

    const req1 = http.get(BASE_URL);
    myRate.add(req1.status === 200);

    check(req1, {
      'Status code 200': (r) => r.status == 200
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
