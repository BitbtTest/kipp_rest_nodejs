var conf=require('../config.json');
var http=require('http');  
var querystring=require('querystring');  
var domain=require('domain');
const d = domain.create();

/**
 *  log configure
 **/
var logger = require('./log.js').logger();

/**
 * kipp 调度方法，暴露给tars
 * @param senddata 
 * @returns {}
 */



module.exports.get= function dis(data,callback) {

        const d = domain.create();

        logger.debug("in http_req get!")
 
        var aurl=data.modelinfo.url

        var ahost=data.modelinfo.host

        var aport=data.modelinfo.post
    
        var abody=data.Remotedata.body

        var contents = querystring.stringify(abody); 
    
        var aheads= {'Content-Length':contents.length}

        var head_data=data.Remotedata.head

        for(var dt in head_data){
        aheads[dt]=head_data[dt]
        }   

    var options={
            host:ahost,
            port:aport,
            path:aurl,  
            method:'get',  
            headers:aheads
    };  
  
   logger.debug("http_req options:",options)

   d.run(() => {

        var req=http.request(options,function(res){  
                res.setEncoding('utf-8');  
            res.on('data',function(data){  
        //console.log(data);  
                   callback(null,data);
       
        
            }); 

        
        });  
  
        req.write(contents);  
        req.end(); 
    });
    d.on('error', (er) => {
  // an error occurred somewhere.
  // if we throw it now, it 

//will crash the program
  // with the normal line number and stack message.

   logger.error("Send get http message error!");
   logger.error(er.stack);
   var err_msg={}
   err_msg['msg']=er.message
   //callback(er,err_msg);
      callback(er,er.message);

});

    
   

}

module.exports.post= function dis(data,callback) {


    const p = domain.create();

        logger.debug("in http_req post!")
 
        var aurl=data.modelinfo.url

        var ahost=data.modelinfo.host

        var aport=data.modelinfo.post
    
        var abody=data.Remotedata.body

        var contents = querystring.stringify(abody); 
    
        var aheads= {'Content-Length':contents.length}

        var head_data=data.Remotedata.head

        for(var dt in head_data){
        aheads[dt]=head_data[dt]
        }   

    var options={
            host:ahost,
            port:aport,
            path:aurl,  
            method:'post',  
            headers:aheads
    };  
  
   logger.debug("http_req options:",options)

   p.run(() => {

        var req=http.request(options,function(res){  
                res.setEncoding('utf-8');  
                res.on('data',function(data){  
                callback(null,data);
             
            }); 

        
        });  
  
        req.write(contents);  
        req.end(); 
    });
    p.on('error', (er) => {
  // an error occurred somewhere.
  // if we throw it now, it 

//will crash the program
  // with the normal line number and stack message.

   logger.error("Send post message error!");
   logger.error(er.stack);
   var err_msg={}
   err_msg['msg']=er.message
   //callback(er,err_msg);
      callback(er,er.message);
});
	// client.post('kippstatus/', data, function(err, res, body) {
 //    	// logger.debug(res);
 //    	logger.debug(body);
	// 	fn(err,body);
 //    });

}
/**
 * kipp 调度方法，暴露给tars
 * @param senddata 
 * @returns {}
 */
module.exports.put= function dis(data,fn) {

	client.put('kippstatus/'+data.name, data, function(err, res, body) {
    	// logger.debug(res);
    	logger.debug(body);
		fn(err,body);
    });
}
/**
 * rest 消息发送方法，
 * @param senddata 
 * @returns {}
 */
module.exports.delete= function dis(data,fn) {

    // client.('kippstatus/'+data.name, data, function(err, res, body) {
    //     // logger.debug(res);
    //     logger.debug(body);
    //     fn(err,body);
    // });

}


function hello(data){

	
	
}