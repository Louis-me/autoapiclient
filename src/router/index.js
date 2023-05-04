import Vue from 'vue'
import VueRouter from 'vue-router'

// npm install vue-json-viewer --save
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)

// 导入登陆组件
import Login from '../components/Login.vue'
// 登陆成功进入到Home组件
import Home from '../components/Home.vue'
import welcome from '../components/welcome.vue'
// 引用全局类
import "../assets/css/global.css"
// 用户管理
import users from "../components/user/users.vue"
// 用例管理
import cases from "../components/case/cases.vue"
// 套件管理
import suites from "../components/case/suites.vue"
// 实时任务管理
import readTimeTask from "../components/task/RealTimeTask.vue"
// 实时任务详情
import realTimeTaskDetail from "../components/task/RealTimeTaskDetail.vue"
// 模糊用例
import fuzzs from "../components/case/fuzzs.vue"
// 定时任务管理
import timingTask from "../components/task/TimingTask.vue"
// 定时任务详情
import timingTaskDetail from "../components/task/TimingTaskDetail.vue"
// 图形报告管理
import reportTask from "../components/task/ReportTask.vue"
// 报告管理
import reportListTask from "../components/task/ReportListTask.vue"
// 报告详情
import reporDetail from "../components/task/ReportDetail.vue"

// 在线日志
import logs from "../components/log/Logs.vue"

Vue.use(VueRouter)
const routes = [
  {
    path:'/',
    redirect:"/login",
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // {
  //   path: "/cases",
  //   name:"cases",
  //   component: cases
  // },
  {
    path: '/home',
    name: 'home',
    redirect:"/welcome",
    component: Home,
    children:[{
            path:'/welcome',
            component: welcome
          },{
            path:'/users',
            component: users
          },  {
            path: "/cases",
            component: cases
          }, {
            path: "/suites",
            component: suites
          }, {
            path: "/readTimeTask",
            component: readTimeTask
          }, {
            path: "/timingTask",
            component: timingTask
          },
          {
            path: "/realTimeTaskDetail/:id",
            component: realTimeTaskDetail
          },
          {
            path: "/timingTaskDetail/:id",
            component: timingTaskDetail
          },
          {
            path: "/fuzzs",
            component: fuzzs
          },
          {
            path: "/reportTask",
            component: reportTask
          },
          {
            path: "/reportListTask",
            component: reportListTask
          },
          {
            path: "/reporDetail/:id",
            component: reporDetail
          },
          {
            path: "/logs",
            component: logs
          },
        
    ]
  },


]

const router = new VueRouter({
  routes
})


// 拦截路由导航
router.beforeEach((to,from,next)=>{
  // to代表将要访问的地址
  // from 来自于哪个地址
  // next 表示放行，是个函数
  // 如果访问登陆页面就放行
  console.log("before")
  console.log(localStorage.getItem("token"))
  if (to.path==="/login") {
    if (localStorage.getItem("token")) {
      return next("/home")
    }
    return next()
  }
  // 检查若没有登陆就跳转到登陆界面
  if (!localStorage.getItem("token")) { return next('/login')}
  next()

})

export default router
