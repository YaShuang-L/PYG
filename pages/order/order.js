import {request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data: {
	tabs:[
		{
			id:0,
			value:"全部",
			isActive:true
		},
		{
			id:1,
			value:"待付款",
			isActive:false
		},
		{
			id:2,
			value:"待发货",
			isActive:false
		},
		{
			id:3,
			value:"退款/退货",
			isActive:false
		}
	]
  },
  onShow(options){
	  // console.log(options);
	const token=wx.getStorageSync("token");
	// if(!token){
	// 	wx.navigateTo({url:"/pages/auth/auth"});
	// 	return;
	// }
	let pages=getCurrentPages();
	let currentPages=pages[pages.length-1];
	console.log( currentPages.options);
	const {type}=currentPages.options;
	this.getOrders(type);
  },
  async getOrders(type){
	const res=await request({url:"/my/orders/all",data:{type}});
	console.log(res);
  },
  handelTabsItemChange(e){
  	// console.log(e);
  	const {index}=e.detail;
  	let {tabs}=this.data;
  	tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
  	this.setData({
  		tabs
  	})
  }
})