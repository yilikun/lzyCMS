/**
 * Created by hama on 2016/12/27.
 */

//公共的JS操作文件
$(function(){
    //用户注销
    $('#userLoginOut').click(function(){
        $.ajax({
            url:'/users/logout',
            method:'GET',
            success:function(result){
                if(result === 'success'){
                    window.location = '/';
                }else{
                    alert('未知异常,请稍后重试..');
                }
            }
        })
    })


})