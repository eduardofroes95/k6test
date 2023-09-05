import http, { request } from 'k6/http';
import { check, group } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";



export const options = {

  vus: 5,
  duration: '3s',
  thresholds: {
    'http_req_failed{group:::Teste1}': ['rate === 0.00'],
    'http_req_failed{group:::Teste2}': ['rate === 0.00'],
    'http_req_duration{group:::Teste1}': ['p(100) < 250'],
    'http_req_duration{group:::Teste2}': ['p(100) < 250'],
    checks: ['rate > 0.99']
  }

}


const myRate = new Rate('Status code 200');
const myTrend = new Trend('Taxa de espera')

export default function () {


  group('Teste1', function () {
    const req = http.get('http://test.k6.io');
    myRate.add(req.status === 200);
    myTrend.add(req.timings.waiting)

    check(req, {
      'Status code 200': (r) => r.status == 200
    })
  })

  group('Teste2', function () {
    const req = http.get('http://test.k6.io');
    myRate.add(req.status === 200);
    myTrend.add(req.timings.waiting)

    check(req, {
      'Status code 200': (r) => r.status == 200
    })
  })
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}
