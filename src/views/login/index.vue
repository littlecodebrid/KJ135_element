<template>
  <div class="login-container">
   <!-- <div class="login-wrapper"></div>-->
    <div class="title-container">
      <!--<h3 class="title" style="color:#eee">数据管理分系统</h3>-->
      <h3 class="title" style="color:#1890ff">{{$t("login.title")}}</h3>
    </div>

    <el-card class="card-box">

      <div class="title-container">
        <!--<h3 class="title" style="color:#1890ff">用户登录界面</h3>-->
        <h3 class="title" style="color:#1890ff">{{$t("login.about")}}</h3>
      </div>

      <el-switch style="display: block;float: right;margin-bottom:10px" v-model="switchValue"
                 inactive-color="#13ce66"
                 active-color="#1890ff"
                 inactive-text="English"
                 active-text="中文"
                 @change="switchChange">
      </el-switch>

      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
        <!--<el-form-item prop="username"  label="用户名">-->
        <el-form-item prop="username"  :label="$t('login.username')">
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

       <!-- <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>-->
          <!--<el-form-item prop="password"  label="密码">-->
          <el-form-item prop="password"  :label="$t('login.password')">
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
     <!--   </el-tooltip>-->
        <!--短信验证码-->
        <el-form-item prop="verifyCode" :label="$t('login.verifyCode')" >
          <el-input style="width: 70%"
                    ref="verifyCode"
                    v-model="loginForm.verifyCode"
                    :placeholder="$t('login.verifyCode')"
                    name="verifyCode"
                    type="text"
                    tabindex="3"
                    autocomplete="false"
          />
          <el-button type="button" @click="sendcode" :disabled="disabled" style="padding-right: auto" v-if="disabled==false" > {{ $t('login.sendCode') }}</el-button>
          <el-button type="button" @click="sendcode" :disabled="disabled" style="padding-right: auto" v-if="disabled==true">{{btntxt}} </el-button>
        </el-form-item>
        <!--<el-form-item prop="capatch" label="验证码" >-->
        <el-form-item prop="capatch" :label="$t('login.code')" >
          <el-input style="width: 50%"
                    ref="username"
                    v-model="loginForm.captcha"
                    :placeholder="$t('login.code')"
                    name="capatch"
                    type="text"
                    tabindex="3"
                    autocomplete="false"
          />
          <img class="login-captcha"  style="width:50%;border: solid #0a76a4 1px" :src="captchaPath" @click="getCaptcha()" alt="">
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="login" native-type="submit">{{$t('login.login')}}</el-button>
        <hr style="margin-bottom: 10px;"/>

        <el-row type="flex">
          <!-- <a href="/#/register" class="zadmin-left" style="width: 50%; float: left">还没有账号？去注册</a>
           <a href="user/editPwd" class="zadmin-right-forget" style="width: 50%; float: right; padding-left: 30%">忘记密码</a>-->
          <a href="/#/register" class="zadmin-left" style="width: 50%; float: left">{{$t('login.register')}}</a>
          <a href="/#/forget" class="zadmin-right-forget" style="width: 60%; float: right; padding-left: 30%">{{$t('login.forget')}}</a>
        </el-row>

      </el-form>
    </el-card>


  </div>
</template>

<script>
  import { validUsername } from '@/utils/validate'
  import SocialSign from './components/SocialSignin'
  import { getUUID } from '../../utils/validate'
  import { setToken } from '../../utils/auth'
  import Cookies from 'js-cookie'
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
        switchValue: true,
        loginForm: {
          username: 'admin',
          password: 'admin'
        },
        loginRules: {
          // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          //password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          captcha: [{ required: true, trigger: 'blur', message: this.$t('register.checkcaptcha') }]
        },
        captchaPath: null,
        passwordType: 'password',
        capsTooltip: false,
        loading: false,
        showDialog: false,
        redirect: undefined,
        disabled: false,
        time: 0,
        btntxt: this.$t('login.reSend'),
        otherQuery: {}/*,
      baseUrl:'http://192.168.0.18:8080/auth'*/
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
    updated(){
      if(sessionStorage.getItem('locale')=='en'){
        this.switchValue=false
      }else {
        this.switchValue=true
      }
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
      window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      getCaptcha () {
        this.loginForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.loginForm.uuid}`)
        // console.log('ymcaptcha', this.captchaPath)
      },
      sendcode() {
        /*  this.$message({
           /!* message: '发送成功',*!/
            type: 'success',
            center:true
          });*/
        this.time = 60;
        this.disabled = true;
        this.timer();
        this.$http({
          url: this.$http.adornUrl('/sys/sendCode'),
          method: 'post',
          data: this.$http.adornData(this.loginForm)
        }).then(({data}) => {
          this.$message.info(this.$t(data.msg))
        })
      },
      //60S倒计时
      timer() {
        if (this.time > 0) {
          this.time--;
          this.btntxt = this.time + "s后，"+this.$t('login.reSend');
          setTimeout(this.timer, 1000);
        } else {
          this.time = 0;
          this.btntxt = this.$t('login.sendCode');
          this.disabled = false;
        }
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
                Cookies.set('languageKey', this.switchValue)
                this.goToRedirect()
              } else {
                this.getCaptcha()
                this.$message.error(this.$t(data.msg))
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
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      },
      switchChange(value){
        if(value==true){
          localStorage.setItem('lang', 'zh-CN')
          sessionStorage.setItem('locale','cn')
          this.$i18n.locale=sessionStorage.getItem('locale')
        }else {
          localStorage.setItem('lang', 'en-US')
          sessionStorage.setItem('locale','en')
          this.$i18n.locale=sessionStorage.getItem('locale')
        }
      },
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
    background:hsla(0,0%,100%,.3);

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
    background-image: url(~@/assets/img/login_bg1.png);
    background-size:100%;
    //background-color: $bg;
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
</style>
