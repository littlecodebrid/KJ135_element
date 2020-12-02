import ApiClient from './ApiClient'
import config from '../../public/config'

const api = new ApiClient(config.baseUrl_data)
// 获取所有卫星ID、载荷ID、地面站ID、数据类型
function getAllOptions(param) {
  return api.get('/segment/query/options', param)
}
// 搜索
function search(param) {
  return api.post('/segment/query/segments', param)
}
// 根据segmentId获取段相关信息
function getSegment(param) {
  return api.get('/segment/query/segment', param)
}
// 根据segmentId获取产品信息，产品类型为L2时调用
function getProduct(param) {
  return api.get('/segment/query/products', param)
}
// 根据segmentId获取景信息
function getScene(param) {
  return api.get('/segment/query/scenes', param)
}
export {
  getAllOptions,
  search,
  getSegment,
  getProduct,
  getScene
}
