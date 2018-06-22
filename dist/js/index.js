$(function () {
	var mainCtr={
		args:jwei.args(),
		ChangeUrl:"/web/api/franchiser_diamond",//转移钻石接口;target为转移目标diamond为钻石数量
		searchUrl:"/web/api/franchiser_diamond_log",//搜索转移记录start：开始时间戳end：结束时间戳search：搜索目标
		baseUrl:false?'http://api.server.tpt.3patticlub.net':'http://192.168.1.137:8280',
		diamond:0,
	}
	var dfArgs = 'account=' + mainCtr.args.account + "&channel=" + mainCtr.args.channel + '&time=' + mainCtr.args.time + '&checksum=' + mainCtr.args.checksum;

	bindTouchEvent($("#tpage2"),function(ele){$(ele).addClass('pubtnactive'); },function(ele){$(ele).removeClass('pubtnactive'); },function(ele){$(".page1_user").hide(); $(".page3_recharge").show(); });
	bindTouchEvent($("#tpage3"),function(ele){$(ele).addClass('pubtnactive'); },function(ele){$(ele).removeClass('pubtnactive'); },function(ele){$(".page1_user").hide(); $(".page2_expends").show(); });

	//转账
	bindTouchEvent($("#dSure"),function(ele){
		$(ele).addClass('active');
	},function(ele){
		$(ele).removeClass('active')
	},function(ele){
		transferAccounts($("#userid").val().trim(),$("#diamonds").val().trim(),function(){
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

	// 子页面之间返回按钮
	$(".Backpage1").on("click",function(){
		$(".page1_user").show();
		$(".page3_recharge").hide();
		$(".page2_expends").hide();
		loadingTarget(false);
	})
	$(".successBox").on("click",function(){$(this).hide()});
	
	function bindTouchEvent(ele,call,call2,call3){
		var isSupportTouch = "ontouchend" in document ? true : false;
		var touchs=isSupportTouch?'touchstart':'mousedown',
		    touche=isSupportTouch?'touchend':'mouseup',
		    touchm=isSupportTouch?'touchmove':'mousemove';
		$(ele).on(touchs,function(e){
			if(e.target.nodeName!='A'){
				// e.preventDefault();//决解安卓端bug
			}
			call(this);
		})
		$(ele).on(touche,function(){
			call2(this);
			call3(this);

		})
		$(ele).on(touchm,function(){
			call2(this);
		})
	}
	
	function templates(data){
		var lists=eval(data.data),
			temp="";
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
	$("#check").on("click",function(){
		 getDateList();
	})
	$("#checkVague").on("click",function(){
		 getDateList($("#checkVagueValue").val());
	})

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
		if(!userid||userid.length!=6){
			tips("Please enter the recipient User ID");//new
			return;
		}
		if(!diamondinp){
			// new
			tips("Please enter the amount of diamonds to be transferred")
			return;
		}
		if(+diamondinp>+$(".diamondNum .num").html()){
			// new
			tips("The amount of diamonds entered exceeds your balance");
			return;
		}
		if(userid!=""&&diamondinp!=""){
			//new
			$(".accountTips").html("Are you sure you want to transfer "+diamondinp+" diamonds to "+cName+"("+userid+")?");
			$(".transferAccounts").show();
		}
	});
	// 查找用户id
	function checkId(id){
		loadingTarget(true);
		$.ajax({
			type:"GET",
			url:mainCtr.baseUrl+"/web/api/account_info?id="+id,
			dataType:'jsonp',
			jsonp: 'callback',
			success:function(data){
				if(!data.avatar&&!data.name){
					tips("User ID is incorrect, please  try again");// new
					$("#userid").val("");
					loadingTarget(false);
					return;
				}
				$("#c_avatar").attr({'src':data.avatar});
				$("#c_name").html(data.name);
				$(".usernameShow").show();
				loadingTarget(false);
			},
		})
	}
	//得到历史转账的account
	function getHistoryAccount(){
		
	}
	//时间查转账记录
	function getDateList(searchName){
		var t=currTime(),
			urls=mainCtr.baseUrl+"/web/api/franchiser_diamond_log?"+dfArgs+"&start="+t.start+"&end="+t.end;
			if(searchName){urls+="&search="+searchName}
		if(!t){
			tips(" Please select the correct date range");//new 
			return
		}
		loadingTarget(true);
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
						tips("Failed to verify, please try again or contact customer service");//new 
						break;
				}
				loadingTarget(false);
			}
		})
	}
	//历史用户
	$("#historyBtn").on("click",function(){
		$("#contacts").show();
	})

	//转账钻石
	function transferAccounts(id,diamondNum,calls){
		loadingTarget(true);
		$.ajax({
			type:"GET",
			url:mainCtr.baseUrl+"/web/api/franchiser_diamond?"+dfArgs+"&target="+id+"&diamond="+diamondNum,
			dataType:'jsonp',
			jsonp: 'callback',
			success:function(data){
				switch(data.code){
					case 0:
						$(".successBox").show();
						mainCtr.diamond-=diamondNum;
						updateDiamondTem();
						break;
					case -1:
						tips("Network Error, please try again later.");//new
						break;
					case 1:
						tips("Failed to verify, please try again or contact customer service.");//new
						break;
					case 6:
						tips("Insufficient diamond balance.");//new
						break;
					case 4:
						tips("You cannot transfer to target user.");//new
						break;
				}
				loadingTarget(false);
				calls();
			},
			error:function(err){
				loadingTarget(false);
				calls();
				tips("Network Error, please try again later.");//new
			}
		})
	}
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
				updateDiamondTem();
				
			}
		});
	}
	function loadingTarget(flag){
		var str='<div class="loading colorW_textC dn"> <div> loading <span class="dotting"></span> </div> </div>';
		if($(".loading").length==0){
			$("body").append(str);
		}
		flag?$('.loading').show():$('.loading').hide();
	}
	//更新自己的钻石。。
	function updateDiamondTem(){
		$('.diamondNum .num').html(mainCtr.diamond);
	}
	//提示
	function tips(str){
		$("#tipsContent").html(str);
		$("#tipsBoxs").show();
	}


});