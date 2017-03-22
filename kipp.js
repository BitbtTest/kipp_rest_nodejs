var express = require('express') //加载模块  
var app = express()//实例化之  
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var conf=require('./config.json');
var toTars=require('./lib/status.js');
var res_head={'Content-Type':'text/json','Encodeing':'utf8'};
var kipp_status={

	"online":"online",
	"ready":"ready",
	"running":"running",
	"error":"error",
	"offline":"offline"

}
var kipp_body={
    "name":conf.body.name,
    "type":conf.body.type,
    "status":kipp_status.online,
    "timestamp":"",
    "ip":conf.host.ip,
    "port":conf.host.port,
    "sid":conf.body.sid
};

var restserver=require('./lib/restserver.js');


/**
 *  log configure
 **/
var logger = require('./lib/log.js').logger();

var domain=require('domain');

var async = require('async');



//引入一个domain的中间件，将每一个请求都包裹在一个独立的domain中
//domain来处理异常
app.use(function (req,res, next) {
  var d = domain.create();
  //监听domain的错误事件
  d.on('error', function (err) {

    logger.error("KIPP ERROR KIPP ERROR KIPP ERROR KIPP ERROR ");
    logger.error(err);

    res.statusCode = 500;
    res.json({sucess:false, messag: "KIPP Server Error!"});
    d.dispose();
  });
  
  d.add(req);
  d.add(res);
  d.run(next);
});

// /**
//  *  catch unknow exection
//  *
//  **/
// process.on('uncaughtException', function (err) {
//   //打印出错误
//   logger.error(err);
//   //打印出错误的调用栈方便调试
//   logger.error(err.stack);
// });
/**
 * Configuration
 */
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/**
 *  say hello to tars
 */
// function start(){

//     logger.debug("send message to tars!");
    
//     toTars.hello(kipp_body,function (err,body){

//     	logger.info("receive message: ")
//     	logger.info(body);
//     	if(err) logger.error("kipp connect tars error!");
//         try{
//     	if(body.result=="success"){
//     		kipp_body.timestamp=body.timestamp;
//     		logger.info("kipp timestamp change "+kipp_body.timestamp);
//     		toTars.add(kipp_body,function(err,body){

//                 if(err){
//                     logger.error("add kipp error: "+err.message);
//                 }else{

//                     logger.info("add kipp to tars！begin")
//                     if(body.result=="success"){

//                         kipp_body.timestamp=body.timestamp;
//                         kipp_body.status=kipp_status.online; 
//                         logger.info("kipp ready to work! "+kipp_body.timestamp);
//                      }else{
//                          toTars.update(kipp_body,function(err,body){

//                             logger.info("add kipp to tars！")
//                             if(body.result=="success"){
//                             kipp_body.timestamp=body.timestamp;
//                             kipp_body.status=kipp_status.ready; 
//                             logger.info("kipp ready to work! "+kipp_body.timestamp);
//                             }
//                         });
//                     }

//                 }
    			
    	 
//     		});
//     	}}catch(e){
//         logger.error(e.message);
//         }

//     });    
// }

function start(){

    logger.debug("send message to tars!");


    async.waterfall([

        function(cb){
            try{
              //注册会话
             toTars.hello(kipp_body,function (err,body){

                logger.info("receive message: ")
                logger.info(body);
                if(err) logger.error("kipp connect tars error!");   
                cb(err,body);
                 });
            }catch(e){
                logger.error(e.message);
            }  

        },
        function(body,cb){
            try{
                 // 新增kipp
                if(body.result=="success"){
                kipp_body.timestamp=body.timestamp;
                logger.info("kipp timestamp change "+kipp_body.timestamp);
                toTars.add(kipp_body,function(err,body){

                    if(err){
                        logger.error("add kipp error: "+err.message);
                    }else{

                        cb(err,body);
                    }
                });

               }else{

               }
            }catch(e){
                logger.error(e.message);
            }
        },
        function(body,cb){
            //如果新增失败，再更新一次
            try{

                if(body.result=="success"){

                            kipp_body.timestamp=body.timestamp;
                            kipp_body.status=kipp_status.online; 
                            logger.info("kipp ready to work! "+kipp_body.timestamp);
                         }else{
                            logger.info("will update kipp to tars! and ready to work! "+kipp_body.timestamp);
                             toTars.update(kipp_body,function(err,body){

                                logger.info("update kipp to tars！")
                                if(body.result=="success"){
                                kipp_body.timestamp=body.timestamp;
                                kipp_body.status=kipp_status.ready; 
                                logger.info("kipp ready to work! "+kipp_body.timestamp);
                                }
                            });
                        }
            }catch(e){
            logger.error(e.message);
            }
        }

    ],function(err,result){

                });
}
start();


/**
 * Routes index
 */
 app.post('/task', function(req, res){ //Restful Post method  
    
    //update timestamp;
    logger.info("receive message:");
    logger.info(req.body);
    logger.info("begin working!");

    restserver.rest(req.body,function(err,data){

        logger.info("receive message:",data);
        res.set(res_head);
        res.send(data); //id 一般由数据库产生  

        });
   
});

app.get('/isReady',function(req,res){

	logger.info("isReady")
	if(kipp_body.status==kipp_status.ready){

		return {"result":true}

	}else{
		return {"result":false}
	}

});
/**
 * Connect to the database.
 */

app.listen(conf.host.port); //监听8888端口，没办法，总不好抢了tomcat的8080吧！ 
