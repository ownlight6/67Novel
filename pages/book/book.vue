<template>
	<view class="homeContainer">
		<view class="bg" @click="hideClose()"></view>
		<view class="bgbar" :style="{'height': allBarHeight}"></view>
		<navBar :nav="setNav"></navBar>
		<view class="bookShelf" v-if="bookShelfList.length != 0">
			<view class="bookBox" v-for="(item,index) in bookShelfList" :key="index" @longpress="showClose()">
				<view class="bookImg" @click="readBook(index,item.title)">
					<image :src="item.cover"></image>
				</view>
				<i class="iconfont iconclose" :class="isClose?'close':'noclose'" @click="clearBook(index)"></i>
				<view class="bookName">{{item.title}}</view>
			</view>
		</view>
		<view class="noBook" v-if="bookShelfList.length == 0">请先添加书籍 ~</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				setNav: {
					'isShowBackBtn': false,
					'barColor': 'white',
					'navTitle': '书架',
				},
				allBarHeight: 0,
				bookShelfList: [],
				linkList: [],
				isClose: false,
			}
		},
		created() {
			if (uni.getStorageSync('barInfo'))
				this.allBarHeight = uni.getStorageSync('barInfo').allBarHeight
		},
		onShow() {
			this.getBookShelf()
			this.getBookList()
		},
		methods: {
			getBookShelf() {
				if (uni.getStorageSync('bookShelfList')) {
					this.bookShelfList = uni.getStorageSync('bookShelfList')
				}
			},
			getBookList() {
				if (uni.getStorageSync('linkList')) {
					this.linkList = uni.getStorageSync('linkList')
				} else {
					for (let i = 0; i < this.bookShelfList.length; i++) {
						uni.request({
							url: 'https://api.aixdzs.com/content/' + this.bookShelfList[i]._id,
							success: (res) => {
								let data = res.data.mixToc
								this.linkList[i] = data.chapters[0].link
								uni.setStorageSync('linkList', this.linkList)
							}
						})
					}
					console.log(this.linkList)
				}
			},
			readBook(index, name) {
				uni.navigateTo({
					url: '../chapter/chapter?link=' + this.linkList[index] + '&name=' + name + '&id=' + this.bookShelfList[index]._id,
				})
				let temp1 = this.bookShelfList[index]
				this.bookShelfList.splice(index, 1)
				this.bookShelfList.unshift(temp1)
				let temp2 = this.linkList[index]
				this.linkList.splice(index, 1)
				this.linkList.unshift(temp2)
				uni.setStorageSync('bookShelfList', this.bookShelfList)
				uni.setStorageSync('linkList', this.linkList)
			},
			showClose() {
				this.isClose = true
				uni.vibrateShort({
					success: function() {
						console.log('success');
					}
				});
			},
			hideClose() {
				this.isClose = false
			},
			clearBook(index) {
				uni.showToast({
					title: '删除成功',
					icon: 'success',
					duration: 1500,
				})
				uni.vibrateShort({
					success: function() {
						console.log('success');
					}
				});
				uni.removeStorageSync('chapterListData'+this.bookShelfList[index]._id)
				uni.removeStorageSync('scrollData'+this.bookShelfList[index]._id)
				this.isClose = false
				this.bookShelfList.splice(index, 1)
				this.linkList.splice(index, 1)
				uni.setStorageSync('bookShelfList', this.bookShelfList)
				uni.setStorageSync('linkList', this.linkList)
			},
		}
	}
</script>

<style lang="scss">
	.homeContainer {
		.bg {
			background: #b8c4ee;
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			z-index: -1;
		}

		.bgbar {
			background: #b8c4ee;
			width: 100%;
			position: fixed;
			top: 0;
			z-index: 2;
		}

		.bookShelf {
			z-index: 1;
			background-color: #FFFFFF;
			width: 90%;
			margin: 40rpx 5% 40rpx;
			border-radius: 20rpx;
			padding: 30rpx;
			box-sizing: border-box;
			display: flex;
			flex-wrap: wrap;

			.bookBox {
				height: 250rpx;
				// width: 180rpx;
				width: 30%;
				padding: 10rpx;
				margin: 0 0 40rpx;
				position: relative;

				.bookImg {
					width: 100%;
					height: 90%;

					image {
						width: 100%;
						height: 100%;
						border-radius: 10rpx;
					}

				}

				.noclose {
					display: none;
				}

				.close {
					z-index: 99;
					position: absolute;
					color: #FFFFFF;
					font-size: 35rpx;
					font-weight: bold;
					top: 0;
					right: 0;
					background-color: #b8c4ee;
					border-radius: 50%;
					padding: 2rpx;
				}

				.bookName {
					text-align: center;
					font-size: 25rpx;
					color: #666666;
					margin-top: 10rpx;
				}
			}
		}

		.noBook {
			margin-top: 100rpx;
			text-align: center;
			font-size: 25rpx;
			color: #666666;
			letter-spacing: 2rpx;
		}
	}
</style>
