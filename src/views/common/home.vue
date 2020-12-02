<template>
  <div class="mod-home">
    <div class="z-body animated fadeIn">
        <blockquote class="layui-elem-quote">您好，
            <span><shiro:principal property="username"/></span>！当前时间: {{new Date().toString('yyyy-MM-dd HH:mm:ss') }}</blockquote>
        <fieldset class="layui-elem-field">
            <legend>数据统计</legend>
            <div class="layui-field-box">
                <div class="layui-col-md12">
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <div class="layui-carousel z-admin-carousel z-admin-backlog" lay-anim="" lay-indicator="inside" lay-arrow="none" style="width: 100%; height: 90px;">
                                <div carousel-item="">
                                    <ul class="layui-row layui-col-space10 layui-this">
                                        <li class="layui-col-xs2">
                                            <a href="#" onclick="openTab('用户管理', '/user/index')" class="z-admin-backlog-body">
                                                <h3>用户数</h3>
                                                <p>
                                                    <cite th:text="${userCount}"></cite>
                                                </p>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs2">
                                            <a href="#" onclick="openTab('角色管理', '/role/index')" class="z-admin-backlog-body">
                                                <h3>角色数</h3>
                                                <p>
                                                    <cite th:text="${roleCount}"></cite>
                                                </p>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs2">
                                            <a href="#" onclick="openTab('菜单管理', '/menu/index')" class="z-admin-backlog-body">
                                                <h3>菜单数</h3>
                                                <p>
                                                    <cite th:text="${menuCount}"></cite>
                                                </p>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs2">
                                            <a href="#" onclick="openTab('登录日志', '/log/login/index')" class="z-admin-backlog-body">
                                                <h3>登录日志</h3>
                                                <p>
                                                    <cite th:text="${loginLogCount}"></cite>
                                                </p>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs2">
                                            <a href="#" onclick="openTab('操作日志', '/log/sys/index')" class="z-admin-backlog-body">
                                                <h3>操作日志</h3>
                                                <p>
                                                    <cite th:text="${sysLogCount}"></cite>
                                                </p>
                                            </a>
                                        </li>
                                        <li class="layui-col-xs2">
                                            <a href="#" onclick="openTab('在线人数', '/online/index')" class="z-admin-backlog-body">
                                                <h3>在线人数</h3>
                                                <p>
                                                    <cite th:text="${userOnlineCount}"></cite>
                                                </p>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>
        <fieldset class="layui-elem-field">
            <legend>最近登录</legend>
            <div class="layui-field-box">
                <div id="main" style="width: 100%;height:400px;"></div>
            </div>
        </fieldset>
    </div>

  </div>
</template>

<script>
  export default {
    methods:{
      dateFormat(fmt, date) {
      var o = {
          "M+": date.getMonth() + 1,                      //月份
          "d+": date.getDate(),                           //日
          "h+": date.getHours(),                          //小时
          "m+": date.getMinutes(),                        //分
          "s+": date.getSeconds(),                        //秒
          "q+": Math.floor((date.getMonth() + 3) / 3),    //季度
          "S": date.getMilliseconds()                     //毫秒
      };
      if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
  },

    /**
     * 公共打开父页面 tab 方法.
     * @param title
     * @param url
     */
    openTab(title, url) {
        
    }
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>

