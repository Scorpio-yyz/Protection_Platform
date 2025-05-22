<template>
  <div class="login">
    <div class="title-box">
      <img src="../assets/login/登录切图/biaotou.png" alt="" class="title-bg">
      <!-- <img src="../assets/login/视频深度伪造对抗系统.png" alt="" class="title-img"> -->
      <div class="title-img" style="color: #fff;font-size: 44px;letter-spacing: 4px;font-weight: bold;">
        面向虚假信息工具的立体防护平台
      </div>
    </div>
    <!-- <img src="../assets/login/ren.png" alt="" class="left-img"> -->
    <div class="login-weaper">
      <div class="login-right">
        <div class="login-main">
          <h4 class="login-title">登 录</h4>
          <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
                <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码"
                @keyup.enter="handleLogin">
                <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
              <el-input v-model="loginForm.code" size="large" auto-complete="off" placeholder="验证码" style="width: 63%"
                @keyup.enter="handleLogin">
                <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" class="login-code-img" />
              </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
              <el-button :loading="loading" size="large" type="primary" style="width:100%;" @click.prevent="handleLogin">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
              <div style="float: right;" v-if="register">
                <router-link class="link-type" :to="'/register'">立即注册</router-link>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();

const loginForm = ref({
  username: "",
  password: "",
  rememberMe: false,
  code: "",
  uuid: ""
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const codeUrl = ref("");
const loading = ref(false);
// 验证码开关
const captchaEnabled = ref(true);
// 注册开关
const register = ref(false);
const redirect = ref(undefined);

watch(route, (newRoute) => {
  redirect.value = newRoute.query && newRoute.query.redirect;
}, { immediate: true });

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        Cookies.set("password", encrypt(loginForm.value.password), { expires: 30 });
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 });
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore.login(loginForm.value).then(() => {
        const query = route.query;
        const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
          if (cur !== "redirect") {
            acc[cur] = query[cur];
          }
          return acc;
        }, {});
        router.push({ path: redirect.value || "/", query: otherQueryParams });
      }).catch(() => {
        loading.value = false;
        // 重新获取验证码
        if (captchaEnabled.value) {
          getCode();
        }
      });
    }
  });
}

function getCode() {
  getCodeImg().then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      loginForm.value.uuid = res.uuid;
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

getCode();
getCookie();
</script>

<style lang='scss' scoped>
.login {
  height: 100%;
  min-height: 950px;
  width: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
  background-image: url(../assets/login/登录切图/beij.png);
  background-size: 100% 100%;

  .title-box {
    position: fixed;
    top: 0;
    width: 100%;

    .title-bg {
      width: 100%;
    }

    .title-img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .left-img {
    position: absolute;
    top: 54%;
    transform: translateY(-50%);
    left: 12%;
    width: 700px;
  }

  .login-weaper {
    width: 491px;
    height: 450px;
    padding: 20px;
    display: flex;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 12%;
    z-index: 1;
    border: none;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    background-color: #2B3950;
    border-radius: 30px;

    .login-right {
      padding: 20px;
      width: 100%;
      position: relative;
      align-items: center;
      display: flex;
      background-color: #001A2D;
      border-radius: 10px;

      .login-main {
        margin: 0 auto;
        width: 100%;

        .login-title {
          color: #fff;
          margin-bottom: 20px;
          font-weight: 800;
          font-size: 40px;
          text-align: center;
          letter-spacing: 4px;
        }

        .login-form {
          margin: 10px 0;

          i {
            color: var(--prev-color-text-primary);
          }

          .el-form-item {
            height: 38px;
            margin-bottom: 20px !important;

            .el-input {
              height: 100%;
            }

            .login-code {
              display: flex;
              align-items: center;
              justify-content: space-around;
              margin: 0 0 0 10px;
              user-select: none;

              .login-code-img {
                margin-top: 2px;
                width: 100px;
                height: 38px;
                border: 1px solid var(--prev-border-color-base);
                color: var(--prev-color-text-primary);
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 5px;
                line-height: 38px;
                text-indent: 5px;
                text-align: center;
                cursor: pointer;
                transition: all ease 0.2s;
                border-radius: 4px;

                &:hover {
                  border-color: var(--prev-border-color-hover);
                  transition: all ease 0.2s;
                }
              }
            }

            .login-submit {
              width: 100%;
              letter-spacing: 2px;
            }
          }
        }

        .login-menu {
          margin-top: 30px;
          width: 100%;
          text-align: left;

          a {
            color: var(--prev-color-text-secondary);
            font-size: 12px;
            margin: 0 8px;
            text-decoration: none;

            &:hover {
              color: var(--prev-color-primary);
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
