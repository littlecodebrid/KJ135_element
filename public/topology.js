module.exports = {
topology :
{
    "nodes": [
      {
        "status": "",
        "symbol": "roundRect",
        "name": "server144",
        "keyName": "test002",
        "x": "155",
        "y": "-76",
        "id": "server144",
        "value": "数管服务器2"
      },
      {
        "status": "",
        "symbol": "roundRect",
        "name": "switch10T",
        "keyName": "test001",
        "x": "325",
        "y": "50",
        "id": "switch10T",
        "value": "万兆交换机×2"
      },
      {
        "status": "",
        "symbol": "roundRect",
        "name": "server143",
        "keyName": "test002",
        "x": "50",
        "y": "-75",
        "id": "server143",
        "value": "数管服务器1"
      },
      {
        "status": "",
        "symbol": "roundRect",
        "name": "server141",
        "keyName": "test002",
        "x": "-160",
        "y": "-75",
        "id": "server141",
        "value": "数据库服务器1"
      },
      {
        "status": "",
        "symbol": "roundRect",
        "name": "server142",
        "keyName": "test002",
        "x": "-60",
        "y": "-75",
        "id": "server142",
        "value": "数据库服务器2"
      },
      {
        "status": "",
        "symbol": "roundRect",
        "name": "disk1",
        "keyName": "test001",
        "x": "325",
        "y": "150",
        "id": "disk1",
        "value": "NAS存储"
      },
    //   {
    //     "status": "",
    //     "symbol": "roundRect",
    //     "name": "test001159118082898363845811",
    //     "keyName": "test001",
    //     "x": "-225",
    //     "y": "50",
    //     "id": "test001159118082898363845811",
    //     "value": "万兆交换机"
    //   },
      {
        "status": "",
        "symbol": "roundRect",
        "name": "server147",
        "keyName": "test002",
        "x": "475",
        "y": "-75",
        "id": "server147",
        "value": "web服务器1"
      },
      {
        "status": "",
        "symbol": "roundRect",
        "name": "server146",
        "keyName": "test002",
        "x": "365",
        "y": "-75",
        "id": "server146",
        "value": "数管服务器4"
      },
      {
        "status": "",
        "symbol": "roundRect",
        "name": "server145",
        "keyName": "test002",
        "x": "260",
        "y": "-75",
        "id": "server145",
        "value": "数管服务器3"
      },
      {
        "status": "",
        "symbol": "roundRect",
        "name": "server148",
        "keyName": "test002",
        "x": "585",
        "y": "-75",
        "id": "server148",
        "value": "web服务器2"
      },
      {
        "status": "",
        "symbol": "roundRect",
        "name": "switchT",
        "keyName": "test001",
        "x": "300",
        "y": "-200",
        "id": "switchT",
        "value": "千兆交换机×2"
      }
    //   {
    //     "status": "",
    //     "symbol": "roundRect",
    //     "name": "test001159118111524017204513",
    //     "keyName": "test001",
    //     "x": "-225",
    //     "y": "150",
    //     "id": "test001159118111524017204513",
    //     "value": "万兆交换机"
    //   }
    ],
    "lines": [
      {
        "val": "thin",
        "shape": "arrow",
        "source": "server143",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 50,
            "y": -46.300000000000004
          },
          {
            "x": 50,
            "y": 50
          },
          {
            "x": 223.25,
            "y": 50
          }
        ],
        "target": "switch10T"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "server144",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 155,
            "y": -47.300000000000004
          },
          {
            "x": 155,
            "y": 50
          },
          {
            "x": 223.25,
            "y": 50
          }
        ],
        "target": "switch10T"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "server147",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 475,
            "y": -46.300000000000004
          },
          {
            "x": 475,
            "y": 50
          },
          {
            "x": 426.75,
            "y": 50
          }
        ],
        "target": "switch10T"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "server148",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 585,
            "y": -46.300000000000004
          },
          {
            "x": 585,
            "y": 50
          },
          {
            "x": 426.75,
            "y": 50
          }
        ],
        "target": "switch10T"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "server146",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 365,
            "y": -46.300000000000004
          },
          {
            "x": 365,
            "y": 0
          },
          {
            "x": 352.75,
            "y": 21.299999999999997
          }
        ],
        "target": "switch10T"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "switch10T",
        "type": "solidArrow",
        "controlPoints": null,
        "target": "disk1"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "server145",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 260,
            "y": -46.300000000000004
          },
          {
            "x": 260,
            "y": 0
          },
          {
            "x": 297.25,
            "y": 21.299999999999997
          }
        ],
        "target": "switch10T"
      },
    //   {
    //     "val": "thin",
    //     "shape": "arrow",
    //     "source": "test001159118082898363845811",
    //     "type": "solidArrow",
    //     "controlPoints": null,
    //     "target": "test001159118111524017204513"
    //   },
    //   {
    //     "val": "thin",
    //     "shape": "arrow",
    //     "source": "server141",
    //     "type": "solidArrow",
    //     "controlPoints": [
    //       {
    //         "x": -300,
    //         "y": -46.300000000000004
    //       },
    //       {
    //         "x": -300,
    //         "y": 0
    //       },
    //       {
    //         "x": -252.75,
    //         "y": 21.299999999999997
    //       }
    //     ],
    //     "target": "test001159118082898363845811"
    //   },
    //   {
    //     "val": "thin",
    //     "shape": "arrow",
    //     "source": "server142",
    //     "type": "solidArrow",
    //     "controlPoints": [
    //       {
    //         "x": -150,
    //         "y": -46.300000000000004
    //       },
    //       {
    //         "x": -150,
    //         "y": 0
    //       },
    //       {
    //         "x": -197.25,
    //         "y": 21.299999999999997
    //       }
    //     ],
    //     "target": "test001159118082898363845811"
    //   },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "switchT",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 198.25,
            "y": -200
          },
          {
            "x": -160,
            "y": -200
          },
          {
            "x": -160,
            "y": -103.7
          }
        ],
        "target": "server141"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "switchT",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 198.25,
            "y": -200
          },
          {
            "x": -60,
            "y": -200
          },
          {
            "x": -60,
            "y": -103.7
          }
        ],
        "target": "server142"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "switchT",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 198.25,
            "y": -200
          },
          {
            "x": 50,
            "y": -200
          },
          {
            "x": 50,
            "y": -103.7
          }
        ],
        "target": "server143"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "switchT",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 198.25,
            "y": -200
          },
          {
            "x": 155,
            "y": -200
          },
          {
            "x": 155,
            "y": -104.7
          }
        ],
        "target": "server144"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "switchT",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 272.25,
            "y": -171.3
          },
          {
            "x": 260,
            "y": -150
          },
          {
            "x": 260,
            "y": -103.7
          }
        ],
        "target": "server145"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "switchT",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 327.75,
            "y": -171.3
          },
          {
            "x": 365,
            "y": -150
          },
          {
            "x": 365,
            "y": -103.7
          }
        ],
        "target": "server146"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "switchT",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 401.75,
            "y": -200
          },
          {
            "x": 475,
            "y": -200
          },
          {
            "x": 475,
            "y": -103.7
          }
        ],
        "target": "server147"
      },
      {
        "val": "thin",
        "shape": "arrow",
        "source": "switchT",
        "type": "solidArrow",
        "controlPoints": [
          {
            "x": 401.75,
            "y": -200
          },
          {
            "x": 585,
            "y": -200
          },
          {
            "x": 585,
            "y": -103.7
          }
        ],
        "target": "server148"
      }
    ]
  }
}