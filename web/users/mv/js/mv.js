/**
 * Created by user on 2019/11/19.
 */

document.onreadystatechange = loading;


function MV() {
  this.area = "全部";
  this.version = "全部";
  this.page = 0;
  this.content = [];
  this.counts = 1;
  this.isEmpty = true;
}

MV.prototype = {
  constructor: MV,
  init: function () {
	var data = this.getData();

	// 添加标签
	this.reset(data);
	this.addTag(data);
	this.addPage(data);


  },
  appendTo: function (pos) {
	var self = this;

	// 先清空容器原有数据
	clearChild(pos);

	for (var i = 0; i < self.content.length; ++i) {
	  //1、 创建li
	  var liItem = document.createElement('li');
	  liItem.className = "list_item";
	  //1.1、 创建li内部容器
	  var liBox = document.createElement('div');
	  liBox.className = "list_box";
	  //1.1.1、 创建图片容器
	  var itemBox = document.createElement('a');
	  itemBox.className = "item_box";
	  itemBox.setAttribute('href',"./mv_play.html");
	  //1.1.1.1、 创建图片
	  var itemImg = document.createElement('img');
	  itemImg.className = "item_img";
	  itemImg.setAttribute('src', self.content[i].img);
	  //1.1.1.2、 创建播放图标
	  var iconPlay = document.createElement('i');
	  iconPlay.className = "icon-play";
	  // 把图片和播放图标添加到图片容器
	  itemBox.appendChild(itemImg);
	  itemBox.appendChild(iconPlay);
	  //1.1.2、 创建标题
	  var itemTitle = document.createElement('a');
	  itemTitle.className = "item_title";
	  itemTitle.innerHTML = self.content[i].title;
	  //1.1.3、 创建歌手
	  var itemAuthor = document.createElement('a');
	  itemAuthor.className = "item_author";
	  itemAuthor.innerHTML = self.content[i].singer;
	  //1.1.4、 创建播放信息
	  var itemInfo = document.createElement('div');
	  itemInfo.className = "item_info";
	  //1.1.4.1、 播放量
	  var itemPlay = document.createElement('span');
	  itemPlay.className = "item_play";
	  //1.1.4.1.1、 播放图标
	  var itemPlayIcon = document.createElement('i');
	  itemPlayIcon.className = "fa fa-video-camera item_play_icon";
	  //1.1.4.1.2、 播放量文本
	  var text = document.createTextNode(self.content[i].play);
	  // 添加播放量
	  itemPlay.appendChild(itemPlayIcon);
	  itemPlay.appendChild(text);
	  //1.1.4.2、 发布时间
	  var date = document.createElement('span');
	  date.innerHTML = self.content[i].date;
	  // 把播放量和发布日期添加到播放信息
	  itemInfo.appendChild(itemPlay);
	  itemInfo.appendChild(date);
	  // 把图片容器、标题、歌手、播放信息添加到li内部容器
	  liBox.appendChild(itemBox);
	  liBox.appendChild(itemTitle);
	  liBox.appendChild(itemAuthor);
	  liBox.appendChild(itemInfo);
	  // 把li内部容器添加到li中
	  liItem.appendChild(liBox);
	  // 最后把li添加到指定容器
	  pos.appendChild(liItem);
	}
  },
  reset: function (data) {
	console.log(data);

	if(data.success === false){
	  return;
	}
	this.counts = data.counts;

	if (data.result.length === 0) {
	  return;
	}

	var size = data.result.length > 12 ? 12 : data.result.length;

	for (var j = 0; j < size; ++j) {
	  this.content.push({
		"img": data.result[j].img,
		"date": data.result[j].date,
		"play": (data.result[j].play / 10000).toFixed(1) + 'w',
		"title": data.result[j].title,
		"singer": data.result[j].singer,
		"url": data.result[j].url
	  });
	}
  },
  getData: function () {
	var data;
	$.ajax({
	  type: "get",
	  url: "/mvGet",
	  data: {"area": this.area, "version": this.version, "page": this.page},
	  async: false,
	  success: function (result) {
		// console.log(result);

		data = JSON.parse(result);
	  }
	});
	return data;
  },
  addTag: function (data) {
	// 获取mv顶部标签容器
	var tags = document.getElementById('tags');
	clearChild(tags);

	// console.log("tags: " + tags);

	// 创建"区域"标签和"版本"标签
	var areaTag = document.createElement('div');
	var versionTag = document.createElement('div');
	areaTag.className = "tag";
	versionTag.className = "tag";
	// 创建小标题
	var title1 = document.createElement('h3');
	title1.className = "tag_title";
	title1.innerHTML = "区域";
	var title2 = document.createElement('h3');
	title2.className = "tag_title";
	title2.innerHTML = "版本";
	// 创建a标签
	var all1 = document.createElement('a');
	all1.classList.add("tag_item", "selected");
	all1.setAttribute('href', "javascript:;");
	all1.innerHTML = "全部";
	var all2 = document.createElement('a');
	all2.classList.add("tag_item", "selected");
	all2.setAttribute('href', "javascript:;");
	all2.innerHTML = "全部";

	// 添加子元素
	areaTag.appendChild(title1);
	versionTag.appendChild(title2);
	areaTag.appendChild(all1);
	versionTag.appendChild(all2);

	// console.log("areaTag" + areaTag);
	// console.log("versionTag" + versionTag);


	if (this.isEmpty) {
	  for (var i = 0; i < data.area.length; ++i) {
		var aTag = document.createElement('a');
		aTag.className = "tag_item";
		aTag.setAttribute('href', "javascript:;");
		aTag.innerHTML = data.area[i];
		areaTag.appendChild(aTag);
	  }

	  for (var i = 0; i < data.version.length; ++i) {
		var aTag = document.createElement('a');
		aTag.className = "tag_item";
		aTag.setAttribute('href', "javascript:;");
		aTag.innerHTML = data.version[i];
		versionTag.appendChild(aTag);
	  }
	  // 把标签放入tags容器
	  tags.appendChild(areaTag);
	  tags.appendChild(versionTag);
	  this.isEmpty = false;
	}
  },
  addPage: function(data){
	var main = document.getElementsByClassName('main')[0];
	console.log(main);
	var pageBox = document.createElement('div');
	pageBox.className = "page";
	var size = parseInt(this.counts / 12);
	console.log(size);
	if(size <= 1){

	} else if(size < 4 ) {
	  for (var i = 0; i < size; ++i) {
		var page = "<a href=\"javascript:;\" class=\"page_index";
		if(i === 0) {
		  page += " selected\">" + i + 1 + "</a>";
		}
		else{
		  page += "\">" + i + 1 + "</a>";
		}
	  }
	  pageBox.innerHTML = page;
	  main.appendChild(pageBox);
	}

  },
  clear: function(){
    this.content.length = 0;
  }
};


