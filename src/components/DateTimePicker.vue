 <!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 年月日时分秒范围选择（带有快捷键） 
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-03-12 10:18:03
 -->
<template>
	<el-date-picker 
		v-model="dateTimePicker" 
		type="datetimerange" 
		:picker-options="pickerOptions" 
		:id = "dateIdArr"
		:editable = false
		range-separator="至" 
		start-placeholder="开始日期" 
		end-placeholder="结束日期" 
		value-format="yyyy-MM-dd HH:mm:ss" 
		align="center">
	</el-date-picker>
</template>

<script>
	export default {
		name: 'DateTimePicker',
		props: ['isTodayBefore'],
		data() {
			const vm = this;
			return {
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}],
					disabledDate: function(time) {
						if(vm.isTodayBefore) {
							return time.getTime() > new Date().getTime();
						} else {
							return false;
						}
					}
				},
				dateTimePicker: '',
				dateIdArr: ['start' + Math.random(),'end' + Math.random()],//日期组件id
			};
		}
	};
</script>
<style rel="stylesheet/scss" lang="scss">
	.el-date-editor--datetimerange.el-input__inner{
		width: 350px;
	}
	.el-date-editor .el-range-input{
		width: 45%;
	}
</style>
