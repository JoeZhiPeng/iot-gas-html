<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 数据字典
 * @Date: 2019-04-19 09:09:10
 * @LastEditTime: 2019-04-23 14:16:02
 -->
<template>
	<div class="app-container">
		<!-- 搜索条件 -->
		<div class="filter-container">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="数据项代码">
					<el-input v-model="listQuery.dictCode" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="数据项名称">
					<el-input v-model="listQuery.dictName" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-button class="filter-item blue-btn" type="primary" icon="iconfont iconsousuo" @click="(getList(true))">
					搜索
				</el-button>
				<el-button class="filter-item green-btn" type="primary" icon="iconfont iconxinzeng" @click="handleCreate">
					新增
				</el-button>
				<el-button class="filter-item blue-btn" type="primary" icon="el-icon-back" v-show="backBtnVisible" @click.native.prevent="backBtnClicked">
					返回
				</el-button>
			</el-form>
		</div>

	<!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" label="序号" prop="sortIndex"></el-table-column>
			<el-table-column align="center" label='数据项名称' prop="dictName"></el-table-column>
			<el-table-column align="center" label="数据项代码" prop="dictCode"></el-table-column>
		    <el-table-column align="center" label="状态" width="170">
				<template slot-scope="scope">
					<span v-if="scope.row.status == 'Y'">可用</span>
					<span v-else>不可用</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="创建人" prop="createUser"></el-table-column>
			<el-table-column align="center" label="创建时间" width="170">
				<template slot-scope="scope">
                    <span v-if="scope.row.createTime">{{scope.row.createTime}}</span>
					<span v-else>--</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-dropdown  class="own-btn blue-btn" trigger="click">
						<el-button type="primary">
							更多操作<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)">修改</el-dropdown-item>
							<el-dropdown-item @click.native="checkChildren(scope.$index, scope.row)">数据源</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		
		<!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>

		<!-- 新增弹窗 -->
		<el-dialog title="新增" :visible.sync="dialogFormVisible" top="10%" width="400px" lock-scroll class="dick-addbox" 
			:close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" :model="newDataTemp" ref="addRuleForm" :rules="rulesAdd" v-loading="addLoad" element-loading-text="拼命加载中" 
			label-position="left" label-width="140px">
				<el-form-item label="数据项名称：" prop="dictName">
					<el-input v-model="newDataTemp.dictName" placeholder="数据项名称"></el-input>
				</el-form-item>
				<el-form-item label="数据项代码：" prop="dictCode">
					<el-input v-model="newDataTemp.dictCode" placeholder="数据项代码"></el-input>
				</el-form-item>
				<el-form-item label="排序：" prop="sortIndex">
					<el-input type="number" v-model="newDataTemp.sortIndex" placeholder="排序"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native.prevent="handleCreateSubmit('addRuleForm')">确 定</el-button>
			</div>
		</el-dialog>
		
		<!-- 修改弹窗 -->
		<el-dialog title="修改" :visible.sync="updateFormVisible" top="10%" width="400px" lock-scroll class="dick-addbox" :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="editRuleForm" v-loading="updateLoad" element-loading-text="拼命加载中" :rules="rulesEdit" :model="editDataTemp" label-position="left" label-width="140px">
				<el-form-item label="数据项名称：" prop="dictName">
					<el-input v-model="editDataTemp.dictName" placeholder="数据项名称"></el-input>
				</el-form-item>
				
				<el-form-item label="排序：" prop="sortIndex">
					<el-input type="number" v-model="editDataTemp.sortIndex" placeholder="排序"></el-input>
				</el-form-item>
				
				<el-form-item label="数据项状态：">
					<el-select v-model="editDataTemp.status" placeholder="数据项状态">
						<el-option label="可用" value="Y"></el-option>
						<el-option label="不可用" value="N"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="updateFormVisible = false">取 消</el-button>
				<el-button type="primary" @click.native.prevent="handleEditSubmit('editRuleForm')">确 定</el-button>
			</div>
		</el-dialog>	
	</div>	
