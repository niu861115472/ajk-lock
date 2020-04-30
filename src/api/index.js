import axios from 'axios'
import qs from 'qs'                                                                                                                                                                                                                                                                          

var base_url = 'http://demo.live-ctrl.com/aijukex'
// var base_url = 'http://192.168.0.84:8888/aijukex'
const base_axios_options = {
headers:{ 'content-type': 'application/json' },
timeout:5000,
withCredentials:false,  //是否跨站点访问控制请求
};
const url = `${base_url}`;
const postAxios = axios.create(Object.assign({},{ baseURL:url },base_axios_options));

export const Api = {
  // 获取验证码接口
  getCode:(params) =>{
    return postAxios.post('tenement/manager_hotel_getPassword?'+qs.stringify(params)).then(res=>res.data);
  },
  //登录接口
  login:(params) =>{
    return postAxios.post('tenement/manager_hotel_login?'+qs.stringify(params)).then(res=>res.data);
  },
  //房间列表接口
  getHouseList:(params) =>{
    return postAxios.post('tenement/manager_hotel_getHotelHouses?'+qs.stringify(params)).then(res=>res.data);
  },
  //设置密码接口
  getPassword:(params) =>{
    return postAxios.post('tenement/manager_hotel_setPassword?'+qs.stringify(params)).then(res=>res.data);
  },
  //酒店下拉框接口
  getHotel:(params) =>{
    return postAxios.post('tenement/manager_hotel_getHotels?'+qs.stringify(params)).then(res=>res.data);
  },
  //开锁记录接口
  getSetHistory:(params) =>{
    return postAxios.post('tenement/manager_hotel_getSetHistory?'+qs.stringify(params)).then(res=>res.data);
  },
  //开锁密码接口
  getHousePassword:(params) =>{
    return postAxios.get('tenement/manager_hotel_getHousePassword?'+qs.stringify(params)).then(res=>res.data);
  },
  //获取RCU门锁设备
  getHostDevices:(params) =>{
    return postAxios.get('op/rcu_getHostDevices?'+qs.stringify(params)).then(res=>res.data);
  },
 //新RCU设备kong控制
  deviceControl:(params) =>{
    return postAxios.get('op/rcu_deviceControl?'+qs.stringify(params)).then(res=>res.data);
  },
}