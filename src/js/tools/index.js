require('../../css/top.less');
require('../../css/charts.less');
import * as chart from './chart';
import * as table from './table';
import * as info from './info';
import * as tool from './tool';
import { checkData } from '../common/common';

console.log(document.getElementsByTagName('body')[0].innerText);
function initPage(type = 'paper') {
    chart.chart_data(type).then(function(data) {
        var formBean = checkData(data.data);
        chart.myChart.setOption(chart.formatDta(formBean));
        $('#tables').html(table.formTable(formBean))
    });
};

$(function() {
    initPage();
    $('#paper').click(function() {
        initPage();
    })
    $('#larele').click(function() {
        initPage('lelectronic');
    })
    $('#smlele').click(function() {
        initPage('selectronic');
    })
})