</template>
<script>
	import { Message } from 'element-ui';
	import { validate } from 'utils/validate';
	import { utils } from 'src/utils';
	import Pagination from '../../components/Pagination';

	export default {
		components: {
			'pagination': Pagination,
		},
		data () {
			const vm = this;
			//时间校验
			const validateDictCode = (rule, value, callback) => {
				if (vm.isValidate.isOk) {
					if (vm.isValidate.dictCode) {
						callback();
						return;
					}
				} else {
					vm.isValidate.dictCode = false;
				}

				if (!value || value == "") {
					callback(new Error("字典项代码不能为空"));
				} else {
					vm.$instance.get("/proxy/sysmgr/dict/isUnique", {"params" : {"dictCode": value}}).then(res =>{
						if(res.status == 200){
							if (res.data.success) { //新增提交
								vm.isValidate.dictCode = true;
								callback();
							} else { //不唯一
								callback(new Error("字典项代码不唯一，请重新输入"));
							}
						}else{
							callback(new Error("唯一性校验失败"));
						}
					});
				}
			};
			return {
				//按钮的权限 查询query 新增add   true 显示  false 隐藏
				permBtn:{
	                
				},
				height: 540,
				list:[], //表格list
				total: 0,
				listLoading: true,
				addLoad: false,//新增加载状态
				updateLoad: false,//修改加载状态
				dialogFormVisible: false,//新增弹框
				updateFormVisible: false,//修改弹框
				backBtnVisible: false,  //返回按钮是否可见

				dictPids: [], //当前父ID列表  先进后出
				//唯一性验证状态记录
				isValidate:{
					dictCode: false,
					isOk: false   //点击确定第一时间将此变量设置为true
				},
				//列表查询参数
				listQuery: {
					iDisplayLength: 10,
					iDisplayStart: 0,
					dictCode: "",
					dictName: "",
					dictPid: ""
				},
				//新建数据
				newDataTemp: {
					dictName: "",
					sortIndex: "",
					dictCode: "",
					dictPid: ""
				},

				//编辑数据
				editDataTemp: {
					dictName: "",
					sortIndex: "",
					status: "",
					dictId: ""
				},
				//新增校验
				rulesAdd: {
					dictName: [
						{ required: true, message: '请输入数据项名称', trigger: 'blur' }
					],
					dictCode: [
						{ required: true, validator: validateDictCode, trigger: 'blur' }
					],
					sortIndex: [
						{ required: true, message: '请输入排序数字', trigger: 'blur' }
					]
				},
				//编辑校验
				rulesEdit: {
					dictName: [
						{ required: true, message: '请输入数据项名称', trigger: 'blur' }
					],
					sortIndex: [
						{ required: true, message: '请输入排序数字', trigger: 'blur' }
					]
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
		        vm.$instance.post("/proxy/sysmgr/dict/findDictsList", vm.listQuery).then(res =>{
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
			//新增
			handleCreate() {
				this.newDataTemp.dictName = "";
				this.newDataTemp.sortIndex = "";
				this.newDataTemp.dictCode = "";

				if (this.dictPids.length == 0) {
					this.newDataTemp.dictPid = "-1";
				} else {
					this.newDataTemp.dictPid = this.dictPids[this.dictPids.length - 1];
				}

				this.isValidate.isOk = false;
				this.isValidate.dictCode = false;

				this.dialogFormVisible = true;
				this.resetForm("addRuleForm");
			},
			
			//新增提交
			handleCreateSubmit(formName) {
				var vm = this;
				this.isValidate.isOk = true;
				validate.isValidate(vm, formName, function(formData) {
					if(formData.validates){
						vm.addLoad = true;
						vm.$instance.post("/proxy/sysmgr/dict/add", formData.param).then(res =>{
							vm.addLoad = false;
							if(res.status == 200){
								if (res.data.success) {
									Message.success({message: '添加成功！'});
									vm.dialogFormVisible = false;
									vm.getListData();
								} else {
									Message.error({message:res.data.errorMsg});
								}						
							}else{
								Message.error({message:"调用接口失败"});
							}
						}).catch(error => {
							vm.addLoad = false;
							vm.dialogFormVisible = false;
						});
					}
					vm.isValidate.isOk = false;
				}, vm.newDataTemp);
				
			},
			//修改
			handleEdit(index, row) {
				this.editDataTemp.dictName = row.dictName;
				this.editDataTemp.sortIndex = row.sortIndex;
				this.editDataTemp.status = row.status;
				this.editDataTemp.dictId = row.dictId;

				this.updateFormVisible = true;
			},
			//修改提交
		    handleEditSubmit(formName) {
				var vm = this;
				validate.isValidate(vm, formName, function(formData) {
					if(formData.validates){
						vm.updateLoad = true;
						vm.$instance.post("/proxy/sysmgr/dict/modify", formData.param).then(res =>{
							vm.updateLoad = false;
							if(res.status == 200){
								if (res.data.success) {
									vm.updateFormVisible = false;
									Message.success({message: '修改成功！'});
									vm.getListData();
								} else {
									Message.error({message:res.data.errorMsg});
								}
							}else{
								Message.error({message:"调用接口失败"});
							}
						}).catch(error => {
							vm.updateLoad = false;
							vm.updateFormVisible = false;
						});
					}
				}, vm.editDataTemp);
		    },
			//数据源
			checkChildren(index, row) {
				this.listQuery.dictCode = "";
				this.listQuery.dictName = "";

				this.dictPids.push(row.dictId);
				this.listQuery.dictPid = row.dictId;
				if (!this.backBtnVisible) {
					this.backBtnVisible = true;
				}

				this.getListData(true);
			},
			//返回
			backBtnClicked(){
				this.listQuery.dictCode = "";
				this.listQuery.dictName = "";

				var pid = this.dictPids.pop();
				if (this.dictPids.length == 0) {
					this.backBtnVisible = false;
					this.listQuery.dictPid = "-1";
				} else {
					this.listQuery.dictPid = this.dictPids[this.dictPids.length - 1]
				}

				this.getListData(true);
			},
			resetForm(formName) {
        		if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
      		}
		}
	}
</script>