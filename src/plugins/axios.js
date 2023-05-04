import Vue from "vue"
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; //让ajax携带cookie


//请求发送拦截，把数据发送给后台之前做些什么......
axios.interceptors.request.use((request) => {
    console.log("axios request")
    request.headers.Authorization = localStorage.getItem("token")

    console.log(localStorage.getItem("token"))
    return request;
   
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  

//http response 拦截器
axios.interceptors.response.use(
    response => {
      //拦截响应，如果发现接口返回400做统一处理跳转到登陆
      if (response.data.code) {
        switch (response.data.code) {
          case 403:
            localStorage.removeItem("token")
            console.log("登陆失败")
            window.location.href='/'

            
        }
      }
      return response
    },
    //接口错误状态处理，也就是说无响应时的处理
    error => {
        console.log("Please check your internet connection.");
        console.log(error)
        return Promise.reject(error) // 返回接口返回的错误信息
    })
 
// 设置接口访问的根目录
// axios.defaults.baseURL = " http://127.0.0.1:8000/myapi/"
axios.defaults.baseURL = " http://www.shikun.work:8081/myapi/"
// 设置原型属性后,其他地方如果要调用，只要用this.$http.get就可以了
Vue.prototype.$http = axios