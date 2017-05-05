/**
 * Created by hama on 2017/1/4.
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

//初始化普通里列表的分页
function initPagination($scope,$http){
    //分页的初始化数据
    initPageInfo($scope);
    //获取不同栏目下的数据,带分页
    getPageInfos($scope,$http,"/admin/manage/getDocumentList/"+ $('#currentCate').val())
}
//初始化分页参数
function initPageInfo($scope){
    $('#dataLoading').removeClass('hide');
    $scope.selectPage = [
        {name:'10',value:'10'},
        {name:'20',value:'20'},
        {name:'30',value:'30'}
    ];
    $scope.limitNum = '10';
    $scope.currentPage = 1;
    $scope.totalPage = 1;
    $scope.limit = 10;
    $scope.pages = [];
    $scope.startNum = 1;
}
//翻页组件
function getPageInfos($scope,$http,url){
    //定义翻页的动作
    $scope.loadPage = function(page){
        $scope.currentPage = page;
        getPageInfos($scope,$http,url);
    }
    $scope.nextPage = function(){
        if($scope.currentPage < $scope.totalPage){
            $scope.currentPage ++ ;
            getPageInfos($scope,$http,url);
        }
    }
    $scope.prevPage = function(){
        if($scope.currentPage > 1){
            $scope.currentPage --;
            getPageInfos($scope,$http,url);
        }
    }
    $scope.firstPage = function(){
        if($scope.currentPage > 1){
            $scope.currentPage = 1;
            getPageInfos($scope,$http,url);
        }
    }
    $scope.lastPage = function(){
        if($scope.currentPage < $scope.totalPage){
            $scope.currentPage = $scope.totalPage;
            getPageInfos($scope,$http,url);
        }
    }
    $scope.changeOption = function(){
        $scope.limit = Number($scope.limitNum);
        getPageInfos($scope,$http,url);
    }
    //发送请求获取数据
    $http.get(url + '?limit=' + $scope.limit + '&currentPage=' + $scope.currentPage).success(function(result){
        $scope.data = result.docs;
        //如果发生删除操作，还是需要随时调整分页的
        if(result.pageInfo){
            $scope.totalItems = result.pageInfo.totalItems;
            $scope.currentPage = result.pageInfo.currentPage;
            $scope.limit = result.pageInfo.limit;
            $scope.startNum = result.pageInfo.startNum;
            //获取总页数
            $scope.totalPage = Math.ceil($scope.totalItems / $scope.limit);
            var pageArr = [];
            var page_start = $scope.currentPage - 2 > 0 ? $scope.currentPage - 2 : 1;
            var page_end = page_start + 4 >= $scope.totalPage ? $scope.totalPage : page_start + 4;
            for(var i=page_start;i<=page_end;i++){
                pageArr.push(i);
            }
            $scope.pages = pageArr;
        }else{
            console.log('获取分页信息失败');
        }
        $('#dataLoading').addClass('hide');
    })
}
//初始化管理员权限
function initPowerList($scope){
    //z-tree的配置参数
    var setting = {
        view:{
            selectedMulti:false
        },
        check:{
            enable:true
        },
        data:{
            simpleData:{
                enable:true
            }
        },
        callback:{
            beforeCheck:beforeCheck,
            onCheck:onCheck
        }

    }
    //获取所有的权限数组
    var zNodes = setAdminPowerTreeData();
    var code ,log ,className = 'dark';
    function beforeCheck(treeId,treeNode){
        className = (className === 'dark' ? '':'dark');
        return (treeNode.doCheck !== false)
    }
    function onCheck(e,treeId,treeNode){
        var zTree = $.fn.zTree.getZTreeObj("groupPowerTree"),
            checkedNodes = zTree.getCheckedNodes(true);
        var nodesArr = [];
        for(var i=0;i<checkedNodes.length;i++){
            var currentNode = checkedNodes[i];
            nodesArr.push(currentNode.id + ':' + true);
        }
        $scope.formData.power = nodesArr;
    }
    $.fn.zTree.init($("#groupPowerTree"), setting, zNodes);
}
//权限管理数据初始化
function setAdminPowerTreeData(){
    return [
        { id:'sysTemManage', pId:0, name:"系统管理", open:true},
        { id:'sysTemManage_user', pId:'sysTemManage', name:"系统用户管理", open:true},
        { id:'sysTemManage_user_add', pId:'sysTemManage_user', name:"新增"},
        { id:'sysTemManage_user_view', pId:'sysTemManage_user', name:"查看"},
        { id:'sysTemManage_user_modify', pId:'sysTemManage_user', name:"修改"},
        { id:'sysTemManage_user_del', pId:'sysTemManage_user', name:"删除"},

        { id:'sysTemManage_uGroup', pId:'sysTemManage', name:"系统用户组管理", open:true},
        { id:'sysTemManage_uGroup_add', pId:'sysTemManage_uGroup', name:"新增"},
        { id:'sysTemManage_uGroup_view', pId:'sysTemManage_uGroup', name:"查看"},
        { id:'sysTemManage_uGroup_modify', pId:'sysTemManage_uGroup', name:"修改"},
        { id:'sysTemManage_uGroup_del', pId:'sysTemManage_uGroup', name:"删除"},


        { id:'contentManage', pId:0, name:"文章管理", open:true},
        { id:'contentManage_content', pId:'contentManage', name:"文章内容管理", open:true},
        { id:'contentManage_content_add', pId:'contentManage_content', name:"新增"},
        { id:'contentManage_content_view', pId:'contentManage_content', name:"查看"},
        { id:'contentManage_content_top', pId:'contentManage_content', name:"置顶"},
        { id:'contentManage_content_modify', pId:'contentManage_content', name:"修改"},
        { id:'contentManage_content_del', pId:'contentManage_content', name:"删除"},

        { id:'contentManage_cateGory', pId:'contentManage', name:"文章分类管理", open:true},
        { id:'contentManage_cateGory_add', pId:'contentManage_cateGory', name:"新增"},
        { id:'contentManage_cateGory_view', pId:'contentManage_cateGory', name:"查看"},
        { id:'contentManage_cateGory_modify', pId:'contentManage_cateGory', name:"修改"},
        { id:'contentManage_cateGory_del', pId:'contentManage_cateGory', name:"删除"},

        { id:'contentManage_tag', pId:'contentManage', name:"文章标签管理", open:true},
        { id:'contentManage_tag_add', pId:'contentManage_tag', name:"新增"},
        { id:'contentManage_tag_view', pId:'contentManage_tag', name:"查看"},
        { id:'contentManage_tag_modify', pId:'contentManage_tag', name:"修改"},
        { id:'contentManage_tag_del', pId:'contentManage_tag', name:"删除"},


        { id:'contentManage_msg', pId:'contentManage', name:"留言管理", open:true},
        { id:'contentManage_msg_view', pId:'contentManage_msg', name:"查看"},
        { id:'contentManage_msg_add', pId:'contentManage_msg', name:"回复"},
        { id:'contentManage_msg_del', pId:'contentManage_msg', name:"删除"},

        { id:'contentManage_notice', pId:'contentManage', name:"系统消息", open:true},
        { id:'contentManage_notice_view', pId:'contentManage_notice', name:"查看"},
        { id:'contentManage_notice_modify', pId:'contentManage_notice', name:"标记已读"},
        { id:'contentManage_notice_del', pId:'contentManage_notice', name:"删除"},

        { id:'userManage', pId:0, name:"会员管理", open:true},
        { id:'userManage_user', pId:'userManage', name:"注册用户管理", open:true},
        { id:'userManage_user_view', pId:'userManage_user', name:"查看"},
        { id:'userManage_user_modify', pId:'userManage_user', name:"修改"},
        { id:'userManage_user_del', pId:'userManage_user', name:"删除"}
    ]
}
//清空z-tree节点上所有的选中.
function cancelTreeCheckBoxSelect(id){
    var treeObj = $.fn.zTree.getZTreeObj(id),
        checkedNodes = treeObj.getCheckedNodes(true);
    for (var i=0, l=checkedNodes.length; i < l; i++) {
        treeObj.checkNode(checkedNodes[i], false, true);
    }
}
//关闭模态窗口初始化数据
function clearModalData($scope,modalObj){
    $scope.formData = {};
    $scope.targetID = "";
    modalObj.find(".form-control").val("");
}
//获取添加或修改链接
function getTargetPostUrl($scope,bigCategory){
    var url = "/admin/manage/"+bigCategory+"/addOne";
    if($scope.targetID){
        url = "/admin/manage/"+bigCategory+"/modify?uid="+$scope.targetID;
    }
    return url;
}

