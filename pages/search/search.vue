<template>
	<view class="homeContainer">
		<view class="bg"></view>
		<view class="bgbar" :style="{'height': allBarHeight}"></view>
		<navBar :nav="setNav"></navBar>
		<view class="searchBox">
			<input class="searchLine" v-model="inputValue" confirm-type="search" @input="searchBook(inputValue)" />
			<i class="iconfont" :class="inputValue==''?'iconsearch':'iconclose'" @click="removeInput()"></i>
		</view>
		<view class="searchList" v-if="inputValue!=''&&searchList.length!=0">
			<view class="bookBox" v-for="(item,index) in searchList" :key="index" @click="getBookDetail(item._id,item.title)">
				<view class="bookImg">
					<image :src="bookImg(item)"></image>
				</view>
				<view class="bookInfo">
					<view class="bookTitle">{{item.title}}</view>
					<view class="bookAuthor">{{item.author}}</view>
					<view class="bookChapter">{{item.lastchapter}}</view>
				</view>
			</view>
		</view>
		<view class="hotList" v-if="searchList.length==0||inputValue==''">
			<view class="hotBar">
				<view class="hotTitle">热门搜索</view>
				<view class="hotRefresh iconfont iconrefresh" @click="getHotWords()"></view>
			</view>
			<view class="hotBox">
				<view class="hotWord" v-for="(item,index) in hotList" :key="index" @click="searchHotWord(item)">{{item}}</view>
			</view>
		</view>
		<view class="hisList" v-if="hisList.length!=0&&inputValue==''">
			<view class="hisBar">
				<view class="hisTitle">搜索历史</view>
				<view class="hisClose iconfont iconclose" @click="removeHisWords()"></view>
			</view>
			<view class="hisBox">
				<view class="hisWord" v-for="(item,index) in hisList" :key="index" @click="searchHotWord(item)">{{item}}</view>
			</view>
		</view>
		<view class="bottomSelect" v-if="searchList.length==0||inputValue==''">
			<view class="leaderBoard" @click="getLeaderBoard()">
				<i class="iconchart-bar iconfont"></i>
				<view class="leaderWord">排行榜</view>
			</view>
			<view class="sort" @click="getSort()">
				<i class="iconmodular iconfont"></i>
				<view class="sortWord">分类</view>
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
					'navTitle': '搜索',
				},
				allBarHeight: 0,
				inputValue: '',
				searchList: [],
				hotList: [],
				hisList: [],
			}
		},
		created() {
			if (uni.getStorageSync('barInfo')) {
				this.allBarHeight = uni.getStorageSync('barInfo').allBarHeight
			}
		},
		computed: {
			bookImg() {
				return function(item) {
					if (item.cover)
						return item.cover
				}
			},
		},
		mounted() {
			this.getHotWords()
			if (uni.getStorageSync('hisList'))
				this.hisList = uni.getStorageSync('hisList')
		},
		methods: {
			searchBook(inputValue) {
				uni.request({
					url: 'https://api.aixdzs.com/book/search',
					data: {
						query: inputValue
					},
					success: (res) => {
						this.searchList = res.data.books
						for (let i = 0; i < this.searchList.length; i++) {
							this.searchList[i].cover = 'https://img22.aixdzs.com/' + res.data.books[i].cover
						}
					}
				})
				this.setHisList()
			},
			setHisList() {
				let num = 0
				for (let i = 0; i < this.hisList.length; i++)
					if (this.hisList[i] == this.inputValue) {
						num++;
						let temp = this.hisList[0]
						this.hisList[0] = this.hisList[i]
						this.hisList[i] = temp
					}
				if (num == 0 && this.inputValue.length > 0 && this.inputValue.trim().length != 0)
					this.hisList.unshift(this.inputValue)
				this.hisList = this.hisList.splice(0, 10)
				uni.setStorageSync('hisList', this.hisList)
			},
			getBookDetail(id, name) {
				uni.navigateTo({
					url: '../bookDetail/bookDetail?id=' + id
				})
			},
			getHotWords() {
				uni.request({
					url: 'https://api.aixdzs.com/book/hot-word',
					success: (res) => {
						this.hotList = res.data.hotWords
						this.getAllWord()
					}
				})
			},
			getAllWord() {
				let newList = [];
				for (let i = 0; i < this.hotList.length; i++) {
					if (this.hotList[i] != '' && this.hotList[i] != null && this.hotList[i] != '1' && this.hotList[i] != '11')
						newList.push(this.hotList[i])
				}
				this.hotList = [].concat(newList)

			},
			searchHotWord(word) {
				this.inputValue = word
				this.searchBook(word)
			},
			removeInput() {
				if (this.inputValue != '')
					this.inputValue = ''
			},
			removeHisWords() {
				this.hisList = []
				uni.setStorageSync('hisList', this.hisList)
			},
			getLeaderBoard() {
				uni.navigateTo({
					url: '../leaderBoard/leaderBoard'
				})
			},
			getSort() {
				uni.navigateTo({
					url: '../sort/sort'
				})
			},
		},
	}
