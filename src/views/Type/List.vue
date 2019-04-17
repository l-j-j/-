<template>
	<section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item style="float:right">
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="typeList" v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="id" label="ID" width="150">
			</el-table-column>
			<el-table-column prop="name" label="类型" width="300">
			</el-table-column>
            <el-table-column prop="icon" label="图标" width="300">
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

        <!--新增编辑界面-->
		<el-dialog :title="dialog.title" :visible.sync="dialog.visible" :close-on-click-modal="false">
            <el-form :model="dialog.form" :rules="dialog.rules" label-width="80px">
                <el-form-item label="类型" prop="type">
                    <el-input v-model="dialog.form.type"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-input v-model="dialog.form.icon"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
	</section>
</template>

<script>
	import {getTypeList,typeAdd,typeDel} from '../../api/api.js'
	export default {
		data() {
			return {
				typeList:[],
                listLoading: false,
                dialog:{
                    title:"",
                    visible:false,
                    form:{
                        type:"",
                        icon:"",
                        id:""
                    },
                    rules:{
                        type:[
                            { required: true, message: '请输入类型', trigger: 'blur' }
                        ],
                    },
                }
			}
        },
        inject:['reload'],
		methods: {
			//获取列表
			getList(){
				getTypeList().then(res=>{
                    this.typeList = res;
                })
            },
            //新增
            handleAdd(){
                this.dialog.title="新增"
                this.dialog.visible=true
                this.dialog.form.id=""
                this.dialog.form.type=""
                this.dialog.form.icon=""
            },
			//编辑
			handleEdit(row){
                this.dialog.visible=true
                this.dialog.title="编辑"
                this.dialog.form.id=row.id
                this.dialog.form.type=row.name
                this.dialog.form.icon=row.icon
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					typeDel(para).then((res) => {
						if(res.status == 1){
							this.listLoading = false;
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getList();
						}else{
                            this.listLoading = false;
                            this.$message.error('删除失败')
                        }
					});
				}).catch(() => {});
            },
            handleSubmit(){
                var params = {
                    id:this.dialog.form.id,
                    name:this.dialog.form.type,
                    icon:this.dialog.form.icon
                }
                typeAdd(params).then(res=>{
                    if(res.status==1){
                        this.$message({
                            message:'编辑成功',
                            type:'success'
                        })
                        this.reload()
                    }else{
                        this.$message({
                            message:'编辑失败',
                            type:'error'
                        })
                    }
                })
            }
		},
		mounted() {
            this.getList();
		}
	}

</script>

<style scoped>

</style>