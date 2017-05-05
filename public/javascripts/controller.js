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
lzyApp.factory('getItemService',['$http',function($http){
    var getItemRequest = function(currentPage,targetId){
        var requestPath = '/admin/manage' + currentPage + '/item?uid=' + targetId;
        return $http.get(requestPath);
    }
    return {
        itemInfo:function(currentPage,targetId){
            return getItemRequest(currentPage,targetId);
        }
    }
}])

//管理用户组
lzyApp.controller('adminGroup',['$scope','$http','pageData','getItemService',function($scope,$http,pageData,getItemService){
    $scope.formData = {};
    $scope.formData.power = {};
    $scope.checkInfo = {};
    //获取用户组的列表信息
    initPagination($scope,$http);
    //获取基础的权限列表
    /*initPowerList($scope);
    //删除用户
    initDelOption($scope,$http,'您确认要删除选中的用户组吗？');*/
}])

