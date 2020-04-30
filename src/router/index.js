import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'登录',
      component: resolve => require(['../view/index'], resolve)
    },
    {
      path:'/house_list',
      name:'选择房间',
      component: resolve => require(['../view/houseList'], resolve)
    },
    {
      path:'/set_psw',
      name:'设置密码',
      component: resolve => require(['../view/setPassword'], resolve)
    },
    {
      path:'/open_record',
      name:'开门记录',
      component: resolve => require(['../view/open_record'], resolve)
    },
  ]
})
