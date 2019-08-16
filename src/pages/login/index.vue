<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">微信聊天管理系统</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="userName">
          <el-input v-model="ruleForm.userName" placeholder="请输入用户名">
            <el-button slot="prepend" icon="el-icon-user"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            show-password
            v-model="ruleForm.password"
            @keyup.enter.native="submitForm('ruleForm')"
          >
            <el-button slot="prepend" icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookie from "@/utils/cookie";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data: function() {
    return {
      ruleForm: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted () {
    if(localStorage.getItem("ms_username")){
      this.ruleForm.userName = localStorage.getItem("ms_username");
    }
    if(localStorage.getItem("ms_upassword")){
      this.ruleForm.password = localStorage.getItem("ms_upassword");
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          localStorage.setItem("ms_username", this.ruleForm.userName);
          localStorage.setItem("ms_upassword", this.ruleForm.password);
          this.loginSubmit(this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    loginSubmit(params) {
      if(params.userName!='admin'){
        this.$message.error('账号不存在')
        return
      }else if(params.userName=='admin' && params.password!='123456'){
        this.$message.error('账号密码错误')
        return
      }
      if(params.userName=='admin' && params.password=='123456'){
        Cookie.setCookie("token", '321321');
        this.$router.push("home");
      }
      // this.$API.loginReq(params).then(res => {
      //   const { data, msg, status } = res;
      //   // console.log("登陆", res);
      //       if (status == 200) {
      //         alert(data.token)
      //         this.$router.push("home");
      //       }else{
      //         this.$router.push("home");
      //         this.$message.error(msg);
      //       }
      // });
    },
    getNavPermission(res) {
      const params = { id: res };
      this.$API.getPermissionNavReq(params).then(res => {
        const { data, msg, status } = res;
        if (status == 200) {
          // console.log("权限", res);
          const codeList = data.map(item => item.component);
          Cookie.setCookie("codeList", JSON.stringify(codeList));
          this.$router.push("/home");
        } else {
          this.$message.error(msg);
        }
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>