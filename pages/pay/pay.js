// pages/cart/cart.js
import {requestPayment,showToast} from "../../utils/syncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from "../../request/index.js";
Page({
	data:{
		address:{},
		cart:[],
		totalPrice:0,
		totalNum:0
	},
	onShow(){
		const address=wx.getStorageSync("address");
		let cart=wx.getStorageSync("cart")||[];
		// const allChecked=cart.length?cart.every(v=>v.checked):false;
		cart=cart.filter(v=>v.checked);
		this.setData({address});
		let totalNum=0;
		let totalPrice=0;
		cart.forEach(v=>{
			totalPrice+=v.num*v.goods_price;
			totalNum+=v.num;
		})
		this.setData({
			cart,
			totalPrice,
			totalNum,
			address
		})
	},
	// 点击支付
	async handelOrderPay(){
		try{
			//判断缓存中有没有token
			const token =wx.getStorageSync("token");
			if(!token){
				wx.navigateTo({
					url:"/pages/auth/auth"
				});
				return;
			}
			// 3创建订单
			// 3.1准备请求头参数
			const header = {Authorization:token} ;
			// 3.2准备请求体参数
			const order_price = this.data.totalPrice;
			const consignee_addr = this.data.address.a11;
			const cart=this.data.cart;
			let goods=[];
			cart.forEach(v=>goods.push({
			goods_id:v.goods_id,
			goods_number:v.num,
			goods_price:v.goods_price
			}))
			const orderParams= { order_price,consignee_addr,goods};
			// 4准备发送请求创建订单获取订单编号
			const {order_number}=await request({url:"/my/orders/create",method:"POST",data:orderParams, header:header}); 
			console.log(order_number);
			//发起预支付
			const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}, header:header});
			//发起微信支付
			await requestPayment(pay);
			const res=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}, header:header});
			// console.log(res);
			await showToast({title:"支付成功"});
			// let newcart=wx.getStorageSync("cart");
			// newcart=newcart.filter(v=>!v.checked);
			// wx.setStorageSync("cart",newcart);
			wx.navigateTo({
				url:"/pages/order/order"
			})
			
		}catch(error){
			//TODO handle the exception
			await showToast({title:"支付失败"});
			let newcart=wx.getStorageSync("cart");
			newcart=newcart.filter(v=>!v.checked);
			wx.setStorageSync("cart",newcart);
			console.log(error);
		}
	}
})