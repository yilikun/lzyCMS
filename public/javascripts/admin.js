/**
 * Created by hama on 2017/1/4.
 */

//后台公共的JS文件


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

