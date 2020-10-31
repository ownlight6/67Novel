<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			this.getBarInfo();
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		methods: {
			getBarInfo() {
				var that = this;
				uni.getSystemInfo({
					success: function(res) {
						console.log(res)
						if (res.model.indexOf('iPhone') !== -1) {
							that.titleBarHeight = 44 + 'px';
							that.nptitleHeight = 44
						} else {
							that.titleBarHeight = 48 + 'px';
							that.nptitleHeight = 48
						}
						that.statusBarHeight = res.statusBarHeight + 'px'
						that.npstatusHeight = res.statusBarHeight
						that.allBarHeight = that.nptitleHeight + that.npstatusHeight + 'px'
						that.screenHeight = res.screenHeight + 'px'
						that.screenWidth = res.screenWidth + 'px'
						let barInfo = {
							'statusBarHeight': that.statusBarHeight,
							'titleBarHeight': that.titleBarHeight,
							//'nptitleHeight': that.nptitleHeight,
							//'npstatusHeight': that.npstatusHeight,
							'allBarHeight': that.allBarHeight,
							'screenHeight': that.screenHeight,
							'screenWidth': that.screenWidth,
						}
						uni.setStorageSync('barInfo', barInfo)
					},
				})
			}

		},
	};
</script>

<style>
	@import url("static/iconfont.css");

	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		src: url('/static/uni.ttf');
	}

	/* #endif */
</style>
