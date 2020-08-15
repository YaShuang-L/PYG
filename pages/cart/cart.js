// pages/cart/cart.js
import {getSetting,chooseAddress,openSetting,showModal,showToast} from "../../utils/syncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
	data:{
		address:{},
		cart:[],
		allChecked:false,
		totalPrice:0,
		totalNum:0
	},
	onShow(){
		const address=wx.getStorageSync("address");
		const cart=wx.getStorageSync("cart")||[];
		// const allChecked=cart.length?cart.every(v=>v.checked):false;
		this.setData({address});
	    this.setCart(cart);
	},

 async handelChooseAdress(){
	// wx.getSetting({
	// 	success:(result)=>{
	// 		const scopeAddress=result.authSetting["scope.address"];
	// 		if(scopeAddress===true||scopeAddress===undefined){
	// 			wx.chooseAddress({
	// 			  success: (result1) => {
	// 				console.log(result1)
	// 			  }
	// 			});
	// 		}else{
	// 			wx.openSetting({
	// 			  success: (result2) => {
	// 				wx.chooseAddress({
	// 				  success: (result3) => {
	// 					console.log(result3)
	// 				  }
	// 				});
	// 			  }
	// 			});
 //            }
	// 	}
	// })
	try {
		const res1=await getSetting();
		const scopeAddress=res1.authSetting["scope.address"];
			if(scopeAddress===false){
				await openSetting();
			}
			const address=await chooseAddress();
			// console.log(res2);
			//存储到本地
			wx.setStorageSync("address",address);
	}catch(error){
		console.log(error);
	}
    
 },
  //商品选中
handelItemChange(e){
	const id=e.currentTarget.dataset.id;
	// console.log(goods_id);
	let {cart}=this.data;
	const index=cart.findIndex(v=>v.goods_id===id)
	cart[index].checked=!cart[index].checked;
	this.setCart(cart);
	
},
//设置购物车状态 全选 数量 总价
setCart(cart){
	let allChecked=true;
	let totalNum=0;
	let totalPrice=0;
	cart.forEach(v=>{
		if(v.checked){
			totalPrice+=v.num*v.goods_price;
			totalNum+=v.num;
		}else{
			allChecked=false;
		}
	})
	//判断数组是否为空
	allChecked=cart.length!=0?allChecked:false;
	this.setData({
		cart,
		allChecked,
		totalPrice,
		totalNum
	})
	wx.setStorageSync("cart",cart);
},
//商品全选功能 反选
handelItemAllCheck(){
	let {cart,allChecked}=this.data;
	allChecked=!allChecked;
	cart.forEach(v=>v.checked=allChecked);
	this.setCart(cart);
},
//商品数量编辑
async handelItemNumEdit(e){
	const id=e.currentTarget.dataset.id;
	const operation=e.currentTarget.dataset.operation;
	// const {goods_id,operation}=e.currentTarget.dataset;
	let {cart}=this.data;
	const index=cart.findIndex(v=>v.goods_id===id);
	//当num=1时 弹窗提示
	if(cart[index].num===1 && operation===-1){
		const result=await showModal({content:"您是否要删除"});
		if (result.confirm) {
			cart.splice(index,1);
			this.setCart(cart);
		}
	}else{
		cart[index].num+=operation;
		this.setCart(cart);
	}
},
//结算功能
async handelPay(){
	const {address,totalNum}=this.data;
	if(!address.userName){
		const result=await showToast({title:"您还没有选择收货地址"});
		return;
	}
	if(totalNum===0){
		const result=await showToast({title:"您还没有选购商品"});
		return;
	}
	wx.navigateTo({
		url:"/pages/pay/pay"
	});
}
})