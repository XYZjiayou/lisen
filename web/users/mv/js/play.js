/**
 * Created by user on 2019/12/6.
 */

document.onreadystatechange = loading;

// 页面加载事件
function loading() {
  var load = document.querySelector('.loading');

  if (document.readyState === "complete") {
	load.style.display = "none";
  } else {
	load.style.display = "block";
  }
}


function MVP() {
  console.log(document.cookie);
  this.mId = document.cookie.split("=")[1];                     // 前提是只有一个cookie, 如：mId=3
  this.videoInfo = [];											// 接受后台发送的视频信息
  this.cmts = [];												// 接受发送的评论信息
  this.video = document.querySelector("#mvPlay video");			// 视频
  this.playBtn = document.querySelector("#icoPlay");			// 播放按钮
  this.vPro = document.querySelector(".progress_inner");		// 视频进度条
  this.vDot = document.querySelector(".v_dot");					// 视频小圆点
  this.volPro = document.querySelector(".vol_progress");		// 声音进度条
  this.volumeBtn = document.querySelector("#icoVolume");	    // 声音按钮
  this.fullscreenBtn = document.querySelector("#icofullscreen");// 全屏按钮
  this.isPlay = false;
}

MVP.prototype = {
  constructor: MVP,
  init: function () {
	var data = this.getData();
	this.videoInfo = data.videoInfo;
	this.addVideo();
	this.addInfo();
  },
  getData: function () {
	var data;
	var self = this;
	$.ajax({
	  type: "get",
	  url: "/videoGet",
	  data: {"mId": self.mId},
	  async: false,
	  success: function (result) {
		data = JSON.parse(result);

		console.log(data);
	  }
	});
	return data;
  },
  addVideo: function () {
	this.video.setAttribute('src', this.videoInfo[0].url);
  },
  addInfo: function () {
	var mv_title = document.querySelector(".mv_title");
	var mv_listen = document.querySelector(".mv_listen");

	// 歌曲标题
	mv_title.innerHTML = this.videoInfo[0].singer + " - " + this.videoInfo[0].title;

	// 播放量
	var str = this.videoInfo[0].play > 10000 ? ((this.videoInfo[0].play / 10000).toFixed(1)) : this.videoInfo[0].play;
	mv_listen.innerHTML = "播放量：" + str + "万";

	// 视频简介
	var mv_singer = document.querySelector(".mv_singer");
	var mv_date = document.querySelector(".mv_info_date span");
	mv_singer.innerHTML = this.videoInfo[0].singer;
	mv_date.innerHTML = this.videoInfo[0].date;
  },
  timeUpdate: function () {
	var self = this;

	// 视频剩余时间文本容器
	var timeLeft = document.querySelector(".v_time .time_left");

	// 视频总时间文本容器
	var timeDuration = document.querySelector('.v_time .time_duration');

	// 获取总时长
	this.video.addEventListener('canplay', function () {
	  var duration = this.duration;     // duration 以秒计时
	  var M = parseInt(duration / 60) % 60;
	  M = M < 10 ? ('0' + M) : M;
	  var S = parseInt(duration % 60);
	  S = S < 10 ? ('0' + S) : S;
	  timeDuration.innerHTML = M + ":" + S;
	});

	// 添加监听事件
	this.video.addEventListener('timeupdate', function () {
	  var curT = this.currentTime;
	  // 分钟
	  var m = parseInt(curT / 60) % 60;
	  m = m < 10 ? ('0' + m) : m;
	  // 秒
	  var s = parseInt(curT % 60);
	  s = s < 10 ? ('0' + s) : s;
	  //写入剩余时间
	  timeLeft.innerHTML = m + ":" + s;

	  // 进度条
	  var duration = this.duration;
	  var proWidth = $($(self.vPro).parent()).css('width');			// 进度条宽度
	  proWidth = parseInt(proWidth.match(/\d+/)[0]);
	  $(self.vPro).css('width', curT / duration * proWidth + 'px');

	  // 小圆点
	  var dotWidth = $(self.vDot).css('width').match(/\d+/)[0];
	  dotWidth = parseInt(dotWidth);
	  $(self.vDot).css('left', (curT / duration * proWidth - dotWidth / 2) + 'px');
	})
  },
  event: function(){						// 绑定各种点击事件
    var self = this;
    // 播放按钮
	this.playBtn.onclick = function () {
	  if (!self.isPlay) {
		self.video.play();
		this.classList.remove("fa-play");
		this.classList.add("fa-pause");
		self.isPlay = true;
	  } else {
		self.video.pause();
		this.classList.remove("fa-pause");
		this.classList.add("fa-play");
		self.isPlay = false;
	  }
	};

	this.volumeBtn.onmouseover = function(){
	  $(self.volPro).css('display', 'block');
	};
	this.volPro.onmouseout = function(){
	  $(this).css('display', 'none');
	}
  }
};


window.onload = function () {
  var mvp = new MVP();
  mvp.init();
  var htmlTitle = document.querySelector('title');
  htmlTitle.innerHTML = mvp.videoInfo[0].singer + " - " + mvp.videoInfo[0].title;

  mvp.timeUpdate();
  mvp.event();

};
