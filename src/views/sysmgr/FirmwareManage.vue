<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 固件管理
 * @Date: 2019-04-19 09:37:56
 * @LastEditTime: 2019-04-25 16:58:52
 -->

<template>
	<div class="app-container">
		<!-- 搜索条件 -->
		<div class="filter-container">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="固件名称">
					<el-input v-model="listQuery.firmwareName" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="固件版本号">
					<el-input v-model="listQuery.firmwareVersion" placeholder="请输入" clearable></el-input>
				</el-form-item>
                <el-form-item label="厂家名称">
					<el-input v-model="listQuery.firmwareName" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="固件版本号">
					<el-input v-model="listQuery.firmwareVersion" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-button class="filter-item blue-btn" type="primary" icon="iconfont iconsousuo" @click="(getList(true))">
					搜索
				</el-button>
				<el-button class="filter-item green-btn" type="primary" icon="iconfont iconxinzeng" @click="handleCreate">
					新增
				</el-button>
			</el-form>
		</div>

	<!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" label='固件名称' prop="firmwareName"></el-table-column>
			<el-table-column align="center" label='固件版本号' prop="firmwareVersion"></el-table-column>
			<el-table-column align="center" label='固件url' prop="firmwareUrl"></el-table-column>
			<el-table-column align="center" label="厂家名称" prop="factoryName"></el-table-column>
			<el-table-column align="center" label="设备型号" prop="modelName"></el-table-column>
			<el-table-column align="center" label="备注" prop="description"></el-table-column>
		    
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-dropdown class="own-btn blue-btn" trigger="click">
						<el-button type="primary">
							更多操作<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)">修改</el-dropdown-item>
							<el-dropdown-item @click.native="handleDelete(scope.$index, scope.row)">删除</el-dropdown-item>
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
			<el-form class="small-space" ref="addDialogForm" :rules="rules" :model="addForm" label-position="left" label-width="130px" element-loading-text="拼命加载中">
				<el-row>
					<el-col :span="14">
						<el-form-item label="厂家：" prop="factoryId">
							<el-select v-model="addForm.factoryId" clearable filterable placeholder="请选择" class="dialog-sel">
								<el-option label="思博慧" value="6a7eed9c83364c5e92013dcc3ada8972"></el-option>
								<el-option label="华宝" value="e1096b31d899466d800d40bbde7c59b7"></el-option>
								<el-option label="宝时安" value="4591cab4e2ac47738231339b75d62e1e"></el-option>
								<el-option label="国基视讯" value="6ae05287b84e45cc85da5129d2a3fa17"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备型号：" prop="modelId" class="dialog-sel">
							<el-select v-model="addForm.modelId" clearable filterable placeholder="请选择">
								<el-option label="SBH_JT1078" value="111"></el-option>
								<el-option label="SBH_JT1002" value="222"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="固件名称：" prop="firmwareName" class="model">
							<el-input v-model="addForm.idcard" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="固件版本号：" prop="firmwareVersion" class="model">
							<el-input v-model="addForm.equImei" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10" class="drag-upload">
						<el-upload
							drag
							action="https://jsonplaceholder.typicode.com/posts/"
							multiple>
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
							<!-- <div class="el-upload__tip" slot="tip">不超过500kb</div> -->
						</el-upload>
					</el-col>
				</el-row>
				<el-form-item label="备注：" class="firm-textarea">
					<el-input
						type="textarea"
						autosize
						placeholder="请输入内容"
						v-model="addForm.description">
					</el-input>
				</el-form-item>
				<el-form-item class="formButton">
					<el-button @click="addFormVisible = false; $refs.addDialogForm.resetFields();">取 消</el-button>
					<el-button type="primary" @click="handleCreateSubmit('addDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!--修改弹框-->
		<el-dialog title="修改" :visible.sync="editFormVisible"  @close="$refs.editDialogForm.resetFields()" top="10%" width="700px" lock-scroll class="dialog"
			:close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="editDialogForm" :rules="rules" :model="editForm" label-position="left" label-width="130px" element-loading-text="拼命加载中">	
				<el-row>
					<el-col :span="14">
						<el-form-item label="厂家：" prop="factoryId">
							<el-select v-model="editForm.factoryId" clearable filterable placeholder="请选择" class="dialog-sel">
								<el-option label="思博慧" value="6a7eed9c83364c5e92013dcc3ada8972"></el-option>
								<el-option label="华宝" value="e1096b31d899466d800d40bbde7c59b7"></el-option>
								<el-option label="宝时安" value="4591cab4e2ac47738231339b75d62e1e"></el-option>
								<el-option label="国基视讯" value="6ae05287b84e45cc85da5129d2a3fa17"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="设备型号：" prop="modelId" class="dialog-sel">
							<el-select v-model="editForm.modelId" clearable filterable placeholder="请选择">
								<el-option label="SBH_JT1078" value="111"></el-option>
								<el-option label="SBH_JT1002" value="222"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="固件名称：" prop="firmwareName" class="model">
							<el-input v-model="editForm.firmwareName" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="固件版本号：" prop="firmwareVersion" class="model">
							<el-input v-model="editForm.firmwareVersion" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10" class="drag-upload">
						<el-upload
							drag
							action="https://jsonplaceholder.typicode.com/posts/"
							multiple>
							<i class="el-icon-upload"></i>
							<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
							<!-- <div class="el-upload__tip" slot="tip">不超过500kb</div> -->
						</el-upload>
					</el-col>
				</el-row>
				<el-form-item label="备注：" class="firm-textarea">
					<el-input
						type="textarea"
						autosize
						placeholder="请输入内容"
						v-model="editForm.textarea1">
					</el-input>
				</el-form-item>
				<el-form-item class="formButton">
					<el-button @click="editFormVisible = false; $refs.editDialogForm.resetFields(); editForm = []">取 消</el-button>
					<el-button type="primary" @click="handleEditSubmit('editDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>	
	</div>	
