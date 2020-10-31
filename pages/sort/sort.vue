<template>
	<view class="sortContainer">
		<view class="bg"></view>
		<view class="bgbar" :style="{'height': allBarHeight}"></view>
		<navBar :nav="setNav"></navBar>
		<view class="sortList">
			<view class="sortBox" v-for="(item,index) in sortList" :key="index" @click="getSortDetail(item._id,item.name)">
				<view class="sortName">{{item.name}}</view>
				<view class="bookCount">{{item.bookCount}} 本</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				setNav: {
					'isShowBackBtn': true,
					'barColor': 'white',
					'navTitle': '分类',
				},
				allBarHeight: 0,
				sortList: [],
			}
		},
		created() {
			if (uni.getStorageSync('barInfo')) {
				this.allBarHeight = uni.getStorageSync('barInfo').allBarHeight
			}
		},
		mounted() {
			this.getSortList()
		},
		methods: {
			getSortList() {
				uni.request({
					url: 'https://api.aixdzs.com/sort',
					success: (res) => {
						this.sortList = res.data.male
						console.log(this.sortList)
					}
				})
			},
			getSortDetail(id,name) {
				uni.navigateTo({
					url: '../leaderBoard/leaderBoard?id=' + id + '&name=' + name
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sortContainer {
		.bg {
			background: #8591db;
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			z-index: -1;
		}

		.bgbar {
			background: #8591db;
			width: 100%;
			position: fixed;
			top: 0;
			z-index: 2;
		}

		.sortList {
			z-index: 1;
			background-color: #FFFFFF;
			width: 90%;
			margin: 40rpx 5% 40rpx;
			border-radius: 20rpx;

			.sortBox:first-child {
				border-top: none;
			}

			.sortBox {
				border-top: 3rpx solid #eeeeee;
				padding: 30rpx;
				display: flex;
				justify-content: space-between;
				letter-spacing: 2rpx;
				font-size: 35rpx;
			}
		}
	}
</style>
