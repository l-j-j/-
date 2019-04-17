<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input  placeholder="用户名" v-model="selectUser"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSelect">查询</el-button>
				</el-form-item>
                <el-form-item style="float:right">
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="userList" v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="60">
			</el-table-column>
			<el-table-column prop="id" label="ID" width="60">
			</el-table-column>
			<el-table-column prop="username" label="用户名" width="180">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="180" >
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="150">
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="150">
			</el-table-column>
            <el-table-column prop="phone" label="手机号" width="200">
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button size="small" @click="handlepwd(scope.row)">密码</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 新增和编辑窗口 -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :close-on-click-modal="false">
            <user-modul @exit="exit" :id="dialog.id" />
        </el-dialog>

		<!-- 密码窗口 -->
		<el-dialog :title="pwdDialog.title" :visible.sync="pwdDialog.visible" :close-on-click-modal="false">
            <userPwd @exit="exit" :id="pwdDialog.id" />
        </el-dialog>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChange" :page-size="number" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import userModul from './components/Form.vue'
	import userPwd from './components/password.vue'
	import {getUserList,delUser} from '../../api/api.js'
	export default {
		data() {
			return {
				userList:[],
				total: 0,
				page: 1,
				number:20,//分页的数量
				listLoading: false,
				sels: [],//列表选中列
                selectUser:'',
                dialog:{
                    visible:false,
                    title:'',
                    id:''
				},
				pwdDialog:{
					visible:false,
                    title:'设置密码',
                    id:''
				}
			}
		},
		computed:{
			params(){
				return{
					page:this.page,
					number:this.number,
					username:this.selectUser
				}
			}
        },
        components:{
			userModul,
			userPwd
        },
		methods: {
			//获取列表
			getList(){
				getUserList(this.params).then(res => {
					this.userList=res.data
                    this.total = res.count
                    this.userList.forEach(element => {
                        switch(element.sex){
                            case 0:
                                element.sex='未知';
                                break;
                            case 1:
                                element.sex='男';
                                break;
                            case 2:
                                element.sex='女';
                                break;
                        }
                    });
				})
			},
			//切换页
			handleCurrentChange(val) {
				this.page = val;
				this.getList();
			},
			//选择框勾选
			selsChange: function (sels) {
				this.sels = sels;
			},
			//查询
			handleSelect(){
				this.getList();
            },
            //新增
            handleAdd(){
                this.dialog.visible = true;
                this.dialog.title = '新增';
                this.dialog.id='';
            },
			//编辑
			handleEdit(row){
                this.dialog.visible = true;
                this.dialog.title = '编辑';
                this.dialog.id = row.id;
			},
			//密码
			handlepwd(row){
				this.pwdDialog.visible = true;
				this.pwdDialog.id = row.id;
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					delUser(para).then((res) => {
						if(res.status == 1){
							this.listLoading = false;
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getList();
						}else{
							this.listLoading = false;
							this.$message({
								message:res.msg,
								type:'error'
							})
						}
					});
				}).catch(() => {});
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: ids };
					delUser(para).then((res) => {
						if(res.status==1){
							this.listLoading = false;
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getList();
						}else{
							this.listLoading = false;
							this.$message({
								message:res.msg,
								type:'error'
							})
						}	
					});
				}).catch(() => {});
            },
            exit(){
				this.dialog.visible=false
				this.pwdDialog.visible=false
            }
		},
		mounted() {
			this.getList();
		}
	}

</script>

<style scoped>

</style>