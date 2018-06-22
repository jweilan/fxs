!function(){
  var root = this;
   
  var ArrayProto = Array.prototype;
  var push       =ArrayProto.push,
      slice      =ArrayProto.slice;

// 构造函数
  var jwei=function(obj){
  	if(obj instanceof jwei) return obj;
  	if(!(this instanceof jwei)) return new jwei(obj);
  	this.warps=obj;
  }
// 全局曝光
   root.jwei=jwei;

/*操作集合的方法*/
      // 遍历数组
	  jwei.each=function(obj,iteratee,context){
	      if(obj == null) return obj;
	      var i,length=obj.length;
	      if(length === +length){
	      	for(i=0;i<length;i++){
	      		iteratee(obj[i],i,obj);
	      	}
	      }else{
	      	var keys=jwei.keys(obj);
	      	for(i=0,length=keys.length;i<length;i++){
	      		iteratee(obj[keys[i]],keys[i],obj);
	      	}
	      }
	      return obj;
	  }
	  // map
	  jwei.map=function(obj,iteratee,context){
		  	if(obj == null) return [];
		  	 var keys = obj.length!==+obj.length&&jwei.keys(obj),
		  	     length = (keys||obj).length,
		  	     results=Array(length),
		  	     currentKey;
		     for(var i=0;i<length;i++){
		     	currentKey = keys ? keys[i]:i;
		     	results[i] = iteratee(obj[currentKey],currentKey,obj);
		     }
		     return results;
		  };
	  // reduce
	  jwei.reduce=function(obj,iteratee,memo,context){
	        if(obj == null) obj =[];
	         var keys = obj.length !== +obj.length && jwei.keys(obj),
		        length = (keys || obj).length,
		        index = 0, currentKey;
		     if (arguments.length < 3) {
		      memo = obj[keys ? keys[index++] : index++];
		     }
		    for (; index < length; index++) {
		      currentKey = keys ? keys[index] : index;
		      memo = iteratee(memo, obj[currentKey], currentKey, obj);
		     }
		    return memo;
	  }
/*操作数组的方法*/
	// 判断数组中是否含有该元素
	    jwei.arrHas=function(arr,element){
	        // 判断传进来的对象
	    	for(var i in arr){
	    		if(arr[i]==element){
	    			return true;
	    		}
	    	}
	    	return false;
	     }
	    // 随机一个不重复的数组
	    jwei.RandomArr=function(min,max,number){
	    	var result=[];
	    	// 判断范围是否合理
	    	if((max-min+1)<number){
	    		alert('不合理');
	    		return;
	    	}
	    	while(result.length<number){
	    		var n=jwei.Random(min,max);
	    		if(!jwei.arrHas(result,n)){
	              result.push(n);
	    		}
	    	}
	    	return result;
	     } 
	    jwei.bubbleSort=function(arr,arg){
        var len=arr.length,j;
        var f=arg?true:false;
        var temp;
        if(f){
	        while(len>0){
	            for(j=0;j<len-1;j++){
	                if(arr[j][arg]>arr[j+1][arg]){
	                    temp=arr[j];
	                    arr[j]=arr[j+1];
	                    arr[j+1]=temp;
	                }
	            }
	            len--;
	        }
	        return arr;
        }
        while(len>0){
            for(j=0;j<len-1;j++){
            	
                if(arr[j]>arr[j+1]){
                    temp=arr[j];
                    arr[j]=arr[j+1];
                    arr[j+1]=temp;
                }
            }
            len--;
        }
        return arr;
    }    

	     
	     
/*操作函数的方法*/
	// 判断是否为函数
		jwei.isFunction=function(obj){
			return typeof obj == 'function' || false;
		}
/*操作对象的方法*/
	  // 获取对象的属性名(不包含原型链上的属性)
	  jwei.keys=function(obj){
	       var keys=[];
	       for(var key in obj) if(jwei.has(obj,key)) keys.push(key);
	       return keys;
	  }
	  //判断对象是否包含指定的属性名
	  jwei.has = function(obj,key){
	  	return obj !=null && hasOwnProperty.call(obj,key);
	  }
	  // 获取对象属性名
	  jwei.functions=function(obj){
		   var names=[];
		   for(var key in obj){
		   	 if(jwei.isFunction(obj[key]))names.push(key);
		   }
		   return names.sort();
		 }
	  // 获取函数名
	  jwei.functions=function(obj){

	  }
/*链式实现*/	  
	//添加一个链功能，开始链接包裹强调对象
	jwei.chain = function(obj){
		var instance = jwei(obj);
		instance.jweichain=true;
		return instance;
	}
	 // 
	 var result = function(instance,obj){
	 	return instance.jweichain?jwei(obj).chain():obj;
	 }
	  //添加到函数的原型链上
	 jwei.mixin = function(obj){
	  	 jwei.each(jwei.functions(obj),function(name){
	  	 	var func = jwei[name]=obj[name];
	  	 	jwei.prototype[name]=function(){
	  	 		var args = [this.warps];
	  	 		push.apply(args,arguments);
	  	 		return result(this,func.apply(jwei,args));
	  	 	}
	  	 })
	  } 
/*实用工具*/ 
	    // 获得一个范围随机数
	    jwei.Random = function(min, max) {
	  	    max>=min?max:max=min;
		    if (max == null) {
		      max = min;
		      min = 0;
		    }
		    return min + Math.floor(Math.random() * (max - min + 1));
		  };
		  // 多维数组深层拷贝
        jwei.deepcopy=function(obj){
             var out = [],i = 0,len = obj.length;
		    for (; i < len; i++) {
			if (obj[i] instanceof Array){
			    out[i] = deepcopy(obj[i]);
			}
			else out[i] = obj[i];
		    }
		    return out;
        }
     //获取当前地址：返回所有参数的对象   
     jwei.args=function(){
					var result={};
					var urlinfo=window.location.href, //获取当前页面的url 
					    len=urlinfo.length,//获取url的长度 
					    offset=urlinfo.indexOf("?"),//设置参数字符串开始的位置
					    newsidinfo=urlinfo.substr(offset+1,len),//取出参数字符串 这里会获得类似“id=1”这样的字符串 
					    newsids=newsidinfo.split(/=|&/);//对获得的参数字符串按照“=”或者"&"进行分割 
					for(var i=0;i<newsids.length;i++){
						if(i%2==0){
							result[newsids[i]]=newsids[i+1];
						}
					}
					return result;	
				}
     //时间差：天数
     jwei.DateDiff= function(dateArr,type){    //sDate1和sDate2是2006-12-18格式 :两个参数就是第一个日期到第二个日期相隔天数，一个日期就是今天到指定日期相隔天数
			   var sDate1=dateArr[0],sDate2=dateArr[1];
			   var  aDate,oDate1,oDate2,iDays;
			    aDate  =  sDate1.split(/\.|\/|-/g);
			    oDate1  =  new  Date(aDate[1]  +  '/'  +  aDate[2]  +  '/'  +  aDate[0]);   //转换为12-18-2006格式 
			    
			   //今天到指定日期的相隔天数
			   if(sDate2){
			       aDate  =  sDate2.split(/\.|\/|-/g)  
			       oDate2  =  new  Date(aDate[1]  +  '/'  +  aDate[2]  +  '/'  +  aDate[0]);
			       if(type&&oDate1>oDate2)return 0;
			   }else{
				   aDate =new Date().toLocaleDateString().split(/\.|\/|-/g);
				   oDate2=new Date(aDate[1]+'/'+aDate[2]+'/'+aDate[0]);
				   if(type&&oDate1<oDate2)return 0;
			   }
			   iDays  =  parseInt(Math.abs(oDate1-oDate2)/1000/60/60/24)    //把相差的毫秒数转换为天数 
			   return  iDays+1
		}
			//毫秒转化成日期：毫秒数
	    jwei.DateDiffBack=function(time,type){
		   	var unixTimestamp = new Date(time),
		   		hor=this.getTenNum(unixTimestamp.getHours()),
		   		min=this.getTenNum(unixTimestamp.getMinutes()),
		   		mon=this.getTenNum(unixTimestamp.getMonth()+1),
		   		day=this.getTenNum(unixTimestamp.getDate());
			    switch(type){
			    	case 1:
			    	   return {m:mon+"/"+day,h:hor+":"+min};
			    	case 2:
			    	   break;
			      	default:
				       var commonTime = unixTimestamp.toLocaleString();
					  return commonTime;
				}
		}
		jwei.getTenNum=function(num){
			return num>=10?num:"0"+num;
		}
		jwei.day=function(){
	      //构造当前日期对象
	      var date = new Date();
	      //获取年份
	      var year = date.getFullYear();
	      //获取当前月份
	      var mouth = date.getMonth() + 1;
	      //定义当月的天数；
	      var days ;
	      //当月份为二月时，根据闰年还是非闰年判断天数
	      if(mouth == 2){
	              days= year % 4 == 0 ? 29 : 28;
	          }
	          else if(mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12){
	              //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
	              days= 31;
	          }
	          else{
	              //其他月份，天数为：30.
	              days= 30;
	          }
	          //输出天数
	       return {d:days,m:mouth};
	     }
        
	    // 随机颜色
	    jwei.Rcol=function(min,max,option){
	    	min==undefined?min=0:min;
	    	max==undefined?max=255:max;
	    	option==undefined?option=1:option;
	    	if(max<min){
	           max=min;
	    	}
	    	return 'rgba('+jwei.Random(min,max)+','
	    		          +jwei.Random(min,max)+','
	    		          +jwei.Random(min,max)+','
	    		          +option+')';
	     }
	    
			//原价、折后价、true(返回不带百分号的数值)，false(返回字符串百分比)；
			jwei.baifenbi=function(num1,num2,flag){
				if(flag){
					return Math.round((num2/num1)*100);
				}else{
					return Math.round((num2/num1)*100)+'%';
				}
			}
	    
	    
	    // 获得一个字符串里的某某符号前面跟后面的字符
		jwei.stringqh=function (string,gz,qh){  //字符串  //字符  //前true后false
		    var qresult='',hresult='';
		    if(qh){
		      for(var i=0;i<string.length;i++){
		        if(string[i]==gz){
		          return qresult;
		        }else{
		          qresult+=string[i];
		        }
		     }
		   }else{
		     for(var i=0;i<string.length;i++){
		      if(string[i]==gz){
		        for(var k=i+1;k<string.length;k++){
		          hresult+=string[k];
		        }
		        return hresult;
		      }
		     }
		   }
		 }
	    //阻止事件冒泡函数
	    jwei.stopBubble=function(e){
	  	 if (e && e.stopPropagation)
		        e.stopPropagation()
		    else
		        window.event.cancelBubble=true
	      }
      //关闭浏览器
       jwei.CloseWebPage=function(){
				 if (navigator.userAgent.indexOf("MSIE") > 0) {
				  if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
				   window.opener = null;
				   window.close();
				  } else {
				   window.open('', '_top');
				   window.top.close();
				  }
				 }
				 else if (navigator.userAgent.indexOf("Firefox") > 0) {
				  window.location.href = 'about:blank ';
				 } else {
				  window.opener = null;
				  window.open('', '_self', '');
				  window.close();
				 }
				}
       //获得屏幕可视区域大小
       jwei.getWh=function(){
            var w= window.outerWidth||document.documentElement.clientWidth||document.body.clientWidth;
			      var h=window.outerHeight||document.documentElement.clientHeight||document.body.clientHeight;
			    return {w:w,h:h}
		       }
       //检测是否支持touchstart
        jwei.hasTouch=function(){
	        var touchObj={};
	        touchObj.isSupportTouch = "ontouchend" in document ? true : false;
	        touchObj.isEvent=touchObj.isSupportTouch?'touchstart':'click';
	        return 'click';
        }
	    // 实现tab切换
       jwei.tabJeep=function(arrTab,arrBox,tabCls,tabClsFinally){
          jwei.each(arrTab,function(obj,i){
          	// 兼容ie6、7、8
              if(typeof addEventListener=='function' ){
                   obj.addEventListener(jwei.hasTouch(),function(){
	                  for(var a=0;a<arrBox.length;a++){
	                        arrBox[a].style.display='none';
	                        tabCls(arrTab,a);
	                  }
	                  arrBox[i].style.display='block';
	                  tabClsFinally(this);
	          	      });
              }else{
              	  obj.attachEvent("on"+jwei.hasTouch(),function(){
	                  for(var a=0;a<arrBox.length;a++){
	                        arrBox[a].style.display='none';
	                        tabCls(arrTab,a);
	                  }
	                  arrBox[i].style.display='block';
	                  tabClsFinally(arrTab[i]);
	          	      });
              }
          });
        }
 jwei.mixin(jwei);
 jwei.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    jwei.prototype[name] = function() {
      var obj = this.warps;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
     };
  });
  // 取值
  jwei.prototype.value=function(){
  	return this.warps;
  }
}();


