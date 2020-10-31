<template>
	<view class="homeContainer">
		<view class="bg"></view>
		<navBar :nav="setNav"></navBar>
		<view class="userInfo">
			<button v-if="!hasUserInfo" open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
			<view class="userCover" v-if="hasUserInfo">
				<image :src="avatarUrl"></image>
			</view>
			<view class="userName" v-if="hasUserInfo">{{nickName}}</view>
		</view>
		<view class="homeSet">
			<view class="clear" @click="clearData()"><i class="iconfont iconrefresh"></i>清除缓存</view>
			<view class="share">
				<button open-type="share"><i class="iconfont iconshare"></i>分享</button>
			</view>
			<view class="versionNum"><i class="iconfont icontask"></i>版本号：{{versionNum}}</view>
			<view class="developer" @click="about()"><i class="iconfont iconprompt"></i>关于</view>
			<view class="developAbout" v-if="isAbout">
				<text class="developname">ownlight</text>
				<text class="email">ownlight@qq.com</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				setNav: {
					'isShowBackBtn': false,
					'barColor': 'white',
					'navTitle': '个人中心',
				},
				hasUserInfo: false,
				userInfo: {},
				avatarUrl: '',
				nickName: '',
				versionNum: '1.0.3',
				isAbout: false,
			}
		},
		created() {
			if (uni.getStorageSync('userInfo')) {
				this.userInfo = uni.getStorageSync('userInfo')
				this.hasUserInfo = true;
				this.avatarUrl = this.userInfo.avatarUrl
				this.nickName = this.userInfo.nickName
			} else {
				this.getUserInfo(e)
			}
		},
		methods: {
			getUserInfo(e) {
				console.log('getUserInfo success', e);
				let data = e.detail.userInfo
				this.hasUserInfo = true
				this.userInfo = data
				this.avatarUrl = data.avatarUrl
				this.nickName = data.nickName
				uni.setStorageSync('userInfo', this.userInfo)
				uni.showToast({
					title: '登录成功！',
					icon: 'success',
					duration: 1000,
				})
			},
			clearData() {
				uni.showModal({
					content: '确定要清楚所有缓存吗？',
					success: function(res) {
						if (res.confirm) {
							let res = uni.getStorageInfoSync().keys
							for (let i = 1; i < res.length; i++) {
								uni.removeStorageSync(res[i])
							}
						} else if (res.cancel) {
							return
						}
					}
				});
			},
			about() {
				this.isAbout = !this.isAbout
			},
		},
		onShareAppMessage(res) {
			return {
				title: '67小说',
				path: '/pages/book/book'
			}
		},
	}
</script>

<style lang="scss">
	.homeContainer {
		.bg {
			background: #d5c4d7;
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			z-index: -1;
		}

		.userInfo {
			z-index: 1;
			background-color: #FFFFFF;
			width: 90%;
			margin: 40rpx 5% 40rpx;
			border-radius: 20rpx;
			padding: 20rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.userCover {
				padding: 0 50rpx;
				border-right: 3rpx solid #eeeeee;

				image {
					width: 150rpx;
					height: 150rpx;
					border-radius: 75rpx;
				}
			}

			.userName {
				flex: 1;
				padding-left: 50rpx;
				font-size: 35rpx;
				letter-spacing: 1rpx;
			}
			
			button {
				line-height: 1;
				text-align: left;
				font-size: 38rpx;
				padding-left: 0;
				padding-right: 0;
				background-color: #FFFFFF;
				padding: 20rpx;
			}
			
			button::after {
				border: none;
			}

		}

		.homeSet {
			z-index: 1;
			background-color: #FFFFFF;
			width: 90%;
			margin: 40rpx 5% 40rpx;
			border-radius: 20rpx;
			padding: 20rpx;
			box-sizing: border-box;
			font-size: 30rpx;
			letter-spacing: 2rpx;

			i {
				display: inline-block;
				padding: 0;
				margin-right: 20rpx;
			}

			view {
				padding: 25rpx 20rpx;
				border-top: 3rpx solid #eeeeee;
			}

			view:first-child {
				border-top: none;
			}

			button {
				line-height: 1;
				text-align: left;
				font-size: 30rpx;
				padding-left: 0;
				padding-right: 0;
				background-color: #FFFFFF;
			}

			button::after {
				border: none;
			}
		}

		.developAbout {
			text-align: right;

			text {
				display: block;
				margin-top: 10rpx;
			}
		}
	}
</style>
