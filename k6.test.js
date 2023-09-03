import http from 'k6/http';
import { check } from 'k6'; 
import { sleep } from 'k6';


export const options = {

  vus: 5,
  duration: '10s'

}



export default function () {
const res = http.get('http://test.k6.io')

check(res,{
  'Status code 200': (r) => r.status == 200
})

}
