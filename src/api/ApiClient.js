/* eslint-disable */
import request from './request'
import qs from 'qs'
/**
 使用示例：
 import ApiClient from '@/api/ApiClient.js'
 
 let api = new ApiClient('http://xxx.xx.xx/cache/data')

 this.api.get('', {json:'sfs'}).then(res => {
   console.log(res)
 }) 
 this.api.post('', {cacheName:'sfs1'})
 this.api.put('', {cacheName:'sfs1'})
 this.api.delete('', {id: 'test'}).then(res =>{
   console.log(res)
 }).catch(err =>{
   console.log(err)
 })

 */
export default class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    parseArgs(param, xform){
        let contentType = "application/json;text/plain; charset=UTF-8"
        let xdata = param
        if(xform) {
          xdata = qs.stringify(param)
          contentType = "application/x-www-form-urlencoded;"+contentType
        }

        return {
            data: xdata,
            headers: {'Content-Type': contentType} 
        }
    }

    get(url, param){
        console.log("GET:"+this.baseUrl+ url +" with param:"+param)
        return request({
            url: this.baseUrl+url,
            method: 'get',
            params: param
        })
    }

    post(url, param, xform=false){
        console.log("POST:"+ this.baseUrl+ url +" with param:"+param)
        let args = this.parseArgs(param, xform)
        return request({
            method: 'post',
            url: this.baseUrl+url,
            data: args.data,
            headers: args.headers
        })
    }

    put(url, param, xform=false){
        console.log("PUT:"+ this.baseUrl+ url +" with param:"+param)
        let args = this.parseArgs(param, xform)
        return request({
            method: 'put',
            url: this.baseUrl+url,
            data: args.data,
            headers: args.headers
        })
    }

    delete(url, param, xform=false){
        console.log("DELETE:"+ this.baseUrl+ url +" with param:"+param)
        let args = this.parseArgs(param, xform)
        return request({
            method: 'delete',
            url: this.baseUrl+url,
            data: args.data,
            headers: args.headers
        })
    }




}