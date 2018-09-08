$(function () {
	var mainCtr={
		args:jwei.args(),
		ChangeUrl:"/web/api/franchiser_diamond",//转移钻石接口;target为转移目标diamond为钻石数量
		searchUrl:"/web/api/franchiser_diamond_log",//搜索转移记录start：开始时间戳end：结束时间戳search：搜索目标
		baseUrl:true?'http://franchiser.pokerclubph.com':'http://192.168.1.137:8280',
		diamond:0,
		accountArr:[],//历史账号记录
		propArr:["Golden Card","Platinum Card","Diamond Card","Diamond","Emoji","Time Blank"],
		propImgArr:["card2.png","card3.png","card4.png","diamond01.png","emoji06.png","addtime.png"],
		propNum:[0,0,0,0,0,0],//道具数量
		currPropType:4,//当前选择的道具：默认4钻石
		loadImg:["prop/card2.png","prop/card3.png","prop/card4.png","prop/diamond01.png","prop/emoji06.png","prop/addtime.png","checkbutton.png","touxiangkuang.png","xinxidk.png"],
	}
	var TIPS={
		PROP_NUM_NOT_ENOUGH:"The amount of item entered exceeds your balance",//输入的数量超过自己拥有的：道具数量不足
		ENTER_NUM_NOLL:"Please enter the amount of item to be transferred",//未输入转账数量提示：请输入发送数量
		ENTER_ID_NOLL:"Please enter the recipient User ID",//未输入id转账提示：请输入id
		FAILED_TO_VERIFY:"Failed to verify, please try again or contact customer service",//参数验证错误
		NETWORK_ERROR:"Network Error, please try again later.",//网络错误
		DATE_RANGE_ERROR:" Please select the correct date range",//结束时间小于开始时间错误提示
		ID_INCORRECT:"User ID is incorrect, please  try again",//id不正确，请重新输入
		POWER_NOT_ENOUGH:"You cannot transfer to target user.",//权限不足
	}
	var dfArgs = 'account=' + mainCtr.args.account + "&channel=" + mainCtr.args.channel + '&time=' + mainCtr.args.time + '&checksum=' + mainCtr.args.checksum;
	var plugin={
		n:0,
		loadimg:function(){
			this.loadingTarget(true);
			for(var i=0;i<mainCtr.loadImg.length;i++){
				var m=new Image()
					m.onload=function(){
						plugin.n++;
						if(plugin.n==mainCtr.loadImg.length-1)plugin.loadingTarget(false);
					}
					m.onerror=function(){
						plugin.n++;
						if(plugin.n==mainCtr.loadImg.length-1)plugin.loadingTarget(false);
					}
					m.src="img/"+mainCtr.loadImg[i];
			}
		},
		loadingTarget:function(flag){//loading框
			var str='<div class="loading colorW_textC dn"> <div> loading <span class="dotting"></span> </div> </div>';
			if($(".loading").length==0){
				$("body").append(str);
			}
			flag?$('.loading').show():$('.loading').hide();
		},
		tips:function(str){//提示
			$("#tipsContent").html(str);
			$("#tipsBoxs").show();
		},
		getPropName:function(){//得到道具名字
			return mainCtr.propArr[mainCtr.currPropType-1];
		},
		getPropImgPath:function(name){
			for(var i=0;i<mainCtr.propArr.length;i++){
				if(name==mainCtr.propArr[i]){
					return mainCtr.propImgArr[i];
				}
			}
		},
		setPropNumUI:function(propType,num){//道具数据与ui更新
			if(mainCtr.propNum[0]==-1)return;//盟主则返回
			if(propType&&num)mainCtr.propNum[propType-1]-=num;//转账则设置
			// 更新ui
			var s=$("#shopList li");
			for(var i=0;i<s.length;i++){
				$(s[i]).find(".remain").html(mainCtr.propNum[$(s[i]).attr("data-type")-1]);
			}
		},
		updateDiamondTem:function(){//更新自己的钻石
			$('.diamondNum .num').html(mainCtr.diamond);
		},
		OtherEvent:function(){
			$(".successBox").on("click",function(){$(this).hide()});
			//历史用户
			$("#historyBtn").on("click",function(){$("#contacts").show();})
			$("#contacts").on("click",function(){ $("#contacts").hide(); })
			// 根据时间得到历史记录
			$("#check").on("click",function(){ getDateList(); })
			// 根据时间和关键词得到历史记录
			$("#checkVague").on("click",function(){ getDateList($("#checkVagueValue").val()); })
			// 子页面之间返回按钮
			$(".Backpage1").on("click",function(){
				$(".page1_user").show();
				$(".page3_recharge").hide();
				$(".page2_expends").hide();
				plugin.loadingTarget(false);
			})
			//选择商品
			$("#shopList li").on('click',function(){
				$("#shopList li").removeClass("spactive");
				$(this).attr({"class":"spactive"});
				mainCtr.currPropType=$(this).attr("data-type");
				$("#shopicon").attr({"src":$(this).find("img").attr("src")});

			})
		}
	}
	plugin.OtherEvent();
	bindTouchEvent($("#tpage2"),function(ele){$(ele).addClass('pubtnactive'); },
		function(ele){$(ele).removeClass('pubtnactive'); },
		function(ele){
			$(".page1_user").hide();
			$(".page3_recharge").show();
	});
	bindTouchEvent($("#tpage3"),function(ele){$(ele).addClass('pubtnactive'); },function(ele){$(ele).removeClass('pubtnactive'); },function(ele){$(".page1_user").hide(); $(".page2_expends").show(); });
	//转账
	bindTouchEvent($("#dSure"),function(ele){
		$(ele).addClass('active');
	},function(ele){
		$(ele).removeClass('active')
	},function(ele){
		transferAccounts($("#userid").val().trim(),$("#diamonds").val().trim(),$("#shopList .spactive").attr("data-type"),function(){
			$(".transferAccounts").hide();
		});
		$(".transferAccounts").hide();
	})
	//关闭按钮
	bindTouchEvent($(".close"),function(ele){
		$(ele).addClass('active');
	},function(ele){
		$(ele).removeClass('active')
	},function(ele){
		$(".fullP").hide();
	})
	
	// 触摸事件
	function bindTouchEvent(ele,call,call2,call3){
		var isSupportTouch = "ontouchend" in document ? true : false;
		var touchs=isSupportTouch?'touchstart':'mousedown',
		    touche=isSupportTouch?'touchend':'mouseup',
		    touchm=isSupportTouch?'touchmove':'mousemove';
		$(ele).on(touchs,function(e){
			if(e.target.nodeName!='A'){
				// e.preventDefault();//决解安卓端bug
			}
			e.preventDefault();//决解安卓端bug
			call(this);
		})
		$(ele).on(touche,function(e){
			e.preventDefault();//决解安卓端bug
			call2(this);
			call3(this);

		})
		$(ele).on(touchm,function(e){
			e.preventDefault();//决解安卓端bug
			call2(this);
		})
	}
	// 转账历史记录
	function templates(data,flag){
		var lists=eval(data.data),
			temp="";
			lists.reverse();
		if(flag){
			mainCtr.accountArr=[];//初始化
			for(var i=0;i<lists.length;i++){
				var Alist=lists[i],times=jwei.DateDiffBack(Alist.time*1000,1);
				if(mainCtr.accountArr.indexOf(Alist.target)==-1){
					var str='<li><div class="h_userinfo pubMiddle"> <div class="h_avatar"><img src="'+
						Alist.avatar+'"></div> <ul> <li class="h_name">'+Alist.name+'</li> <li class="h_id">ID <span class="account">'+
						Alist.target+'</span></li></ul></div></li>'
					temp+=str;
					mainCtr.accountArr.push(Alist.target);
				}
			}
			if(lists.length==0){
				var str="<li class='nohistory'>No History</li>";
				temp+=str;
			}
			$("#contactsBox>ul").html(temp);
			// 选择某个用户
			$("#contactsBox>ul>li").on("click",function(){
				var account=$(this).find('.account').html();
				$("#userid").val(account);
				$("#contacts").hide();
				checkId(account);
			})
		}else{
			for(var i=0;i<lists.length;i++){
				var Alist=lists[i],times=jwei.DateDiffBack(Alist.time*1000,1);
				var str='<li> <div class="h_time pubMiddle"> <p>'+
						times.m+'</p><p>'+times.h+'</p></div> <div class="h_userinfo pubMiddle"> <div class="h_avatar"><img src="'+
						Alist.avatar+'"></div> <ul> <li class="h_name">'+Alist.name+'</li> <li class="h_id">ID '+
						Alist.target+'</li></ul></div><div class="h_diamonds pubMiddle"><img src="img/prop/'+plugin.getPropImgPath(Alist.item_name)+'"><span class="num">'+Alist.count+'</span> </div> </li>'
				temp+=str;
			}
			if(lists.length==0){
				var str="<li class='nohistory'>No History</li>";
				temp+=str;
			}
			$("#historyBox").html(temp);
		}
	}
	//验证当前选择的时间
	function currTime(){
		var e=new Date($("#end_date").val()).getTime(),
			s=new Date($("#start_date").val()).getTime();
		if(e<s){
			return false;
		}else{
			return {"start":~~(s/1000),"end":~~(e/1000)+86400};
		}
	}
	// 查找用户id
	function checkId(id){
		plugin.loadingTarget(true);
		$.ajax({
			type:"GET",
			url:mainCtr.baseUrl+"/web/api/account_info?id="+id,
			dataType:'jsonp',
			jsonp: 'callback',
			success:function(data){
				if(!data.avatar&&!data.name){
					plugin.tips(TIPS.ID_INCORRECT);// new
					$("#userid").val("");
					plugin.loadingTarget(false);
					return;
				}
				$("#c_avatar").attr({'src':data.avatar});
				$("#c_name").html(data.name);
				$(".usernameShow").show();
				plugin.loadingTarget(false);
			},
			error:function(err){
				plugin.loadingTarget(false);
				plugin.tips(TIPS.NETWORK_ERROR);//new
			}
		})
	}
	//得到历史转账的account
	function getHistoryAccount(){
		var t=new Date().getTime();
		var ts=~~(t/1000)+86400;
			urls=mainCtr.baseUrl+"/web/api/union_item_send_log?"+dfArgs+"&start=1514736000&end="+ts;
		plugin.loadingTarget(true);
		$.ajax({
			type:"GET",
			url:urls,
			dataType:'jsonp',
			jsonp: 'callback',
			success:function(data){
				switch(data.code){
					case 0:
						templates(data,true);
						break;
					case 1:
						plugin.tips(TIPS.FAILED_TO_VERIFY);//new 
						break;
				}
				plugin.loadingTarget(false);
			},
			error:function(){
				plugin.loadingTarget(false);
				plugin.tips(TIPS.NETWORK_ERROR);//new
			}
		})
	}
	//时间查转账记录
	function getDateList(searchName){
		var t=currTime(),
			urls=mainCtr.baseUrl+"/web/api/union_item_send_log?"+dfArgs+"&start="+t.start+"&end="+t.end;
			if(searchName){urls+="&search="+searchName}
		if(!t){
			plugin.tips(TIPS.DATE_RANGE_ERROR);//new 
			return
		}
		plugin.loadingTarget(true);
		$.ajax({
			type:"GET",
			url:urls,
			dataType:'jsonp',
			jsonp: 'callback',
			success:function(data){
				switch(data.code){
					case 0:
						templates(data);
						break;
					case 1:
						plugin.tips(TIPS.FAILED_TO_VERIFY);//new 
						break;
				}
				plugin.loadingTarget(false);
			}
		})
	}

	//转账道具
	function transferAccounts(id,propNum,propType,calls){
		plugin.loadingTarget(true);
		$.ajax({
			type:"GET",
			url:mainCtr.baseUrl+"/web/api/union_item_send?"+dfArgs+"&target="+id+"&item="+propType+"&count="+propNum,
			dataType:'jsonp',
			jsonp: 'callback',
			success:function(data){
				switch(data.code){
					case 0:
						$(".successBox").show();
						mainCtr.diamond-=propNum;
						// plugin.updateDiamondTem();
						plugin.setPropNumUI(propType,propNum);
						if(mainCtr.accountArr.indexOf(+id)==-1){//不是历史用户不用遍历
							getHistoryAccount();
						}
						break;
					case -1:
						plugin.tips(TIPS.NETWORK_ERROR);//new
						break;
					case 1:
						plugin.tips(TIPS.FAILED_TO_VERIFY);//new
						break;
					case 5://账号不存在
						plugin.tips(TIPS.ID_INCORRECT);//new
						break;
					case 6:
						plugin.tips(TIPS.PROP_NUM_NOT_ENOUGH);//new
						break;
					case 7:
						plugin.tips(TIPS.POWER_NOT_ENOUGH);//new
						break;
				}
				plugin.loadingTarget(false);
				calls();
			},
			error:function(err){
				plugin.loadingTarget(false);
				calls();
				plugin.tips(TIPS.NETWORK_ERROR);//new
			}
		})
	}
	// 得到道具数量
	function getPropNum(){
		// web/api/union_item_count?
		$.ajax({
			type:"GET",
			url:mainCtr.baseUrl+"/web/api/union_item_count?"+dfArgs,
			dataType:'jsonp',
			jsonp: 'callback',
			success:function(data){
				mainCtr.propNum=data;
				plugin.setPropNumUI();
			},
		})
	}
	// 输入用户id
	$('#userid').bind('input propertychange', function() {  
	    switch($(this).val().length){
	    	case 6:
	    		checkId($(this).val());
	    		break;
	    	case 8:
	    		checkId($(this).val());
	    		break;
	    	default:
	    		$(".usernameShow").hide();
	    		break;
	    }
	});
	//确定转账
	$("#confirm").on("click",function(){
		var diamondinp=$("#diamonds").val().trim(),
			userid=$("#userid").val().trim(),
			cName=$("#c_name").html();
		// 检查id
		if(!userid||userid.length!=6){
			plugin.tips(TIPS.ENTER_ID_NOLL);//new
			return;
		}
		//检查发送数是否为空
		if(!diamondinp){
			// new
			plugin.tips(TIPS.ENTER_NUM_NOLL);
			return;
		}
		//检查输入的转账道具数是否小于自身账户余额
		if(+diamondinp>mainCtr.propNum[mainCtr.currPropType-1]&&mainCtr.propNum[mainCtr.currPropType-1]!=-1){
			// new
			plugin.tips(TIPS.PROP_NUM_NOT_ENOUGH);
			return;
		}
		//
		if(userid!=""&&diamondinp!=""){
			//new
			$(".accountTips").html("Are you sure you want to transfer "+diamondinp+" "+plugin.getPropName()+"  to "+cName+"("+userid+")?");
			$(".transferAccounts").show();
		}
	});
	plugin.loadimg();
	//得到转账历史账号
	getHistoryAccount();
	getPropNum();
	if(mainCtr.args.account){//未带参数不初始化
		//初始化信息
		$.ajax({
			type:"GET",
			url:mainCtr.baseUrl+"/web/api/account_info?id="+mainCtr.args.account,
			dataType:'jsonp',
			jsonp: 'callback',
			success:function(data){
				mainCtr.diamond=mainCtr.args.diamond;
				$('.myavatar').attr({"src":data.avatar?data.avatar:"img/mrtx.png"});
				$('.username').html(data.name);
				$('.gameid').html(mainCtr.args.account);
				// plugin.updateDiamondTem();
				
			}
		});
	}
	function fs(){
		doc = document;
		function setFontSize() {
		　　var winWidth =window.outerWidth||document.documentElement.clientWidth||document.body.clientWidth||320;
		　　//640这个数字是根据你的设计图的实际大小来的，所以值具体根据设计图的大小
		　　var size = (winWidth / 640) * 34;
		　　doc.documentElement.style.fontSize = (size < 34 ? size : 34) + 'px';
		};
	  //这里我们给个定时器来实现页面加载完毕再进行字体设置
		setTimeout(function() {
		　　//初始化
		　　setFontSize();
		}, 100);
	}
	fs();
});