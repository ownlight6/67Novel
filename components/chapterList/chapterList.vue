<template>
	<view class="listContainer" :style="{'height':screenHeight}" :class="{'nightColor': bookId.isNight}">
		<view class="topTitle">
			<view class="topWord">目录</view>
			<view class="reverse" v-if="!isReverse" @click="reverseList()">倒序</view>
			<view class="reverse" v-if="isReverse" @click="reverseList()">正序</view>
		</view>
		<scroll-view class="chapterList" scroll-y :style="{'height':screenHeight}" :scroll-top="scrollTop" @scroll="getScroll">
			<view class="listBox" v-for="(item,index) in chapterList" :key='index'>
				<view class="chapterName" @click="getChapter(item.link,item.title)">{{item.title}}</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props: [
			"bookId",
		],
		data() {
			return {
				screenHeight: 0,
				id: '',
				chapterNum: '',
				bookName: '',
				chapterList: [],
				upDate: '',
				scrollTop: 0,
				qscrollTop: 0,
				isReverse: false,
			}
		},
		created() {
			if (uni.getStorageSync('barInfo')) {
				this.screenHeight = uni.getStorageSync('barInfo').screenHeight
			}
			this.id = this.bookId.bid
			this.bookName = this.bookId.bookName
		},
		mounted() {
			this.getData()
			this.getBookList()
		},
		methods: {
			getData() {
				if (uni.getStorageSync('scrollData' + this.id)) {
					this.scrollTop = uni.getStorageSync('scrollData' + this.id)
				}
			},
			getBookList() {
				if (uni.getStorageSync('chapterListData' + this.id)) {
					this.chapterList = uni.getStorageSync('chapterListData' + this.id)
					uni.setStorageSync('chapterNum' + this.id, this.chapterList.length)
				} else {
					uni.request({
						url: 'https://api.aixdzs.com/content/' + this.id,
						success: (res) => {
							let data = res.data.mixToc
							this.chapterNum = data.chaptercount
							uni.setStorageSync('chapterNum' + this.id, this.chapterNum)
							this.chapterList = data.chapters
							uni.setStorageSync('chapterListData' + this.id, this.chapterList)
							this.upDate = data.updated
						}
					})
				}
			},
			getChapter(link, name) {
				uni.redirectTo({
					url: '../../pages/chapter/chapter?link=' + link + '&name=' + this.bookName + '&id=' + this.id,
				})
				let linkList = uni.getStorageSync('linkList')
				linkList[0] = link
				uni.setStorageSync('linkList', linkList)
			},
			getScroll(e) {
				console.log(e.detail.scrollTop)
				let data = e.detail.scrollTop
				uni.setStorageSync('scrollData' + this.id, data)
			},
			reverseList() {
				this.chapterList = this.chapterList.reverse()
				this.isReverse = !this.isReverse
			}
		}
	}
</script>

<style lang="scss">
	.nightColor {
		background-color: #181818 !important;
		color: #9c9a9d !important;
	}

	.listContainer {
		box-sizing: content-box;
		// display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		width: 70%;
		// height: 90%;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		z-index: 55;

		.topTitle {
			font-size: 38rpx;
			padding: 5%;
			margin-left: 20rpx;
			margin-top: 40rpx;
			display: flex;
			justify-content: space-between;

			.topWord {}

			.reverse {
				font-size: 30rpx;
				padding: 0 5rpx;
				border: 3rpx solid #eeeeee;
				border-radius: 10rpx;
			}
		}


		.chapterList {
			z-index: 60;
			width: 90%;
			// height: 90%;
			margin: 10rpx 5% 40rpx;
			overflow-y: scroll;

			.listBox:first-child {
				border-top: none;
			}

			.listBox {
				padding: 20rpx;
				border-top: 3rpx solid #EEEEEE;
				font-size: 30rpx;

				.chapterName {
					margin-left: 0rpx;
				}
			}
		}
	}
</style>
