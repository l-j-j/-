
export default {
    //用户信息
    userinfo(state){
        state.user =JSON.parse(sessionStorage.getItem('user')) 
    }
}