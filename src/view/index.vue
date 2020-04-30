<template>
  <div class="home">
    <yd-cell-group class="login">
      <yd-cell-item>
        <img slot="left" src="../assets/images/user@3x.png" alt>
        <span slot="left" style="font-size:.34rem;margin-left:.38rem">手机号：</span>
        <yd-input
          slot="right"
          style="font-size:.32rem;margin-top:.08rem"
          v-model="input1"
          max="11"
          regex="mobile"
          placeholder="请输入手机号"
        ></yd-input>
      </yd-cell-item>
      <yd-cell-item>
        <img slot="left" src="../assets/images/mima@3x.png" alt>
        <span slot="left" style="font-size:.34rem;margin-left:.38rem">密码：</span>
        <yd-input
          slot="right"
          style="font-size:.32rem;margin-top:.08rem"
          type="password"
          v-model="input2"
          max='8'
          :show-success-icon="false"
          placeholder="请输入密码"
        ></yd-input>
      </yd-cell-item>
    </yd-cell-group>
    <div class="remb_password">
      <yd-cell-item>
        <yd-checkbox color="#555" size="18" slot="left" v-model="checkbox1">记住密码</yd-checkbox>
        <yd-sendcode
          slot="right"
          init-str="获取密码"
          run-str="{%s}s"
          reset-str="重新发送"
          style="color:#555;width:1.5rem;height:.75rem;
                        font-size:.30rem;
                        border:1px solid #f3f3f3;
                        border-radius:5px"
          v-model="start1"
          @click.native="sendCode1"
          type="warning"
        ></yd-sendcode>
      </yd-cell-item>
    </div>
    <div class="login_btn" @click="login()">登录</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input1: "",
      input2: "",
      checkbox1: true,
      start1: false,
      teleStor: "",
      psdStor: "",
      customerId: ""
    };
  },
  created() {
    this.teleStor = localStorage.getItem("TELEPHONE");
    this.psdStor = localStorage.getItem("PASSWORD");
    this.input1 = this.teleStor;
    this.input2 = this.psdStor;
  },
  methods: {
    //发送验证码
    sendCode1() {
      this.$dialog.loading.open("发送中...");
      this.$api
        .getCode({
          telephone: this.input1
        })
        .then(res => {
          if (res.success) {
            setTimeout(() => {
              this.start1 = true;
              this.$dialog.loading.close();
              this.$dialog.toast({
                mes: "已发送",
                icon: "success",
                timeout: 1500
              });
            }, 1000);
          } else {
            setTimeout(() => {
              this.start1 = true;
              this.$dialog.loading.close();
              this.$dialog.toast({
                mes: res.msg,
                icon: "error",
                timeout: 1500
              });
            }, 1000);
          }
        });
    },
    //登录
    login() {
      if (this.input1.length != 11 || this.input1 == null) {
        this.$dialog.toast({
          mes: "手机号不正确!",
          icon: "error"
        });
        return;
      }
      if (this.input2 == "") {
        this.$dialog.toast({
          mes: "密码错误!",
          icon: "error"
        });
        return;
      }
      this.$api
        .login({
          telephone: this.input1,
          password: this.input2
        })
        .then(res => {
          if (res.success) {
            this.customerId = res.dataObject;
            this.$dialog.loading.open('正在登录');
            setTimeout(() => {
              this.$dialog.loading.close()
              this.$router.push({
              path: "/house_list",
              query: {
                customerId: this.customerId
              }
            });
            }, 1500);
          }else{
            this.$dialog.toast({
              mes:res.msg,
              icon:'error'
            })
          }
        });
      if (this.checkbox1 == true) {
        this.psdStor = localStorage.setItem("PASSWORD", this.input2);
      } else {
        localStorage.clear();
      }
      this.teleStor = localStorage.setItem("TELEPHONE", this.input1);
    }
  }
};
</script>
<style>
input[type="password"] {
  padding-left: 0.3rem;
}
.home {
  padding-top: 2rem;
  background: #ffffff;
}
.yd-btn-warning:not(.yd-btn-loading) {
  background-color: #ffffff !important;
}
.home .login {
  width: 90%;
  margin: 0 auto;
  color: #6e6e6e;
}
.home .login img {
  width: 0.35rem;
  height: 0.33rem;
}
.home .remb_password {
  padding: 0.5rem 0.3rem;
}
.home .login_btn {
  width: 85%;
  height: 0.95rem;
  line-height: 0.95rem;
  color: #ffffff;
  text-align: center;
  background-image: url(../assets/images/butt_dl@2x.png);
  background-size: 100% 100%;
  margin: 1rem auto;
}
</style>
