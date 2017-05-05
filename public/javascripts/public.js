/**
 * Created by hama on 2017/5/5.
 */
//后台公共的JS文件
//angularJs https Post方法封装
function angularHttpPost($http,isValid,url,formData,callBack){
    if(isValid){
        $http({
            method  : 'POST',
            url     : url,
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function(data) {
                //  关闭所有模态窗口
                $('.modal').each(function(i){
                    $(this).modal("hide");
                });

                if(data == 'success'){
                    callBack(data);
                }else{
                    layer.msg(data);
                }
            });
    }
    else{
        layer.msg('参数效验不成功');
    }
}
//主要针对删除操作
function angularHttpGet($http,url,callBack){
    $http.get(url).success(function(result){
        $('.modal').each(function(i){
            $(this).modal("hide");
        });
        if(result == 'success'){
            callBack(result);
        }else{
            layer.msg(result);
        }
    })
}