import {request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {login} from "../../utils/syncWx.js";
 Page({
	async handelGetUserInfo(e){
		// console.log(e);
		//获取用户信息
		try{
			const {encryptedData, rawData, iv, signature}=e.detail;
			//获取小程序登录后的code值
			const {code}=await login();
			console.log(code);
			//const loginParams={encryptedData,rawData,iv,signature,code}
			// 获取token值
			//const {token}=await request({url:"/users/wxlogin",data:loginParams,methods="post"});
			// console.log(res);
			// 4把token存入缓存中同时跳转回上一个页面
			//wx.setStorageSync ("token",token) ; 
			wx.navigateBack({
				delta: 1
			});
		}catch(error){
			//TODO handle the exception
			console.log(error);
		}

		  
		
	}
})