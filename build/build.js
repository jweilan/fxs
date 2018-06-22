var express=require('express');
var proxy=require("http-proxy-middleware");
var app=express();

var interfaceBaseUrl="http://spcx.www.gov.cn";

app.use(express.static('dist'));



app.listen(801,function(){
	console.log("启动成功");
})
app.get('/',function(req,res){
	res.sendfile('index.html');
})

const config={
  "development": {
    "id": "master-server-1", "host": "127.0.0.1", "port": 3005
  },
  "production": {
    "id": "master-server-1", "host": "127.0.0.1", "port": 3005
  }
}

//查询id
app.get('/checkId',function(req,res){
	  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
	  var otherObject;
	  if(req.query.id){
	  	otherObject = { username: "jwei",status:200, avatar: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3310749218,625563946&fm=27&gp=0.jpg" };  
	  }else{
	  	otherObject = { tips: "无此id",status:404,};  
	  }
	  var json = JSON.stringify(otherObject); 
	  res.end(json); 
})
//转账
app.get('/transferAccounts',function(req,res){
	  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
	  var otherObject;
	  if(req.query.id){
	  	otherObject = { tips: "Success",status:200,}; 
	  }else{
	  	otherObject = { tips: "无此id",status:404,};  
	  }
	  var json = JSON.stringify(otherObject); 
	  res.end(json); 
})
// 按时间查询
app.get('/checkDate',function(req,res){
	  res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});//设置response编码为utf-8
	  var objlist=[{
	  	name:'jwei',id:100009,avatar:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3310749218,625563946&fm=27&gp=0.jpg',
	  	time:1527666227284,diamonds:1000,
	  },{
	  	name:'jwei1',id:100019,avatar:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3310749218,625563946&fm=27&gp=0.jpg',
	  	time:1527666227284,diamonds:1200,
	  },{
	  	name:'jwei1',id:100019,avatar:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3310749218,625563946&fm=27&gp=0.jpg',
	  	time:1527661222284,diamonds:1300,
	  }]
	  var otherObject={ list:objlist,status:200,}
	  var json = JSON.stringify(otherObject); 
	  res.end(json); 
})
//按id模糊查询
//刚进入界面时初始化的信息
app.get('/myinfo',function(req,res){
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	var otherObject={username:'tony',id:100001,diamonds:10021,avatar:"https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1071899407,1665501066&fm=58&bpow=748&bpoh=1055"}
  	var json = JSON.stringify(otherObject); 
  	res.end(json);
})

app.use("/web",proxy({target:"http://192.168.1.137:8280",changeOrigin:true}));
// app.use("/web",proxy({target:"http://api.server.friendpokerol.com",changeOrigin:true}));

// app.use("/web/api",proxy({target:"http://api.server.friendpokerol.com",changeOrigin:true}));