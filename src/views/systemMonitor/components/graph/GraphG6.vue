<template>
    <div id="mountNode" class="mountNode"></div>
</template>
<script>
// import Graph from '../../compnentsVue/charts/graph.vue'
export default {
    name: 'graph-g6',
    mounted() {
        this.initG6();

    },
    props: ['data', 'size'],
    methods: {
        initG6(){
            const self = this
            G6.Global.nodeLabelStyle = { // 设置节点文本的样式
                fill: 'white',
                textAlign: 'center',
                textBaseline: 'middle',
                fontSize: 20
            };
            self.plugin = new G6.Plugins['layout.dagre']({
                rankdir: 'LR', // 可取值为： 'TB','BT','LR','RL' 默认为 'TB'
                nodesep: 100, // 节点间距
                ranksep: 100, // 层次距离
                useEdgeControlPoint: true, // 生成边的控制点，默认为 true
            });
            self.Util = G6.Util;
            self.net = new G6.Net({
                id: 'mountNode',
                // height: 400,
                // width: 1680,
                height: 500,
                width: 850,
                fitView: 'cc', // cc(center center) 渲染到图表的中间位置， autoZoom 自动适应画布 ,fitView
                // fitView: 'autoZoom',
                mode: 'none',
                grid: null, // 无网格
            });
            self.net.changeMode('drag'); // 画布可拖动
            // console.log('111111',this.size)
            // if(this.size) self.net.changeSize(1679, this.size);

            self.net.tooltip({
                split: ': ', // @type {String} 分割符号
                dx: 10, // @type {Number} 水平偏移
                dy: 10, // @type {Number} 垂直偏移
            })
            self.net.on('itemclick', ev => {
                let param = {
                    data: ev.item.get('model')
                }
                this.$emit('openNewTab', param)
            });
            // 添加移动的小圆球
            G6.registEdge('move-ball', {
                draw: function(cfg, group) {
                    let model = cfg.model;
                    var points = cfg.points;
                    var label = cfg.label;
                    var pointsArr = [];
                    var totalLength = 0;
                    var speed = 0.1; // 0.1 像素每毫秒
                    var p2;
                    var newCfg;
                    var shape;
                    self.Util.each(points, function(p1, i){
                        pointsArr.push([p1.x, p1.y]);
                        p2 = points[i+1];
                        if(p2){
                            totalLength += Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
                        }
                    });
                    newCfg = {
                        attrs: {
                            points: pointsArr,
                            stroke: '#68C1EA',
                            arrow: false,
                            lineDash: [0,0],
                            lineWidth: model.val === 'thin' ? this.lineThin : this.lineW
                        }
                    };
                    if(model.type === 'dashArrow'){
                        newCfg.attrs.lineDash = [5,5] // 此属性变成虚线
                    } else if(model.type === 'solidArrow'){
                        newCfg.attrs.lineDash = [0,0] // 为[0,0]变成实线
                    }

                    shape = group.addShape('polyline', newCfg);
                    var tinyPoint = group.addShape('circle', {
                        attrs: {
                            x: points[0].x,
                            y: points[0].y,
                            r: 2,
                            fill: 'white' // 移动的小小球的颜色
                        }
                    });
                    tinyPoint.animate({
                        onUpdate: function(frame, ratio){
                            var p = shape.getPoint(ratio);
                            frame.attrs.x = p.x;
                            frame.attrs.y = p.y;
                            },
                        repeat: true
                    }, totalLength/speed);
                    return shape;
                }
            });
            // 注册图标样式基类
            G6.registerNode('model-card', {
                draw(item, group) {
                    // console.log(item)
                    const model = item.model;
                    const width = 90;
                    const height = 40;
                    const x = -width / 2;
                    const y = -height / 2;
                    const borderRadius = 4;
                    const keyShape = group.addShape('rect', {
                        attrs: { // 节点的设置
                            x,
                            y,
                            width,
                            height,
                            radius: borderRadius,
                            fill: 'white', // 设置节点背景颜色
                            fillOpacity: '1',
                            stroke: '#CED4D9'
                        }
                    });

                    // 左侧色条
                    group.addShape('path', {
                        attrs: {
                            path: [
                                [ 'M', x, y + borderRadius ],
                                [ 'L', x, y + height - borderRadius ],
                                [ 'A', borderRadius, borderRadius, 0, 0, 0, x + borderRadius, y + height ],
                                [ 'L', x + borderRadius, y ],
                                [ 'A', borderRadius, borderRadius, 0, 0, 0, x, y + borderRadius ]
                            ],
                            // fill: this.color_type,
                            fill: self.tranStatus(model.Status)
                        }
                    });
                    // 类型 logo // 节点上的icon
                    let type_icon_color_left_logo_url = '';
                    let type_icon_color_status_logo_url = '';

                    // if(model.Status === "Completed") {
                    //     type_icon_color_left_logo_url = '../../../static/images/icons/01_green.png';
                    //     type_icon_color_status_logo_url = '../../../static/images/icons/03_green.png';

                    // }else if(model.Status === "Aborted") {
                    //     type_icon_color_left_logo_url = '../../../static/images/icons/01_red.png';
                    //     type_icon_color_status_logo_url = '../../../static/images/icons/03_red.png';

                    // }else if(model.Status === "Running") {
                    //     type_icon_color_left_logo_url = '../../../static/images/icons/01_orange.png';
                    //     type_icon_color_status_logo_url = '../../../static/images/icons/03_orange.png';

                    // }else {
                    //     type_icon_color_left_logo_url = '../../../static/images/icons/01_gray.png'
                    //     type_icon_color_status_logo_url = '../../../static/images/icons/03_gray.png'
                    // }
                    // group.addShape('image', { // 左侧icon
                    //     attrs: {
                    //     // img: this.type_icon_url,
                    //     img: type_icon_color_left_logo_url,
                    //     x: x + 16,
                    //     y: y + 12,
                    //     width: 20,
                    //     height: 16
                    //     }
                    // });
                    // 名称文本
                    const label = model.label ? model.label : this.label;
                    group.addShape('text', {
                        attrs: {
                            text: label,
                            x: x + 13,
                            y: y + 13 + 2,
                            textAlign: 'start',
                            textBaseline: 'top',
                            //fill: 'rgba(0,0,0,0.65)'
                            fill: 'black'
                        }
                    });
                    // // 状态 logo // 右侧的 icon
                    // group.addShape('image', {
                    //     attrs: {
                    //     // img: this.state_icon_url,
                    //     img: type_icon_color_status_logo_url,
                    //     x: x + 158,
                    //     // x: x + 274,
                    //     y: y + 12,
                    //     width: 16,
                    //     height: 16
                    //     }
                    // });
                    return keyShape;
                },
                // 设置锚点
                anchor: [
                    [ 0.5, 0 ], // 上面边的中点
                    [ 0.5, 1 ] // 下边边的中点
                ]
            });
        },
        tranStatus (status) {
            let color = '';
            if(status == "Completed") {
                color = 'rgba(0,166,90,1)';
            }else if(status == "Aborted") {
                color = 'rgba(221 ,75,57,1)';
            }else if(status == "Running") {
                color = 'rgba(255,153,0,1)';
            }else {
                color = 'gray';
            }
            return color
        },
        render(DATA){
             DATA.nodes ? DATA.nodes.map((item, index) => {
                item.shape = 'model-card';
                item.color = this.tranStatus(item.Status)
                item.width = 90;
                item.height = 50;
                item.val = item.value;
                item['设备类型'] = item.val;
                item['设备名称'] = item.name;
                item['状态'] = item.status;
                item.label = item.value;
                // if(item.value.length > 9){
                //     item.label = item.value.substr(0, 8) + '...';
                // } else {
                //     item.label = item.value;
                // }
                return item
            }) : '';
            DATA.lines ? DATA.lines.map((item, index) => {
                item.shape = 'move-ball';
                return item
            }) : ''
            DATA.edges = DATA.lines ? DATA.lines : '';
            let readData = {
                source: DATA
            }
            this.net.read(readData);

            this.net.node().tooltip(['设备类型','设备名称','状态'])
            this.net.render();
        },
        handleData(param){ // 点击表格显示流程图
            this.net.clear(); //  清空画布
            this.render(param);
        },
    },
}
</script>
<style>

</style>
