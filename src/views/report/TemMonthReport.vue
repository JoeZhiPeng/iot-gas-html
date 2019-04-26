<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description:  温度月报表
 * @Date: 2019-04-23 15:29:44
 * @LastEditTime: 2019-04-26 15:30:28
 -->
<template>
    <div>
        <!-- 搜索条件 -->
		<div class="filter-container">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="户主名">
					<el-input v-model="listQuery.homeMaster" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="住户电话">
					<el-input v-model="listQuery.phone" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="统计时间">
					<date-month-picker ref="dateMonthPicker" @changStartDate="getStartDate" @changEndDate="getEndDate"></date-month-picker>
				</el-form-item>
				<el-button class="filter-item blue-btn" type="primary" icon="iconfont iconsousuo" @click="(getList(true))">
					搜索
				</el-button>
				<el-button class="filter-item blue-btn" type="primary" icon="iconfont icondaochu" @click="exportFormLists">
					导出
				</el-button>
				<el-button class="filter-item blue-btn fr" type="primary"  @click="getLine">
					柱状图
				</el-button>
			</el-form>
		</div>
        
        <!-- 表格 -->
        <el-table ref="multipleTable" class="monthTable" :data="list" :height="height" border fit highlight-current-row element-loading-text="拼命加载中">
            <el-table-column align="center" label="时间" prop="time"></el-table-column>
            <el-table-column align="center" label="住户名" prop="homeMaster"></el-table-column>
            <el-table-column align="center" label="住户电话" prop="phone"></el-table-column>
            <el-table-column align="center" label='室内温度'>
				<template slot-scope="scope">
					<span v-if="scope.row.temperature">{{scope.row.temperature}}℃</span>
					<span v-else>--</span>
				</template>
			</el-table-column>
            <el-table-column align="center" label='详细地址' show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.areaName + scope.row.astateName + scope.row.homeNum}}</span>
                </template>
            </el-table-column>
        </el-table>
            
        <!-- 分页 -->
        <pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>
		<!-- 折线图弹窗 -->
		<div v-show="checkTrailEchartVisible" class="box2" id="echartBox2">
			<div class="el-icon-circle-close close" @click="closeEchart"></div>
			<div class="mileMonthLine" id="mileMonthLine"></div>
			<!-- <div class="switch-btn">
				<el-switch
				  	v-model="echartSwitch"
				  	active-text="折线图"
				  	inactive-text="柱状图"
				  	inactive-color="#409EFF"
				  	@change=showEchart>
				</el-switch>
			</div> -->
		</div>
    </div>
</template>

