/**
 * Created by hama on 2016/12/28.
 */
//通用的上传函数
function initUpload(id,type,key,callback){
    //首先设置一些默认的参数
    var types = 'Image Files';
    var filtertype = '*.gif; *.jpg; *.png';
    var buttonText = '上传图片';
    var uploadApi = '/system/upload';
    var autoUpdate = true;
    var sizeLimit = 1024 * 1024 * 1;
    var adminId = $('#adminId').val();
    var buttonWidth = 100;
    var buttonStyle = 'uploadify-btn-default';
    //开始设置上传
    $('#'+id).uploadify({
        //指定swf文件
        'swf': '/plugins/uploadify/uploadify.swf',
        //后台处理的页面
        'uploader':uploadApi + '?adminId=' + adminId + '&type=' + type + '&key=' + key,
        //按钮显示的文字
        'buttonText':buttonText,
        'buttonClass':buttonStyle,
        'width':buttonWidth,
        //上传文件的类型
        'fileTypeDesc':types,
        //允许上传的文件后缀
        'fileTypeExts':filtertype,
        //发送给后台的其他参数可以在formData中指定
        //'formData':''
        'sizeLimit':sizeLimit,
        //选择文件后自动上传
        'auto':autoUpdate,
        //设置为true将允许多文件上传
        'multi':false,
        //上传成功执行的函数
        'onUploadSuccess':function(file,data,response){
            if(data === 'typeError'){
                alert('文件类型不正确，请重新尝试');
                return;
            }else{
                callback(data);
            }
        },
        'onComplete': function(event, queueID, fileObj, response, data) {//当单个文件上传完成后触发
            //event:事件对象(the event object)
            //ID:该文件在文件队列中的唯一表示
            //fileObj:选中文件的对象，他包含的属性列表
            //response:服务器端返回的Response文本，我这里返回的是处理过的文件名称
            //data：文件队列详细信息和文件上传的一般数据
            alert("文件:" + fileObj.name + " 上传成功！");
        },
        //上传错误
        'onUploadError' : function(file, errorCode, errorMsg, errorString) {
            alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
        },
        'onError': function(event, queueID, fileObj) {//当单个文件上传出错时触发
            alert("文件:" + fileObj.name + " 上传失败！");
        }
    })
}