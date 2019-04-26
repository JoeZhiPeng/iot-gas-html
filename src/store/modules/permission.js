/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 路由store
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-04-16 17:21:27
 */

const permission = {
    state: {
        routers: null, //菜单
        perms: null, //权限
        breadcrumbList: null //面包屑
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.routers = routers;
        },
        SET_PERMS: (state, perms) => {
            state.perms = perms;
        },
        SET_BREADCRUMBLIST: (state, menus) => {
            state.breadcrumbList = [];
            state.breadcrumbList = menus;
        }
    },
    actions: {
        //c菜单
        GenerateRoutes({ commit }, data) {
            //console.log('该用户所有的菜单：',data);
            return new Promise(resolve => {
                commit('SET_ROUTERS', data);
                resolve();
            })
        },
        //按钮权限
        GeneratePerms({ commit }, data) {
            //console.log('该用户下所有权限',data);
            return new Promise(resolve => {
                commit('SET_PERMS', data);
                resolve();
            })
        }
    }
};
export default permission;