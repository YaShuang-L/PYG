import {request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
	goodsObj:{},
	//商品是否被收藏
	iscollect:false
  },
  //商品对象
  goodsInfo:{},
 onShow(){
	let pages=getCurrentPages();
	let currentPage=pages[pages.length-1];
	let options=currentPage.options;
	// console.log(options)
	const {goods_id}=options;
	// console.log(goods_id);
	this.getGoodsList(goods_id);
	
 },
  //获取商品数据
  async getGoodsList(goods_id){
	  const res=await request({url:"/goods/detail",data:{goods_id}});
	  // console.log(res);
	  this.goodsInfo=res.data.message;
	  //获取缓存中商品收藏数组
	  let collect=wx.getStorageSync("collect")||[];
	  //判断当前商品是否被收藏
	  let iscollect=collect.some(v=>v.goods_id===this.goodsInfo.goods_id);
	  this.setData({
	  	goodsObj:{
			goods_name:res.data.message.goods_name,
			goods_price:res.data.message.goods_price,
			goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
			pics:res.data.message.pics,
		},
		iscollect
	  })
  },
  //图片放大
  handelPreviewImage(e){
	  // console.log('1');
	  //构造预览图片数组
	  const urls=this.goodsInfo.pics.map(v=>v.pics_mid);
	  //接受传递过来的图片
	  const current=e.currentTarget.dataset.url;
	  wx.previewImage({
		  current: current,
		  urls: urls
	  });
  },
  //点击加入购物车
  handelCartAdd(){
	let cart=wx.getStorageSync("cart")||[];
	let index=cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
	if(index===-1){
		this.goodsInfo.num=1;
		this.goodsInfo.checked=true;
		cart.push(this.goodsInfo);
	}else{
		cart[index].num++;
	}
	wx.setStorageSync("cart",cart);
	wx.showToast({
		title:'加入成功',
		icon:'success',
		mark:true
	})
  },
  //点击 收藏商品
  handelCollect(){
	 let iscollect=false;
	 let collect=wx.getStorageSync("collect")||[];
	 let index=collect.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
	 if(index!==-1){
		 collect.splice(index,1);
		 iscollect=false;
		 wx.showToast({
			 title:'取消成功',
			 icon:'success',
			 mark:true
		 });
	 }else{
		 collect.push(this.goodsInfo);
		 iscollect=true;
		 wx.showToast({
		 			 title:'收藏成功',
		 			 icon:'success',
		 			 mark:true
		 });
	 }
	 wx.setStorageSync("collect",collect);
	 this.setData({iscollect});
  }

 

  
})