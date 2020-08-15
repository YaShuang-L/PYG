// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
	tabs:[
		{
			id:0,
			value:"体验问题",
			isActive:true
		},
		{
			id:1,
			value:"商品、商家投诉",
			isActive:false
		}
	],
	//被选中的图片路径数组
	chooseImgs:[],
	//文本域内容
	textValue:""
	
  },
  //外网图片路径数组 
  uploadImgs:[],
  handelTabsItemChange(e){
	  // console.log(e);
	  const {index}=e.detail;
	  let {tabs}=this.data;
	  tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
	  this.setData({tabs});
  },
  //选择图片
  handelChooseImg(){
	  // 调用小程序内置得API
	  wx.chooseImage({
		  count:9,
		  sizeType:['original','compressed'],
		  sourceType:['album','camera'],
		  success:(result)=>{
			  console.log(result);
			  this.setData({
				  //图片数组 进行拼接
				  chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
			  })
		  }
	    });
    },
	//点击自定义图片组件
	handelImgRemove(e){
		const {index}=e.currentTarget.dataset;
		// console.log(index);
		//获取data中图片数组
		let {chooseImgs}=this.data;
		chooseImgs.splice(index,1);
		this.setData({
			chooseImgs
		})
	},
	//文本域输入触发事件
	handelTextInput(e){
		// console.log(e);
		this.setData({
			textValue:e.detail.value
		})
	},
	//表单提交
	handelFormSubmit(){
		//获取文本域内容 图片数组
		const {textValue,chooseImgs}=this.data;
		if(!textValue.trim()){
			//不合法
			wx.showToast({
				title:"输入不合法",
				icon:'none',
				mask:true
			});
			return;
		}
		//弹窗提示
		wx.showLoading({
			titlt:"正在加载中",
			mask:true
		})
		//判断有没有需要上传的图片数组
		if(chooseImgs.length!==0){
			chooseImgs.forEach((v,i)=>{
				wx.uploadFile({
					url:'https://autumnfish.cn/api/joke',
					filePath:v,
					name:"file",
					formData:{},
					success:(result)=>{
						console.log(result);
						let url=JSON.parse(result.data);
						this.uploadImgs.push(url);
						// console.log(this.uploadImgs);
						if(i===chooseImgs.length-1){
							//加载完成 然后把弹窗关闭
							wx.hideLoading();
							
							console.log("把文本中的内容和外网的图片数组都提交到后台中");
							this.setData({
								textValue:"",
								chooseImgs:[]
							});
							wx.navigateBack({
								delta:1
							});
						}
					}
				})
			})
		}else{
			wx.hideLoading();
			console.log("只是提交了文本");
			wx.navigateBack({
				delta:1
			});
		}
		
	}
})