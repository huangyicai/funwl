import Home from '@/pages/home'
import error from '@/pages/404'
import showIndex from '@/pages/showIndex'
import Redirect from '@/pages/redirect'
import Login from '@/pages/login'
import personal from '@/pages/personal'
import pay from '@/pages/pay'
//funwl
import FunCustomerService from '@/pages/funwl/fnCustomerService'
import funUser from '@/pages/funwl/fnUser'
import funService from '@/pages/funwl/funService'
import funData from '@/pages/funwl/fnDataAnalysis'
import funProfits from '@/pages/funwl/fnProfitsAnalysis'
//kh
import khCustomerService from '@/pages/client/clientCustomerService.vue'
import khBill from '@/pages/client/clientBill'
import khWayBill from '@/pages/client/clientWayBill'
//kd
import kdData from '@/pages/express/kdDataAnalysis'
import kdBillAnalysis from '@/pages/express/kdBillAnalysis'
import kdProfits from '@/pages/express/kdProfitsAnalysis'
import kdUser from '@/pages/express/kdUser'
import kdCustomerService from '@/pages/express/kdCustomerService'
import kdNotice from '@/pages/express/kdNotice'
import kdIndex from '@/pages/express/kdIndex'
import kdBill from '@/pages/express/kdBill'
import kdBillUpload from '@/pages/express/kdBillsUpload'




let routes = [
  {
    path: '/showIndex',
    name: 'showIndex',
    // redirect:'/showIndex',
    component: showIndex,
    hidden: true,

  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    hidden: true,
  },
  {
    path: '/redirect',

    component: Home,
    name: 'redirect',
    leaf: true,//是否只有一个字节点
    hidden: true,//是否展示在nav
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},  // 添加该字段，表示进入这个路由是需要登录的
    children: [
      {path: '/redirect', component: Redirect, name: 'redirect',meta:{requireAuth: true}},
    ]
  },
  {
    path: '/personal',
    component: Home,
    name: '个人中心',
    leaf: true,//是否只有一个字节点
    hidden: false,//是否展示在nav
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},  // 添加该字段，表示进入这个路由是需要登录的
    children: [
      {path: '/personal', component: personal, name: '个人中心',meta:{requireAuth: true}},
    ]
  },
  //funwl
  {
    path: '/funCustomers',
    component: Home,
    name: '客服/工单',
    leaf: true,//是否只有一个字节点
    hidden: false,//是否展示在nav
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},  // 添加该字段，表示进入这个路由是需要登录的
    children: [
      {path: '/funCustomers', component: FunCustomerService, name: '客服/工单',meta:{requireAuth: true}},
    ]
  },
  {
    path: '/funServisce',
    component: Home,
    name: '客服管理',
    leaf: false,
    hidden: false,
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},
    children: [
        {path: '/funServisce', component: funService, name: '客服管理',meta:{requireAuth: true}},
    ]
  },
  {
    path: '/funUser',
    component: Home,
    name: '用户管理',
    leaf: false,
    hidden: false,
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},
    children: [
      {path: '/funUsers', component: funUser, name: '用户管理',meta:{requireAuth: true}},
    ]
  },
  {
    path: '/funMath',
    component: Home,
    name: ' 数据管理',
    leaf: false,
    hidden: false,
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},
    children: [
      {path: '/funMathDataAnalysis', component: funUser, name: '数据分析',meta:{requireAuth: true}},
      {path: '/funMathbillAnalysis', component: funProfits, name: '利润分析',meta:{requireAuth: true}},
    ]
  },
  //kh
  {
    path: '/khCustomerServices',
    component: Home,
    name: '客服/工单',
    leaf: true,
    hidden: false,
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},
    children: [
      {path: '/khCustomerServices', component: khCustomerService, name: '客服/工单',meta:{requireAuth: true}},
    ]
  },
  {
    path: '/khBills',
    component: Home,
    name: '账单管理',
    leaf: true,
    hidden: false,
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},
    children: [
      {path: '/khBills', component: khBill, name: '账单管理',meta:{requireAuth: true}},
    ]
  },
  {
    path: '/khWayBills',
    component: Home,
    name: '运单管理',
    leaf: true,
    hidden: false,
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},
    children: [
      {path: '/khWayBills', component: khWayBill, name: '运单管理',meta:{requireAuth: true}},
    ]
  },
  //kd
  {
    path: '/kdMath',
    component: Home,
    name: ' 数据管理',
    leaf: false,
    hidden: false,
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},
    children: [
        {path: '/kdProfits', component: kdProfits, name: '利润分析',meta:{requireAuth: true}},
      {path: '/kdData', component: kdData, name: '数据分析',meta:{requireAuth: true}},
      {path: '/kdBillAnalysis', component: kdBillAnalysis, name: '收营管理',meta:{requireAuth: true}},

    ]
  },
  {
    path: '/kdUsers',
    component: Home,
    name: '用户管理',
    leaf: true,
    hidden: false,
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},
    children: [
      {path: '/kdUsers', component: kdUser, name: '用户管理',meta:{requireAuth: true}},
    ]
  },
  {
    path: '/kdCustomerServices',
    component: Home,
    name: '客服/工单',
    leaf: true,//是否只有一个字节点
    hidden: false,//是否展示在nav
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},  // 添加该字段，表示进入这个路由是需要登录的
    children: [
      {path: '/kdCustomerServices', component: kdCustomerService, name: '客服/工单',meta:{requireAuth: true}},

    ]
  },
  {
    path: '/kdNotices',
    component: Home,
    name: '通知',
    leaf: true,//是否只有一个字节点
    hidden: false,//是否展示在nav
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},  // 添加该字段，表示进入这个路由是需要登录的
    children: [
      {path: '/kdNotices', component: kdNotice, name: '通知',meta:{requireAuth: true}},
    ]
  },
  {
    path: '/kdIndexs',
    component: Home,
    name: '首页',
    leaf: true,//是否只有一个字节点
    hidden: false,//是否展示在nav
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},  // 添加该字段，表示进入这个路由是需要登录的
    children: [
      {path: '/kdIndexs', component: kdIndex, name: '首页',meta:{requireAuth: true}},
    ]
  },
  {
    path: '/kdBills',
    component: Home,
    name: '账单管理',
    leaf: true,//是否只有一个字节点
    hidden: false,//是否展示在nav
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},  // 添加该字段，表示进入这个路由是需要登录的
    children: [
      {path: '/kdBills', component: kdBill, name: '账单管理',meta:{requireAuth: true}},
      {path: '/kdBillsUpload', component: kdBillUpload, name: '账单上传',meta:{requireAuth: true}},
    ]
  },

  {
    path: '/pay',
    component: Home,
    name: '续费',
    leaf: true,//是否只有一个字节点
    hidden: false,//是否展示在nav
    iconCls: 'el-icon-setting',
    meta:{requireAuth: true},  // 添加该字段，表示进入这个路由是需要登录的
    children: [
      {path: '/pay', component: pay, name: '续费',meta:{requireAuth: true}},
    ]
  },




  {
    path: '/404',
    name: 'error',
    component: error,
    hidden: true,

  },

];


export default routes



