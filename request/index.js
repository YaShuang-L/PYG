//多次发送异步请求
let ajaxtimes=0;
export const request=(params)=>{
    ajaxtimes++;
    // 显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true,
       
    });
      

	// https://api-hmugo-web.itheima.net/api/public/v1/categories
	const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
        var reqTask = wx.request({
           ...params,
		   url:baseUrl+params.url,
           success:(result)=>{
               resolve(result);
           },
           fail:(err)=>{
               reject(err);
           },
           //不管请求成功还是失败都会触发的事件
           complete:()=>{
               //关闭图标
               ajaxtimes--;
               if(ajaxtimes===0){
                wx.hideLoading();
               } 
           }
        });
          
    })
}