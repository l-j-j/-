<template>
	<section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input  placeholder="标题" v-model="selectTitle"></el-input>
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
		<el-table :data="sourceList" v-loading="listLoading" style="width: 100%;" @selection-change="selsChange">
			<el-table-column type="selection" width="80">
			</el-table-column>
			<el-table-column prop="id" label="ID" width="100">
			</el-table-column>
			<el-table-column prop="title" label="标题" width="300">
			</el-table-column>
            <el-table-column prop="url" label="链接" width="500">
			</el-table-column>
			<el-table-column prop="code" label="提取码" width="150">
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
                <el-form-item label="标题" prop="title">
                    <el-input v-model="dialog.form.title"></el-input>
                </el-form-item>
                <el-form-item label="链接" prop="url">
                    <el-input v-model="dialog.form.url"></el-input>
                </el-form-item>
				<el-form-item label="提取码">
                    <el-input v-model="dialog.form.code"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>

		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChange" :page-size="number" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import {getSourceList,addSource,delSource} from '../../api/api.js'
	export default {
		data() {
			return {
				sourceList:[],
				listLoading: false,
				total: 0,
				page: 1,
				number:20,//分页的数量s
				sels:[],
				selectTitle:'',
                dialog:{
                    title:"",
                    visible:false,
                    form:{
						id:"",
                        title:"",
                        url:"",
                        code:""
                    },
                    rules:{
                        title:[
                            { required: true, message: '请输入标题', trigger: 'blur' }
						],
						url:[
                            { required: true, message: '请输入链接', trigger: 'blur' }
                        ]
                    },
                }
			}
		},
		computed:{
			params(){
				return{
					page:this.page,
					number:this.number,
					title:this.selectTitle
				}
			}
		},
        inject:['reload'],
		methods: {
			//勾选
			selsChange(sels){
				this.sels = sels 
			},
			//获取列表
			getList(){
				getSourceList(this.params).then(res=>{
					this.sourceList = res.data;
					this.total = res.count;
                })
			},
			//查询
			handleSelect(){
				this.getList();
			},
			//切换页
			handleCurrentChange(val) {
				this.page = val;
				this.getList();
			},
            //新增
            handleAdd(){
                this.dialog.title="新增"
                this.dialog.visible=true
                this.dialog.form.id=""
                this.dialog.form.title=""
				this.dialog.form.url=""
				this.dialog.form.code=""
            },
			//编辑
			handleEdit(row){
                this.dialog.visible=true
                this.dialog.title="编辑"
                this.dialog.form.id=row.id
                this.dialog.form.title=row.title
				this.dialog.form.url=row.url
				this.dialog.form.code=row.code
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					delSource(para).then((res) => {
						if(res.status == 1){
							this.listLoading = false;
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getList();
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
					delSource(para).then((res) => {
						if(res.status==1){
							this.listLoading = false;
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getList();
						}	
					});
				}).catch(() => {});
			},
            handleSubmit(){
                var params = {
                    id:this.dialog.form.id,
                    title:this.dialog.form.title,
					url:this.dialog.form.url,
					code:this.dialog.form.code
                }
                addSource(params).then(res=>{
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