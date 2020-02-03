<template>
	<view class="uni-padding-wrap">
		<view class="manageIn" @click="goManage">
			管理入口
		</view>
		<form @submit="formSubmit" @reset="formReset">
			<view class="uni-form-item uni-column">
				<view class="title">企业号</view>
				<input class="uni-input" name="company" placeholder="请输入企业号" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">部门编号</view>
				<input class="uni-input" name="department" placeholder="请输入部门编号" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">工号</view>
				<input class="uni-input" name="jobnumber" placeholder="请输入工号" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">姓名</view>
				<input class="uni-input" name="name" placeholder="请输入姓名" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">在过去的14天内，是否出过本地区</view>
				<radio-group name="questionA">
					<label>
						<radio value="1" /><text>是</text>
					</label>
					<label>
						<radio value="0" /><text>否</text>
					</label>
				</radio-group>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">在过去的14天内，是否到过湖北</view>
				<radio-group name="questionB">
					<label>
						<radio value="1" /><text>是</text>
					</label>
					<label>
						<radio value="0" /><text>否</text>
					</label>
				</radio-group>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">在过去的14天内，是否与湖北旅居人员接触</view>
				<radio-group name="questionC">
					<label>
						<radio value="1" /><text>是</text>
					</label>
					<label>
						<radio value="0" /><text>否</text>
					</label>
				</radio-group>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">是否与疑似病例接触</view>
				<radio-group name="questionD">
					<label>
						<radio value="1" /><text>是</text>
					</label>
					<label>
						<radio value="0" /><text>否</text>
					</label>
				</radio-group>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">在过去的14天内，是否经停湖北</view>
				<radio-group name="questionE">
					<label>
						<radio value="1" /><text>是</text>
					</label>
					<label>
						<radio value="0" /><text>否</text>
					</label>
				</radio-group>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">在过去的14天内，是否在外地乘坐公共交通工具（包括：火车，飞机，汽车等）</view>
				<radio-group name="questionF">
					<label>
						<radio value="1" /><text>是</text>
					</label>
					<label>
						<radio value="0" /><text>否</text>
					</label>
				</radio-group>
			</view>
			
			<view class="uni-form-item uni-column">
				<view class="title">在过去的14天内，是否有发热，呼吸道症状等</view>
				<radio-group name="questionG">
					<label>
						<radio value="1" /><text>是</text>
					</label>
					<label>
						<radio value="0" /><text>否</text>
					</label>
				</radio-group>
			</view>

			<view class="uni-btn-v">
				<button form-type="submit" type='primary'>提交</button>
				<button type="default" form-type="reset">重置</button>
			</view>
		</form>
	</view>
</template>


<style>
	.uni-form-item .title {
		padding: 20rpx 0;
	}

	.manageIn {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		color: #007aff;
		text-decoration: underline;
	}
</style>
<script>
	var graceChecker = require('common/graceChecker.js');
	import {
		mapState
	} from 'vuex';
	export default {
		computed: mapState(['hasLogin']),
		methods: {
			goManage: function() {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '../login/index'
					});
				} else {
					uni.navigateTo({
						url: '../manager/index'
					});
				}
				
				
				
			},
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				//定义表单规则
				var rule = [{
						name: "company",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请填写企业号"
					},
					{
						name: "jobnumber",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请填写工号"
					},
					{
						name: "name",
						checkType: "string",
						checkRule: "1,4",
						errorMsg: "姓名应为1-4个字符"
					},
					{
						name: "questionA",
						checkType: "in",
						checkRule: "0,1",
						errorMsg: "请选择在过去的14天内，是否出过本地区"
					},
					{
						name: "questionB",
						checkType: "in",
						checkRule: "0,1",
						errorMsg: "请选择在过去的14天内，是否到过湖北"
					},
					{
						name: "questionC",
						checkType: "in",
						checkRule: "0,1",
						errorMsg: "请选择在过去的14天内，是否与湖北旅居人员接触"
					},
					{
						name: "questionD",
						checkType: "in",
						checkRule: "0,1",
						errorMsg: "请选择是否与疑似病例接触"
					},
					{
						name: "questionE",
						checkType: "in",
						checkRule: "0,1",
						errorMsg: "请选择在过去的14天内，是否经停湖北"
					},
					{
						name: "questionF",
						checkType: "in",
						checkRule: "0,1",
						errorMsg: "请选择在过去的14天内，是否在外地乘坐公共交通工具（包括：火车，飞机，汽车等）"
					},
					{
						name: "questionG",
						checkType: "in",
						checkRule: "0,1",
						errorMsg: "请选择在过去的14天内，是否有发热，呼吸道症状等"
					}
				];
				//进行表单检查
				var formData = e.detail.value;

				var checkRes = graceChecker.check(formData, rule);
				if (!checkRes) {
					uni.showToast({
						title: graceChecker.error,
						icon: "none"
					});
				} else {
					uniCloud.callFunction({
						name: 'company_collect_save',
						data: formData
					}).then((res) => {
						uni.hideLoading()
						uni.showModal({
							content: `提交成功，建议:${res.result}`,
							showCancel: false
						})
						console.log(res)
					}).catch((err) => {
						uni.hideLoading()
						uni.showModal({
							content: `添加数据失败，错误信息为：${err.message}`,
							showCancel: false
						})
						console.error(err)
					})

				}

			},
			formReset: function(e) {
				console.log('清空数据')
			}

		}
	}
</script>
