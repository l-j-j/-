<template>
	<el-form ref="form" :model="form" :rules="rules" label-width="80px" v-loading="loading">
		<el-form-item label="标题" prop="title">
			<el-input v-model="form.title"></el-input>
		</el-form-item>
		<el-form-item label="类型" prop="region">
			<el-select v-model="form.region" placeholder="请选择类型">
				<el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="封面">
			<el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
                <img v-if="form.cover" :src="form.cover" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
		</el-form-item>
		<el-form-item class="editor" label="内容" prop="content">
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
import {addRest,getRestTypeList,getRest} from '../../api/api.js'
	export default {
		inject:['reload'],
		data() {
			return {
				uploadUrl:"/blog/user/avatarUpload",
				loading:false,
				id:'',
				typeList:[],
				form: {
					title: '',
					content:'',
					region:'',
					cover:''
				},
				rules:{
					title:[
						{ required: true, message: '请输入标题', trigger: 'blur' }
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
							content:this.form.content,
							cover:this.form.cover,
							type:this.form.region
						}
						if(this.id){
							params.id = this.id
						}
						addRest(params).then(data=>{
							if(data.status == 1){
								this.$message({
									message:'编辑成功!',
									type:'success'
								})
								this.$router.push('/rest')
							}else{
                                this.loading = false
                                this.$message.error('编辑失败!')
                            }
						})
					}
				})
			},
			//获取类型
			getType(){
				getRestTypeList().then(res=>{
					this.typeList=res;
				})
			},
			handleAvatarSuccess(res, file) {
				if(res.status==1){
					this.$message.success('上传成功!');
					this.form.cover = res.url;
				}else{
					this.$message.error('上传失败!');
				}   
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG && !isPNG) {
					this.$message.error('图片只能是 JPG或PNG 格式!');
					return;
				}
				if (!isLt2M) {
					this.$message.error('图片大小不能超过 2MB!');
					return;
				}
			}
		},
		components:{
			quillEditor
		},
		mounted(){
			this.getType();
			this.id=this.$route.params.id;
			if(this.id){
				getRest({id:this.id}).then(res=>{
					this.form.title = res.title;
					this.form.content = res.content;
					this.form.region = res.type;
					this.form.cover = res.cover
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


