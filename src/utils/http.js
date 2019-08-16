import axios from 'axios'
import Cookie from "./cookie";
// import 'whatwg-fetch';
import { Loading, Message } from 'element-ui';
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' //进度条样式
import router from "../router/index";
NProgress.configure({
  easing: 'ease',  // 动画方式    
  speed: 500,  // 递增进度条的速度    
  showSpinner: false, // 是否显示加载ico    
  trickleSpeed: 200, // 自动递增间隔    
  minimum: 0.3 // 初始化时的最小百分比
});
const instance = axios.create({
  // baseURL:'/api/v1', // api的前缀
 //timeout: 1000 // 设置请求超市
})
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

// 请求拦截添加头部参数等
instance.interceptors.request.use(config => {
  config.headers['token'] = Cookie.getCookie('token') == null ? "" : Cookie.getCookie('token')
  //config.headers['X-Token'] = getToken()
  //  loading = Loading.service({
  //   lock: true,
  //   text: '加载中',
  //   spinner: 'el-icon-loading'
  // });
  NProgress.start(); //开始
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截
instance.interceptors.response.use(
  response => {
    NProgress.done(); // 结束
    console.log('状态',response.data.status)
    switch (response.data.status) {
      case 200:
        return response.data;
      case 401:
         router.push('/login');
        break;
      case 403:
        router.push('/login');
        break;
      default:
        Message({
          type: 'warning',
          message: response.data.msg,
        })
        return Promise.reject('error');
    }
  },
  error => {
    NProgress.done();
      Message({
        type:'error',
        message:error,
      })
    //console.log('err' + error)
    return Promise.reject(error)
  })


const http = {
  post(url, data, callback) {
    return instance({
      url,
      data,
      method: 'post'
    })
  },
  get(url, params) {
    // console.log(url, params)
    return instance({
      url,
      params,
      method: 'get',
    })
  },
  put(url, data, callback) {
    return instance({
      url,
      data,
      method: 'put'
    })
  },
  delete(url, params) {
    // console.log(url, params)
    return instance({
      url,
      params,
      method: 'delete',
    })
  },
  postFormData(url, data) {
    return instance({
      url,
      data, //formdata形式传入
      method: 'post'
    })
  },
  exportBlob(url, data){
    let options = {
      method: 'GET',   //方法名
      responseType: 'blob',
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        "token":Cookie.getCookie('token') == null ? "" : Cookie.getCookie('token')
      }
    }
    // if (data) options.body = JSON.stringify(data)
    let req_url = data ? this.buildUrl(url, data) : url;
    return this.streamRequest(req_url, options)
  },
  buildUrl(url, params) {
    const ps = []
    if (params) {
      for (let p in params) {
        if (p) {
          ps.push(p + '=' + encodeURIComponent(params[p]));
        }
      }
    }
    return url + '?' + ps.join('&')
  },
  streamRequest(url, options){
    options.headers = options.headers;
    options.credentials = 'same-origin';
    return fetch(url, options)
    .then(function (response){
      
      switch (response.status) {
        case 200:
          return response.arrayBuffer();
        case 500:
       
          Message({
            type: 'error',
            message: "下载异常",
          })
          return response;
        default:
          return response;
      }
    })
  }
}

export default http;
