import zhLocale from 'element-ui/lib/locale/lang/zh-CN' //引入element语言包
const cn = {
  login: {
   'title':'数据管理分系统',
    'about':'用户登录界面',
    'username':'用户名',
    'password':'密码',
    'code':'验证码',
    'register':'还没有账号？去注册',
    'forget':'忘记密码？',
  },
  register: {
    'title':'数据管理分系统',
    'about':'用户注册',
    'confirm':'密码确认',
    'email':'邮箱',
    'mobile':'手机号',
    'toLogin':'已有账号？去登录',
  },
  ...zhLocale
}

export default cn;
