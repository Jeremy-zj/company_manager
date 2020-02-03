<template>
	<view class="uni-padding-wrap">
		<view class="companyInfo">
			<view>
				企业号：{{userInfo.company_no}}
				部门：{{userInfo.department || '-'}}
			</view>
			<view class="linkTxt" @click="quitLogin">退出</view>
		</view>
		<form @submit="formSubmit" @reset="formReset">
			<view class="uni-form-item">
				<view class="title">姓名：</view>
				<input class="uni-input" name="name" placeholder="请输入姓名" />
			</view>
			<view class="uni-form-item">
				<view class="title">筛查结果：</view>
				<view class="uni-list-cell-db">
					<picker @change="bindPickerChange" :value="adviceIndex" :range="adviceArr" range-key="name">
						<view class="uni-input" name="advert">{{adviceArr[adviceIndex]}}</view>
					</picker>
				</view>
			</view>
		
			<view class="button-sp-area" style="text-align: center;">
				<button form-type="submit" class="mini-btn" type="primary" size="mini" style="margin-right: 15rpx;">搜索</button>
				<button type="default" form-type="reset" class="mini-btn" size="mini">重置</button>
			</view>
		</form>
		<!-- <button type="primary" @click="get">员工信息导出excel</button> -->
		<!-- <download-excel :data="json_data" name="excel.xls">
			下载文件
		</download-excel> -->
		<view class="uni-flex uni-column table-content">
			<view class="uni-flex uni-row table-header">
				<view class="flex-item table-column" style="width: 17%;">员工</view>
				<view class="flex-item table-column" style="width: 15%;">部门</view>
				<view class="flex-item table-column" style="width: 25%;">筛查结果</view>
				<view class="flex-item table-column" style="width: 28%;">时间</view>
				<view class="flex-item table-column" style="width: 15%;">操作</view>
			</view>
			<view class="flex-item flex-item-V" v-for="(item, index) in json_data" v-bind:key="index">
				
				<view class="uni-flex uni-row table-body">
					<view class="flex-item" style="width: 17%; text-align: center;">
						<view>{{item.jobnumber}}</view>
						<view>{{item.name}}</view>
					</view>
					<view class="flex-item table-column" style="width: 15%;">{{item.department}}</view>
					<view class="flex-item table-column" :style="{color: adviceShowColor[item.advice], width: '25%'}">{{adviceArr[item.advice]}}</view>
					<view class="flex-item table-column" style="width: 28%;">{{item.dateF}}</view>
					<view class="flex-item table-column linkTxt" style="width: 15%;" @click="goDetail(item)">详情</view>
				</view>
			</view>
		</view>
		<view class="pageList">
			<uni-pagination :total="total" :current="page" :pageSize="size" @change="changePage"></uni-pagination>
		</view>
		<view class="pageDesc">第{{page}}页，总共{{total}}条，每页{{size}}条</view>
		<uni-popup ref="popup" type="center">
			<view class="popupCon">
				<view>姓名：{{currItem.name}}</view>
				<view>在过去的14天内，是否出过本地区：{{radioTxt[currItem.questionA]}}</view>
				<view>在过去的14天内，是否到过湖北：{{radioTxt[currItem.questionB]}}</view>
				<view>在过去的14天内，是否与湖北旅居人员接触：{{radioTxt[currItem.questionC]}}</view>
				<view>是否与疑似病例接触：{{radioTxt[currItem.questionD]}}</view>
				<view>在过去的14天内，是否经停湖北：{{radioTxt[currItem.questionE]}}</view>
				<view>在过去的14天内，是否在外地乘坐公共交通工具（包括：火车，飞机，汽车等）：{{radioTxt[currItem.questionF]}}</view>
				<view>在过去的14天内，是否有发热，呼吸道症状等：{{radioTxt[currItem.questionG]}}</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import uniPagination from '@dcloudio/uni-ui/lib/uni-pagination/uni-pagination.vue';
	import uniPopup from "@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue";
	import moment from 'moment';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			uniPagination,
			uniPopup
		},
		computed: mapState(['hasLogin', 'userInfo']),
		data() {
			return {
				radioTxt: {1: '是', 0: '否'},
				adviceArr: [
					'全部',
					'可以直接上班',
					'专家判断是否需要隔离',
					'居家或到当地指定地点隔离14天',
					'去定点发烧门诊就诊',
					'常规感冒治疗'
				],
				adviceIndex: 0,
				json_data: [],
				total: 30,
				page: 1,
				size: 10,
				formData: {},
				adviceShowColor:{
					1:'green',
					2:'blue',
					3:'orange',
					4:'red',
					5:'purple'
				},
				/**
				 *  1. 可以直接上班 （绿色）
					2. 需要专家判断是否需要隔离（蓝色）
					3. 需要居家隔离（橙色）
					4. 需要去定点发烧门诊就诊（红色）
					5. 需要常规感冒治疗（黄色）
				 */
				currItem: {}
			}
		},
		methods: {
			...mapMutations(['logout']),
			bindPickerChange: function(e) {
				this.adviceIndex = e.target.value
			},
			formSubmit: function(e) {
				//进行表单检查
				var formData = e.detail.value;
				formData.advice = this.adviceIndex;
				formData.page = 1;
				formData.size = this.size;
				this.formData = {...this.formData, ...formData};
				this.get();
			},
			formReset: function(e) {
				console.log('清空数据')
				this.adviceIndex = 0;
			},
			changePage: function(e) {
				this.page = e.current;
				this.formData.page = e.current;
				this.get();
			},
			get() {
				uni.showLoading({
					title: '处理中...'
				})
				uniCloud.callFunction({
					name: 'company_collect_get',
					data: this.formData
				}).then((res) => {
					console.log(res)
					uni.hideLoading()
					const resData = res.result || {};
					const arr = resData.data || [];
					for(var i = 0, len = arr.length; i < len; i += 1) {
						arr[i].dateF = moment(arr[i].createTime).format('YYYY-MM-DD HH:mm:ss');
					}
					this.json_data = arr;
					this.total = resData.total || 0;
					this.page = resData.page || 1;
				}).catch((err) => {
					console.log(err);
					uni.hideLoading()
					uni.showModal({
						content: `查询失败，错误信息为：${err.message}`,
						showCancel: false
					})
				})
			},
			quitLogin: function() {
				this.logout();
				uni.navigateTo({
					url: '../login/index'
				});
			},
			goDetail: function(d) {
				this.currItem = d;
				this.$refs.popup.open();
			}
		},
		onShow() {
			console.log('用户信息：', this.userInfo);
			if(this.hasLogin) {
				this.formData = {
					page: this.page,
					size: this.size,
					company: this.userInfo.company_no,
					department: this.userInfo.department,
					name: '',
					advice: this.adviceIndex
				
				};
				this.get();
			} else {
				this.quitLogin();
			}
		}
	}
</script>
<style>
	.uni-form-item .title {
		padding: 14rpx 0;
		width: 180rpx;
		text-align: right;
		background-color: #FFFFFF;
	}
	.companyInfo {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
	}
	.linkTxt {
		color: #007aff;
		text-decoration: underline;
		display: inline;
	}
	.table-content {
		padding: 10rpx 0;
	}
	.table-column {
		text-align: center;
		line-height: 40rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.table-header {
		justify-content: space-between;
		color: #909399;
		background-color: #FFFFFF;
		border-top: 1px solid #ebeef5;
		border-bottom: 1px solid #ebeef5;
		padding: 18rpx 0;
	}
	.table-body {
		justify-content: space-between;
		background-color: #FFFFFF;
		border-bottom: 1px solid #ebeef5;
		padding: 10rpx 0;
		color: #888888;
	}
	.pageList {
		background-color: #FFFFFF;
		margin-top: 20rpx;
		
	}
	.pageDesc {
		text-align: center;
		margin-top: 10rpx;
		margin-bottom: 40rpx;
	}
	.popupCon {
		background-color: #FFFFFF;
		padding: 30rpx 40rpx;
	}
</style>
