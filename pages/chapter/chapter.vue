<template>
	<view class="chapterContainer">
		<view class="bg" @click="showOther()" :class="{'nightColor':isNight}"></view>
		<view class="bgbar" :style="{'height': allBarHeight}" :class="{'nightColor':isNight}"></view>
		<navBar :nav="setNav"></navBar>
		<scroll-view class="chapterList" @click="showOther()" :class="{'nightColor':isNight}" :style="{'font-size': sizeNum + 'rpx!important'}">
			<view class="chapterBox" v-for="(item,index) in chapterBodyList" :key="index">
				<view class="chapterLine" :style="{'line-height': heightNum + 'rpx!important'}">{{item}}</view>
			</view>
		</scroll-view>
		<view class="setBox" v-if="isShow">
			<view class="topSet">
				<view class="setButton" @click="getBefore">上一章</view>
				<view class="chapterName">{{chapterName}}</view>
				<view class="setButton" @click="getAfter">下一章</view>
			</view>
			<view class="bottomSet" v-if="!isSet">
				<view class="chapter" @click="showChapter()"><i class="iconfont iconmenu"></i>目录</view>
				<view class="night" @click="setNight()" v-if="!isNight"><i class="iconfont iconyejian"></i>夜间</view>
				<view class="night" @click="setNight()" v-if="isNight"><i class="iconfont iconsunshine"></i>日间</view>
				<view class="setList" @click="goSet()"><i class="iconfont iconziti"></i>选项</view>
				<view class="bookDetail" @click="getDetail()"><i class="iconfont iconimage-text"></i>简介</view>
			</view>
			<view class="setList" v-if="isSet">
				<view class="fontSize">
					<view class="less" @click="lessSizeNum(sizeNum)">-</view>
					<view class="sizeNum">字号：{{sizeNum}}</view>
					<view class="plus" @click="plusSizeNum(sizeNum)">+</view>
				</view>
				<view class="lineHeight">
					<view class="less" @click="lessHeightNum(heightNum)">-</view>
					<view class="heightNum">行高：{{heightNum}}</view>
					<view class="plus" @click="plusHeightNum(heightNum)">+</view>
				</view>
				<view class="defaultSet" @click="setDefault()">默认</view>
			</view>
		</view>
		<view class="bottomInfo" :class="{'nightColor':isNight}">
			<view class="chapterName">{{chapterName}}</view>
			<view class="readPercent">{{readPercent}}</view>
		</view>
		<chapterList class="chapterList" v-if="isChapter" :bookId="setId"></chapterList>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				setId: {
					'bid': '',
					'bookName': '',
					'isNight': '',
				},
				setNav: {
					'isShowBackBtn': true,
					'barColor': 'white',
					'navTitle': '',
				},
				allBarHeight: 0,
				link: '',
				id: '',
				bookName: '',
				readPercent: '',
				chapterName: '',
				chapterBody: '',
				chapterBodyList: [],
				isShow: false,
				isChapter: false,
				isNight: false,
				setData: {},
				isSet: false,
				sizeNum: 0,
				heightNum: 0,
				scrollTop: 0,
			}
		},
		created() {
			if (uni.getStorageSync('barInfo')) {
				this.allBarHeight = uni.getStorageSync('barInfo').allBarHeight
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onReachBottom(e) {
			this.getAfter()
		},
		computed: {
			getNavTitle() {
				this.setNav.navTitle = this.bookName
			},
			getListId() {
				this.setId.bid = this.id
				this.setId.bookName = this.bookName
				this.setId.isNight = this.isNight
			}
		},
		onLoad(options) {
			this.link = options.link
			this.bookName = options.name
			this.id = options.id
		},
		mounted() {
			this.getSetData()
			this.getChapter()
		},
		methods: {
			getChapter() {
				uni.request({
					url: 'https://api.aixdzs.com/chapter/' + this.link,
					success: (res) => {
						this.chapterName = res.data.chapter.title
						let all = uni.getStorageSync('chapterNum' + this.id)
						let one = this.link.split('/')
						let str = ((parseInt(one[1]) / all) * 100).toFixed(2)
						str += "%"
						this.readPercent = str
						this.chapterBody = res.data.chapter.body
						this.chapterBodyList = this.chapterBody.split("\n")
						this.getAllLine()
					}
				})
			},
			getAllLine() {
				let newList = [];
				for (let i = 0; i < this.chapterBodyList.length; i++) {
					if (this.chapterBodyList[i] != '' && this.chapterBodyList[i].indexOf('关注微信') == -1)
						newList.push(this.chapterBodyList[i])
				}
				this.chapterBodyList = [].concat(newList)
			},
			showOther() {
				this.isShow = !this.isShow
				this.isChapter = false
				this.isSet = false
			},
			showChapter() {
				this.isChapter = !this.isChapter
				this.isShow = false
			},
			getBefore() {
				let changelink = this.link.split('/')[1] - 1
				if (changelink > 0) {
					this.link = this.link.split('/')[0] + '/' + changelink
					let linkList = uni.getStorageSync('linkList')
					linkList[0] = this.link
					uni.setStorageSync('linkList', linkList)
					this.getChapter()
					this.$nextTick(function() {
						this.scrollTop = 0
					})
					uni.pageScrollTo({
						duration: 400,
						scrollTop: 0
					})
				} else {
					uni.showToast({
						title: '已是第一章',
						duration: 1500,
					})
				}
			},
			getAfter() {
				let changelink = parseInt(this.link.split('/')[1]) + 1
				let all = uni.getStorageSync('chapterNum' + this.id)
				if (changelink < all) {
					this.link = this.link.split('/')[0] + '/' + changelink
					let linkList = uni.getStorageSync('linkList')
					linkList[0] = this.link
					uni.setStorageSync('linkList', linkList)
					this.getChapter()
					this.$nextTick(function() {
						this.scrollTop = 0
					})
					uni.pageScrollTo({
						duration: 100,
						scrollTop: 0
					})
				} else {
					uni.showToast({
						title: '已是最后一章',
						duration: 1500,
					})
				}
			},
			getSetData() {
				let data = uni.getStorageSync('setData')
				if (data) {
					this.setData = {
						isNight: data.isNight,
						fontSize: data.fontSize,
						lineHeight: data.lineHeight,
					}
					this.isNight = this.setData.isNight
					this.sizeNum = this.setData.fontSize
					this.heightNum = this.setData.lineHeight
				} else {
					this.setData = {
						isNight: false,
						fontSize: 35,
						lineHeight: 50,
					}
					uni.setStorageSync('setData', this.setData)
				}
			},
			setNight() {
				this.isNight = !this.isNight
				this.setData.isNight = this.isNight
				let data = this.setData
				uni.setStorageSync('setData', data)
			},
			getDetail() {
				uni.navigateTo({
					url: '../bookDetail/bookDetail?id=' + this.id
				})
			},
			goSet() {
				this.isSet = true
			},
			lessSizeNum(num) {
				if (num - 1 < 20)
					uni.showToast({
						title: '已达最小值',
					})
				else {
					this.sizeNum = num - 1
					this.setData.fontSize = this.sizeNum
					let data = this.setData
					uni.setStorageSync('setData', data)
				}

			},
			plusSizeNum(num) {
				if (num + 1 > 50)
					uni.showToast({
						title: '已达最大值',
					})
				else {
					this.sizeNum = num + 1
					this.setData.fontSize = this.sizeNum
					let data = this.setData
					uni.setStorageSync('setData', data)
				}

			},
			lessHeightNum(num) {
				if (num - 1 < 30)
					uni.showToast({
						title: '已达最小值',
					})
				else {
					this.heightNum = num - 1
					this.setData.lineHeight = this.heightNum
					let data = this.setData
					uni.setStorageSync('setData', data)
				}

			},
			plusHeightNum(num) {
				if (num + 1 > 70)
					uni.showToast({
						title: '已达最大值',
					})
				else {
					this.heightNum = num + 1
					this.setData.lineHeight = this.heightNum
					let data = this.setData
					uni.setStorageSync('setData', data)
				}

			},
			setDefault() {
				this.sizeNum = 35
				this.heightNum = 50
				this.setData.fontSize = 35
				this.setData.lineHeight = 50
				let data = this.setData
				uni.setStorageSync('setData', data)
			},
		}
	}
</script>

<style lang="scss">
	.chapterContainer {
		.nightColor {
			background-color: #181818 !important;
			color: #9c9a9d !important;
		}

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

		.setBox {
			width: 86%;
			z-index: 10;
			padding: 20rpx 7%;
			position: fixed;
			background-color: #181818;
			bottom: 0;
			color: #FFFFFF;
			text-align: center;
			font-size: 28rpx;

			// border-top: 3rpx solid #eeeeee;
			i {
				font-size: 50rpx;
				margin-bottom: 10rpx;
			}

			.topSet {
				display: flex;
				justify-content: space-between;
				padding: 20rpx;

				.chapterName {
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					width: 60%;
					padding: 20rpx 0;
				}

				.setButton {
					display: inline-block;
					padding: 20rpx 10rpx;
				}
				
				.setButton:active{
					background-color: #000000;
					border-radius: 20rpx;
				}
			}

			.bottomSet {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx;
			}

			.setList {
				padding: 20rpx;
				line-height: 50rpx;
				letter-spacing: 2rpx;

				.less,
				.plus {
					font-size: 50rpx;
				}

				.fontSize,
				.lineHeight {
					display: flex;
					justify-content: space-between;
					margin-bottom: 20rpx;
				}

				.defaultSet {
					float: right;
					display: inline;
					text-align: right;
					padding: 5rpx;
				}
			}
		}

		.bottomInfo {
			z-index: 2;
			width: 90%;
			position: fixed;
			display: flex;
			justify-content: space-between;
			background-color: #8591db;
			box-shadow: 0 0 100rpx #8591db;
			border: none;
			bottom: 0;
			padding: 10rpx 5%;
			color: #FFFFFF;
			font-size: 25rpx;

			.chapterName {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				padding-right: 20rpx;
			}
		}

		.chapterList {
			z-index: 1;
			width: 90%;
			margin: 40rpx 5% 60rpx;
			padding-bottom: 800rpx;
			border-radius: 20rpx;
			letter-spacing: 3rpx;
			font-size: 35rpx;

			.chapterLine {
				margin-bottom: 30rpx;
				line-height: 50rpx;
			}
		}
	}
</style>
