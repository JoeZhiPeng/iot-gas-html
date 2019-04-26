<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 用气量报表
 * @Date: 2019-04-23 15:19:40
 * @LastEditTime: 2019-04-23 16:44:02
 -->
<template>
	<div class="app-container no-padding">
		<el-tabs type="border-card" @tab-click="handleClick">
			<el-tab-pane v-if="permBtn.tem_day" label="日报表" tabName="gas_day">
				<gas-day-report></gas-day-report>
			</el-tab-pane>
			<el-tab-pane v-if="permBtn.tem_day" label="月报表" tabName="gas_month">
				<gas-month-report></gas-month-report>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import GasDayReport from './GasDayReport';		//温度日报表
	import GasMonthReport from './GasMonthReport';	//温度月报表
	import { utils } from 'src/utils';
	export default {
		components: {
		    'gas-day-report': GasDayReport,
		    'gas-month-report': GasMonthReport,
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