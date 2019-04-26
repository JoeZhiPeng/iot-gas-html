<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 温度告警报表
 * @Date: 2019-03-18 16:38:14
 * @LastEditTime: 2019-04-23 15:39:54
 -->

<template>
	<div class="app-container no-padding">
		<el-tabs type="border-card" @tab-click="handleClick">
			<el-tab-pane v-if="permBtn.tem_day" label="日报表" tabName="tem_day">
				<tem-day-report></tem-day-report>
			</el-tab-pane>
			<el-tab-pane v-if="permBtn.tem_day" label="月报表" tabName="tem_month">
				<tem-month-report></tem-month-report>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import TemDayReport from './TemDayReport';		//温度日报表
	import TemMonthReport from './TemMonthReport';	//温度月报表
	import { utils } from 'src/utils';
	export default {
		components: {
		    'tem-day-report': TemDayReport,
		    'tem-month-report': TemMonthReport,
		},
		data() {
			return {
				//按钮的权限 查询query 新增add   true 显示  false 隐藏
				permBtn:{
					tem_day: true
				},
				names: 'account'//默认加载第一个
			}
		},
		mounted() {
			let vm = this;
			vm.getPerm(vm);
		},
		methods: {
			//获取当前页面的权限
			getPerm(vm){
				vm.permBtn = utils.permsButton(vm);
			},
			//tab切换
			handleClick(tab, event){
				this.names = tab.$attrs.tabName;//加载该组件
			}
		}
	}
</script>
