/*
 **str switch
 */
export var switchName = (str) => {
        switch (str) {
            case 'cityBusiness':
                return '城商';
                break;
            case 'country':
                return '国股';
                break;
            case 'finance':
                return '财务';
                break;
            case 'foreign':
                return '外资';
                break;
            case 'ruralCredit':
                return '农信';
                break;
            case 'ruralTown':
                return '村镇';
                break;
            case 'ruralCooperation':
                return '农合';
                break;
            case 'ruralBusiness':
                return '农商';
                break;
            default:
                return '';
                break;
        }
    }
    /*
     **表格数据格式化
     @param ajax data
     @return table innerHtml
     */
export var formTable = data => {
    var tabHtml = `<thead>
            <td>承兑行名称</td>
            <td>最高价(‰)</td>
            <td>最低(‰)</td>
            <td>报价机构数</td>
            </thead>`;
    Object.keys(data).forEach(key => {
        if (key !== 'timeaxis' && data[key].length > 0) {
            tabHtml += '<tr><td>' + switchName(key) || '--'; //data[key][0].bankType
            tabHtml += '</td><td>';
            tabHtml += data[key][0].max == 0 ? '--' : data[key][0].max;
            tabHtml += '</td><td>';
            tabHtml += data[key][0].min == 0 ? '--' : data[key][0].min;
            tabHtml += '</td><td>';
            tabHtml += data[key][0].count == 0 ? '--' : data[key][0].count;
            tabHtml += '</td></tr>';
        }
    })
    return tabHtml
}