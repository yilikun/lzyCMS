/**
 * Created by hama on 2017/1/4.
 */
//后台首页的核心模块
var lzyApp = angular.module('adminApp',[]);
lzyApp.factory('pageData',function(){
    return {
        bigCategory:$('#currentCate').val()
    }
})

