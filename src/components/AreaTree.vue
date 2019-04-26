<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description:  筛选组件
 * @Date: 2019-01-16 13:50:55 
 * @LastEditTime: 2019-04-08 09:17:23
 -->

<template>
		<el-form-item class="area-components" label="地区" >
			<el-cascader
				v-model="selectData"
				placeholder="请选择"
				:options="data"
				:props= treeProps
				filterable
				@change= selectTree
				change-on-select
				clearable
			></el-cascader>
	</el-form-item>
</template>

<script>
	export default {
        name:"areaTree",
        props:["data"],
		data() {
			return {
				selectData:[],
                treeProps:{
					label:"name",
					value:"id"
                },
                selectData:[]
			}
		},
		mounted() {
			
		},
		watch: {
			
		},
		methods: {
            selectTree(){
                this.$emit("onSelect", this.selectData )
            }
        }
	}
	
</script>
<style rel="stylesheet/scss"  lang="scss">

.el-cascader-menu__item.is-active {
    color: #409eff;
}
.area-components .el-cascader{
	width: 100%
}

</style>
