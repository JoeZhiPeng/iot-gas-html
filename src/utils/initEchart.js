/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 异步按需加载 echart
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-04-08 09:21:46
 */

const initEcharts = equireAsync([
    'graphic',
    'line',
    'legend',
    'dataZoom',
    'pie',
    'bar',
    'tooltip'
])

export default initEcharts