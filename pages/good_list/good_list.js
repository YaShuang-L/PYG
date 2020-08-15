import {request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
	tabs:[
		{
			id:0,
			value:"综合",
			isActive:true
		},
		{
			id:1,
			value:"销量",
			isActive:false
		},
		{
			id:2,
			value:"价格",
			isActive:false
		}
	],
	goodList:[]
  },
  //接口要的参数
  Queryparams:{
	  query:"",
	  cid:"",
	  pagenum:1,
	  pagesize:10
	  
  },
//定义总页数
totalPages:1,

  onLoad: function (options) {
	this.Queryparams.cid=options.cid||"";
	this.Queryparams.query=options.query||"";
	this.getGoodList();
  },
  //获取商品列表数据
  async getGoodList(){
	  const res=await request({url:"/goods/search",data:this.Queryparams});
	  // console.log(res);
	  const total=res.data.message.total;
	  this.totalPages=Math.ceil(total/this.Queryparams.pagesize);
	  // console.log(this.totalPage);
	  this.setData({
		goodList:[...this.data.goodList,...res.data.message.goods]
	  })
	  //关闭下拉刷新窗口
	  wx.stopPullDownRefresh();
	  
  },
handelTabsItemChange(e){
	// console.log(e);
	const {index}=e.detail;
	let {tabs}=this.data;
	tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
	this.setData({
		tabs
	})
},
// 页面上划触底事件
onReachBottom(){
	// console.log('1');
	if(this.Queryparams.pagenum>=this.totalPages){
		// console.log('none')
	    wx.showToast({title: '没有下一页'});
		  
	}else{
		this.Queryparams.pagenum++;
		this.getGoodList();
	}
},
//下拉刷新
onPullDownRefresh(){
	// console.log('2');
	this.setData({
		goodList:[]
	})
	this.Queryparams.pagenum=1;
	this.getGoodList();
	
}

})