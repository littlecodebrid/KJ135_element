/* eslint-disable */

import ApiClient from '@/api/ApiClient'
import config from '@/../public/config'

export default class MonitorApiClient {
    constructor() {
        this.api = new ApiClient(config.monitorBaseUrl+"/monitor/")
    }

    getToplogy(){
        return this.api.get('topology')
    }
    
    getHost(param){
        return this.api.get('host', param)
    }
    

    getService(param){
        return this.api.get('service', param)
    }
    

    getProblem(param){
        return this.api.get('problem', param)
    }
    
    getStorage(param){
        return this.api.get('storage',param)
    }
    
}