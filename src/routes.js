import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main/Main.vue'
import List from './views/Article/List.vue'
import Form from './views/Article/Form.vue'
import Type from './views/Type/List.vue'
import NoteForm from './views/Note/Form.vue'
import Notes from './views/Note/List.vue'
import Sources from './views/Source/List.vue'
import restType from './views/Rest/Type.vue'
import restList from './views/Rest/List.vue'
import restForm from './views/Rest/Form.vue'
import User from './views/User/List.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-university',
        leaf:true,//只有一个节点
        children: [
            { path: '/', component: Main, name: '主页', }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-tags',
        leaf:true,
        children: [
            { path: '/type', component: Type, name: '类型管理', }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '文章管理',
        iconCls: 'fa fa-newspaper-o',//图标样式class
        children: [
            { path: '/form', component: Form, name: '发布文章' },
            { path: '/list', component: List, name: '文章列表' },
            { path: '/edit/:id', component: Form, name: '编辑文章',hidden:true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '笔记管理',
        iconCls: 'fa fa-pencil-square-o',
        children: [
            { path: '/noteform', component: NoteForm, name: '创建笔记' },
            { path: '/notes', component: Notes, name: '笔记列表' },
            { path: '/noteedit/:id', component: NoteForm, name: '编辑笔记',hidden:true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '资源管理',
        iconCls: 'fa fa-share-alt',
        children: [
            { path: '/source', component: Sources, name: '链接管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '其他',
        iconCls: 'fa fa-bars',
        children: [
            { path: '/resttype', component: restType, name: '类型管理' },
            { path: '/restfrom', component: restForm, name: '发布'},
            { path: '/rest', component: restList, name: '列表管理'},
            { path: '/restedit/:id', component: restForm, name: '',hidden:true }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-users',
        children: [
            { path: '/user', component: User, name: '用户列表' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;