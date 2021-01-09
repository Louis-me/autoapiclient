<template>
    <div class="login_container">
        <div class="login_box">
            <el-form ref="formRef" :rules="rules" :model="loginForm" class="login_form">
                <el-form-item label="用户名" prop="username">
                    <el-input prefix-icon="el-icon-s-custom" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="loginForm.pwd" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="loginEvent">登陆</el-button>
                    <el-button type="info" @click="resetEvent">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

  export default {
    data() {
      return {
        loginForm: {
          username: '',
          pwd: '', 
        }, 
        // 使用验证功能
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          pwd:[
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
       }
      }
    
    },
    created(){
      this.checkLogin();
    },

    methods: {
      loginEvent() {
           //  this.$refs.formRef就能拿到表单是否验证通过的值
           this.$refs.formRef.validate(async valid=>{
               if (!valid) return
                // this.loginForm自动包表单中的name属性的值提交
                // let res = await this.$http.post("login/",JSON.stringify(this.loginForm))
                let res = await this.$http.post("login/",this.loginForm)
                if (res.data.code != 1) {
                   this.$message.error(res.data.msg)
                } else{
                  this.$message.success('登陆成功')
                  console.log("登陆成功")
                  localStorage.setItem('token', res.data.token);
                  console.log(localStorage.getItem("token"))
                   // 登陆成功跳转到home组件
                  this.$router.push("/home")

                }

           });
        
      },
      resetEvent() {
        console.log(this.$refs.formRef);
          this.$refs.formRef.resetFields();
      },
      // 如果已经登陆,就跳转到home
      checkLogin() {
        if (localStorage.getItem("username")) {
          this.$router.push("/home")
        }
      }
    }
  }
</script>

<style lang="less" scoped>
    .login_container {
        background-color: skyblue;
        height: 100%;
    }
    .login_box {
        width:450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
    }
    .btns {
        display: flex;
        justify-content: flex-end;
    }
    .login_form {
        position:absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

</style>