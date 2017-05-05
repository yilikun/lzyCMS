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
    initPowerList($scope);
    //删除用户
    //initDelOption($scope,$http,'您确认要删除选中的用户组吗？');
    //因为编辑和新建用了同一个模态框，所以这里要进行下判断
    $('#addAdminGroup').on('show.bs.modal',function(event){
        var obj = $(event.relatedTarget);
        var editId = obj.data('whatever');
        //console.log(editId);
        var modalTitle = $(this).find('.modal-title');
        if(editId){
            //不为空的情况下是编辑
            modalTitle.text('编辑用户组');

        }else{
            //新增
            modalTitle.text('添加新用户组');
            cancelTreeCheckBoxSelect('groupPowerTree');
            $scope.formData = {};
        }
    }).on('hidden.bs.modal',function(e){
        //清空所有的选中
        cancelTreeCheckBoxSelect('groupPowerTree');
        //清空$scope上所有的数据
        clearModalData($scope,$(this));
    })
    //添加新的用户组
    $scope.processForm = function(isValid){
        var groupData = {
            name:$scope.formData.name,
            power:JSON.stringify($scope.formData.power)
        }
        angularHttpPost($http,isValid,getTargetPostUrl($scope,pageData.bigCategory),groupData,function(data){
            initPagination($scope,$http);
        });
    }
}])

