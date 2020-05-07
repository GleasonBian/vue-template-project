<template>
  <el-main class="login-box">
    <div class="login-container">
      <img src="../assets/sjgtw.png" alt="世界高铁网logo" class="sjgtw-logo" />
      <div class="systemName">{{'小程序运营中台'}}</div>
      <div class="input-box">
        <el-row class="login-row">
          <el-col :span="24">
            <el-input
              id="name"
              v-model="userName"
              placeholder="请输入帐号"
              class="el-input"
              @keyup.enter.native="check"
            >
              <template slot="prepend">
                <img src="../assets/avator.png" height="30px" class="login-image" />
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-row class="login-row">
          <el-col :span="24">
            <el-input
              id="password"
              v-model="password"
              type="password"
              placeholder="请输入密码"
              @keyup.enter.native="check"
            >
              <template slot="prepend">
                <img src="../assets/password.png" height="30px" class="login-image" />
              </template>
            </el-input>
          </el-col>
        </el-row>
        <el-row class="login-row">
          <el-col :span="24">
            <el-button
              id="login"
              @click="check"
              style="width:100%"
              type="primary"
              class="login-button"
            >登录</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="version">{{version}}</div>
    </div>
  </el-main>
</template>
<script>
// import { login } from "@/getData";
export default {
  data() {
    return {
      userName: "",
      password: ""
    };
  },
  created() {},
  computed: {
    version() {
      let date = new Date().toLocaleDateString().replace(/\//g, "-");
      return "v 1.2.304 - " + date + " - " + "α 版";
    }
  },
  methods: {
    async check() {
      //获取值
      var name = this.userName;
      var password = this.password;
      if (name == "" || password == "") {
        this.$message({
          message: "账号或密码为空！",
          type: "error"
        });
        return;
      }
      let data = {
        username: this.userName,
        password: this.password
      };
      this.$message.success('登录成功')
      this.$router.push("/dashboard");
      // const res = await login(data);
      // if (res.result) {
        // sessionStorage.setItem('companyId',  escape(res.data.user.companyId));
        // this.$router.push('/middleground');
      // } else this.$message.warning(res.message);
    }
  }
};
</script>
<style scoped>
.login-box {
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/loginBG.png);
  background-size: 100vw 100vh;
  background-repeat: no-repeat;
  background-position: 0 0;
}

.login-container {
  box-sizing: border-box;
  width: 420px;
  height: 630px;
  background: #ffffff;
  position: absolute;
  right: 200px;
  top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
}

.sjgtw-logo {
  margin-top: 50px;
  width: 144px;
  height: 50px;
}

.systemName {
  font-family: "MicrosoftYaHei";
  font-weight: bold;
  font-size: 24px;
  color: #111111;
}

.login-button {
  font-size: 20px;
}

.login-row {
  margin-bottom: 30px;
}

.input-box {
  margin-bottom: 145px;
}

.el-input {
  border: none;
}

.version {
  position: absolute;
  bottom: 20px;
  color: rgb(134, 130, 131);
  font-size: 14px;
}

.login-image {
  vertical-align: middle;
}

@media screen and (max-width: 1366px) {
  .login-container {
    width: 350px;
    height: 460px;
    background: #ffffff;
    right: 20vh;
    top: 10vh;
  }

  .input-box {
    margin-bottom: 13vh;
  }

  .login-row {
    margin-bottom: 22px;
  }

  .sjgtw-logo {
    margin-top: 40px;
    width: 144px;
    height: 50px;
  }
}
</style>