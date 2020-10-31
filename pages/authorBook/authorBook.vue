<template>
	<view class="authorBookContainer">
		<view class="bg"></view>
		<view class="bgbar" :style="{'height': allBarHeight}"></view>
		<navBar :nav="setNav"></navBar>
		<view class="bookList">
			<view class="bookBox" v-for="(item,index) in bookList" :key="index" @click="getBookDetail(item._id,item.title)">
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
				author: '',
				bookList: [],
			}
		},
		created() {
			if (uni.getStorageSync('barInfo')) {
				this.allBarHeight = uni.getStorageSync('barInfo').allBarHeight
			}
		},
		computed: {
			getNavTitle() {
				this.setNav.navTitle = this.author
			},
		},
		onLoad(options) {
			this.author = options.author
		},
		mounted() {
			this.getBookList()
		},
		methods: {
			getBookList(){
				uni.request({
					url: 'https://api.aixdzs.com/author?gender=' + this.author,
					success: (res) => {
						this.bookList = res.data.books
						for (let i = 0; i < this.bookList.length; i++)
							this.bookList[i].cover = 'https://img22.aixdzs.com/' + res.data.books[i].cover
					}
				})
			},
			getBookDetail(id, name) {
				uni.navigateTo({
					url: '../bookDetail/bookDetail?id=' + id
				})
			},
		}
	}
</script>

<style lang="scss">
	.authorBookContainer {
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
		
		.bookList {
			z-index: 1;
			background-color: #FFFFFF;
			width: 90%;
			margin: 40rpx 5% 40rpx;
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
	}
</style>
