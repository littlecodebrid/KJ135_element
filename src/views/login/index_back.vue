<template>
  <div class="login-container" style="height:1000px;">
    <el-scrollbar style='height:100%'>
    <div class="login-wrapper"></div>
    <div class="title-container">
      <h3 class="title" style="color:#eee">{{$t('login.title')}}</h3>
    </div>

    <el-card class="card-box">

      <div class="title-container">
        <h3 class="title" style="color:#1890ff">{{$t('login.about')}}</h3>
      </div>

      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

        <el-form-item prop="username"  >
          <span slot="label">{{$t('login.username')}}</span>
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password"  >
            <span slot="label">{{$t('login.password')}}</span>
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-form-item prop="capatch"  >
          <span slot="label">{{$t('login.code')}}</span>
          <el-input style="width: 50%"
            ref="username"
            v-model="loginForm.captcha"
            placeholder="Verification"
            name="capatch"
            type="text"
            tabindex="3"
            autocomplete="false"
            @keyup.enter.native="login"
          />
          <img class="login-captcha"  style="width:50%;border: solid #0a76a4 1px" :src="captchaPath" @click="getCaptcha()" alt="">



        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="login">登录</el-button>
        <hr style="margin-bottom: 10px;"/>

        <el-row type="flex">
          <a href="/#/register" class="zadmin-left" style="width: 50%; float: left">{{$t('login.register')}}</a>
          <a href="/#/forget" class="zadmin-right-forget" style="width: 50%; float: right; padding-left: 15%">{{$t('login.forget')}}</a>

        </el-row>

      </el-form>
    </el-card>

    </el-scrollbar>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import ApiClient from '../../api/ApiClient'
import { getUUID } from '../../utils/validate'
import { setToken } from '../../utils/auth'

export default {
   name: 'Login',
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', message: "验证码不能为空" }]
      },
      captchaPath: null,
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      baseUrl:'http://192.168.0.18:8080/auth'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.getCaptcha()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getCaptcha () {
      this.loginForm.uuid = getUUID()
      this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.loginForm.uuid}`)
      console.log('ymcaptcha', this.captchaPath)
    },

    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // this.$router.push({ path: '/cache', query: this.otherQuery })
              this.goToRedirect()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    login() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/login'),
            method: 'post',
            data: this.$http.adornData(this.loginForm)
          }).then(({data}) => {

            if (data && data.code === 0) {
              this.$store.commit('SET_TOKEN', data.token)
              setToken(data.token)
              this.goToRedirect()
            } else {
              this.getCaptcha()
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    goToRedirect() {
      let currentUrl = window.location.href
      let toUrl
      if(currentUrl.indexOf('redirect') !== -1) {
        toUrl = currentUrl.match(/redirect=(\S*)/)[1]
        toUrl = decodeURIComponent(toUrl)
        if(toUrl.indexOf('http') !== -1) {
          window.location.href = toUrl

        } else {
          this.$router.push({path: toUrl})
        }
      } else {
        this.$router.push({path: '/home'})
      }

      console.log('this.$router :', this.$router)
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">

$bg:white;
$light_gray:#333;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: #333;
  }

  .el-form-item__label{
    float: left;
    width: 80px;

  }

  .el-form-item__content{
    float: left;
    display: flex;
    background: rgba(128, 128, 128, 0.1);
    width: 70%;
  }

}
</style>

<style lang="scss" scoped>
$bg:white;
$dark_gray:#889aa4;
$light_gray:#333;

 .card-box {
   width: 500px;
   justify-content: center;
   z-index: 100 !important;
   position: absolute;
   left: calc(50% - 250px);

 }


.login-wrapper {
  background: #0e405c;
  /*background: #304156;*/
  height: 340px;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 0;
}

.login-container {
  padding-top: 50px;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  z-index: 2;
  position: relative;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }



  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }


  .login-captcha {
    overflow: hidden;
  }

  .login-captcha > img {
    width: 100px;
    cursor: pointer;
    display: inline-block;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
  //滚动条
.el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
