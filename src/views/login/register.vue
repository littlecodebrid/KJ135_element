<template>


  <div class="login-container" style="height:1000px;">
    <el-scrollbar style='height:100%'>
   <!-- <div class="login-wrapper"></div>-->
    <div class="title-container">
      <h3 class="title" style="color:#1890ff">{{$t("login.title")}}</h3>
    </div>

    <el-card class="card-box">
      <div class="title-container">
        <h3 class="title" style="color:#1890ff">{{$t('register.about')}}</h3>
      </div>

      <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  autocomplete="on" label-position="left">

        <el-form-item  prop="username">
          <span slot="label">{{$t('login.username')}}</span>
          <el-input v-model="dataForm.username" :placeholder="$t('login.username')"></el-input>
        </el-form-item>
        <el-form-item  prop="password" :class="{ 'is-required': !dataForm.id }">
          <span slot="label">{{$t('login.password')}}</span>
          <el-input v-model="dataForm.password" type="password" :placeholder="$t('login.password')"></el-input>
        </el-form-item>
        <el-form-item  prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
          <span slot="label">{{$t('register.confirm')}}</span>
          <el-input v-model="dataForm.comfirmPassword" type="password" :placeholder="$t('register.confirm')"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <span slot="label">{{$t('register.email')}}</span>
          <el-input v-model="dataForm.email" :placeholder="$t('register.email')"></el-input>
        </el-form-item>
        <el-form-item prop="mobile">
          <span slot="label">{{$t('register.mobile')}}</span>
          <el-input v-model="dataForm.mobile" oninput="if(value.length > 11)value = value.slice(0, 11)" :placeholder="$t('register.mobile')" ></el-input>
        </el-form-item>
       <!-- <el-form-item label="角色" size="mini" prop="roleIdList">
          <el-checkbox-group v-model="dataForm.roleIdList">
            <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
        <el-form-item prop="capatch"  >
          <span slot="label">{{$t('login.code')}}</span>
          <el-input style="width: 50%"
                    ref="username"
                    v-model="dataForm.captcha"
                    :placeholder="$t('login.code')"
                    name="capatch"
                    type="text"
                    tabindex="3"
                    autocomplete="false"
          />
          <img class="login-captcha"  style="width:50%;border: solid #0a76a4 1px" :src="captchaPath" @click="getCaptcha()" alt="">
        </el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="register">{{$t('register.about')}}</el-button>
        <hr style="margin-bottom: 10px;"/>
        <el-row type="flex">
          <a href="/#/login?redirect=http%3A%2F%2Flocalhost%3A8001%2F#/sys-tusubsystem" class="zadmin-left" style="width: 50%; float: left">{{$t('register.toLogin')}}</a>
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
import { getUUID, isEmail, isMobile } from '../../utils/validate'
import { setToken } from '../../utils/auth'

export default {
   name: 'Login',
  components: { SocialSign },
  data () {
    var validateUser = (rule, value, callback) => {
      if (value==null) {
        callback(new Error(this.$t('forget.isUser')))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error(this.$t('register.isPass')))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error(this.$t('register.isConfrim')))
      } else if (this.dataForm.password !== value) {
        callback(new Error(this.$t('register.checkPass')))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error(this.$t('backstage.06012')))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error(this.$t('register.isPhone')))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      captchaPath: null,
      //baseUrl:'http://172.19.4.221:8080/auth',
      baseUrl:'http://172.16.2.36:8888/auth',
      loading: false,
        roleList: [{roleId:2, roleName:'普通用户'}],
        dataForm: {
        id: 0,
          username: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          status: 1
      },
      dataRule: {
        username: [
          { required: true, message: this.$t('forget.isUser'), trigger: 'blur' }
        ],
          password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
          comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
          email: [
          { required: true, message: this.$t('forget.isEmail'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
          mobile: [
          { required: true, message: this.$t('forget.checkPhone'), trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$t('register.checkcaptcha'), trigger: 'blur' }]
      }
    }
  },
  watch: {


  },

  mounted(){
    this.getCaptcha()
  },

  methods: {
    getCaptcha () {
      this.dataForm.uuid = getUUID()
      this.captchaPath = this.baseUrl + `/captcha.jpg?uuid=${this.dataForm.uuid}`
    },
    init (id) {
      this.dataForm.id = id || 0
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
    register() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/register'),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({data}) => {
            console.log("data:"+data.code)
            if (data && data.code === 0) {
            /*  this.$store.commit('SET_TOKEN', data.token)
              setToken(data.token)
              */
              this.$message.info(this.$t(data.msg));
              this.goToRedirect()
            } else {
              this.getCaptcha()
              this.$message.error(this.$t(data.msg))
            }
          })
        }
      })
    },
  }
}

</script>

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
   /* background-color: $bg;*/
    background-image: url(~@/assets/img/login_bg1.png);
    background-size:100%;
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
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
</style>
