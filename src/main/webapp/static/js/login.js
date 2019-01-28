﻿'use strict';  //登录js by 木遥（516584683） 2018-4-11

$(document).ready(function () {
    initView();
});

function initView() {
    //根据设置，加载不同样式或皮肤
    setStyleByTheme();

    var guid;

    // 验证码刷新
    $('.reload-vify').on('click', function () {
        var $img = $(this).children('img');
        guid = getGUID();

        $img.prop('src', baseUrl + 'userlogin/captcha.jpg?uuid=' + guid);
    });
    $('.reload-vify').click();




    
    $(document).keyup(function (event) {
        /*if (event.keyCode == 13) {
            $("#btnLogin").trigger("click");
        } */
    });


}



function getGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


//根据设置，加载不同样式
function setStyleByTheme() {
    setInterval(slideSwitch, 5000);
    slideSwitch();
}

//图片轮播
function slideSwitch() {
    var $active = $('#loginBJ IMG.active');
    if ($active.length == 0) $active = $('#loginBJ IMG:last');

    // use this to pull the images in the order they appear in the markup
    var $next = $active.next().length ? $active.next()
        : $('#loginBJ IMG:first');
    $active.addClass('last-active');

    $next.css({ opacity: 0.0 })
        .addClass('active')
        .animate({ opacity: 1.0 }, 1000, function () {
            $active.removeClass('active last-active');
        });
}
