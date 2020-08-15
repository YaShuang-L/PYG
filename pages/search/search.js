import {request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data: {
	goods:[],
	isFocus:false,
	inputValue:""
  },
  //定时器
  timeId:-1,
  //输入框的值改变，就会触发的事件
  handelInput(e){
	// console.log(e);
	const {value}=e.detail;
	//判断值是否合法
	if(!value.trim()){
		//值不合法
		this.setData({
			goods:[],
			isFocus:false
		});
		return;
	}
	this.setData({
		isFocus:true
	});
	clearTimeout(this.timeId);
	this.timeId=setTimeout(()=>{
		this.qsearch(value);
	},100)
	
  },
  async qsearch(query){
	  const res=await request({url:"/goods/search",data:{query}});
	  console.log(res);
	  this.setData({
		  goods:res
	  });
  },
  //按钮 取消
  handelCancel(){
	// console.log('1');
	this.setData({
		inputValue:"",
		goods:[],
		isFocus:false
	});
  }
})