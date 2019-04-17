<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input  placeholder="标题" v-model="selectTitle"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker  type="daterange" unlink-panels  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" v-model="selectDate"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-select v-model="selectType">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSelect">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="articleList" v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="60">
			</el-table-column>
			<el-table-column prop="id" label="ID" width="60">
			</el-table-column>
			<el-table-column prop="title" label="标题" width="450" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="date" label="日期" width="180" >
			</el-table-column>
			<el-table-column prop="type" label="类型" width="180">
			</el-table-column>
			<el-table-column prop="source" label="来源" width="180">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="total, prev, pager, next" background @current-change="handleCurrentChange" :page-size="number" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import {getArticleList,delArticle,getTypeList} from '../../api/api.js'
	export default {
		data() {
			return {
				articleList:[],
				total: 0,
				page: 1,
				number:20,//分页的数量
				listLoading: false,
				sels: [],//列表选中列
				selectTitle:'',
				selectDate:[],
				selectType:'',
				typeList:[],
			}
		},
		computed:{
			params(){
				return{
					page:this.page,
					number:this.number,
					dateArr:this.selectDate,
					title:this.selectTitle,
					type:this.selectType
				}
			}
		},
		methods: {
			//获取列表
			getList(){
				getArticleList(this.params).then(res => {
					this.articleList=res.data
					this.total = res.count
					this.articleList.forEach(element => {
						element.date = util.formatDate.format(new Date(element.date),'yyyy-MM-dd')
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
			//编辑
			handleEdit(row){
				this.$router.push(`/edit/${row.id}`)
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					delArticle(para).then((res) => {
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
					delArticle(para).then((res) => {
						if(res.status==1){
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
			}
		},
		mounted() {
			this.getList();
			getTypeList().then(res=>{
				this.typeList=res
			})
		}
	}

</script>

<style scoped>

</style>