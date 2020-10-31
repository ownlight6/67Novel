<template>
	<view class="leaderBoardContainer">
		<view class="bg"></view>
		<view class="bgbar" :style="{'height': allBarHeight}"></view>
		<navBar :nav="setNav"></navBar>
		<view class="leaderBoard" :style="{'height':boxHeight}">
			<view class="topSelect">
				<view @click="getSwiper(0)" :class="{'titleSelect':current==0}">{{topTitleList[0]}}</view>
				<view @click="getSwiper(1)" :class="{'titleSelect':current==1}">{{topTitleList[1]}}</view>
				<view @click="getSwiper(2)" :class="{'titleSelect':current==2}">{{topTitleList[2]}}</view>
			</view>
			<swiper class="swiper" :current="current" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
			 :duration="duration" @change="swiperChange">
				<swiper-item>
					<view class="swiper-item weekLeader">
						<view class="bookBox" v-for="(item,index) in weekList" :key="index" @click="getBookDetail(item._id,item.title)">
							<view class="bookImg">
								<image :src="item.cover"></image>
							</view>
							<view class="bookInfo">
								<view class="bookTitle">{{item.title}}</view>
								<view class="bookAuthor">{{item.author}}</view>
								<view class="bookChapter">{{item.lastchapter}}</view>
							</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item monthLeader">
						<view class="bookBox" v-for="(item,index) in monthList" :key="index" @click="getBookDetail(item._id,item.title)">
							<view class="bookImg">
								<image :src="item.cover"></image>
							</view>
							<view class="bookInfo">
								<view class="bookTitle">{{item.title}}</view>
								<view class="bookAuthor">{{item.author}}</view>
								<view class="bookChapter">{{item.lastchapter}}</view>
							</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item allLeader">
						<view class="bookBox" v-for="(item,index) in allList" :key="index" @click="getBookDetail(item._id,item.title)">
							<view class="bookImg">
								<image :src="item.cover"></image>
							</view>
							<view class="bookInfo">
								<view class="bookTitle">{{item.title}}</view>
								<view class="bookAuthor">{{item.author}}</view>
								<view class="bookChapter">{{item.lastchapter}}</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
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
					'navTitle': '排行榜',
				},
				allBarHeight: 0,
				screenHeight: 0,
				screenWidth: 0,
				boxHeight: 0,
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				current: 0,
				weekList: [],
				monthList: [],
				allList: [],
				topTitleList: ['周榜', '月榜', '总榜'],
				url1: 'https://api.aixdzs.com/ranking/1',
				url2: 'https://api.aixdzs.com/ranking/2',
				url3: 'https://api.aixdzs.com/ranking/3',
				isOnload: false,
			}
		},
		created() {
			let data = uni.getStorageSync('barInfo')
			if (data) {
				this.allBarHeight = data.allBarHeight
				this.screenHeight = data.screenHeight
				this.screenWidth = data.screenWidth
			}
		},
		mounted() {
			this.getHeight()
			this.getBookList()
		},
		onLoad(e) {
			if (JSON.stringify(e) != "{}") {
				this.isOnload = true
				this.topTitleList = ['热门', '最新', '完结']
				this.setNav.navTitle = e.name
				this.url1 = "https://api.aixdzs.com/book-sort?type=hot&gender=" + e.id
				this.url2 = "https://api.aixdzs.com/book-sort?type=new&gender=" + e.id
				this.url3 = "https://api.aixdzs.com/book-sort?type=over&gender=" + e.id
			}
		},
		methods: {
			getHeight() {
				let sumNum = this.screenHeight.slice(0, 3) - this.allBarHeight.slice(0, 2)
				this.boxHeight = this.pxTorpx(sumNum) - 140 + 'rpx'
				console.log('boxHeight', this.boxHeight)
			},
			pxTorpx(num) {
				let temp = 750 / this.screenWidth.slice(0, 3)
				return temp * num
			},
			getBookList() {
				uni.request({
					url: this.url1,
					success: (res) => {
						let data
						if (!this.isOnload) {
							data = res.data.ranking.books
						} else {
							data = res.data.books
						}
						this.weekList = data
						for (let i = 0; i < this.weekList.length; i++)
							this.weekList[i].cover = 'https://img22.aixdzs.com/' + data[i].cover
					}
				})
				uni.request({
					url: this.url2,
					success: (res) => {
						let data
						if (!this.isOnload) {
							data = res.data.ranking.books
						} else {
							data = res.data.books
						}
						this.monthList = data
						for (let i = 0; i < this.monthList.length; i++)
							this.monthList[i].cover = 'https://img22.aixdzs.com/' + data[i].cover
					}
				})
				uni.request({
					url: this.url3,
					success: (res) => {
						let data
						if (!this.isOnload) {
							data = res.data.ranking.books
						} else {
							data = res.data.books
						}
						this.allList = data
						for (let i = 0; i < this.allList.length; i++)
							this.allList[i].cover = 'https://img22.aixdzs.com/' + data[i].cover
					}
				})

			},
			getBookDetail(id, name) {
				uni.navigateTo({
					url: '../bookDetail/bookDetail?id=' + id
				})
			},
			getSwiper(num) {
				this.current = num
			},
			swiperChange(res) {
				this.current = res.detail.current
				console.log('current', this.current)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.leaderBoardContainer {
		overflow: hidden;

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

		.leaderBoard {
			z-index: 1;
			background-color: #FFFFFF;
			width: 90%;
			margin: 40rpx 5% 40rpx;
			border-radius: 20rpx;
			padding: 30rpx;
			box-sizing: border-box;
			height: 2000rpx;

			.topSelect {
				display: flex;
				justify-content: space-around;
				padding: 20rpx 0;
				// border-bottom: 5rpx solid #eeeeee;

				view {
					padding-bottom: 10rpx;
				}

				.titleSelect {
					color: #b8c4ee;
					border-bottom: 5rpx solid #b8c4ee;
				}
			}

			.swiper {
				height: 92%;

				.swiper-item {
					height: 100%;
					overflow-y: scroll;

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
			}
		}
	}
</style>
