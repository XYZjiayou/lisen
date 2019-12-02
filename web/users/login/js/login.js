    /**
     * 用户登录
     * 登录成功后，需要重新判断登录状态
     */
    $(document).ready(function(){
        $("#btn_login").click(function(){
            var username = $("#username").val();
            var password = $("#password").val();
            $.get(
                "/loginAction/login",
                {"username":username,"password":password},
                function(result){
                    var data = JSON.parse(result);
                    if(data.success){
                        if(data.msg==="查询成功"){
                            alert("哩森音乐欢迎你");
                            window.location.href="index.html";
                        }else{
                            alert("账号或密码错误!");
                        }
                    }
                }
            );

        });
    });


/**
 * <summary>用户注销</summary>
 * 注销后，返回到首页
 */
/*$(document).ready(function(){
    $("#a_exit").click(function(){
        $.get(
            "loginAction/exit",
            function(result){
                var data = JSON.parse(result);
                if(data.success){
                    window.location.href = "index.html";
                }
            }
        );
    });
});*/
