<template>
	<view class="detailContainer">
		<view class="bg"></view>
		<view class="bgbar" :style="{'height': allBarHeight}"></view>
		<navBar :nav="setNav"></navBar>
		<view class="bookDetail">
			<view class="bookBox">
				<view class="bookImg">
					<image :src="imgUrl"></image>
				</view>
				<view class="bookMain">
					<view class="bookName">{{bookName}}</view>
					<view class="bookAuthor">{{author}}</view>
					<view class="bookCat">{{category}}</view>
					<view class="bookDate">{{upDate}}</view>
					<view class="lastChapter">{{lastChapter}}</view>
				</view>
			</view>
			<view class="bookData">
				<view class="bookStatus"><i>状态</i>{{status}}</view>
				<view class="wordNum"><i>总字数</i>{{wordNum}}</view>
			</view>
			<view class="bookInfo" :class="isShow?'bookInfoShow':''" @click="getShow()">
				<view class="infoLine" v-for="(item,index) in bookInfoList" :key="index">{{item}}</view>
			</view>
		</view>
		<view class="bookOperate">
			<view class="bookSelect bookShelf" v-if="!isBookShelf" @click="setBookShelf()">加入书架</view>
			<view class="bookSelect bookShelf" v-if="isBookShelf" @click="getBookShelf()">进入书架</view>
			<view class="bookSelect bookRead" @click="bookRead()">开始阅读</view>
			<view class="bookSelect bookDownload" @click="downLoad()">下载书籍</view>
			<view class="bookSelect bookOther" @click="authorBook()">作者作品</view>
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
					'navTitle': '',
				},
				allBarHeight: 0,
				id: '',
				bookName: '',
				author: '',
				category: '',
				chapterNum: '',
				imgUrl: '',
				lastChapter: '',
				bookInfo: '',
				bookInfoList: [],
				upDate: '',
				wordNum: '',
				status: '',
				link: '',
				isShow: false,
				bookShelfList: [],
				isBookShelf: false,
				bookData: {},
			}
		},
		created() {
			if (uni.getStorageSync('barInfo')) {
				this.allBarHeight = uni.getStorageSync('barInfo').allBarHeight
			}
		},
		computed: {
			getNavTitle() {
				this.setNav.navTitle = this.bookName
			},
			getLoadShelfList() {
				this.loadShelfList()
			},
		},
		onLoad(options) {
			this.id = options.id
		},
		mounted() {
			this.getBookDetail()
			this.getBookList()
		},
		methods: {
			getBookDetail() {
				uni.request({
					url: 'https://api.aixdzs.com/book/' + this.id,
					success: (res) => {
						let data = res.data
						this.bookData = data
						this.bookName = data.title
						this.author = data.author
						this.category = data.cat
						this.chapterNum = data.chaptersCount
						uni.setStorageSync('chapterNum' + this.id, parseInt(this.chapterNum))
						this.imgUrl = 'https://img22.aixdzs.com/' + data.cover
						this.lastChapter = data.lastChapter
						this.bookInfo = data.longIntro
						this.bookInfoList = this.bookInfo.split("\n")
						this.upDate = data.updated.slice(0, 10)
						this.wordNum = data.wordCount
						this.status = data.zt
					}
				})
			},
			getBookList() {
				uni.request({
					url: 'https://api.aixdzs.com/content/' + this.id,
					success: (res) => {
						let data = res.data.mixToc
						console.log('data:', data)
						// let linkList = uni.getStorageSync('linkList')
						// let num = 0
						// for (let i = 0; i < linkList.length; i++) {
						// 	if (this.id == linkList[i].split('/')[0]) {
						// 		this.link = linkList[i]
						// 		num++
						// 	}
						// }
						this.link = data.chapters[0].link
						console.log('link:' + this.link)
					}
				})
			},
			loadShelfList() {
				if (uni.getStorageSync('bookShelfList'))
					this.bookShelfList = uni.getStorageSync('bookShelfList')
				console.log(this.bookShelfList)
				for (let i = 0; i < this.bookShelfList.length; i++) {
					if (this.bookName == this.bookShelfList[i].title) {
						this.isBookShelf = true
					}
				}
			},
			bookRead() {
				uni.redirectTo({
					url: '../chapter/chapter?link=' + this.link + '&name=' + this.bookName + '&id=' + this.id
				})
			},
			getShow() {
				this.isShow = !this.isShow
			},
			downLoad() {
				uni.setClipboardData({
					data: 'https://www.aixdzs.com/down?id=' + this.id + '&p=1',
					success: () => {
						uni.showToast({
							title: '内容已复制 请在浏览器打开',
							icon: 'none',
							duration: 1500,
						})
					}
				})
			},
			authorBook() {
				uni.redirectTo({
					url: '../authorBook/authorBook?author=' + this.author,
				})
			},
			setBookShelf() {
				uni.showToast({
					title: '成功添加至书架',
					icon: 'success',
					duration: 1500,
				})
				this.isBookShelf = true
				this.bookData.cover = 'https://img22.aixdzs.com/' + this.bookData.cover
				this.bookShelfList.push(this.bookData)
				uni.setStorageSync('bookShelfList', this.bookShelfList)
				let linkList = uni.getStorageSync('linkList')
				console.log('book link:',this.link)
				linkList.push(this.link)
				uni.setStorageSync('linkList', linkList)
			},
			getBookShelf() {
				uni.switchTab({
					url: '../book/book',
					success: function(e) {
						var page = getCurrentPages()[0];
						if (page == undefined || page == null) return;
						page.onShow();
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.detailContainer {
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

		.bookDetail {
			z-index: 1;
			background-color: #FFFFFF;
			width: 90%;
			margin: 40rpx 5% 40rpx;
			border-radius: 20rpx;

			.bookBox {
				display: flex;
				padding: 40rpx;
				border-bottom: 3rpx solid #EEEEEE;
				letter-spacing: 2rpx;

				.bookImg {
					width: 25%;

					image {
						width: 100%;
						height: 100%;
						border-radius: 5rpx;
						border: 3rpx solid #EEEEEE;
					}
				}

				.bookMain {
					margin-left: 5%;
					width: 70%;

					.bookName {
						font-size: 35rpx;
						margin-bottom: 10rpx;
						color: #8591db;
					}

					.bookAuthor,
					.bookCat,
					.bookDate,
					.lastChapter {
						font-size: 25rpx;
						color: #666666;
						margin-bottom: 5rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}

			.bookData {
				padding: 20rpx;
				display: flex;
				justify-content: space-around;
				border-bottom: 3rpx solid #EEEEEE;

				i {
					font-size: 25rpx;
					margin-bottom: 5rpx;
					color: #666666;
				}

				.bookStatus,
				.wordNum {
					font-size: 35rpx;
					color: #8591db;
				}
			}

			.bookInfo {
				padding: 20rpx;
				font-size: 28rpx;
				letter-spacing: 2rpx;
				height: 200rpx;
				overflow-y: scroll;

				.infoLine {
					text-indent: 2em;
					margin-bottom: 10rpx;
				}
			}

			.bookInfoShow {
				height: auto;
				overflow: hidden;
			}
		}

		.bookOperate {
			z-index: 1;
			width: 90%;
			margin: 40rpx 5% 40rpx;
			border-radius: 20rpx;
			text-align: center;

			.bookSelect {
				display: inline-block;
				width: 40%;
				padding: 15rpx;
				margin: 15rpx;
				border: 3rpx solid #8591db;
				border-radius: 10rpx;
				background-color: #FFFFFF;
				color: #8591db;
				font-size: 35rpx;
				letter-spacing: 2rpx;
			}
		}
	}
</style>
