<template>
<div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username" v-if="!id">
            <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="头像">
            <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
                <img v-if="form.avatar" :src="form.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="性别">
            <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="年龄">
            <el-input v-model="form.age" type="number"></el-input>
        </el-form-item>
        <el-form-item label="生日">
            <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
            <el-input v-model="form.address"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="exit">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
</div>
</template>

<script>
import {addUser,getUser} from '../../../api/api.js'
export default {
    data(){
        var checkPhone = (rule,value,callback)=>{
            if (!value) {
                    callback();
            } else {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('请输入正确的手机号'));
                }
            }
        };
        return{
            uploadUrl:"/blog/user/avatarUpload",
            form:{
                username:'',
                name:'',
                avatar:'',
                sex: '',
                age:'',
                birthday:'',
                address:'',
                phone:''
            },
            rules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                phone:[
                    {validator: checkPhone, trigger: 'blur'}
                ]
            }
        }
    },
    props:['id'],
    inject:['reload'],
    methods:{
        handleSubmit(){
            this.$refs.form.validate(valid=>{
                if(valid){
                    var params = {
                        username:this.form.username,
                        name:this.form.name,
                        avatar:this.form.avatar,
                        sex:this.form.sex,
                        age:this.form.age,
                        birthday:this.form.birthday,
                        address:this.form.address,
                        phone:this.form.phone,
                        id:this.id
                    }
                    addUser(params).then(res=>{
                        if(res.status==1){
                            this.$message({
                                message:'编辑成功',
                                type:'success'
                            })
                            if(this.id == this.$store.state.user.id){
                                this.$store.state.user = params;
                                sessionStorage.setItem('user', JSON.stringify(params));
                            }
                            this.$emit('exit')
                            this.reload();
                        }else{
                            this.$message({
                                message:'编辑失败',
                                type:'error'
                            })
                        }    
                    })
                }
            })
        },
        exit(){
            this.$emit('exit')
        },
        edit(){
            getUser({id:this.id}).then(res=>{
                for(var key in res){
                    this.form[key] = res[key]
                }
                switch(this.form.sex){
                    case 1:
                        this.form.sex = '男';
                        break;
                    case 2:
                        this.form.sex = '女';
                        break;
                    default:
                        this.form.sex = '';
                }
            })
        },
        handleAvatarSuccess(res, file) {
            if(res.status==1){
                this.$message.success('上传成功!');
                this.form.avatar = res.url;
            }else{
                this.$message.error('上传失败!');
            }   
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG && !isPNG) {
                this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
                return;
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                return;
            }
        }
    },
    mounted(){
        if(this.id){
            this.edit();
        }  
    },
    watch:{
        id(){
            if(this.id){
                this.edit();
            }else{
                for(var key in this.form){
                    this.form[key] = ''
                }
            }
        }
    }
}
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
</style>
