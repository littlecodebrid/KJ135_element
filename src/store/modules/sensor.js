/* eslint-disable */

import { getAllOptions } from '@/api/sensor'
import { Message } from 'element-ui'
const state = {
    SatelliteID: [],
    SensorID: [],
    WorkMode: [],
    StationID: []

}
const mutations = {
    getSatelliteID(state, data){
        state.SatelliteID = data
    },
    getSensorID(state, data){
        state.SensorID = data
    },
    getWorkMode(state, data){
        state.WorkMode = data
    },
    getStationID(state, data){
        state.StationID = data
    }
}
const actions = {
    async getSatelliteID(context){
        let resp = await getAllOptions({searchType: 'PlatformID'})
        if (resp.code === 200)
            {context.commit('getSatelliteID', resp.data)
            return resp.data}
        else 
            Message({
                message: resp.exception,
                type: 'error'
            })
    },
    async getSensorID(context){
        let resp = await getAllOptions({searchType: 'SensorID'})
        if (resp.code === 200)
            {context.commit('getSensorID', resp.data)
            return resp.data}
        else 
            Message({
                message: resp.exception,
                type: 'error'
            })
    },
    async getWorkMode(context){
        let resp = await getAllOptions({searchType: 'WorkMode'})
        if (resp.code === 200)
            {context.commit('getWorkMode', resp.data)
            return resp.data}
        else 
            Message({
                message: resp.exception,
                type: 'error'
            })
    },
    async getStationID(context){
        let resp = await getAllOptions({searchType: 'StationID'})
        if (resp.code === 200)
            {context.commit('getStationID', resp.data)
            return resp.data}
        else 
            Message({
                message: resp.exception,
                type: 'error'
            })
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}