</script>

<style lang="scss">
	.homeContainer {
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
			padding-top: 140rpx;
			position: fixed;
			top: 0;
			z-index: 2;
		}

		.searchBox {
			background-color: #FFFFFF;
			height: 80rpx;
			width: 90%;
			margin: 20rpx 5% 0;
			border-radius: 20rpx;
			display: flex;
			position: fixed;
			z-index: 3;

			.searchLine {
				height: 100%;
				width: 85%;
				padding-left: 5%;
				font-size: 35rpx;
				color: #6E6E6E;
				display: inline-block;
			}

			.iconsearch,
			.iconclose {
				display: inline-block;
				line-height: 80rpx;
				height: 80rpx;
				width: 10%;
				font-size: 55rpx;
			}
		}

		.searchList {
			z-index: 1;
			background-color: #FFFFFF;
			width: 90%;
			margin: 140rpx 5% 40rpx;
			border-radius: 20rpx;

			.bookBox:first-child {
				border-top: none;
			}

			.bookBox {
				padding: 20rpx;
				border-top: 3rpx solid #EEEEEE;
				display: flex;
				font-size: 25rpx;
				justify-content: space-around;

				.bookImg {
					width: 15%;
					height: auto;
					border: 3rpx solid #EEEEEE;
					border-radius: 5rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.bookInfo {
					width: 70%;

					.bookTitle {
						font-weight: bold;
						margin-bottom: 10rpx;
						font-size: 30rpx;
					}

					.bookAuthor {
						margin-bottom: 10rpx;
					}

					.bookChapter {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}

		.hotList {
			z-index: 1;
			background-color: #FFFFFF;
			width: 90%;
			margin: 140rpx 5% 40rpx;
			border-radius: 20rpx;

			.hotBar {
				padding: 20rpx;
				color: #8591db;
				display: flex;
				justify-content: space-between;

				.hotTitle {
					font-size: 32rpx;
					font-weight: bold;
				}

				.hotRefresh {
					font-size: 35rpx;

				}
			}

			.hotBox {
				padding: 0 15rpx 15rpx;
				color: #666666;
				font-size: 28rpx;

				.hotWord {
					display: inline-block;
					margin-right: 10rpx;
					margin-bottom: 10rpx;
					padding: 5px;
					border: 3rpx solid #EEEEEE;
					border-radius: 14rpx;
					letter-spacing: 2rpx;
				}
			}
		}

		.hisList {
			z-index: 1;
			background-color: #FFFFFF;
			width: 90%;
			margin: 40rpx 5% 40rpx;
			border-radius: 20rpx;

			.hisBar {
				padding: 20rpx;
				color: #8591db;
				display: flex;
				justify-content: space-between;

				.hisTitle {
					font-size: 32rpx;
					font-weight: bold;
				}

				.hisClose {
					font-size: 35rpx;

				}
			}

			.hisBox {
				padding: 0 15rpx 15rpx;
				color: #666666;
				font-size: 28rpx;

				.hisWord {
					display: inline-block;
					margin-right: 10rpx;
					margin-bottom: 10rpx;
					padding: 5px;
					border: 3rpx solid #EEEEEE;
					border-radius: 14rpx;
					letter-spacing: 2rpx;
				}
			}
		}

		.bottomSelect {
			position: fixed;
			bottom: 0;
			border: 3rpx solid #EEEEEE;
			z-index: 3;
			background-color: #FFFFFF;
			width: 90%;
			margin: 40rpx 5% 40rpx;
			border-radius: 20rpx;
			display: flex;
			justify-content: space-around;

			.iconfont {
				color: #8591db;
				font-size: 60rpx;
				text-align: center;
			}

			.leaderBoard {
				padding: 20rpx 0;
			}

			.sort {
				padding: 20rpx 0;
			}

			.leaderWord,
			.sortWord {
				color: #666666;
				font-size: 28rpx;
				letter-spacing: 3rpx;
				font-weight: bold;
				text-align: center;
			}
		}
	}
</style>
