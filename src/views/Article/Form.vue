<template>
	<el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="loading">
		<el-form-item label="文章标题" prop="title">
			<el-input v-model="form.title"></el-input>
		</el-form-item>
		<!-- <el-form-item label="日期" prop="date">
			<el-date-picker :editable="false" type="date" placeholder="选择日期" v-model="form.date"></el-date-picker>
		</el-form-item> -->
		<el-form-item label="类型" prop="region">
			<el-select v-model="form.region" placeholder="请选择类型">
				<el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="来源">
			<el-input v-model="form.source"></el-input>
		</el-form-item>
		<el-form-item class="editor" label="文章内容" prop="content">
			<quillEditor v-model="form.content" :options="editorOption" />
		</el-form-item>
		<el-form-item style="text-align:center;">
			<el-button type="primary" @click="onSubmit">{{id?'保存修改':'立即发布'}}</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import {quillEditor,Quill} from 'vue-quill-editor'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
import {addArticle,getArticle,getTypeList} from '../../api/api.js'
import util from '../../common/js/util.js'
	export default {
		inject:['reload'],
		data() {
			return {
				loading:false,
				id:'',
				typeList:[],
				form: {
					title: '',
					date: '',
					content:'',
					source:'',
					region:''
				},
				rules:{
					title:[
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					date:[
						{ type:'date', required: true, message: '请选择日期', trigger: 'change' }
					],
					content:[
						{ required: true, message: '请填写内容' }
					],
					region: [
						{ required: true, message: '请选择类型', trigger: 'change' }
					]
				},
				editorOption:{
					modules: {
						ImageExtend: {
							loading: true,
							name: 'file',
							size:3,
							action: "/blog/user/avatarUpload", 
							response: (res) => {
								return res.url
							},
							sizeError:()=>{
								this.$message.error('图片大小不能超过3M')
							},
							success:()=>{
								this.$message.success('图片上传成功')
							},
							error:()=>{
								this.$message.error('图片上传失败')
							}
						},
						toolbar: {
							container: container,
							handlers: {
								'image': function () {
								QuillWatch.emit(this.quill.id)
								}
							}
						}
					}
				}
			}
		},
		methods: {
			onSubmit() {
				this.$refs.form.validate((valid)=>{
					if(valid){
						this.loading=true
						var params = {
							title:this.form.title,
							//date:util.formatDate.format(this.form.date,'yyyy-MM-dd'),
							content:this.form.content,
							source:this.form.source,
							type:this.form.region
						}
						if(this.id){
							params.id = this.id
						}
						addArticle(params).then(data=>{
							if(data.status == 1){
								this.$message({
									message:'编辑成功!',
									type:'success'
								})
								this.$router.push('/list')
							}
						})
					}
				})
			},
			//获取类型
			getType(){
				getTypeList().then(res=>{
					this.typeList=res;
				})
			}
		},
		components:{
			quillEditor
		},
		mounted(){
			this.getType();
			this.id=this.$route.params.id;
			if(this.id){
				getArticle({id:this.id}).then(res=>{
					this.form.title = res.title;
					//this.form.date = new Date(res.date);
					this.form.source = res.source;
					this.form.content = res.content;
					this.form.region = res.type;
				})
			}
		},
		watch:{
			$route(to,from){
				this.reload();
			}
		}
	}
</script>

<style lang="scss" scoped>
.editor{
	height: 580px;
	.quill-editor{
		height: 500px;
	}
}	
</style>


