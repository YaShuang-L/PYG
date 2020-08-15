//引入用来发送请求的方法
import {request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    //左侧菜单
    leftMenuList:[],
    //右侧菜单
    rightMenuList:[],
	//被点击左侧菜单索引
	currentIndex:0,
	scrollTop:0
  },
  //定义接口返回值
  Cates:[],

  onLoad: function (options) {
    
	const Cates=wx.getStorageSync("cates");
	if(!Cates){
		this.getMenuList();
	}else{
		//10s
		if(Date.now()-Cates.time>1000*10){
			this.getMenuList();
		}else{
			this.Cates=Cates.data;
			//构造左侧菜单数据
			let leftMenuList=this.Cates.map(v=>v.cat_name);
			//构造右侧菜单数据
			let rightMenuList=this.Cates[0].children;
			this.setData({
			  leftMenuList,
			  rightMenuList
			})
			
		}
	}
  },

  //获取分类数据
  async getMenuList(){
   //  request({url: '/categories'})
   //  .then(res=>{
   //    // console.log(res)
   //    this.Cates=res.data.message;
	  
	  // wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
   //    //构造左侧菜单数据
   //    let leftMenuList=this.Cates.map(v=>v.cat_name);
   //    //构造右侧菜单数据
   //    let rightMenuList=this.Cates[0].children;
   //    this.setData({
   //      leftMenuList,
   //      rightMenuList
   //    })
   //  })
   
   //采用es7的async await来发送请求
   const res=await request({url:"/categories"})
   this.Cates=res.data.message;
   	  
   	  wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
      //构造左侧菜单数据
      let leftMenuList=this.Cates.map(v=>v.cat_name);
      //构造右侧菜单数据
      let rightMenuList=this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightMenuList
      })
      
  },
  //点击左侧菜单触发事件
  handelItemTap(e){
	  console.log(e);
	  const {index}=e.currentTarget.dataset;
	  let rightMenuList=this.Cates[index].children;
	  this.setData({
		  currentIndex:index,
		  rightMenuList,
		  scrollTop:0
	  })
  }

 
})