import enLocale from 'element-ui/lib/locale/lang/en' //引入element语言包
const en = {
  login: {
    'title':'DataManageSystem',
    'about':'User login',
    'username':'username',
    'password':'password',
    'code':'Verification',
    'register':'Create an account.',
    'forget':'forget password？',
    'verifyCode':'verifyCode',
    'sendCode':'send Code',
    'login':'Sign in',
    'reSend':'ReSend',
  },
  register: {
    'about':'Register',
    'confirm':'confirm',
    'email':'email',
    'mobile':'phone',
    'toLogin':'TO LOGIN',
    'isPass':'please input PassWord',
    'isPhone':'format of phone number is wrong',
    'isConfrim':'please input ConfrimPassWord',
    'checkPass':'Two input password must be consistent',
    'checkPhone':'please input phoneNumber',
    'checkcaptcha':'please input VerifyCode',
  },
  forget:{
    'confrim':'Send password reset email',
    'reset':'Reset Password',
    'isUser':'please input Account',
    'isEmail':'please input Email',
  },
  backstage:{
    '06001':'Valid code error!',
    '06002':'Incorrect username or password!',
    '06003':'Accout is locked,please contact system administrator!',
    '06004':'Account has existed!',
    '06005':'Phone number has existed!',
    '06006':'Email has existed!',
    '06007':'You have registered successfully!',
    '06008':'Account is disabled，please contact the administrator!',
    '06009':'Account does not exist!',
    '06010':'Password is resetted，please check your email!',
    '06011':'Token is not valid，please login again!',
    '06013':'Account has not existed!',
    '06014':'VerifyCode is Sending,pleast hold on!',
    '06015':'VerifyCode is Error',
    '06016':'Please get the verification code',
    '06017':'The verification code is invalid, please get it again',
    '06018':'Error in verification code input, please try again!',
  },
  ...enLocale
}

export default en;
