window.onload = function change() {

  var userId = null;     //用户id
  var songId = null;     //歌曲id
  //获取用户id
  $.get(
	"/userGet",
	function (result) {
	  var data = JSON.parse(result);
	  console.log(data);
	  if (data.success) {

		userId = data.result[0].id;
	  }
	}
  );

  var pause = document.getElementById("pause"); //暂停，播放
  var range = document.getElementById("play_load");
  var progress = document.getElementById("play_dot");
  var dot = document.getElementById("dot");
  var audio = document.getElementById("audio");
  var current = document.getElementById("current_time");
  var left = document.getElementById("btn_left");
  var right = document.getElementById("btn_right");
  var lyric = document.getElementById('lyric');       //歌词容器
  var bg = document.querySelector('body .bg');			// 背景图

  function format(t) {
	var m = Math.floor(t / 60);
	var s = Math.floor(t % 60);
	if (m <= 9)     //小于10时，在前面填0
	  m = "0" + m;
	if (s <= 9)
	  s = "0" + s;
	return m + ":" + s;
  }


  /*接受url传来的参数*/

  function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r !== null) return unescape(r[2]);
	return null;
  }

  var song = decodeURI(GetQueryString("song"));
  var singer = decodeURI(GetQueryString("singer"));
  var duration = decodeURI(GetQueryString("duration"));


  //获取总时间
  var total = document.getElementById("total_time");
  audio.addEventListener("canplay", function () {
	total.innerHTML = format(audio.duration);
  });

  var name = document.getElementById("music_name");
  var song_name = document.getElementById("song_info_name");
  var singer_name = document.getElementById("song_info_singer");
  var music = new Array();           //存放获取的歌曲
  var song_singer = new Array();     //存放 歌曲 - 歌手
  var pic_song = new Array();
  var pic_singer = new Array();
  var num = 0;            // 当前播放的歌曲
  var btnDown = document.querySelector('.btn_down');


  $(document).ready(function () {
	//单曲播放
	if (singer !== "null") {
	  $(".list_author")[0].append(singer);
	  $($(".list_music")[0]).show();
	  $(".list_name")[0].append(song);
	  $(".list_time")[0].append(duration);
	  let url = 'http://192.168.1.125:8080/music/song/music/' + singer + '/' + song + '.mp3';
	  // 添加下载
	  btnDown.setAttribute('href', url);
	  audio.setAttribute("src", url);
	  audio.play();
	  name.innerHTML = $($(".list_name")[0]).html() + " - " + $($(".list_author")[0]).html();
	  if (audio.played) {
		pause.style.backgroundPosition = "-30px  0px";
	  }
	  $("#song_info_name").html(song);
	  $("#song_info_singer").html(singer);
	  wave();
	  albumPic();
	  //  音频加载完后，显示歌词
	  audio.onloadedmetadata = function () {
		var path = singer + "/" + song;
		addLyric(lyric, path);
	  };
	}
	var search = decodeURI(GetQueryString("album"));
	// var music = new Array();
	// console.log("album: " + search + " type: " + typeof(search));
	//专辑播放列表
	if (search !== "null") {
	  $.get(
		"/album/song/get",
		{"search": search},
		function (result) {
		  var data = JSON.parse(result);
		  if (data.success) {
			for (var j = 0; j < data.result.length; j++) {
			  $($(".list_name")[j]).append(data.result[j].song);
			  $($(".list_author")[j]).append(data.result[j].singer);
			  $($(".list_time")[j]).append(data.result[j].duration);
			  $($(".list_music")[j]).show();
			}
			let url = 'http://192.168.1.125:8080/music/song/music/' + data.result[0].singer + '/' + data.result[0].song + '.mp3';
			// 添加下载
			btnDown.setAttribute('href', url);
			audio.setAttribute("src", url);
			$("#song_info_name").html(data.result[0].song);
			$("#song_info_singer").html(data.result[0].singer);
			audio.play();
			pause.style.backgroundPosition = "-30px  0px";
			for (var i = 0; i < data.result.length; i++) {
			  var urlSinger = $($(".list_author")[i]).html();
			  var urlSong = $($(".list_name")[i]).html();
			  music[i] = urlSinger + "/" + urlSong;
			  song_singer[i] = urlSong + " - " + urlSinger;
			  pic_song[i] = urlSong;
			  pic_singer[i] = urlSinger;
			  // console.log(music[i]);
			}
			name.innerHTML = song_singer[0];      //进度条歌曲-歌手
			addLyric(lyric, music[0]);            //添加歌词
			albumPic();                           //添加专辑图片
			$($(".wave")[0]).attr("src", "images/wave.gif");
			$($(".list_number_position")[0]).hide();
			$($(".list_music")[0]).css("background", "rgba(51, 51, 51, 0.75)");
		  }
		}
	  );
	}
	// console.log(decodeURI(GetQueryString("oneSinger")));
	var oneSinger = decodeURI(GetQueryString("oneSinger"));
	// alert(decodeURI(GetQueryString("oneSinger")));
	//单曲列表播放
	if (oneSinger !== "null") {
	  $.get(
		"/single/get",
		{"search": oneSinger},
		function (result) {
		  var data = JSON.parse(result);
		  // console.log(data);
		  if (data.success) {
			for (var k = 0; k < data.result.length; k++) {
			  $($(".list_author")[k]).append(data.result[k].singer);
			  $($(".list_time")[k]).append(data.result[k].duration);
			  $($(".list_name")[k]).append(data.result[k].song);
			  $($(".list_music")[k]).show();
			}
			let url = "http://192.168.1.125:8080/music/song/music/" + oneSinger + "/" + data.result[0].song + ".mp3";
			// 添加下载
			btnDown.setAttribute('href', url);

			audio.setAttribute("src", url);
			$("#song_info_name").html(data.result[0].song);
			$("#song_info_singer").html(oneSinger);
			audio.play();
			pause.style.backgroundPosition = "-30px  0px";
			for (var i = 0; i < data.result.length; i++) {
			  var urlSinger = oneSinger;
			  var urlSong = $($(".list_name")[i]).html();
			  music[i] = urlSinger + "/" + urlSong;
			  song_singer[i] = urlSong + " - " + urlSinger;
			  pic_song[i] = urlSong;
			  pic_singer[i] = urlSinger;

			  // console.log(music[i]);
			}
			name.innerHTML = song_singer[0];
			addLyric(lyric, music[0]);
			wave();
			albumPic();
		  }
		}
	  );
	}


	/*-------------------------- yyq加 start --------------------------------*/


	//排行榜新歌
	var date = decodeURI(GetQueryString("filed"));
	var desc = decodeURI(GetQueryString("order"));
	// console.log("newSong--date：" + date);
	// console.log("newSong--desc：" + desc);
	if (date !== "null" && desc !== "null") {
	  $.get(
		"/timeDown/get",
		{
		  "field": date,
		  "order": desc
		},
		function (result) {
		  var data = JSON.parse(result);
		  console.log(data);
		  if (data.success) {
			for (var j = 0; j < 12; j++) {
			  $($(".list_name")[j]).append(data.result[j].song);
			  $($(".list_author")[j]).append(data.result[j].singer);
			  $($(".list_time")[j]).append(data.result[j].duration);
			  $($(".list_music")[j]).show();
			}
			let url = "http://192.168.1.125:8080/music/song/music/" + data.result[0].singer + "/" + data.result[0].song + ".mp3";
			btnDown.setAttribute('href', url);
			audio.setAttribute("src", url);
			$("#song_info_name").html(data.result[0].song);           //歌词滚动歌手
			$("#song_info_singer").html(data.result[0].singer);

			//歌词滚动歌名
			audio.play();
			pause.style.backgroundPosition = "-30px  0px";
			for (var i = 0; i < 12; i++) {
			  var urlSinger = $($(".list_author")[i]).html();
			  var urlSong = $($(".list_name")[i]).html();
			  music[i] = urlSinger + "/" + urlSong;
			  song_singer[i] = urlSong + " - " + urlSinger;
			  pic_song[i] = urlSong;
			  pic_singer[i] = urlSinger;
			  console.log(music[i]);
			}
			name.innerHTML = song_singer[0];

			addLyric(lyric, music[0]);
			wave();
			albumPic();
		  }
		}
	  );
	}


	//排行榜热歌
	var hits = decodeURI(GetQueryString("hits"));
	var desc2 = decodeURI(GetQueryString("order2"));
	var limit = decodeURI(GetQueryString("limit"));
	// console.log("hotSong--hits：" + hits);
	// console.log("hotSong--order2：" + desc2);
	// console.log("hotSong--limit：" + limit);
	if (hits !== "null" && desc2 !== "null" && limit !== "null") {
	  $.get(
		"/SongHits/get",
		{
		  "hits": hits,
		  "order2": desc2,
		  "limit": limit
		},
		function (result) {
		  var data = JSON.parse(result);
		  console.log(data);
		  if (data.success) {
			for (var j = 0; j < 12; j++) {
			  $($(".list_name")[j]).append(data.result[j].song);
			  $($(".list_author")[j]).append(data.result[j].singer);
			  $($(".list_time")[j]).append(data.result[j].duration);
			  $($(".list_music")[j]).show();
			}
			let url = "http://192.168.1.125:8080/music/song/music/" + data.result[0].singer + "/" + data.result[0].song + ".mp3";
			btnDown.setAttribute('href', url);
			audio.setAttribute("src", );
			$("#song_info_name").html(data.result[0].song);           //歌词滚动歌手
			$("#song_info_singer").html(data.result[0].singer);

			//歌词滚动歌名
			audio.play();
			pause.style.backgroundPosition = "-30px  0px";
			for (var i = 0; i < 12; i++) {
			  var urlSinger = $($(".list_author")[i]).html();
			  var urlSong = $($(".list_name")[i]).html();
			  music[i] = urlSinger + "/" + urlSong;
			  song_singer[i] = urlSong + " - " + urlSinger;
			  pic_song[i] = urlSong;
			  pic_singer[i] = urlSinger;
			  console.log(music[i]);
			}
			name.innerHTML = song_singer[0];

			addLyric(lyric, music[0]);

			wave();
			albumPic();
		  }
		}
	  );
	}


	//排行榜日韩
	var areaId1 = decodeURI(GetQueryString("areaId1"));
	var areaId2 = decodeURI(GetQueryString("areaId2"));
	// console.log("日韩--areaId1：" + areaId1);
	// console.log("日韩--areaId2：" + areaId2);
	if (areaId1 !== "null" && areaId2 !== "null") {
	  $.get(
		"/Japan/get",
		{
		  "areaId1": areaId1,
		  "areaId2": areaId2
		},
		function (result) {
		  var data = JSON.parse(result);
		  console.log(data);
		  if (data.success) {
			for (var j = 0; j < 8; j++) {
			  $($(".list_name")[j]).append(data.result[j].song);
			  $($(".list_author")[j]).append(data.result[j].singer);
			  $($(".list_time")[j]).append(data.result[j].duration);
			  $($(".list_music")[j]).show();
			}
			let url = "http://192.168.1.125:8080/music/song/music/" + data.result[0].singer + "/" + data.result[0].song + ".mp3";
			btnDown.setAttribute('href', url);

			audio.setAttribute("src", url);
			$("#song_info_name").html(data.result[0].song);           //歌词滚动歌手
			$("#song_info_singer").html(data.result[0].singer);

			//歌词滚动歌名
			audio.play();
			pause.style.backgroundPosition = "-30px  0px";
			for (var i = 0; i < 8; i++) {
			  var urlSinger = $($(".list_author")[i]).html();
			  var urlSong = $($(".list_name")[i]).html();
			  music[i] = urlSinger + "/" + urlSong;
			  song_singer[i] = urlSong + " - " + urlSinger;
			  pic_song[i] = urlSong;
			  pic_singer[i] = urlSinger;
			  console.log(music[i]);
			}
			name.innerHTML = song_singer[0];

			addLyric(lyric, music[0]);
			wave();
			albumPic();
		  }
		}
	  );
	}


	//排行榜欧美
	var areaId = decodeURI(GetQueryString("areaId"));
	// console.log("欧美--areaId：" + areaId);
	if (areaId !== "null") {
	  $.get(
		"/EuropeAmerica/get",
		{"areaId": areaId},
		function (result) {
		  var data = JSON.parse(result);
		  console.log(data);
		  if (data.success) {
			for (var j = 0; j < 8; j++) {
			  $($(".list_name")[j]).append(data.result[j].song);
			  $($(".list_author")[j]).append(data.result[j].singer);
			  $($(".list_time")[j]).append(data.result[j].duration);
			  $($(".list_music")[j]).show();
			}
			let url = "http://192.168.1.125:8080/music/song/music/" + data.result[0].singer + "/" + data.result[0].song + ".mp3";
			btnDown.setAttribute('href', url);
			audio.setAttribute("src",url);
			$("#song_info_name").html(data.result[0].song);           //歌词滚动歌手
			$("#song_info_singer").html(data.result[0].singer);

			//歌词滚动歌名
			audio.play();
			pause.style.backgroundPosition = "-30px  0px";
			for (var i = 0; i < 8; i++) {
			  var urlSinger = $($(".list_author")[i]).html();
			  var urlSong = $($(".list_name")[i]).html();
			  music[i] = urlSinger + "/" + urlSong;
			  song_singer[i] = urlSong + " - " + urlSinger;
			  pic_song[i] = urlSong;
			  pic_singer[i] = urlSinger;
			  console.log(music[i]);
			}
			name.innerHTML = song_singer[0];

			addLyric(lyric, music[0]);
			wave();
			albumPic();
		  }
		}
	  );
	}

      //歌单播放列表
      var listId = decodeURI(GetQueryString("listId"));
      // console.log("测试slId："+listId);
      $.ajax({
          type: "get",
          url: "/ListGet",
          data: {"listId": listId},
          success: function(result){
              var data = JSON.parse(result);
              if (data.success) {
                  for (var j = 0; j < data.result.length; j++) {
                      $($(".list_name")[j]).append(data.result[j].song);
                      $($(".list_author")[j]).append(data.result[j].singer);
                      $($(".list_time")[j]).append(data.result[j].duration);
                      $($(".list_music")[j]).show();
                  }
                  let url =  "http://192.168.1.125:8080/music/song/music/" + data.result[0].singer + "/" + data.result[0].song + ".mp3";
                 btnDown.setAttribute('href', url);
                  audio.setAttribute("src", url);
                  $("#song_info_name").html(data.result[0].song);           //歌词滚动歌手
                  $("#song_info_singer").html(data.result[0].singer);

                  //歌词滚动歌名
                  audio.play();
                  pause.style.backgroundPosition = "-30px  0px";
                  for (var i = 0; i < 8; i++) {
                      var urlSinger = $($(".list_author")[i]).html();
                      var urlSong = $($(".list_name")[i]).html();
                      music[i] = urlSinger + "/" + urlSong;
                      song_singer[i] = urlSong + " - " + urlSinger;
                      pic_song[i] = urlSong;
                      pic_singer[i] = urlSinger;
                      console.log(music[i]);
                  }
                  name.innerHTML = song_singer[0];
              }
              addLyric(lyric);
              wave();
              albumPic();
          }
      });

	/*--------------------------- yyq加 end --------------------------------*/


  });


  //右部专辑图片
  function albumPic() {
	var album_pic = $("#song_info_name").html();
	console.log(album_pic);
	console.log("aaa");
	$.get(
	  "/album/song/get",
	  {"search": album_pic},
	  function (result) {
		var data = JSON.parse(result);
		console.log(data);
		if (data.success) {
		  $("#song_info_pic").attr("src", data.result[0].img);
		  bg.style.backgroundImage = "url(" + data.result[0].img + ")";
		}
	  }
	)
  }


  //添加播放图标
  function wave() {
	var dbsong = $("#song_info_name").html();
	// console.log(dbsong)
	for (var j = 0; j < 13; j++) {
	  var dbsongs = $($(".list_name")[j]).html();
	  // console.log(dbsongs);
	  if (dbsong === dbsongs) {
		$($(".wave")[j]).attr("src", "images/wave.gif");
		$($(".list_number_position")[j]).hide();
		$($(".list_music")[j]).css("background", "rgba(0, 0, 0, 0.2)");
	  } else {
		$($(".wave")[j]).attr("src", "none");
		$($(".list_number_position")[j]).show();
		$($(".list_music")[j]).css("background", "transparent");
	  }
	}
  }


    //双击播放
    $(".list_music").on("dblclick", function () {
	var dbsong = $(this).find("li").eq(2).html();
	var dbsinger = $(this).find("li").eq(3).html();
	audio.src = "http://192.168.1.125:8080/music/song/music/" + dbsinger + "/" + dbsong + ".mp3";
	btnDown.setAttribute('href', audio.src);
	name.innerHTML = dbsong + "-" + dbsinger;
	pause.style.backgroundPosition = "-30px 0px";
	song_name.innerHTML = dbsong;
	singer_name.innerHTML = dbsinger;
    // 添加播放图标
	wave();
	audio.play();
    // 添加专辑图片
	albumPic();
	// clearLyric(lyric);
	var path = dbsinger + '/' + dbsong;
	addLyric(lyric, path);
  });

  //上一曲
  left.onclick = function () {
	num = (num + music.length - 1) % music.length;
	audio.src = "http://192.168.1.125:8080/music/song/music/" + music[num] + ".mp3";
	btnDown.setAttribute('href', audio.src);
	name.innerHTML = song_singer[num];
	pause.style.backgroundPosition = "-30px 0px";
	song_name.innerHTML = pic_song[num];
	singer_name.innerHTML = pic_singer[num];
	// 添加播放图标
	wave();
	// 添加专辑图片
	albumPic();
	audio.play();
	/*==== 添加歌词 ====*/
	clearLyric(lyric);
	addLyric(lyric, music[num]);
  };

  //下一曲
  right.onclick = function () {
	num = (num + 1) % music.length;
	audio.src = "http://192.168.1.125:8080/music/song/music/" + music[num] + ".mp3";
	btnDown.setAttribute('href', audio.src);
	name.innerHTML = song_singer[num];
	pause.style.backgroundPosition = "-30px 0px";
	song_name.innerHTML = pic_song[num];
	singer_name.innerHTML = pic_singer[num];
    // 添加播放图标
	wave();
    // 添加专辑图片
	albumPic();
	audio.play();
	/*==== 添加歌词 ====*/
	clearLyric(lyric);
	addLyric(lyric, music[num]);
  };


  //播放，暂停
  pause.onclick = function () {
	if (pause.style.backgroundPosition !== "-30px 0px") {
	  audio.play();
	  pause.style.backgroundPosition = "-30px 0px";
	} else {
	  audio.pause();
	  pause.style.backgroundPosition = "0px 0px";
	}
  };


  //自动播放下一首
  audio.addEventListener('ended', function () {
	// console.log("music.length: " + music.length);
	if(music.length !== 0){
	  right.onclick();
	}
  }, false);

    //勾选歌曲
    $(".list_edit").click(function () {
        if ($(this).css("background-position") !== "-60px -80px") {

            $(this).css("background-position", "-60px -80px");
        } else {

            $(this).css("background-position", "-1000px");

        }
    });

    // 勾选全部
    $(".list_edit_head").click(function () {

        if ($(".list_edit_head").css("background-position") !== "-60px -80px") {
            $(".list_edit_head").css("background-position", "-60px -80px");
            $(".list_edit").css("background-position", "-60px -80px");
        } else {
            $(".list_edit_head").css("background-position", "-1000px");
            $(".list_edit").css("background-position", "-1000px");

        }

    });

    // 清空列表
    $("#clear").click(function () {
        // $(".list_music").hide();
        $(".list_music").empty();
        audio.pause();
    });

    var songName;             //获取歌名
    var songNums = 0;         //标记收藏歌曲的数量
    var editNums = 0;         //标记被勾选歌曲的数量
    //收藏
    $("#collection").click(function () {
        console.log(userId);
       //验证用户是否登录
       if(userId===""||userId===null){
           var r = confirm("温馨提示：请您登录后再操作！");
           if (r == true) {
             window.location.href ="../login/login.html" ;
           }
       }
        console.log("aaa");
        for (var j = 0; j < $(".list_edit").length; j++) {

            if ($($(".list_edit")[j]).css("background-position") === "-60px -80px") {

                editNums++;
                songName = $($(".list_name")[j]).html();
                console.log(songName);
                console.log(userId);
                //获取歌曲id
                $.ajax({
                    type: "get",
                    url: "/collection/song/get",
                    data: {"name": songName},
                    async: false,
                    success: function (result) {
                        var data = JSON.parse(result);
                        console.log(data);
                        songId = data.result[0];

                        // 收藏歌曲
                        $.ajax({
                            type: "get",
                            url: "/collection/song/insert",
                            data: {"userId": userId, "songId": songId},
                            async: false,
                            success: function (result) {
                                console.log(songId);
                                var data = JSON.parse(result);
                                console.log(data);
                                songNums++;
                            }
                        });

                    }
                });

            }

	}
	if (editNums === 0 && userId !== null) {
	  alert("请选择相关的歌曲进行操作");
	}

	if (songNums > 0) {
	  alert("成功添加" + songNums + "首歌曲");
	}


    });


    /*============ 播放进度条 ============*/


    /*==== 获取进度条的宽度 ====*/
    var rangeWidth = parseInt($(range).css('width').substring(0, $(range).css('width').length - 2));


    var mute = false;   //  默认打开声音


    setInterval(setProgress, 100);   //通过定时器设置进度的自动改变
    function setProgress() {
        current.innerHTML = format(audio.currentTime);  //设置当前时间的显示
        progress.style.width = (audio.currentTime) / (audio.duration) * rangeWidth + "px";
        dot.style.left = progress.style.width;
    }

    range.onmousedown = function (ev) {
        changProgress(ev);
    };
    range.onmouseup = function () {
	  audio.play();
	  pause.style.backgroundPosition = "-30px 0px";
	};

    dot.onmousedown = function (ev) {
        document.onmousemove = function (ev) {
            mute = true;    // 鼠标移动时静音
            // console.log("静音");
            changProgress(ev);
        };
        document.onmouseup = function (ev) {      //当鼠标松开后关闭移动事件和自身事件
            mute = false;   // 鼠标松开时打开声音
            // console.log("打开声音");
            changProgress(ev);
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false;
    };

    /*==== 获取左外边距 ====*/
    var MarginLeft = $(range).parent().css('margin-left');
    MarginLeft = MarginLeft.substring(0, MarginLeft.length - 2);
    /*==== 获取left值 ====*/
    var rangeLeft = $(range).parent().parent().css('left');
    rangeLeft = rangeLeft.substring(0, rangeLeft.length - 2);
    /*==== 获取圆的宽度 ====*/
    var dotWidth = $(dot).css('width');
    dotWidth = dotWidth.substring(0, dotWidth.length - 2);
    /*==== 计算圆离左边的距离 ====*/
    var leftDistance = parseInt(MarginLeft) + parseInt(rangeLeft) + parseInt(dotWidth) / 2;

    // 改变进度条
    function changProgress(ev) {
        // console.log("ev.clientX: " + ev.clientX);
        // console.log("leftDistance； " + leftDistance);
        var l = ev.clientX - leftDistance;          //获取圆距左端的距离
        if (l < 0) {
            l = 0;
        } else if (l > rangeWidth) {
            pause.style.backgroundPosition = "0px 0px";
            l = rangeWidth;
        }

        // console.log("l: " + l);

        dot.style.left = l + "px";
        progress.style.width = l + "px";

        audio.muted = mute;

        audio.currentTime = (l / rangeWidth) * audio.duration;    //设置当前时间，以改变真正的播放进度
        current.innerHTML = format(audio.currentTime);  //当前时间
    }


    /*============ 声音进度条 ============*/


    //声音开关
    var voice = document.getElementById("btn_voice");
    voice.onclick = function () {
        if (voice.style.backgroundPosition !== "0px -182px") {
            voice.style.backgroundPosition = "0px -182px";
            audio.muted = true;
        } else {
            voice.style.backgroundPosition = "0px -144px";
            audio.muted = false;
        }
    };

    //声音控制条
    var voiceRange = document.getElementById("play_voice");
    var voiceProgress = document.getElementById("progress_voice");
    var voiceDot = document.getElementById("voice_dot");

    /*==== 获取声音控制条宽度 ====*/
    var voiceRangeWidth = $(voiceRange).css('width');
    voiceRangeWidth = parseInt(voiceRangeWidth.substring(0, voiceRangeWidth.length - 2));
    /*==== 获取control的宽度 ====*/
    var controlWidth = $(voiceRange).parent().parent().css('width');
    controlWidth = controlWidth.substring(0, controlWidth.length - 2);
    /*==== 控制条左边距离 ====*/
    var voiceLeftDistance = parseInt(controlWidth) + parseInt(rangeLeft) - voiceRangeWidth + parseInt(dotWidth) / 2;


    // console.log("control的宽度："+controlWidth);
    //
    // console.log("声音控制条宽度："+voiceRangeWidth);
    //
    // console.log("控制条左边距离："+voiceLeftDistance);


    voiceRange.onmousedown = function (ev) {
        changProgressVoice(ev);
    };

    voiceDot.onmousedown = function (ev) {
        document.onmousemove = function (ev) {
            changProgressVoice(ev);
        };
        document.onmouseup = function () {      //当鼠标松开后关闭移动事件和自身事件
            document.onmousemove = null;
            document.onmouseup = null;
        };
        return false;
    };

    // 改变进度条
    function changProgressVoice(ev) {
        // console.log("声音控制条x坐标："+ev.clientX);
        var d = ev.clientX - voiceLeftDistance;          //获取圆距左端的距离
        if (d < 0) {
            d = 0;
        } else if (d > voiceRangeWidth) {

            d = voiceRangeWidth;
        }
        console.log("d: " + d);
        voiceDot.style.left = d + "px";
        voiceProgress.style.width = d + "px";
        var v = (d / voiceRangeWidth).toFixed(2);
        audio.volume = v;
    }


    var listIconPlay = document.getElementsByClassName("mod_list_iconPlay");

    var i;
    for (i = 0; i < listIconPlay.length; i++) {
        listIconPlay[i].id = i;
        listIconPlay[i].onclick = function () {
            if (listIconPlay[this.id].style.backgroundPosition != "-30px 0px") {
                listIconPlay[this.id].style.backgroundPosition = "-30px 0px";
            } else {
                listIconPlay[this.id].style.backgroundPosition = "0px 0px";

            }
        }
    }


    /*============ 歌词滚动 ============*/

    // var url = './music/音阙诗听、赵方婧 - 霜降.lrc';

    // var singerName = "G.E.M.邓紫棋";
    // var songName = "画 (Live Piano Session II)";


  /*==== 添加歌词 ====*/
  function addLyric(lyric, path) {

	// var path = music[num];
	// console.log(music[num]);
	console.log("path: " + path);

	if (path === undefined) {
	  console.log("%c 路径为空！", "color: #fff;background: #f00; padding:5px 0;");
	  return;
	}

	var song = new Song();

	// 获取歌词
	song.getLyric(path);
	// 添加歌词到指定容器
	song.appendTo(lyric);

        /*==== 歌词高亮行数 ====*/
        var line = 0;
        var p = document.querySelectorAll('#lyric p');
        /*==== 获取行高 ====*/
        var lineHeight = $(lyric).css('line-height');
        lineHeight = parseInt(lineHeight.substring(0, lineHeight.length - 2));
        /*==== 获取下外边距 ====*/
        var marginBottom = $(p[0]).css('margin-bottom');
        marginBottom = parseInt(marginBottom.substring(0, marginBottom.length - 2));
        /*==== 计算p标签高度 ====*/
        var pHeight = lineHeight + marginBottom;


        /*==== 绑定滚动事件 ====*/
        audio.addEventListener('timeupdate', function () {
            var curTime = audio.currentTime;
            if (audio.ended === true) {
                return;
            }
            scroll(curTime);
        });

//
        /*==== 歌词滚动 ====*/
        function scroll(time) {
            if (song.isEmpty) {
                lyric.style.transform = "translateY(0px)";
                return;
            }

            var offset = -1 * line * pHeight; // 计算偏移量

            // console.log("line: " + line);

            // console.log("song.lyric.length: " + song.lyric.length);

            if (time >= song.lyric[song.lyric.length - 1].time) {
                line = song.lyric.length;
                offset = -1 * line * pHeight;
                lyric.style.transform = "translateY(" + offset + "px)";
                setHighLight(line - 1);
                return;
            }

            for (var i = 1; i < song.lyric.length; ++i) {
                if (time < song.lyric[i].time) {
                    line = i - 1;
                    offset = -1 * line * pHeight;
                    break;
                }
            }

            if (time >= song.lyric[line].time && time < song.lyric[line + 1].time) {
                // console.log("curT: " + time + " line: " + line);
                lyric.style.transform = "translateY(" + offset + "px)";
                setHighLight(line);
                line++;
            }
        }

        /*==== 歌词高亮 ====*/
        function setHighLight(row) {
            for (var i = 0; i < p.length; ++i) {
                p[i].className = "";
            }
            p[row].className = "on";
        }

    }

//

    /*==== 清除歌词 ====*/
    function clearLyric(lyric) {
        $(lyric).empty();
    }


};

