// audio.js
Page({
    // onReady: function (e) {
    //   // 使用 wx.createAudioContext 获取 audio 上下文 context
    //   this.audioCtx = wx.createAudioContext('myAudio')
    // },
    data: {
        audioIndex: 0,
        playStatus: false,
        currentTime: '0:0',
        totalTime: '0:0',
        sliderValue: false,
        songUrl: '',
        songId: 0,
        seconds:0,
        x:0,
        y:0,
        duration:0,
        timer:  {}
    },
    onLoad: function(options) {
        if (!this.data.songUrl) {
            this.setData({
                songId: parseInt(options.page)
            });
        }
    },
    onShow: function(e) {
        // let logs = wx.getStorageSync('logs');
        // wx.clearStorage();
        // var song = {
        //     songUrl: this.data.songUrl,
        //     seconds: this.data.seconds,
        //     id: this.data.songId
        // };

        // wx.setStorageSync('logs', song);
    },
    onReady:function(){
        let songUrl = encodeURI('http://177j.jqkan.com:8000/玄幻小说/斗破苍穹-桑梓/' + this.data.songId + '.mp3');
        let logs = wx.getStorageSync('logs');
       // 自动播放
        if (songUrl == logs.songUrl) {
            // console.log("继续播放",logs.seconds);
            const backgroundAudioManager = wx.getBackgroundAudioManager()
            // 跳转到指定时间
            backgroundAudioManager.seek(parseInt(logs.seconds));
            // 设置了 src 之后会自动播放
            backgroundAudioManager.src = logs.songUrl
        }else{
            this.play();
        }
    },
    onUnload: function(e) {
        // wx.pauseBackgroundAudio();
        // wx.clearStorage();
        var song = {
            songUrl: this.data.songUrl,
            seconds: this.data.seconds,
            id: this.data.songId
        }
        wx.setStorageSync('logs', song);
        clearInterval(this.data.timer);
    },
     onChange: function(e) {
        // console.log(e)
        // console.log(e.detail)
        let movableX=0;
        let jumpTime=0;
      
       if(e.detail.x<14 && e.detail.x>=0){
        movableX=e.detail.x;
       }else{
        movableX=e.detail.x+14;
       }
       // console.log('秒数：',movableX);
        jumpTime=movableX*this.data.duration/100/2.65;
        this.bindSliderchange(jumpTime);

      },
    //播放 暂停
    bindPlaySong: function() {
        // console.log('播放/暂停音乐...');
        // console.log('播放/暂停音乐...',this.data.playStatus);
        if (this.data.playStatus === true) {
            this.play();
            this.setData({
                playStatus: false
            });
        } else {
            wx.pauseBackgroundAudio();
            this.setData({
                playStatus: true
            });
            // console.log('清除定时器...');
            clearInterval(this.data.timer);
        }

    },
    //播放音乐函数
    play() {
        let that = this;
        let songUrl = encodeURI('http://177j.jqkan.com:8000/玄幻小说/斗破苍穹-桑梓/' + that.data.songId + '.mp3');
        // let songUrl = encodeURI('http://177j.jqkan.com:8000/玄幻小说/斗破苍穹-桑梓/686.mp3');
        // console.log("that.data.songId,",that.data.songId)
        // let logs = wx.getStorageSync('logs');
        // if (songUrl == logs.songUrl) {
        //     // console.log("继续播放",logs.seconds);
        //     const backgroundAudioManager = wx.getBackgroundAudioManager()
        //     // 跳转到指定时间
        //     backgroundAudioManager.seek(parseInt(logs.seconds));
        //     // 设置了 src 之后会自动播放
        //     backgroundAudioManager.src = logs.songUrl
        // } else {
            
            that.setData({
                songUrl: songUrl
            });

            const backgroundAudioManager = wx.getBackgroundAudioManager()
            // 跳转到指定时间
            backgroundAudioManager.seek(30);
            // 设置了 src 之后会自动播放
            backgroundAudioManager.src = songUrl
        // }

        that.data.timer = setInterval(function() {
            that.setDuration(that)
        }, 1000);
        that.setData({ timer: that.data.timer });
    },
    //音乐 时间轴
    setDuration(that) {
        wx.getBackgroundAudioPlayerState({
            success: function(res) {
                let { status, duration, currentPosition} = res
                if (status === 1 || status === 0) {
                    that.setData({
                        seconds:currentPosition,
                        currentTime: that.stotime(currentPosition),
                        totalTime: that.stotime(duration),
                        duration: duration,
                        sliderValue: Math.floor(currentPosition * 100 / duration),
                    })
                }
            }
        });
         // console.log('seconds:',that.data.seconds);
    },
    //音乐播放进度条
    bindSliderchange: function(e) {
        let value = e;
        let that = this;
        // console.log("value,",value);
        //获取后台音乐播放的状态
        wx.getBackgroundAudioPlayerState({
            success: function(res) {
                // console.log(res)
                let { status, duration } = res
                if (status === 1 || status === 0) {
                    that.setData({
                        sliderValue: value
                    });
                    //控制音乐播放的进度
                    wx.seekBackgroundAudio({
                        // position: value * duration / 100,
                        position: value,
                    });
                }
            }
        })
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
    }
    // ,
    // timeToSec:function (time) {
    //     return  time.length > 1 ? Number(time.split(':')[0]*60) + Number(time.split(':')[1]) : Number(time.split(':')[0]*60);
    // }
})