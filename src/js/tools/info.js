require('../../css/info.less');
import axios from 'axios';
import { interfaces } from '../lib/url'
import '../../css/bootstrap/dist/js/bootstrap';

var banner = () => {
    let headers = { 'content-type': 'application/json' };
    var params = { pageNo: 1, pageSize: 5 };
    return new Promise((resolve, reject) => {
        axios.post('/api' + interfaces.wz, JSON.stringify(params), { headers }, data => {
            console.log(data)
            if (data.code == '000000') {
                resolve(data);
            } else {
                reject(data)
            }
        })
    })
}
$(function() {
    banner().then(data => { console.log(data) }).catch(data => { console.log(data) })
    $('.carousel').carousel({
        interval: 2000
    });
})