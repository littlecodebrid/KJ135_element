<template>


  <div class="login-container" style="height:1000px;">
    <el-scrollbar style='height:100%'>
    <div class="login-wrapper"></div>
    <div class="title-container">
      <h3 class="title" style="color:#eee">数据管理分系统</h3>
    </div>

    <el-card class="card-box">
      <div class="title-container">
        <h3 class="title" style="color:#1890ff">重置密码</h3>
      </div>

      <el-form :model="dataForm" :rules="dataRule" ref="dataForm"  autocomplete="on" label-position="left">

        <el-form-item label="用户名" prop="username">
          <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="confirm">确认</el-button>
        <hr style="margin-bottom: 10px;"/>
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
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }

    return {
      visible: false,
      captchaPath: null,
      //baseUrl:'http://172.19.4.221:8080/auth',
      loading: false,
        dataForm: {
        id: 0,
          username: '',
          email: ''
      },
      dataRule: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
          email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
      }
    }
  },


  methods: {
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

      console.log('this.$router :', this.$router)
    },
    confirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/sys/forget'),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({data}) => {
            console.log("data:"+data.code)
            if (data && data.code === 0) {
            /*  this.$store.commit('SET_TOKEN', data.token)
              setToken(data.token)
              */
              this.$message.info(data.msg);
              this.goToRedirect()
            } else {
              this.$message.error(data.msg)
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
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
</style>
