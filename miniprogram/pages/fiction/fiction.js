//index.js
// const app = getApp();
Page({
    onReady: function(e) {
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        // this.audioCtx = wx.createAudioContext('myAudio');
        // console.log(this.audioCtx)
    },
    onLoad: function(e) {
        // 展示本地存储能力
        let logs = wx.getStorageSync('logs');
        this.setData({
            id: logs.id,
            seconds: this.stotime(logs.seconds)
        });
        // console.log(logs);
        // 写入播放记录
        var app = getApp();
		this.setData({
			playStatus:app.playStatus
		});
    },
    //时间转换
    stotime: function(s) {
        let t = '';
        if (s > -1) {
            // let hour = Math.floor(s / 3600);
            let min = Math.floor(s / 60) % 60;
            // let sec = s % 60;
            let sec = parseInt(s % 60);
            // if (hour < 10) {
            //   t = '0' + hour + ":";
            // } else {
            //   t = hour + ":";
            // }

            if (min < 10) { t += "0"; }
            t += min + ":";
            if (sec < 10) { t += "0"; }
            t += sec;
        }
        return t;
    },
    data: {
        series: 1130,
        page: '',
        id: 0,
        playStatus:true,
        seconds: 0
    }
})