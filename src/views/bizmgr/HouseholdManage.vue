<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 住户管理
 * @Date: 2019-03-20 11:07:17
 * @LastEditTime: 2019-04-26 14:10:32
 -->

<template>
	<div class="app-container">
		<!-- 搜索条件 -->
		<div class="filter-container household">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="户主名">
					<el-input v-model="listQuery.homeMaster" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="住户电话">
					<el-input v-model="listQuery.phone" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="门牌号">
					<el-input v-model="listQuery.homeNum" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="住户类型">
					<el-select v-model="listQuery.homeType" clearable placeholder="请选择">
						<el-option label="高端型" value='1'></el-option>  
						<el-option label="经济型" value='2'></el-option>  
					</el-select>					 
				</el-form-item>
				<!-- <el-form-item label="运行状态">
					<el-select v-model="listQuery.state" clearable placeholder="请选择">
						<el-option label="开机" value='1'></el-option>  
						<el-option label="关机" value='2'></el-option>  
						<el-option label="故障" value='3'></el-option>
					</el-select>					 
				</el-form-item> -->
				<el-form-item label="设备ICCID">
					<el-input v-model="listQuery.equImei" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="设备型号">
					<el-select v-model="listQuery.homeType" clearable placeholder="请选择">
						<el-option label="SBH_JT1078" value='1'></el-option>  
						<el-option label="SBH_JT1002" value='2'></el-option>  
					</el-select>					 
				</el-form-item>
				<el-button class="filter-item blue-btn" type="primary" icon="iconfont iconsousuo" @click="(getList(true))">
					搜索
				</el-button>
				<el-button class="filter-item green-btn" type="primary" icon="iconfont iconxinzeng" @click="handleCreate">
					新增
				</el-button>
				<el-button class="filter-item red-btn" type="primary" icon="iconfont iconqingchu-" @click="delMoreEqu">
					批量删除
				</el-button>
				<el-dropdown split-button class="own-btn yellow-btn" type="primary" @click="handleClickOnOff(1)">
					<i class="iconfont iconIC_kaiguan"></i>开关设备
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item class="dropdown-name" command="e" disabled>住户类型</el-dropdown-item>
						<el-dropdown-item divided @click.native="handleClickOnOff(2)">高端型</el-dropdown-item>
						<el-dropdown-item @click.native="handleClickOnOff(2)">经济型</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-dropdown split-button class="own-btn panGreen-btn" type="primary" @click="temperatureControl(1)">
					<i class="iconfont iconwendu"></i>温度控制
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item class="dropdown-name" command="e" disabled>住户类型</el-dropdown-item>
						<el-dropdown-item divided @click.native="temperatureControl(2)">高端型</el-dropdown-item>
						<el-dropdown-item @click.native="temperatureControl(2)">经济型</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-dropdown split-button class="own-btn blue-btn" type="primary" @click="upgradeFirmware(1)">
					<i class="iconfont icongujianshengji"></i>固件升级
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item class="dropdown-name" command="e" disabled>住户类型</el-dropdown-item>
						<el-dropdown-item divided @click.native="upgradeFirmware(2)">高端型</el-dropdown-item>
						<el-dropdown-item @click.native="upgradeFirmware(2)">经济型</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-dropdown split-button class="own-btn bloodRed-btn" type="primary" @click="setParams(1)">
					<i class="iconfont iconcanshupeizhi"></i>参数配置
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item class="dropdown-name" command="e" disabled>住户类型</el-dropdown-item>
						<el-dropdown-item divided @click.native="setParams(2)">高端型</el-dropdown-item>
						<el-dropdown-item @click.native="setParams(2)">经济型</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-form-item class="import-btn">
					<el-button class="filter-item panGreen-btn" type="primary" icon="icon iconfont icondaoru" @click="importForm">导入 </el-button>
					<import :importVisible="importVisible" @changeImport="changeImports($event)"></import> 
				</el-form-item>
				<el-button class="filter-item blue-btn" type="primary" icon="iconfont icondaochu" @click="exportFormLists">
					导出
				</el-button>
			</el-form>
		</div>
		
		<!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中"
			@selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="35"></el-table-column>
			<el-table-column align="center" label='户主姓名' prop="homeMaster"></el-table-column>
			<el-table-column align="center" label="户主电话	" prop="phone"></el-table-column>
			<el-table-column align="center" label='门牌号' prop="homeNum"></el-table-column>
			<el-table-column align="center" label="住户类型">
				<template slot-scope="scope">
                    <span v-if="scope.row.homeType == '1'">高端型</span>
                    <span v-if="scope.row.homeType == '2'">经济型</span>
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" label='室内温度'>
				<template slot-scope="scope">
					<span v-if="scope.row.temperature">{{scope.row.temperature}}℃</span>
					<span v-else>--</span>
				</template>
			</el-table-column> -->
			<el-table-column align="center" label='设备型号' prop="modelName"></el-table-column>
			<el-table-column align="center" label='地址' show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{scope.row.address}}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" label="运行状态" prop="state" width="90">
				<template slot-scope="scope">
					<span v-if="scope.row.state == '1'">
						<i class="iconfont iconduihao"></i>
					</span>
					<span v-if="scope.row.state == '2'">
						<i class="iconfont icontingzhi"></i>
					</span>
					<span v-else-if="scope.row.state == '3'">
						<i class="iconfont icongantanhao"></i>
					</span>
				</template>
			</el-table-column> -->
			
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-dropdown  class="own-btn blue-btn" trigger="click">
						<el-button type="primary">
							更多操作<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="handleCheck(scope.$index, scope.row)">查看</el-dropdown-item>
							<el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)">修改</el-dropdown-item>
							<el-dropdown-item @click.native="handleDelete(scope.$index, scope.row)">删除</el-dropdown-item>
							<el-dropdown-item @click.native="temperatureControl(1, scope.row)">温度控制</el-dropdown-item>
							<el-dropdown-item @click.native="handleClickOnOff(1, scope.row)">开关设备</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		
		<!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>
		
		<!--新增弹框-->
		<el-dialog title="新增" :visible.sync="addFormVisible" top="10%" width="700px" lock-scroll class="dialog"
			:close-on-click-modal="false" @close="$refs.addDialogForm.resetFields()" :close-on-press-escape="false">
			<el-form class="small-space" ref="addDialogForm" :rules="rules" :model="addForm" label-position="left" label-width="120px" v-loading="addLoad" element-loading-text="拼命加载中">
				<el-row>
					<el-col :span="12">
						<el-form-item label="户主名：" prop="homeMaster">
							<el-input v-model="addForm.homeMaster" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="门牌号：" prop="homeNum">
							<el-input v-model="addForm.homeNum" placeholder="请输入" clearable></el-input>
						</el-form-item>
						
						<el-form-item label="设备厂家：" prop="factoryId">
							<el-select v-model="addForm.factoryId" clearable filterable placeholder="请选择">
								<el-option label="厂家一" value="123456"></el-option>
								<el-option label="厂家二" value="001"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备ICCID：" prop="equPhone">
							<el-input v-model="addForm.equPhone" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="户主电话：" prop="phone">
							<el-input v-model="addForm.phone" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="住户类型：" prop="factoryId">
							<el-select v-model="addForm.homeType" clearable filterable placeholder="请选择">
								<el-option label="高端型" value="1"></el-option>
								<el-option label="经济型" value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备型号：" prop="modelId">
							<el-select v-model="addForm.modelId" clearable filterable placeholder="请选择">
								<el-option label="SBH_JT1078" value="111"></el-option>
								<el-option label="SBH_JT1002" value="222"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="详细住址：" prop="address">
							<el-input v-model="addForm.address" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="addFormVisible = false; $refs.addDialogForm.resetFields();">取 消</el-button>
					<el-button type="primary" @click="handleCreateSubmit('addDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
				
			</el-form>
		</el-dialog>

		<!--修改弹框-->
		<el-dialog title="修改" :visible.sync="editFormVisible"  @close="$refs.editDialogForm.resetFields()" top="10%" width="700px" lock-scroll class="dialog"
			:close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="editDialogForm" :rules="rules" :model="editForm" label-position="left" label-width="120px" v-loading="addLoad" element-loading-text="拼命加载中">	
				<el-row>
					<el-col :span="12">
						<el-form-item label="户主名：" prop="homeMaster">
							<el-input v-model="editForm.homeMaster" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="门牌号：" prop="homeNum">
							<el-input v-model="editForm.homeNum" placeholder="请输入" clearable></el-input>
						</el-form-item>
						
						<el-form-item label="设备厂家：" prop="factoryId">
							<el-select v-model="editForm.factoryId" clearable filterable placeholder="请选择">
								<el-option label="厂家一" value="123456"></el-option>
								<el-option label="厂家二" value="001"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备ICCID：" prop="equPhone">
							<el-input v-model="editForm.equPhone" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="户主电话：" prop="phone">
							<el-input v-model="editForm.phone" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="住户类型：" prop="factoryId">
							<el-select v-model="editForm.homeType" clearable filterable placeholder="请选择">
								<el-option label="高端型" value="1"></el-option>
								<el-option label="经济型" value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备型号：" prop="modelId">
							<el-select v-model="editForm.modelId" clearable filterable placeholder="请选择">
								<el-option label="SBH_JT1078" value="111"></el-option>
								<el-option label="SBH_JT1002" value="222"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="详细住址：" prop="address">
							<el-input v-model="editForm.address" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="editFormVisible = false; $refs.editDialogForm.resetFields(); editForm = []">取 消</el-button>
					<el-button type="primary" @click="handleEditSubmit('editDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!--查看弹框-->
		<el-dialog title="查看" :visible.sync="checkFormVisible"  @close="$refs.checkDialogForm.resetFields()" top="10%" width="700px" lock-scroll class="dialog"
			:close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="checkDialogForm" :model="checkForm" label-position="left" label-width="120px" element-loading-text="拼命加载中">	
				<el-row>
					<el-col :span="12">
						<el-form-item label="户主名：">
							<span>{{checkForm.homeMaster}}</span>
						</el-form-item>
						<el-form-item label="门牌号：">
							<span>{{checkForm.homeNum}}</span>
						</el-form-item>
						<el-form-item label="设备厂家：">
							<span>{{checkForm.factoryName}}</span>
						</el-form-item>
						<el-form-item label="设备ICCID：">
							<span>{{checkForm.equPhone}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="户主电话：">
							<span>{{checkForm.phone}}</span>
						</el-form-item>
						<el-form-item label="住户类型：">
							<span v-if="checkForm.homeType == 1">高端型</span>
							<span v-if="checkForm.homeType == 2">经济型</span>
						</el-form-item>
						<el-form-item label="设备型号：">
							<span>{{checkForm.modelName}}</span>
						</el-form-item>
						<el-form-item label="详细住址：">
							<span>{{checkForm.address}}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-dialog>

		<!-- 开关设备 -->
		<el-dialog title="设备开关" :visible.sync="switchFromVisible"  top="10%" width="600px" lock-scroll class="dialog" 
			:close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="swithDialogForm" :rules="rules" :model="swithFrom" label-position="left" label-width="70px" element-loading-text="拼命加载中">
				<input type="checkbox" id="swith" class="swithBtn" :checked='isChecked'>
				<label for="swith"></label>
				<el-form-item class="formButton">
					<el-button @click="switchFromVisible = false;">取 消</el-button>
					<el-button type="primary" @click="handleSwithSubmit('swithDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		
		<!-- 温度控制 -->
		<el-dialog title="温度控制" :visible.sync="temperatureVisible"  top="10%" width="500px" lock-scroll class="dialog" 
			:close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="temperatureDialogForm" :rules="rules" :model="temperatureFrom" label-position="left" label-width="70px" element-loading-text="拼命加载中">
				<el-row>
					<el-col :span="18" class="temperature-text">
						<img src="../../assets/img/temperature.png">
						<span>{{temperatureFrom.temperature}}℃</span>
					</el-col>
					<el-col :span="6">
						<div class="block temperature">
							<el-slider
								v-model="temperatureFrom.temperature"
								vertical
								height="150px"
								:min="15"
								:max="30"
								:show-tooltip="false">
							</el-slider>
						</div>
					</el-col>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="temperatureVisible = false;">取 消</el-button>
					<el-button type="primary" @click="handleTemperatureSubmit('temperatureDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 固件升级 -->
		<el-dialog title="固件升级" :visible.sync="firmwareVisible"  top="10%" width="400px" lock-scroll class="dialog" 
			:close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="firmwareDialogForm" :rules="firmwareRules" :model="firmwareFrom" label-position="left" label-width="100px" element-loading-text="拼命加载中">
				<el-form-item label="固件：" prop="firmwareId">
					<el-select v-model="firmwareFrom.firmwareId" clearable filterable placeholder="请选择">
						<el-option label="固件一" value="001"></el-option>
						<el-option label="固件二" value="002"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="formButton">
					<el-button @click="firmwareVisible = false;">取 消</el-button>
					<el-button type="primary" @click="handleFirmwareSubmit('firmwareDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 参数配置 -->
		<el-dialog title="参数配置" :visible.sync="configVisible"  top="10%" width="400px" lock-scroll class="dialog" 
			:close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="configDialogForm" :rules="firmwareRules" :model="configFrom" label-position="left" label-width="110px" element-loading-text="拼命加载中">
				<el-form-item label="心跳间隔：">
					<el-select v-model="configFrom.areaId" clearable filterable placeholder="请选择">
						<el-option label="5" value="001"></el-option>
						<el-option label="10" value="002"></el-option>
					</el-select>
				</el-form-item>
				
			
				<el-form-item label="上报间隔：">
					<el-select v-model="configFrom.areaId" clearable filterable placeholder="请选择">
						<el-option label="5" value="001"></el-option>
						<el-option label="10" value="002"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="服务器IP：">
					<el-input v-model="configFrom.ip" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="端口：">
					<el-input v-model="configFrom.port" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item class="formButton">
					<el-button @click="configVisible = false;">取 消</el-button>
					<el-button type="primary" @click="handleConfigSubmit('configDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import "../../assets/css/index.scss";
	import { Message } from 'element-ui';
	import { validate } from 'utils/validate';
	import { utils } from 'src/utils';
	import Import from '../../components/Import'; //导入弹框组件
	import Pagination from '../../components/Pagination';
	import DepartSelect from '../../components/DepartSelect';
	import AreaTree from "../../components/AreaTree"
	import { debug, debuglog } from 'util';

	export default {
		components: {
			'import': Import,
			'pagination': Pagination,
			'depart_select':DepartSelect,
			"area-tree": AreaTree
		 },
		data() {
			const vm =this;
				//身份证验证唯一性
			const validateIdCardOnly = (rule, value, callback) => {
				//先去判断是不是确定，如果是，直接获取上次验证的结果，如果不是在请求验证
				if (vm.isValidate.isOk) {
					if (vm.isValidate.idcard) {
						callback();
						return;
					}
				} else {
					vm.isValidate.idcard = false;
				}
				if (value === '' || value === null) {
					callback(new Error('请输入身份证号'));
				} else {
					let param = {};
					param.idcard = value;
					// param.flags = true;
					if (vm.editFormVisible == true) {
						param.homeId = vm.editForm.homeId;
					}
					vm.$instance.get("/proxy/bizmgr/home/uniqueIdcard", {params:param}).then(res =>{
						if(res.status == 200){
							//唯一
							if (res.data.success) {
								vm.isValidate.idcard = true;
								callback();
							} else { //不唯一
								callback("身份证号不唯一，请重新输入！");
							}
						}else{
							callback("调用接口失败");
						}
					}).catch(error => {callback(error);});
				}
			}
			return {
				//按钮的权限 查询query 新增add   true 显示  false 隐藏
				permBtn:{
	                householuer_add: false,
					householuer_delete: false, 
					householuer_modify: false, 
					householuer_check: false, 
					equment_Rule: false,
					householuer_import: false,
					householuer_export: false
				},
				treeProps:{
					label:"name",
					value:"id"
				},
				//导入模板的参数
				importVisible:{
					path:"home",
					imports: false,//弹框是否显示
					templateName: 'biz_home',//下载模板的名称
				},
				list:[], //表格list
				total: 0,
				listLoading: true,
				height: 540,
				multipleSelection: [], //表格的多选数据
				multipleSelectionIds: [], //表格的多选ID数据
				
				//列表查询参数
				listQuery: {
					iDisplayLength: 10,
					iDisplayStart: 0,
					areaId: "",
					astateId: "",
					equImei:"",
					equPhone:"",
					homeMaster:"",
					homeNum:"",
					phone:"",
					state:""
				},
				addLoad: false,//新增加载状态
				addFormVisible: false, //新增弹框
				editFormVisible: false, //修改弹框
				checkFormVisible: false, //查看详情弹框
				switchFromVisible: false, //开关设备弹框
				temperatureVisible: false, //温度控制弹框
				firmwareVisible: false, //固件升级弹框
				configVisible: false, //参数设置弹框
				//唯一性验证状态记录
				isValidate:{
					isOk: false ,  //点击确定第一时间将此变量设置为true
					idcard: false,
					area: false,
				},
				
				type: 1, //当前操作的是1:住户、2:小区  
				addForm:{  //新增参数
					homeMaster:"",
					homeNum:"",
					astateId:"",
					areaId:"",
					equImei:"",
					equPhone:"",
					idcard:"",
					modelId:"",
					phone:"",
					factoryId:"",
				},
				editForm:{  //修改参数

				},
				checkForm: {

				},
				isChecked: false, //设备开关默认为false
				swithFrom: {  //设备开关参数
					type: 1,
					ids: [],
					onoff: 1
				},
				temperatureFrom: { //温度控制参数
					type: 1,
					ids: [],
					temperature: 0
				},
				firmwareFrom: { //固件升级参数
					type: 1,
					ids: [],
					firmwareId: null
				},
				configFrom: { //参数配置参数
					type: 1,
					ids: [],
					ip: null,
					port: null,
					heart: null,
					temperature: null
				},
				//新增修改数据校验
				rules: {
					homeMaster: [
						{ required: true,message: '请输入户主名', trigger:'blur' }
					],
					homeNum: [
						{ required: true, message: '请输入门牌号', trigger: 'blur' }
					],
					phone: [
						{ required: true, message: '请输入户主电话', trigger: 'blur' },
						{ required: true, validator:validate.validateTelphone, trigger: 'blur' },
					],
					address: [
						{ required: true, message: '请输入详细住址', trigger: 'blur' }
					],
					equPhone: [
						{ required: true, message: '请输入设备ICCID', trigger: 'blur' }
					],
					factoryId: [
						{ required: true, message: '请选择设备厂家', trigger: 'change' }
					],
					modelId: [
						{ required: true, message: '请选择设备型号', trigger: 'change' }
					],
					homeType: [
						{ required: true, message: '请选择住户类型', trigger: 'change' }
					]
				},
				firmwareRules: {
					firmwareId: [
						{ required: true, message: '请选择固件', trigger: 'change' }
					]
				}
			}
		},
		
		mounted() {
			var vm = this;
			vm.getPerm();
			vm.getList();
			this.$nextTick(function(){
				utils.getTableHeight((height)=>{
					this.height = height;
				});
			})
		},
		//实例销毁之间调用。在这一步，实例仍然完全可用。   时间定时器
		beforeDestroy(){
			
		},
		methods: {
			//获取当前页面的权限
			getPerm(){
				this.permBtn = utils.permsButton(this);
			},

			//获取列表数据  isBackHome 是否返回首页
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
				let param = JSON.parse(JSON.stringify(vm.listQuery));
		        vm.$instance.post("/proxy/bizmgr/home/findHomeList", param).then(res =>{	
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
			
			//分页改变，加载数据
			paginationChange(pageData) {
				this.listQuery.iDisplayStart = pageData.iDisplayStart;
				this.listQuery.iDisplayLength = pageData.iDisplayLength;
				this.getList();
			},

			//打开新增弹窗
			handleCreate(){
				if (this.$refs.addDepartSelect) {
					this.$refs.addDepartSelect.deptClear();
				}
				this.addFormVisible = true;
				this.resetForm("addDialogForm");
			},

			//新增验证
			handleCreateSubmit(formName) {								
				this.isValidate.isOk = true;
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						this.createSubmit();
					}
					this.isValidate.isOk = false;
				});
			},
			
			//新增确定
			createSubmit(){
				let params = JSON.parse(JSON.stringify(this.addForm));
				this.addLoad = true;
				let vm = this;
				this.$instance.post("/proxy/bizmgr/home/insertHome", params).then(res =>{
					if(res.status == 200){
						this.addLoad = false;
						if (res.data.success) {
							this.addFormVisible = false;	
							this.$refs.addDialogForm.resetFields();
							Message({
								showClose: true,
								message: "新增成功",
								type: 'success',
								duration: 1500 ,
								onClose: function(){
									vm.getList();
								}
					        });
						} else {
							Message.error({message:res.data.errorMsg});
							
						}						
					}else{
						Message.error({message:"调用接口失败"});
						this.addLoad = false;
					}
				}).catch(error => {this.addLoad = false;Message.error({message:"调用接口失败"});});	
			},

			//打开修改弹窗
			handleEdit(idnex, row) {
				this.resetForm("editDialogForm");
				let editData = JSON.parse(JSON.stringify(row))
				this.editForm = {
					areaId: editData.areaId,
					astateId: editData.astateId,
					equId: editData.equId,
					equImei: editData.equImei,
					equPhone: editData.equPhone,
					factoryId: editData.factoryId,
					homeMaster: editData.homeMaster,
					homeNum: editData.homeNum,
					idcard: editData.idcard,
					modelId: editData.modelId,
					phone: editData.phone,
					address: editData.address,
					homeType: editData.homeType
				};
				this.editFormVisible = true;
			},

			//修改验证
			handleEditSubmit(formName) {	
				this.isValidate.isOk = true;
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						this.editSubmit();
					}
					this.isValidate.isOk = false;
				});
			},

			//修改确定	
			editSubmit(){
				let vm = this;
				vm.isValidate.isOk = true;
				let params = JSON.parse(JSON.stringify(vm.editForm));
				vm.addLoad = true;
				
				vm.$instance.post("/proxy/bizmgr/home/updateHome", params).then(res =>{
					if(res.status == 200){
						vm.addLoad = false;
						if (res.data.success) {
							vm.editFormVisible = false;	
							vm.$refs.editDialogForm.resetFields();
							vm.isValidate.isOk = false;
							Message({
								showClose: true,
								message: "修改成功",
								type: 'success',
								duration: 1000 ,
								onClose: function(){
									vm.getList();
								}
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}						
					}else{
						Message.error({message:"调用接口失败"});
						this.addLoad = false;
					}
				}).catch(error => {this.addLoad = false;Message.error({message:"调用接口失败"});});	
			},

			//查看
			handleCheck(idnex, row) {
				this.resetForm("checkDialogForm");
				this.checkForm = row;
				this.checkFormVisible = true;
			},

			//表格的多选
			handleSelectionChange(val) {
				this.multipleSelection = [];
				this.multipleSelectionIds = [];
				val.forEach(element => {
					let param = {
						equId: element.equId,
						state: element.state
					}
					this.multipleSelection.push(param);
					this.multipleSelectionIds.push(element.equId)
				});
			},

			//批量删除
			delMoreEqu() {
				let vm = this
				if(!vm.multipleSelection.length) {
					Message({
						message: '请选择需要删除的住户！',
						type: 'warning',
						duration: 1500
					});
					return;
				}
				let param = {
					alarmIds: vm.multipleSelectionIds
				}
				vm.$confirm('是否删除住户！', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//调用接口
					vm.$instance.post("/proxy/bizmgr/home/deleteHome", param).then(res =>{
						if(res.status == 200){
							if (res.data.success) {
								Message.success({message: '删除成功！'}); 
								vm.$refs.page.deleteItemReLoadList();
							} else {
								Message.error({message:res.data.errorMsg});
							}
						}else{
							Message.error({message:"调用接口失败"});
						}
					}).catch(error => {});
				}).catch(() => {
					Message.info({message: '已取消删除'});          
				});
			},

			//单个删除
			handleDelete(index, row) {
				if(row.equId){
					Message.error({message:"已绑定设备的住户不能删除！"});
					return
				}
				let param = {};
				param.alarmIds = row.equId.split(",");
				//确定删除
				this.$confirm('是否删除住户！', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//调用接口
					this.$instance.post("/proxy/bizmgr/home/deleteHome", param).then(res =>{
						if(res.status == 200){
							if (res.data.success) {
								Message.success({message: '删除成功！'}); 
								this.$refs.page.deleteItemReLoadList();
							} else {
								Message.error({message:res.data.errorMsg});
							}
						}else{
							Message.error({message:"调用接口失败"});
						}
					}).catch(error => {});
				}).catch(() => {
					Message.info({message: '已取消删除'});          
				});
			},

			//设备开关
			handleClickOnOff(type, row) {
				let vm = this
				vm.type = type
				vm.swithFrom.type = type
				vm.swithFrom.ids = [];
				if(type == 1) {
					if(row) {
						vm.switchFromVisible = true;
						vm.swithFrom.ids.push(row.equId);
						if(row.state == 2) {
							vm.isChecked = false
						} else {
							vm.isChecked = true
						}
					} else {
						if(!vm.multipleSelection.length) {
							Message({
								message: '请选择需要操作的住户！',
								type: 'warning',
								duration: 1500
							});
							return;
						}
						vm.switchFromVisible = true;
						vm.swithFrom.ids = vm.multipleSelectionIds
					}
				} else {
					vm.switchFromVisible = true;
				}
			},

			handleSwithSubmit(formName) {
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						this.swithSubmit();
					}
				});
			},
			swithSubmit() {
				let vm = this
				if(vm.type == 2) {
					vm.swithFrom.ids.push(vm.swithFrom.astateId)
				}
				if(vm.isChecked) {
					vm.swithFrom.onoff = 2
				} else {
					vm.swithFrom.onoff = 1
				}
				let params = vm.swithFrom;
				vm.$instance.post("/proxy/bizmgr/home/onfff", params).then(res =>{
					if(res.status == 200){
						vm.addLoad = false;
						if (res.data.success) {
							vm.switchFromVisible = false;	
							vm.$refs.swithDialogForm.resetFields();
							Message({
								showClose: true,
								message: "下发指令成功",
								type: 'success',
								duration: 1500 ,
								onClose: function(){
									vm.getList();
								}
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}						
					}else{
						Message.error({message:"调用接口失败"});
						this.addLoad = false;
					}
				}).catch(error => {this.addLoad = false;Message.error({message:"调用接口失败"});});	
			},

			//温度控制
			temperatureControl(type, row) {
				let vm = this
				vm.type = type
				vm.temperatureFrom.type = type
				vm.temperatureFrom.ids = [];
				if(type == 1) {
					if(row) {
						vm.temperatureVisible = true;
						vm.temperatureFrom.ids.push(row.equId);
						vm.temperatureFrom.temperature = row.temperature;
					} else {
						if(!vm.multipleSelection.length) {
							Message({
								message: '请选择需要操作的住户！',
								type: 'warning',
								duration: 1500
							});
							return;
						}
						vm.temperatureVisible = true;
						vm.temperatureFrom.ids = vm.multipleSelectionIds
					}
				} else {
					vm.temperatureVisible = true;
				}
			},

			handleTemperatureSubmit(formName) {
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						this.temperatureSubmit();
					}
				});
			},
			temperatureSubmit() {
				let vm = this
				if(vm.type == 2) {
					vm.temperatureFrom.ids.push(vm.temperatureFrom.astateId)
				}
				let params = vm.temperatureFrom;
				vm.$instance.post("/proxy/bizmgr/home/temperatureControl", params).then(res =>{
					if(res.status == 200){
						vm.addLoad = false;
						if (res.data.success) {
							vm.temperatureVisible = false;	
							vm.$refs.temperatureDialogForm.resetFields();
							Message({
								showClose: true,
								message: "下发指令成功",
								type: 'success',
								duration: 1500 ,
								onClose: function(){
									vm.getList();
								}
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}						
					}else{
						Message.error({message:"调用接口失败"});
						this.addLoad = false;
					}
				}).catch(error => {
					this.addLoad = false;
					Message.error({message:"调用接口失败"});
				});	
			},

			//固件升级
			upgradeFirmware(type, row) {
				let vm = this
				vm.type = type
				vm.firmwareFrom.type = type
				vm.firmwareFrom.ids = [];
				if(type == 1) {
					if(row) {
						vm.firmwareVisible = true;
						vm.firmwareFrom.ids.push(row.equId);
					} else {
						if(!vm.multipleSelection.length) {
							Message({
								message: '请选择需要操作的住户！',
								type: 'warning',
								duration: 1500
							});
							return;
						}
						vm.firmwareVisible = true;
						vm.firmwareFrom.ids = vm.multipleSelectionIds
					}
				} else {
					vm.firmwareVisible = true;
				}
			},
			handleFirmwareSubmit(formName) {
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						this.firmwareSubmit();
					}
				});
			},
			firmwareSubmit() {
				let vm = this
				if(vm.type == 2) {
					vm.firmwareFrom.ids.push(vm.firmwareFrom.astateId)
				}
				let params = vm.firmwareFrom;
				vm.$instance.post("/proxy/bizmgr/home/upgradeFirmware", params).then(res =>{
					if(res.status == 200){
						vm.addLoad = false;
						if (res.data.success) {
							vm.firmwareVisible = false;	
							vm.$refs.firmwareDialogForm.resetFields();
							Message({
								showClose: true,
								message: "下发指令成功",
								type: 'success',
								duration: 1500 ,
								onClose: function(){
									vm.getList();
								}
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}						
					}else{
						Message.error({message:"调用接口失败"});
						this.addLoad = false;
					}
				}).catch(error => {
					this.addLoad = false;
					Message.error({message:"调用接口失败"});
				});	
			},

			//参数配置
			setParams(type, row) {
				let vm = this
				vm.type = type
				vm.configFrom.type = type
				vm.configFrom.ids = [];
				if(type == 1) {
					if(row) {
						vm.configVisible = true;
						vm.configFrom.ids.push(row.equId);
					} else {
						if(!vm.multipleSelection.length) {
							Message({
								message: '请选择需要操作的住户！',
								type: 'warning',
								duration: 1500
							});
							return;
						}
						vm.configVisible = true;
						vm.configFrom.ids = vm.multipleSelectionIds
					}
				} else {
					vm.configVisible = true;
				}
			},
			handleConfigSubmit(formName) {
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						this.configSubmit();
					}
				});
			},
			configSubmit() {
				let vm = this
				if(vm.type == 2) {
					vm.configFrom.ids.push(vm.configFrom.astateId)
				}
				let params = vm.configFrom;
				vm.$instance.post("/proxy/bizmgr/home/setParams", params).then(res =>{
					if(res.status == 200){
						vm.addLoad = false;
						if (res.data.success) {
							vm.configVisible = false;	
							vm.$refs.configDialogForm.resetFields();
							Message({
								showClose: true,
								message: "下发指令成功",
								type: 'success',
								duration: 1500 ,
								onClose: function(){
									vm.getList();
								}
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}						
					}else{
						Message.error({message:"调用接口失败"});
						this.addLoad = false;
					}
				}).catch(error => {
					this.addLoad = false;
					Message.error({message:"调用接口失败"});
				});	
			},
			
			//导入
      		//打开导入文件的弹框
			importForm(){
				this.importVisible.imports = true;
			},
			//关闭导入文件弹框
			changeImports(param){
				this.importVisible.imports = param;
				this.getList(true);
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

			// 重置表单
			resetForm(formName) {
				if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
			}
		}
		
	}
	
</script>
<style rel="stylesheet/scss" lang="scss">
	.small-space .el-select{
		width: 100%;	
	}
	.el-cascader >.el-input{
		width: 100% !important;
	} 
	
	.household {
		&.filter-container{
			.import-btn{
				margin: 0;
			}
		}
	}
	
	.swithBtn{display: none}
	.swithBtn + label{
		display: inline-block;
		width: 400px;
		height: 129px;
		background: url('../../assets/img/off.png');
		cursor: pointer;
		vertical-align: middle;
		margin: 20px 0 0 80px;
	}
	
	.swithBtn:checked + label{
		background: url('../../assets/img/on.png');
	}
	.temperature {
		margin-top: 20px;
		.el-tooltip{
			padding: 0 !important;
		}
		.el-slider__bar{
			background: linear-gradient( #f4b02d, #c4090c);
			width: 9px !important;
		}
		.el-slider.is-vertical .el-slider__runway{
			width: 9px;
		}
		.el-slider.is-vertical .el-slider__button-wrapper{
			left: -14px
		}
		.el-slider__button{
			border: 1px solid #c4090c;
			background-color: #f4b02d
		}
	}
	.temperature-text{
		padding-left: 100px;
		img{
			height: 160px;
			margin-top: 15px
		}
		span{
			position: absolute;
			top: 10px;
			font-size: 36px;
			font-weight: bolder;
			color: #f4b02d
		}
	}
	.dropdown-name{
		text-align: left;
		padding-left: 10px;
		height: 24px;
		line-height: 24px;
	}
</style>