</template>
<script>
	import { utils } from 'src/utils';
	import { validate } from 'utils/validate';
	import { Message } from 'element-ui';
	import Pagination from '../../components/Pagination';

	export default {
		components: {
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
				addFormVisible: false,  //新增弹框
				editFormVisible: false, //修改弹框
				//列表查询参数
				listQuery: {
					iDisplayLength: 10,
					iDisplayStart: 0,
					factoryName: "",
					firmwareName: "",
					modelId: ""
				},
				addForm: {  //新增参数
					factoryId: "",
					firmwareName: "",
					firmwareUrl: "",
					firmwareVersion: "",
					modelId: "",
					description: "",
				},
				editForm:{  //修改参数
					
				},
				rules: {
					factoryId: [
						{ required: true, message: '请选择设备厂家', trigger: 'change' }
					],
					modelId: [
						{ required: true, message: '请选择设备型号', trigger: 'change' }
					],
					firmwareName: [
						{ required: true, message: '请输入固件名称', trigger: 'blur' }
					],
					firmwareVersion: [
						{ required: true, message: '请输入固件版本号', trigger: 'blur' }
					]
				}
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
		        vm.$instance.post("/proxy/sysmgr/firmware/findFirmwareList", vm.listQuery).then(res =>{
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
			
			//打开新增弹窗
			handleCreate(){
				this.addFormVisible = true;
				this.resetForm("addDialogForm");
			},

			handleCreateSubmit(formName ) {
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						this.createSubmit();
					}
				});
			},
			createSubmit() {
				this.addFormVisible = false;
			},

			//打开修改弹窗
			handleEdit(idnex, row) {
				this.resetForm("editDialogForm");
				let editData = JSON.parse(JSON.stringify(row))
				this.editForm = {
					modelId: editData.modelId,
					firmwareVersion: editData.firmwareVersion,
					firmwareUrl: editData.firmwareUrl,
					firmwareName: editData.firmwareName,
					firmwareId: editData.firmwareId,
					factoryId: editData.factoryId,
					description: editData.description
				};
				this.editFormVisible = true;
			},
			//修改验证
			handleEditSubmit(formName) {	
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						this.editSubmit();
					}
				});
			},

			//修改确定	
			editSubmit(){
				let vm = this;
				let params = JSON.parse(JSON.stringify(vm.editForm));
				vm.$instance.post("/proxy/bizmgr/home/updateHome", params).then(res =>{
					if(res.status == 200){
						if (res.data.success) {
							vm.editFormVisible = false;	
							vm.$refs.editDialogForm.resetFields();
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

			//删除
			handleDelete(index, row) {
				let param = {};
				//确定删除
				this.$confirm('是否删除此固件！', '删除', {
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

			// 重置表单
			resetForm(formName) {
				if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
			}
		}
	}
</script>

<style lang="scss">
	.drag-upload{
		.el-upload-dragger{
			width: 230px !important
		}
	}
	.firm-textarea{
		.el-textarea__inner{
			width: 485px
		}
	}
</style>
