import $ from 'jquery';
import * as prompt from './jquery-impromptu.js'; //弹窗插件
//import '../../css/bootstrap/dist/js/bootstrap';//模态框
/*
 **公用方法集合
 */
export function checkData(data) {
    if (data.code == '000000') {
        return data.data;
    } else {
        $.prompt(data.msg, { title: "提示" });
        return;
    }
}