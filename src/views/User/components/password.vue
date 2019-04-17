<template>
<div>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="新密码" prop="password1">
            <el-input v-model="form.password1" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password1">
            <el-input v-model="form.password2" type="password"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="exit">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
</div>
</template>

<script>
import {setPassword} from '../../../api/api.js'
export default {
    data(){
        return{
            form:{
                password1:'',
                password2:''
            },
            rules:{
                password1:[
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                password2:[
                    { required: true, message: '请输入密码', trigger: 'blur' }
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
                    if(this.form.password1 != this.form.password2){
                        this.$message.error('两次密码不一致!')
                        return 
                    }
                    var params = {
                        password:this.form.password1,
                        id:this.id
                    }
                    setPassword(params).then(res=>{
                        if(res.status == 1){
                            this.$message.success('设置成功!')
                            this.reload();
                        }else{
                            this.$message.error('设置失败!');
                        }
                    })
                }
            })
        },
        exit(){
            this.$emit('exit')
        }
    }
}
</script>
