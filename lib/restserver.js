
var http_req=require('./http_req.js');
var logger = require('./log.js').logger();

/**
 * kipp rest 消息发送
 * @param senddata 
 * @returns {}
 */

module.exports.rest= function dis(data,fn) {

	var model=data.modelinfo.httpmodel ;
	logger.debug("restserver begin :",data);
	logger.debug("restserver model :",model);
	if(model=='GET'){
	
		http_req.get(data,function(err,data){
			logger.debug("restserver in get :",data);

			//if(err) fn(err,null);
			fn(err,data);

		})
	}
	if(model=='POST'){
	
		http_req.post(data,function(err,data){
			logger.debug("restserver in get :",data);

			//if(err) fn(err,null);
			fn(err,data);

		})


	}
}