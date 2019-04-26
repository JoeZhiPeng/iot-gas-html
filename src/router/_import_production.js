/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 生产环境
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-04-08 09:19:23
 */

module.exports = file => () =>
    import ('../views/' + file + '.vue')