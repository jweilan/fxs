$(function () {
	var mainCtr={
		args:jwei.args(),
		ChangeUrl:"/web/api/franchiser_diamond",//转移钻石接口;target为转移目标diamond为钻石数量
		searchUrl:"/web/api/franchiser_diamond_log",//搜索转移记录start：开始时间戳end：结束时间戳search：搜索目标
		baseUrl:false?'http://franchiser.pokerclubph.com':'http://192.168.1.137:8280',
		diamond:0,
		accountArr:[],
	}
	var dfArgs = 'account=' + mainCtr.args.account + "&channel=" + mainCtr.args.channel + '&time=' + mainCtr.args.time + '&checksum=' + mainCtr.args.checksum;
	var plugin={
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
						Alist.target+'</li></ul></div><div class="h_diamonds pubMiddle"><img src="img/zuanshi.png"><span class="num">'+Alist.diamond+'</span> </div> </li>'
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
					plugin.tips("User ID is incorrect, please  try again");// new
					$("#userid").val("");
					plugin.loadingTarget(false);
					return;
				}
				$("#c_avatar").attr({'src':data.avatar});
				$("#c_name").html(data.name);
				$(".usernameShow").show();
				plugin.loadingTarget(false);
			},
		})
	}
	//得到历史转账的account
	function getHistoryAccount(){
		var t=new Date().getTime();
		var ts=~~(t/1000)+86400;
			urls=mainCtr.baseUrl+"/web/api/franchiser_diamond_log?"+dfArgs+"&start=1514736000&end="+ts;
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
						plugin.tips("Failed to verify, please try again or contact customer service");//new 
						break;
				}
				plugin.loadingTarget(false);
			},
			error:function(){
				plugin.loadingTarget(false);
				plugin.tips("Network Error, please try again later.1");//new
			}
		})
	}
	//时间查转账记录
	function getDateList(searchName){
		var t=currTime(),
			urls=mainCtr.baseUrl+"/web/api/franchiser_diamond_log?"+dfArgs+"&start="+t.start+"&end="+t.end;
			if(searchName){urls+="&search="+searchName}
		if(!t){
			plugin.tips(" Please select the correct date range");//new 
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
						plugin.tips("Failed to verify, please try again or contact customer service");//new 
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
						plugin.updateDiamondTem();
						if(mainCtr.accountArr.indexOf(+id)==-1){//不是历史用户不用遍历
							getHistoryAccount();
						}
						break;
					case -1:
						plugin.tips("Network Error, please try again later.");//new
						break;
					case 1:
						plugin.tips("Failed to verify, please try again or contact customer service.");//new
						break;
					case 5://账号不存在
						plugin.tips("User ID is incorrect, please  try again");//new
						break;
					case 6:
						plugin.tips("Insufficient diamond balance.");//new
						break;
					case 7:
						plugin.tips("You cannot transfer to target user.");//new
						break;
				}
				plugin.loadingTarget(false);
				calls();
			},
			error:function(err){
				plugin.loadingTarget(false);
				calls();
				plugin.tips("Network Error, please try again later.2");//new
			}
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
			plugin.tips("Please enter the recipient User ID");//new
			return;
		}
		//检查发送数是否为空
		if(!diamondinp){
			// new
			plugin.tips("Please enter the amount of diamonds to be transferred")
			return;
		}
		//检查收入的转账钻石是否小于自身账户余额
		// if(+diamondinp>+$(".diamondNum .num").html()){
		// 	// new
		// 	plugin.tips("The amount of diamonds entered exceeds your balance");
		// 	return;
		// }
		//
		if(userid!=""&&diamondinp!=""){
			//new
			$(".accountTips").html("Are you sure you want to transfer "+diamondinp+" diamonds to "+cName+"("+userid+")?");
			$(".transferAccounts").show();
		}
	});
	//得到转账历史账号
	// getHistoryAccount();
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
				plugin.updateDiamondTem();
				
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