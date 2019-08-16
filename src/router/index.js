import Vue from 'vue';
import Router from 'vue-router';
import Loading from 'components/loading';
import SideLayout from '@/layout/sideLayout';

Vue.use(Router);
const Home = () => ({
    component: import('@/pages/home/index'),
    loading: Loading
});
const advisoryDetails = () => ({
    component: import('@/pages/advisoryDetails/index'),
    loading: Loading
});
const record = () => ({
    component: import('@/pages/record/index'),
    loading: Loading
});
const Login = () => ({
    component: import('@/pages/login/index'),
    loading: Loading
});
export default new Router({
    // mode: 'history',  //路由配置，不设置默认为hash
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Login,
        },
        {
            path: '/',
            component: SideLayout,
            meta: { title: '区域' },
            children:[
                {
                    path: '/home',
                    component: Home,
                    meta: { title: '微信聊天记录分析' }
                },
                {
                    path: '/advisoryDetails',
                    component: advisoryDetails,
                    meta: { title: '微信聊天' }
                },
                {
                    path: '/record',
                    component: record,
                    meta: { title: '微信聊天' }
                },
            ],
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
