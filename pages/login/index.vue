<template>
	<view class="content">
		<view class="jobIn" @click="goJob">
			调查入口
		</view>
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input class="m-input" type="text" clearable focus v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="formSubmit" style="margin-bottom: 20rpx;">登录</button>
			<button type="default" form-type="reset" @tap="formReset">重置</button>
		</view>
	</view>
</template>



<style scoped>
.jobIn {
		position: absolute;
		top: 5rpx;
		right: 30rpx;
		color: #007aff;
		text-decoration: underline;
	}
</style>
<script>
	import mInput from '../../components/m-input.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			mInput
		},
		data() {
			return {
				username: '',
				password: ''
			}
		},
		methods: {
			...mapMutations(['login']),
			goJob: function() {
				uni.navigateTo({
					url: '../form/form'
				});
			},
			formSubmit: function() {
				if (this.username.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请填写帐号'
					});
					return;
				}
				if (this.password.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请填写密码'
					});
					return;
				}
				uni.showLoading({
					title: '正在登录...'
				})
				uniCloud.callFunction({
					name: 'company_manager_login',
					data: {username: this.username, password: this.password}
				}).then((res) => {
					uni.hideLoading()
					// 登录失败
					if (res.result.status==0) {
						uni.showToast({
							title: `${res.result.errorMsg}`,
							icon: "none"
						});
					}
					// 登录成功
					else {
						const resData = res.result || {};
						const userInfo = resData.data || {};
						this.login(userInfo);
						// 跳转到首页
						uni.showToast({
							icon: 'success',
							title: '登录成功'
						});
						setTimeout(function(){
							uni.reLaunch({
								url: '../manager/index'
							});
						}, 800);
					}
				}).catch((err) => {
					uni.hideLoading()
					uni.showModal({
						content: `登录失败，错误信息为：${err.message}`,
						showCancel: false
					})
					console.error(err)
				})
			},
			formReset: function(e) {
				this.username = '';
				this.password = '';
			}
		}
	}
</script>
