export default {
    getLineList: {  //获取操作日志
        method: 'get',
        url: '/chat/getIndicatorsByDate'
    },
    getIndicatorDetail: {  //获取微信号率
        method: 'get',
        url: '/chat/getIndicatorDetail'
    },
    loginReq:{
        method:'post',
        url:'/crm/login/'
    },
}


