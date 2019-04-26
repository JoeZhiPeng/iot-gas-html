<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 位置服务组件
 * @Date: 2019-04-03 17:30:57
 * @LastEditTime: 2019-04-26 14:57:54
 -->
<template>
	<div class="app-container home-con" :style="{minHeight:homeMinHeight + 'px'}">
		<div class="echarts-box">
			<div class="line fl">
				<div class="echarts-title">
					总用气量实时统计
				</div>
				<e-polyline v-if="loadState" :refName="echartsName"></e-polyline>
			</div>
			<div class="circle fr">
				<div class="echarts-title">
					<div>设备统计</div>
				</div>
				<div class="dividing-line">
					<e-circle v-if="loadState" :refName="echartsName2"></e-circle>
				</div>
				
			</div>
			<span class="clear"></span>
		</div>
		<div class="list-box">
			<el-row class="list-title">
				<el-col :span="2">设备状态列表</el-col>
				<el-col :span="22">
					<el-form :inline="true" :model="listQuery" class="">
						<el-form-item label="户主名">
							<el-input v-model="listQuery.homeMaster" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="住户电话">
							<el-input v-model="listQuery.phone" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="设备型号">
							<el-select v-model="listQuery.modelId" clearable filterable placeholder="请选择">
								<el-option label="SBH_JT1078" value="111"></el-option>
								<el-option label="SBH_JT1002" value="222"></el-option>
							</el-select>					 
						</el-form-item>
						<el-form-item label="设备工况">
							<el-select v-model="listQuery.state" clearable filterable placeholder="请选择">
								<el-option label="工作中" value="1"></el-option>
								<el-option label="关机" value="2"></el-option>
								<el-option label="温度过高" value="3"></el-option>
								<el-option label="主机故障" value="4"></el-option>
							</el-select>					 
						</el-form-item>
						<el-button class="filter-item blue-btn" type="primary" icon="iconfont iconsousuo" @click="(getList(true))">
							搜索
						</el-button>
					</el-form>
				</el-col>
			</el-row>
			
			<!-- 表格 -->
			<div class="list-table">
				<el-table ref="multipleTable" :data="list"  border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
					<el-table-column align="center" label='户主名'>
						<template slot-scope="scope">
							<i v-if="scope.row.equState == '1'" class="table-status" style="background: #15a626"></i>
							<i v-if="scope.row.equState == '2'" class="table-status" style="background: #a8a8a8"></i>
							{{scope.row.homeMaster}}
						</template>
					</el-table-column>
					<el-table-column align="center" label='电话' prop="phone"></el-table-column>
					<el-table-column align="center" label='设备型号' prop="modelName"></el-table-column>
					<el-table-column align="center" label='设备工况'>
						<template slot-scope="scope">
							<span v-if="scope.row.state == '1'" style="color: #15a626">
								工作中
							</span>
							<span v-if="scope.row.state == '2'" style="color: #a8a8a8">
								关机
							</span>
							<span v-else-if="scope.row.state == '3'" style="color: #c4090c">
								温度过高
							</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label='室内温度'>
						<template slot-scope="scope">
							<span v-if="scope.row.temperature">{{scope.row.temperature}}℃</span>
							<span v-else>--</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label='累计用气量(m³)' prop="gas"></el-table-column>
					<el-table-column align="center" label='上报时间' prop="time"></el-table-column>
				</el-table>
			</div>
		
		</div>
	</div>
</template>

<script>
	import { Message } from 'element-ui';
	import "../../assets/css/index.scss";
	import ePolyline from "../../components/echarts/ePolyline.vue"
	import eCircle from "../../components/echarts/eCircle.vue"

	export default {
		data() {
			return {
				rightConHeight: 540,
				echartsName:"echartsLine",
				echartsName2:"echartsLine2",
				listLoading: true,
				list:[],
				loadState:false,
				listQuery: {
					iDisplayLength: 10,
					iDisplayStart: 0,
					homeMaster:"",
					homeTel:"",
					modelId: "",
					state: ""
				},
			}
		},
		components: {
			ePolyline,
			eCircle
		 },
		computed: {
			homeMinHeight: function() {
				let height = document.documentElement.offsetHeight || document.body.offsetHeight;
				this.rightConHeight = height - 38;
				return this.rightConHeight;
			}
		},
		watch: {
			
		},
		beforeDestroy () {
			
		},
		mounted() {
			this.getList()
			this.$nextTick(() => {
				this.loadState = true;
			})
		},
		methods: {
			//获取列表数据
			//isBackHome 是否返回首页
			getList() {
				var vm = this;
				vm.listLoading = true;
				//调用接口
				let param = JSON.parse(JSON.stringify(vm.listQuery));
		        vm.$instance.post("/proxy/bizmgr/home/findHomeList", param).then(res =>{	
					vm.listLoading = false;
		          	if(res.status == 200){
		                vm.list = res.data.data;
		            }else{
		                Message.error({message:"调用接口失败"});
		            }
		        }).catch(error => {
		        	vm.listLoading = false;
		        });
			},
		}
	};
</script>

<style rel="stylesheet/scss" scoped lang="scss" >
	@import "src/assets/css/mixin.scss";
	.app-container{
		padding:0;
		// background:none;
	}
	
	.echarts-box{
		width: 100%;
		height: 428px;
		background:#fff;
		border: 1px solid #efeff0;
		.echarts-title{
			width: 100%;
			height: 54px;
			line-height: 54px;
			font-size: 18px;
			font-weight: 200;
			background: #efeff0;
			border-bottom: 1px solid #efeff0;
			}
		.line{
			display: inline-block;
			width: 65%;
			.echarts-title{
				padding-left: 20px;
			}
			
		}
		.circle{
			display: inline-block;
			width: 35%;
			.echarts-title{
				padding-top: 7px;
				div{
					padding-left: 20px;
					height: 40px;
					line-height: 40px;
					border-left: 1px solid #dadada;
				}
			}
		}
	}
	.list-box{
		margin-top: 20px;
		.list-title{
			width:100%;
			font-size: 18px;
			padding: 10px 0 10px 20px;
			font-weight: 200;
			background: #efeff0;
			border-top: 1px solid #dadada;
			border-bottom: 1px solid #dadada;
			.el-form-item{
				margin-bottom: 0
			}
		}
		.list-table{
			padding:20px;
			background:#fff;
		}
	}
	.dividing-line{
		padding-left: 20px;
		margin-top: 10px;
		border-left: 1px solid #dadada;
	}
	
	.table-status{
		width: 10px;
		height: 10px;
		display: inline-block;
		border-radius: 50%;
		margin-right: 5px;
	}
</style>