// import topology from './public/topology.js'
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const port = 18886;

let express = require('express');   //引入express
let Mock = require('mockjs');       //引入mock

let app = express();        //实例化express

let topologyExport = require('./public/topology.js');
// let graphData = {};
// let graphData = topology
let ipList = [
  '172.19.4.221',

]

let serviceList = [
  'mysql',
  'redis',
  'auth-system',
  'monitor-system',
  'zabbix',
  'sshd',
  'crond',
  'ntpd'
]

app.all('*',function(req, res, next) {

    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header("Access-Control-Allow-Headers", "*");
    if(req.method === "OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
      else  next();

});


app.get('/monitor/host',function(req, res){
  List = []
  for (let i = 0; i < 6; i++) {
    List.push(Mock.mock({
      id: '@increment',
      name: 'server'+ipList[i].substr(9,3),
      "status|1": ['Normal','Error'],
      uptime: '@datetime',
      ip: ipList[i],
      cpu: '@float(20, 60, 2, 2)',
      memory: '@float(30, 80, 2, 2)',
    }))
  }

res.json({
    code: 200,
    exception: '',
    data: List
})
})


app.get('/monitor/service',function(req, res){
  List = []
  for (let i = 0; i < 8; i++) {
    List.push(Mock.mock({
      id: '@increment',
      name: serviceList[i],
      "status|1": ['Normal','Error'],
      uptime: '@datetime',
      "ip|1": ipList,
    }))
  }

res.json({
    code: 200,
    exception: '',
    data: List
})
})

app.get('/monitor/topology',function(req, res){
  let graphData = topologyExport.topology
  graphData.nodes.map(item => {
    item.status = 'normal'
  })
  // List = []
  // for (let i = 0; i < 8; i++) {
  //   List.push(Mock.mock({
  //     id: '@increment',
  //     name: serviceList[i],
  //     "status|1": ['Normal','Error'],
  //     uptime: '@datetime',
  //     "ip|1": ipList,
  //   }))
  // }

res.json({
    code: 200,
    exception: '',
    data: graphData
})
})


app.use('/product/show/query',function(req, res){

    List = []
      for (let i = 0; i < 3; i++) {
        List.push(Mock.mock({
          id: '@increment',
          seqInID: '@increment',
          longitude: '@float(80, 120, 2, 2)',
          latitude: '@float(20, 50, 2, 2)',
          firstTime: '@datetime',
          lastTime: '@datetime',
          description: 'test....'
        }))
      }

    res.json({
        code: 200,
        exception: '',
        data: {
          "total": 100,
          "size": 20,
          "current": 1,
          "orders": [],
          "hitCount": false,
          "searchCount": true,
          "pages": 5,
          'records': List,
        }
    })

})


app.listen(port, '0.0.0.0', (err) => {
    if (err) console.log(err);
    console.info('===> Listening on port %s. Open up http://0.0.0.0:%s/ in your broswer.', port, port);
});
