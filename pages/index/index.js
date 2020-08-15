//引入用来发送请求的方法
import {request } from "../../request/index.js";
Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航 数组
    catesList:[],
    //楼层数组
    floorList:[]
  },
  //页面开始加载 就会触发
  onLoad: function(options) {
    //wx-request直接生成
    //异步请求获取轮播图数据 通过es6 promise 来解决回调地狱的问题
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result)
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // });
    
      this.getSwiperList();
      this.getCatesList();
      this. getFloorList();
  },
  //获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result=>{
		this.setData({
			swiperList:result.data.message
		})
    })
  },
  //获取分类导航数据
  getCatesList(){
    request({url:"/home/catitems"})
    .then(result=>{
	 
      this.setData({
        catesList:result.data.message
      })
    })
  },
  //获取楼层数组
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result=>{
      this.setData({
        floorList:result.data.message
      })
    })
  }
});
  