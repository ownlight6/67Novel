<template>
	<view class="navbar">
		<view class="header" :style="{'height':titleBarHeight,'padding-top':statusBarHeight,'opacity':opacity}">
			<i v-if="nav.isShowBackBtn" class="back-btn iconfont iconarrow-left-bold" :style="{'color':nav.barColor}" @tap="backTo()"></i>
			<view class="header-title" :style="{'color':nav.barColor}">{{nav.navTitle}}</view>
		</view>
		<view :style="{'height':titleBarHeight,'padding-top':statusBarHeight}"></view>
	</view>
</template>

<script>
	export default {
		props: [
			"nav",
			"opacity"
		],
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,
			}
		},
		created() {
			if (uni.getStorageSync('barInfo')) {
				this.statusBarHeight = uni.getStorageSync('barInfo').statusBarHeight
				this.titleBarHeight = uni.getStorageSync('barInfo').titleBarHeight
			}
		},
		methods: {
			backTo() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.header {
		box-sizing: content-box;
		display: flex;
		margin: 0 5%;
		align-items: center;
		top: 0;
		position: fixed;
		width: 100%;
		z-index: 50;

		.back-btn {
			font-weight: bold;
			padding-right: 12rpx;
		}

		.header-title {
			font-weight: bold;
			color: #fff;
			width: 60%;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 36rpx;
			letter-spacing: 5rpx;
		}
	}
</style>
