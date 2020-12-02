import ApiClient from './ApiClient'
import config from '../../public/config'

const api = new ApiClient(config.baseUrl_cache)
// 获取所有缓存信息
function getAllGeneralCache(param) {
  return api.get('/cache/general', param)
}
// 获取缓存信息的数据信息
function getAllGeneralCacheDeatil(param) {
  return api.get('/cache/log/general/latest/detail', param)
}
// 新增总的缓存
function addGeneralCache(param) {
  return api.post('/cache/general', param)
}
// 新增数据缓存
function addDataCache(param) {
  return api.post('/cache/data', param)
}
// 更新数据缓存
function editDataCache(param) {
  return api.put('/cache/data', param)
}
// 获取当前缓存下所有的数据缓存
function getDataCache(param) {
  return api.get('/cache/data', param)
}
// 删除一条数据缓存
function delDataCache(param) {
  return api.delete('/cache/data', param)
}
// 刷新缓存状态
function refreshCache(param) {
  return api.get('/cache/operation/refresh', param)
}
// 清理缓存状态
function cleanCache(param) {
  return api.get('/cache/operation/clean', param)
}
// 查询缓存日志
function cacheLog(param) {
  return api.get('/cache/log/general', param)
}
// 获取最新缓存信息
function getGeneralCache(param) {
  return api.get('/cache/log/general/latest', param)
}

export {
  getAllGeneralCache,
  getAllGeneralCacheDeatil,
  addGeneralCache,
  addDataCache,
  editDataCache,
  getDataCache,
  delDataCache,
  refreshCache,
  cleanCache,
  cacheLog,
  getGeneralCache
}
