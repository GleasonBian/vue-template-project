<template>
  <el-main class="login-box">
    <div class="login-container">
      <div class="login_box">
        <div class="user_name">
          <input
            id="name"
            v-model="userid"
            placeholder="请输入帐号"
            class="name_input"
            @keyup.enter.native="check"
          />
        </div>
        <div class="user_pass">
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter.native="check"
            class="pass_input"
          />
        </div>
        <el-button
          id="login"
          @click="check"
          style="width:100%"
          type="primary"
          class="login_button"
        >登录</el-button>
      </div>

      <div class="version">{{version}}</div>
    </div>
  </el-main>
</template>
<script>
import { login } from "@/getData";
export default {
  data() {
    return {
      userid: "",
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
        userid: this.userid,
        password: this.password
      };
      const res = await login(data);
      if (res.data.code === 200) {
        this.$message.success("登录成功");
        sessionStorage.setItem("Authorization", res.data.Data);
        this.$router.push("/dashboard");
      } else this.$message.warning("账号或密码错误");
    }
  }
};
</script>
<style scoped>
.login-box {
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/loginBG.gif);
  background-size: 100vw 100vh;
  background-repeat: no-repeat;
  background-position: 0 0;
}

.login-container {
  box-sizing: border-box;
  width: 448px;
  height: 525px;
  background: url(../assets/login_box.png);
  position: absolute;
  right: 200px;
  top: 25%;
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

.user_name {
  width: 379px;
  height: 65px;

  padding-left: 85px;
}
.name_input {
  width: 303px;
  height: 65px;
  font-size: 20px;
  padding-left: 20px;
  background: none;
  color: #ffffff;
}
.user_pass {
  width: 379px;
  height: 65px;
  margin-top: 25px;
  padding-left: 85px;
}
.pass_input {
  width: 303px;
  height: 65px;
  font-size: 20px;
  padding-left: 20px;
  background: none;
  color: #ffffff;
}
.login_button {
  margin-top: 47px;
  width: 375px !important;
  height: 65px;
  margin-left: 33px;
}
.login_box {
  margin-top: 186px;
  width: 100%;
}
input:-internal-autofill-previewed,
input:-internal-autofill-selected {
  -webkit-text-fill-color: #ffffff !important;
  transition: background-color 5000s ease-in-out 0s !important;
}
</style>