// 页面加载事件
function loading() {
  var load = document.querySelector('.loading');

  if (document.readyState === "complete") {
	load.style.display = "none";
  } else {
	load.style.display = "block";
  }
}


window.onload = function () {

  var mv = new MV();
  mv.init();
  // console.log(mv);
  var mvList = document.getElementById('mv_list');
  mv.appendTo(mvList);


  var areaTags = document.getElementById('tags').firstChild.children;
  var versionTags = document.getElementById('tags').lastChild.children;

  bindEvent(areaTags, "area");
  bindEvent(versionTags, "version");




  function bindEvent(ele, type) {
	var index = 1;
	for (var i = 1; i < ele.length; ++i) {
	  ele[i].id = i;
	  ele[i].onclick = function () {
		ele[index].classList.remove("selected");
		this.classList.add("selected");
		index = this.id;

		if (type === "area") {
		  mv.area = this.innerText;
		} else if (type === "version") {
		  mv.version = this.innerText;
		} else if (type === "page") {
		  mv.page = this.innerText;
		}
		// 1、先清除mv的内容
		mv.clear();
		// 2、重新获取数据重置mv的内容
		mv.reset(mv.getData());
		// 3、把mv的内容添加到容器
		mv.appendTo(mvList);

	  }
	}
  }
};

function clearChild(parent) {
  while (parent !== null && parent.hasChildNodes()) {
	parent.removeChild(parent.firstChild);
  }
}



