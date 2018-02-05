import { interfaces } from '../lib/url';
import { checkData } from '../common/common';
import axios from 'axios';
import echarts from 'echarts';


export var myChart = echarts.init(document.getElementById('charts'));

/*
 **生成单条折线数据
 */
export function cutList(data, key) {
    var arr = [];
    data.forEach(value => {
        arr.push(value[key] == 0 ? '--' : value[key]); //处理空值
    })
    return arr.reverse();
}
/*
 **折线图数据格式化
 @param  ajax data
 @return echart data 
 */
export function formatDta(data) {
    var type = ['国股', '城商', '外资', '农商', '农信', '农合', '村镇', '财务'];
    var option = { title: {}, tooltip: {}, legend: {}, xAxis: {}, yAxis: {}, series: [] };
    var grid = {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    };
    option.title.text = '实时行情';
    option.tooltip.trigger = 'axis';
    option.legend.data = type;
    option.grid = grid;
    option.xAxis.data = data.timeaxis.reverse();
    option.xAxis.type = 'category';
    option.xAxis.boundaryGap = true;
    option.yAxis.type = 'value';
    for (var i = 0; i < type.length; i++) {
        option.series.push({ name: type[i] });
        option.series[i].type = 'line';
        option.series[i].stack = '';
    }
    option.series[0].data = cutList(data.country, 'ave');
    option.series[1].data = cutList(data.cityBusiness, 'ave');
    option.series[2].data = cutList(data.foreign, 'ave');
    option.series[3].data = cutList(data.ruralBusiness, 'ave');
    option.series[4].data = cutList(data.ruralCredit, 'ave');
    option.series[5].data = cutList(data.ruralCooperation, 'ave');
    option.series[6].data = cutList(data.ruralTown, 'ave');
    option.series[7].data = cutList(data.finance, 'ave');
    console.log(option)
    return option;
};
/*
 **获取折线数据
 @param :票据类型
 @return promise
 */
export function chart_data(billtype = 'paper') {
    var param = { billMedia: billtype };
    let headers = { 'content-type': 'application/json' };
    return new Promise((resolve, reject) => {
        axios.post('/api' + interfaces.hq, JSON.stringify(param), { headers }).
        then(data => {
            if (data.data.code == '000000') {
                resolve(data);
            } else {
                reject(data)
            }
        })
    })
};