<script>
    import { utils } from 'src/utils';
    import { Message } from 'element-ui';
    import DateMonthPicker from '../../components/DateMonthPicker';//选择月组件
	import Pagination from '../../components/Pagination';
	import initEcharts  from 'src/utils/initEchart';
    export default {
        components: {
            'date-month-picker': DateMonthPicker,
			'pagination': Pagination
        },
        data () {
            return {
                height: 540,
                list:[], //表格list
                total: 0,
                //列表查询参数
                listQuery: {
                    iDisplayLength: 10,
                    iDisplayStart: 0,
                    homeMaster: "",
                    phone: "",
                    startTime:"",
                    endTime:"",
				},
				checkTrailEchartVisible: false,
				mileMonthLine: null,
            }
        },
        mounted () {
            var vm = this;
			vm.getList();
			vm.$nextTick(function(){
				utils.getTableHeight((height)=>{
					this.height = height - 42;
				});
			})
        },
        methods: {
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
				//调用接口
		        vm.$instance.post("/proxy/report/alarm/findTemListByMonth", vm.listQuery).then(res =>{
		          	if(res.status == 200){
		                vm.list = res.data.data;
						vm.total = res.data.contTotal;
		            }else{
		                Message.error({message:"调用接口失败"});
		            }
		        }).catch(error => {
		        	
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
			//选择时间start
			getStartDate(startDate){
				this.listQuery.startTime = startDate;
			},
			getEndDate(endDate){
				this.listQuery.endTime = endDate;
			},
			//选择时间end
			getLine() {
                let vm = this
				vm.checkTrailEchartVisible = true;
				document.getElementById("echartBox2").style.width = $(".monthTable").width() + 2 + "px"; //折线图的高度
                document.getElementById("echartBox2").style.height = $(".monthTable").height() + 122 + "px"; //折线图的高度
				document.getElementById("mileMonthLine").style.width = $(".monthTable").width() - 40 + "px"; //折线图的高度
				$('.box2').width($(".monthTable").width() - 40 + "px")
				$('.mileMonthLine').height($(".monthTable").height())
				initEcharts().then(echarts => {
					vm.mileMonthLine = echarts.init(document.getElementById("mileMonthLine"));
					
					// 绘制折线图
					vm.mileMonthLine.setOption({
						tooltip: {
							trigger: "axis",
							axisPointer: {
								type: "cross",
								label: {
									backgroundColor: "#6a7985"
								}
							}
						},
						
						toolbox: {
							x: "98%",
							feature: { saveAsImage: {} }
						},
						grid: {
							left: "3%",
							right: "4%",
							bottom: "3%",
							containLabel: true
						},
						xAxis: [
							{
								name : '日期',
								type: "category",
								data: ['2019-04','2019-03','2019-02','2019-01','2018-12','2018-11','2018-10','2018-09','2018-08','2018-07','2018-06','2018-05','2018-04']
							}
						],
						yAxis: [
							{
								name : '温度/℃',
								type: "value"
							}
						],
						series: [{
							data: [25,24,23,25,24,20,18,25,26,24,23,24,25],
							type: 'bar',
							label: {
								normal: {
									show: true,
									position: 'top',
									color: '#000',
								}
							},
							itemStyle: {
								normal: {
									//颜色渐变
									color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: '#f4b02d'
									}, {
										offset: 1,
										color: '#c4090c'
									}])
								}
							}
						}],
					});
				})
			},
			//关闭图表  table刷新最新的数据
			closeEchart(){
				this.checkTrailEchartVisible = false;
				this.getList();
				this.mileMonthLine.clear(); //清空echarts画布
			},
			//导出
			exportFormLists() {
				Message({
					showClose: true,
					message: "导出数据表格！",
					type: 'success',
					duration: 1500,
				});
				// utils.exportLists(this.listQuery, "/proxy/bizmgr/home/exportHome");
			},
        }
    }
    
</script>
 
<style rel="stylesheet/scss" lang="scss" scoped>
    .echart-trail-dialog {
	    .el-dialog__header {
	        background: #fff;
	        border-top: 1px solid #e9e9e9;
	    }
	    .el-dialog {
	        margin-left: 236px;
	    }
	    .el-dialog__body {
	        padding: 0 30px;
	    }
	    .el-dialog__headerbtn .el-dialog__close {
	        color: red;
	    }
	}
	
	.box2 {
	    border: 1px solid #e9e9e9;
	    background: #fff !important;
	    position: absolute;
	    top: 15px;
        padding: 10px 30px 0 10px;
        z-index: 10;
        
	    @at-root & {
	        @media all and (max-width: 1400px)  {
	            & {
	                padding: 30px 30px 0 10px;
	            }
	        }
	    }
	    .close {
	        position: absolute;
	        width: 20px;
	        height: 20px;
	        right: 8px;
	        top: 15px;
	        color: red;
	        font-size: 20px;
	        cursor: pointer;
	        @at-root & {
		        @media all and (max-width: 1400px)  {
		            & {
		                top: 10px;
		            }
		        }
		    }
	    }
	}
	.mileMonthLine,
	.mileMonthLine > div:first-child,
	canvas {
		width: 100%;
		top: 5%;
    }
</style>