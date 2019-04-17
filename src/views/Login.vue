<template>
  <el-form :model="userForm" :rules="rules" ref="userForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="userForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="userForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapMutations } from 'vuex'
import { requestLogin } from '../api/api'
  export default {
    data() {
      return {
        logining: false,
        userForm: {
          account: 'admin',
          checkPass: '123456'
        },
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        }
      };
    },
    methods: {
      ...mapMutations(['userinfo']),
      handleSubmit(ev) {
        var _this = this;
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            this.logining = true;
            var loginParams = { username: this.userForm.account, password: this.userForm.checkPass };
            requestLogin(loginParams).then(data => {
              this.logining = false;
              if (data.status == 1) {
                sessionStorage.setItem('user', JSON.stringify(data.msg));
                this.userinfo();
                this.$router.push({ path: '/' });
              } else {
                this.$message({
                  message: data.msg,
                  type: 'error'
                });
              }
            });
          } else {
            this.$message({
              message:'用户名密码不能为空!',
              type:'error'
            })
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>