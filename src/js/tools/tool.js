import '../../css/tools.less';
import axios from 'axios';
import { interfaces } from '../lib/url';

function initCalendar() {
    let data = { billType: 'paper', duration: 'whole', month: '2018-03-01' };
    let headers = { 'content-type': 'application/json' };
    return new Promise((resolve, reject) => {
        axios.post('/api' + interfaces.rl, JSON.stringify(data), { headers }).then(data => {
            console.log(data);
            getYmt(data.data.data[0].date)
                // formatCalendar(data.data.data)
            $('.item__4:nth-child(3)').html(formatCalendar(data.data.data));
            resolve(data)
        })
    })
};

function getYmt(str) {
    var date = new Date(str);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var obj = { year, month, day };
    return obj;
}

function getWeek(dateString) { //根据当前日期获取week
    var date, week;
    date = new Date();
    var dateArray = dateString.split("-");
    date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
    week = date.getDay();
    if (week == 0) week = 7;
    return week
};

function formatCalendar(data) {
    var startWeek = getWeek(data[0].date); //当前月第一天星期几,-1为填充数
    var _HTML = '';
    var line = Math.ceil((data.length + startWeek - 1) / 7); //计算总行数6
    for (var j = 1; j <= line; j++) { //遍历行
        _HTML += "  <div class='d_inner'>";
        var index = (j * 7 - startWeek + 1) > data.length ? data.length : j * 7;
        for (var i = (j - 1) * 7; i < index; i++) { //生成列
            if (i + 1 < startWeek) {
                _HTML += "<div class='cell'>&nbsp;</div>";
            } else {
                // console.log(i - startWeek + 1);
                _HTML += "<div class='cell'>" + getYmt(data[i - startWeek + 1].date).day + "</div>";
            }
        }
        _HTML += '</div>'
    }
    return _HTML;
};
$(function() {
    $('.tabs>.items').click(function() {
        var item = $(this);
        item.addClass('active');
        for (var e of item.siblings()) {
            $(e).removeClass('active');
        }
        if (item[0].innerHTML == '贴现计算器') {
            $('.caculator').addClass('active');
            $('.caculator').removeClass('negative');
            for (var t of $('.caculator').siblings()) {
                $(t).removeClass('active');
                $(t).addClass('negative');
            }
        }
        if (item[0].innerHTML == '公示催告查询') {
            $('.telNotice').addClass('active');
            $('.telNotice').removeClass('negative');
            for (var t of $('.telNotice').siblings()) {
                $(t).removeClass('active');
                $(t).addClass('negative');
            }
        }
        if (item[0].innerHTML == '行号查询') {
            $('.bankNO').addClass('active');
            $('.bankNO').removeClass('negative');
            for (var t of $('.bankNO').siblings()) {
                $(t).removeClass('active');
                $(t).addClass('negative');
            }
        }
        if (item[0].innerHTML == '开票日历') {
            $('.calendar').addClass('active');
            $('.calendar').removeClass('negative');
            for (var t of $('.calendar').siblings()) {
                $(t).removeClass('active');
                $(t).addClass('negative');
            }
            initCalendar();
        }
    });
    $('.moreClick').click(function() {
        $(this).css('color', '#ca9a06');
        $('.lessClick').css('color', '#000');
        $('.form>.less').css('display', 'none');
        $('.form>.more').css('display', 'flex');
    })
    $('.lessClick').click(function() {
        $('.moreClick').css('color', '#000');
        $(this).css('color', '#ca9a06');
        $('.form>.less').css('display', 'flex');
        $('.form>.more').css('display', 'none');
    })
})