// 构造song对象
function Song(ar, ti, lrc) {
    this.artist = ar;
    this.title = ti;
    this.lyric = lrc;
    this.isEmpty = false;
}

Song.prototype = {
    constructor: Song,
    appendTo: function (pos) {                              // 添加歌词到指定容器
        while (pos.hasChildNodes()) {
            pos.removeChild(pos.firstChild);
        }
        if (this.lyric === undefined) {
            this.isEmpty = true;
            var none = document.createElement('p');
            var noneText = document.createTextNode("暂无歌词");
            none.appendChild(noneText);
            pos.appendChild(none);
            return;
        }
        for (var i in this.lyric) {
            var p = document.createElement('p');
            var text = document.createTextNode(this.lyric[i].content);
            p.appendChild(text);
            pos.appendChild(p);
        }

    },
    getLyric: function (path) {       // 获取歌词
        var song = this;
        $.ajax({
            type: "get",
            url: "/lyricGet",     // 获取歌词的servlet
            data: {"path": path},   // {"singer": singerName, "song": songName}
            async: false,       // 必须为false才能接受到有效返回值
            success: function (result) {
                console.log(result);
                if (result === "null") {
                    console.log("%c 获取歌词失败！", "color: #fff;background: #f00; padding:5px 0;");
                    return;
                }
                console.log("%c 获取歌词成功！", "color: #0f0;background: #eee; padding:5px 0;");
                // 分割换行符，获取每行歌词和时间
                var data = result.split('\n\n');
//
//         // 获取歌手名和歌曲名
                var artist = data[0].substring(data[0].indexOf(':') + 1, data[0].indexOf(']'));
                var title = data[1].substring(data[1].indexOf(':') + 1, data[1].indexOf(']'));

                song.artist = artist;
                song.title = title;
                var lyric = [];
//         // 获取歌词和时间,data最后一行是空行
                for (var i = 2; i < data.length - 1; ++i) {
                    var time = data[i].substring(data[i].indexOf('[') + 1, data[i].indexOf(']'));
                    var t = parseInt(time.split(':')[0]) * 60 + parseFloat(time.split(':')[1]);
                    var content = data[i].substring(data[i].indexOf(']') + 1);
                    lyric.push({time: t.toFixed(3), content: content});
                }
                song.lyric = lyric;
            }
        });
    }
};




