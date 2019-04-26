<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: app组件加载路由router-view
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-04-17 09:02:19
 -->

<template>
    <div id="app" class="apps">
        <router-view></router-view>
    </div>
</template>

<script>
	import { utils } from 'src/utils';
    export default{
      name: 'APP',
      mounted() {
        utils.setContentHeight();//自动计算高度
      },
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

