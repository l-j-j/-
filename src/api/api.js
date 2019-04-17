import axios from 'axios';


//登录验证接口
export const requestLogin = params => { 
    return axios.post(`/blog/user/login`, params).then(res => res.data); 
};

//发布文章
export const addArticle = params => { 
    return axios.post(`/blog/article/add`, params).then(res => res.data); 
};
//获取文章列表
export const getArticleList = params => { 
    return axios.get(`/blog/article/select`, { params: params }).then(res=>res.data); 
};
//编辑文章
export const getArticle = params => { 
    return axios.get(`/blog/article/edit`, { params: params }).then(res=>res.data); 
};
//删除文章
export const delArticle = params => { 
    return axios.post(`/blog/article/del`, params).then(res=>res.data); 
};

//类型列表
export const getTypeList = params => { 
    return axios.get(`/blog/type/select`, { params: params }).then(res=>res.data); 
};
//新增类型
export const typeAdd = params => { 
    return axios.post(`/blog/type/add`, params).then(res=>res.data); 
};
//编辑类型
export const typeEdit = params => { 
    return axios.get(`/blog/type/edit`, { params: params }).then(res=>res.data); 
};
//删除类型
export const typeDel = params => { 
    return axios.post(`/blog/type/del`, params).then(res=>res.data); 
};

//创建笔记
export const addNote = params => { 
    return axios.post(`/blog/note/add`, params).then(res => res.data); 
};
//获取笔记列表
export const getNoteList = params => { 
    return axios.get(`/blog/note/select`, { params: params }).then(res=>res.data); 
};
//编辑笔记
export const getNote = params => { 
    return axios.get(`/blog/note/edit`, { params: params }).then(res=>res.data); 
};
//删除笔记
export const delNote = params => { 
    return axios.post(`/blog/note/del`, params).then(res=>res.data); 
};

//创建链接
export const addSource = params => { 
    return axios.post(`/blog/source/add`, params).then(res => res.data); 
};
//获取链接列表
export const getSourceList = params => { 
    return axios.get(`/blog/source/select`, { params: params }).then(res=>res.data); 
};
//编辑链接
export const getSource = params => { 
    return axios.get(`/blog/source/edit`, { params: params }).then(res=>res.data); 
};
//删除链接
export const delSource = params => { 
    return axios.post(`/blog/source/del`, params).then(res=>res.data); 
};

//获取用户列表
export const getUserList = params => {
    return axios.get(`/blog/user/select`,{params: params}).then(res=>res.data);
}
//新增用户
export const addUser = params => {
    return axios.post(`/blog/user/add`,params).then(res=>res.data)
}
//编辑用户
export const getUser = params => {
    return axios.get(`/blog/user/edit`,{params:params}).then(res=>res.data)
}
//删除用户
export const delUser = params => {
    return axios.post(`/blog/user/del`,params).then(res=>res.data)
}
//设置密码
export const setPassword = params => {
    return axios.post(`/blog/user/setPassword`,params).then(res=>res.data)
}

//其他类型
export const getRestTypeList = params => { 
    return axios.get(`/blog/rstype/select`, { params: params }).then(res=>res.data); 
};
//新增
export const addRestType = params => { 
    return axios.post(`/blog/rstype/add`, params).then(res=>res.data); 
};
//删除
export const delRestType = params => { 
    return axios.post(`/blog/rstype/del`, params).then(res=>res.data); 
};

//其他发布
export const addRest = params => { 
    return axios.post(`/blog/rest/add`, params).then(res => res.data); 
};
//其他列表
export const getRestList = params => { 
    return axios.get(`/blog/rest/select`, { params: params }).then(res=>res.data); 
};
//编辑
export const getRest = params => { 
    return axios.get(`/blog/rest/edit`, { params: params }).then(res=>res.data); 
};
//删除
export const delRest = params => { 
    return axios.post(`/blog/rest/del`, params).then(res=>res.data); 
};

//获取所有文章笔记数量
export const getCount = params => {
    return axios.post(`/blog/main/count`, params).then(res=>res.data)
}