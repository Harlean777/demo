import Md5 from './md5.js';
import Nav from './navigate.js';
// const app = getApp();

const config = {
  // 本地 
  // baseUrlAjb:'http://datang.jindinghaiju111.com:9527/ajb/', //安居宝
  // picturepath: 'http://datang.jindinghaiju111.com:9527/ajb', //图片
  // baseUrlBuyPlat: 'http://192.168.110.92:8080/BuyPlat_V4.1/', //认购
  // baseUrlAgentPlat: 'http://192.168.110.92:8080/AgentPlat_v4.1/', //报备
  // baseUrlPersonnel: 'http://192.168.110.92:8080/Personnel/', //人事
  // baseUrlCms: 'http://192.168.110.205:8777/', // cms 接口


  // 测试
  // baseUrlAjb:'https://haijutest.jindinghaiju.com/ajb/', //安居宝
  // baseUrlAjb:'http://192.168.110.92:9000/ajb/', //四木
  // picturepath: 'https://haijutest.jindinghaiju.com/ajb/api/file?downloadFilePath=', //图片
  // baseUrlBuyPlat: 'https://haijutest.jindinghaiju.com/buyplat/', //认购
  // baseUrlAgentPlat: 'https://haijutest.jindinghaiju.com/bbxt/', //报备
  // baseUrlPersonnel: 'https://haijutest.jindinghaiju.com/rsxt/', //人事
  // baseUrlCms: 'https://haijutest.jindinghaiju.com/cms/', // cms 


  // 正式
  baseUrlAjb:'https://channel.jindinghaiju.com/ajb/', //安居宝
  picturepath: 'https://channel.jindinghaiju.com/ajb',//图片
  baseUrlBuyPlat: 'https://channel.jindinghaiju.com/buyplat/', //认购
  baseUrlAgentPlat: 'https://channel.jindinghaiju.com/bbxt/', //报备
  baseUrlPersonnel: 'https://channel.jindinghaiju.com/rsxt/', //人事
  baseUrlCms: 'https://scms.jindingaus.com/', // cms
}

/**
 * 封装ajax操作
 * par = {
 *      url: ''                     后台接口地址                                                   
 *      data: {}                    传给后台的数据
 *      success: function(res){}    回调函数
 * }
 */
function ajaxFunc(par) {
  // par.data.sign = createSign();
  // par.data.version = '0.0'; //版本控制管理
  var url = '';
  if(par.origin === 'newLogin') { //大后台
    url = config.baseUrlAjb + par.url
  }else if(par.origin === 'login') { //大后台
    url = config.baseUrlBuyPlat + par.url
  } else if (par.origin === 'newspaper') { // 报备
    url = config.baseUrlAgentPlat + par.url
  }else if (par.origin === 'subscription') { //认购
    url = config.baseUrlBuyPlat + par.url
  }else if (par.origin === 'personnel') { //人事
    url = config.baseUrlPersonnel + par.url
  }

  // header: {
  //   'content-type': 'application/x-www-form-urlencoded' // 默认值
  // },

  let new_cookie = wx.getStorageSync('cookie')
  let new_token = wx.getStorageSync('token')

  if(par.url == 'minilogin/loginForPhone' || par.origin === 'login'){ //切换登录或者用login时  不要cookie 和 token
    new_cookie = ''
    new_token=''
  }

  var defaultHeader = { 
      "Content-Type": "application/x-www-form-urlencoded",
      'openid':wx.getStorageSync('openid'),
      'cookie':new_cookie,
      'token':new_token,
    },
    newHeaders = null;
  if (par.header) {
    newHeaders = Object.assign({}, defaultHeader, par.header)
  } else {
    newHeaders = defaultHeader;
  }
  wx.request({
    url: url,
    data: par.data,
    header: newHeaders,
    responseType: par.responseType || 'text',
    // method: 'POST',
    method: par.type||'POST',
    dataType: 'json',
    success: function (res, err) {
      if(par.url == 'minilogin/loginForPhone'){
        var cookie = res.header['Set-Cookie'] ||''
        if(res.data.code==1){
          wx.setStorageSync('cookie', cookie)
          wx.setStorageSync('token', res.data.loginmap.token||'')
        }else{

        }
      }

      typeof par.success === 'function' ? par.success(res.data) : false;
      if (res.statusCode == 302) {
        wx.showToast({
          title: '当前账号暂无权限',
          icon: 'none'
        });
        wx.setStorageSync('authorization_wx', false);
        wx.setStorageSync('authorization_phone', false);
        wx.setStorageSync('phone_in_system', 0);
        wx.setStorageSync('phone', '');
        wx.setStorageSync('loginmap', '');
        wx.setStorageSync('user', '');
        wx.setStorageSync('token', '');
        wx.setStorageSync('openid', '');
        wx.setStorageSync('session_key', '');

        // wx.clearStorageSync();
        // app.globalData.isLogin = 0;
        Nav.nav('reLaunch', '../index/index')
      } else if (res.statusCode == 401) {
        wx.showToast({
          title: '当前账号没权限',
          icon: 'none'
        });

      } else {

      }

    },
    fail: function (f) {
      wx.hideLoading();
      wx.showToast({
              title: '当前网络不稳定，请重试。',
              icon:'none'
          });
      // return
      wx.getNetworkType({
        success: function (res) {

          // wx.showToast({
          //     title: '当前网络不稳定，请重试。11111',
          //     icon:'none'
          // });
          // wx.setStorageSync('isRefreshPerson', 1);
          // wx.setStorageSync('isRefreshCart', 1);
        }
      })
    }
  });
}

// 创建sign
// function createSign() {
//     let md5_str = '';
//     let sign = '';
//     //let today = new Date();

//     // today.setHours(0);
//     // today.setMinutes(0);
//     // today.setSeconds(0);
//     // today.setMilliseconds(0);
//     // today = today.getTime() / 1000;

//    // sign = Md5.hexMD5(today + config.str);
//   sign = Md5.hexMD5(config.str);


//     return sign;
// }

module.exports = {
  ajaxFunc,
  config,
  // createSign
}