<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 告警监控
 * @Date: 2019-04-23 17:24:36
 * @LastEditTime: 2019-04-25 14:12:02
 -->
<template>
	<div class="app-container">
		<!-- 搜索条件 -->
		<div class="filter-container">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
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
                <el-form-item label="告警类型">
					<el-select v-model="listQuery.astateId" clearable filterable placeholder="请选择">
						<el-option label="温度过高" value='1'></el-option>  
						<el-option label="主机故障" value='2'></el-option>
					</el-select>					 
				</el-form-item>
				<el-form-item label="是否已读">
					<el-select v-model="listQuery.isRead" clearable filterable placeholder="请选择">
						<el-option label="已读" value="1"></el-option>
						<el-option label="未读" value="2"></el-option>
					</el-select>					 
				</el-form-item>
                <el-form-item label="告警时间">
					<date-time-picker ref="dateTimePicker"></date-time-picker>
				</el-form-item>
				<el-button class="filter-item blue-btn" type="primary" icon="iconfont iconsousuo" @click="(getList(true))">
					搜索
				</el-button>
				<el-button class="filter-item blue-btn read-btn" type="primary" icon="el-icon-view" @click="(getList(true))">
					标记为已读
				</el-button>
			</el-form>
		</div>

	<!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" type="selection" width="35"></el-table-column>
			<el-table-column align="center" label='户主姓名' prop="homeMaster"></el-table-column>
			<el-table-column align="center" label="户主电话" prop="phone"></el-table-column>
            <el-table-column align="center" label="设备型号" prop="modelName"></el-table-column>
			<el-table-column align="center" label="告警类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.alarmType == 1">温度过高</span>
					<span v-else>主机故障</span>
				</template>
            </el-table-column>
            <el-table-column align="center" label='详细住址' prop="address" show-overflow-tooltip>
					<template slot-scope="scope">
						<span>{{scope.row.address + scope.row.homeNum}}</span>
					</template>
				</el-table-column>
			<el-table-column align="center" label="告警开始时间" prop="startTime"></el-table-column>
			<el-table-column align="center" label="告警结束时间" prop="endTime"></el-table-column>
			<el-table-column align="center" label="是否已读">
                <template slot-scope="scope">
                    <span v-if="scope.row.isRead == 1">已读</span>
					<span v-else style="color: #c4090c">未读</span>
				</template>
            </el-table-column>
		</el-table>
		
		<!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>	
	</div>	
</template>

<script>
    import { utils } from 'src/utils';
	import { validate } from 'utils/validate';
	import { Message } from 'element-ui';
    import Pagination from '../../components/Pagination';
    import DateTimePicker from "../../components/DateTimePicker"; //日期组件
    
    export default {
        components: {
            "date-time-picker": DateTimePicker, //日期组件
			'pagination': Pagination,
        },
        data () {
            return {
                //按钮的权限 查询query 新增add   true 显示  false 隐藏
				permBtn:{
	                
				},
				height: 540,
				list:[], //表格list
				total: 0,
				listLoading: true,
				//列表查询参数
				listQuery: {
					iDisplayLength: 10,
					iDisplayStart: 0,
					contacts: "",
					factoryName: "",
					address: "",
					phone: "",
				},
            }
        },
        mounted () {
            var vm = this;
			vm.getPerm();
			vm.getList();
			vm.$nextTick(function(){
				utils.getTableHeight((height)=>{
					this.height = height;
				});
			})
        },
        methods: {
            //获取当前页面的权限
			getPerm(){
				this.permBtn = utils.permsButton(this);
			},
			//获取列表数据
			//isBackHome 是否返回首页
			getList(isBackHome = false) {
				var vm = this;
				if (isBackHome) {
					if (vm.listQuery.iDisplayStart != 0) {
						vm.$refs.page.backFirstPage();
						return;
					}
				}
				vm.listLoading = true;
				
				//调用接口
		        vm.$instance.post("/proxy/monitor/alarm/alarmList", vm.listQuery).then(res =>{
					vm.listLoading = false;
		          	if(res.status == 200){
		                vm.list = res.data.data;
						vm.total = res.data.contTotal;
		            }else{
		                Message.error({message:"调用接口失败"});
		            }
		        }).catch(error => {
		        	vm.listLoading = false;
		        });
			},
			/**
			 * 分页改变，加载数据
			 */
			paginationChange(pageData) {
				this.listQuery.iDisplayStart = pageData.iDisplayStart;
				this.listQuery.iDisplayLength = pageData.iDisplayLength;
				this.getList();
			},
        }
    }
</script>

<style lang="scss" scoped>
	.read-btn{
		height: 30px;
	}
</style>
