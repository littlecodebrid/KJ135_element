// create by zhengruxiu 2020.04.02
/* eslint-disable */
// 生成选项
export function getRadio(data){
    let arr = [], id = 0
    for (var i in data){
        arr.push({id: id++, label: i, name: data[i]})
    }
    return arr
}
export function getSelect(data){
    let arr = [], id = 0
    if (Array.isArray(data)) {
        data.map(val => {
            arr.push({id: id++, label: val, value: val})
        })
    } else {
        for (var i in data){
            arr.push({id: id++, label: data[i], value: i})
        }
    }
    return arr
}
export function getFilter(data){
    let arr =[], obj = JSON.parse(JSON.stringify(data))
    for (var i in obj){
        if(i === 'dataType') delete obj[i]
        if(Array.isArray(obj[i])) {  // 值为数组
            if (obj[i].length !== 0){  // 数组不为空
                obj[i].map(val => {
                    if (val.indexOf('>') !== -1)
                        arr.push(`${i}=gt='${val.substr(1)}'`) 
                    else if (val.indexOf('<') !== -1)
                        arr.push(`${i}=lt='${val.substr(1)}'`)
                })
            }
        }else{  //值为字符串
            if (obj[i])  //字符串不为空
                arr.push(`${i}=='${obj[i]}'`)  
        }
    }
    return arr.join(';')
}
export function byteConvert(data) {  //字节转换
    let num = Number(data)
    if (num < 1024)
        return num + 'B'
    else if (num >= 1024 && num < 1024 * 1024)
        return Math.floor(num / 1024 * 100) / 100 + 'KB'
    else if (num >= 1024 * 1024 && num < 1024 * 1024 * 1024 )
        return Math.floor(num / (1024 * 1024) * 100) / 100 + 'MB'
    else if (num >= 1024 * 1024 * 1024 && num < 1024 * 1024 * 1024 * 1024)
        return Math.floor(num / (1024 * 1024 * 1024) * 100) / 100 + 'GB'
    else if (num >= 1024 * 1024 * 1024 * 1024 && num < 1024 * 1024 * 1024 * 1024 * 1024)
        return Math.floor(num / (1024 * 1024 * 1024 * 1024) * 100) / 100 + 'TB'
}

// 异常信息英文转中文
export function exceptionConvert(str){
    console.log('转', str)
    if (str === '' || str === null || str === undefined) return str
    let newStr = str.replace(/WRAN/g, '警告').replace(/abnormal/g, '异常')
    return newStr
}