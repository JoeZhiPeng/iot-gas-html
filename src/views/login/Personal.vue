<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 个人信息
 * @Date: 2019-04-16 16:52:32
 * @LastEditTime: 2019-04-26 08:37:11
 -->

<template>
	<div class="app-container personal-view" :style="{ height: tableHeight + 'px' }">
		<div class="user-name">
			<div>
				<img src="../../assets/img/self-photo.png">
			</div>
			<p>贵州燃气项目管理员</p>
		</div>
		<fieldset>
			<legend>个人信息</legend>
			<ul>
				<li>账&nbsp;&nbsp;&nbsp;号：
					{{ userInfo.account }}
				</li>
				<li>昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：
					<span v-if="userInfo.nick">{{ userInfo.nick }}</span>
					<span v-else>暂未定义</span>
				</li>
				<li>用户属性：
					<span v-if="userInfo.superadmin">超级管理员</span>
					<span v-else>普通用户</span>
				</li>
				<li>手机号：
					{{ userInfo.phone }}
				</li>
				<li>邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱：
					{{ userInfo.email }}
				</li>
				<li>账号状态：
					<span v-if="userInfo.valid">可用</span>
					<span v-else>不可用</span>
				</li>
				<li>联系人：
					{{ userInfo.contacts }}
				</li>
				<li>角色列表：
					<span v-if="userInfo.roles.length > 0">{{ userInfo.roles }}</span>
					<span v-else>暂未赋权</span>
				</li>
			</ul>
		</fieldset>
	</div>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		data() {
			return {
				heightData: 540
			}
		},
		computed: {
			...mapGetters([
				'userInfo'
			]),
			tableHeight: function() {
				let height = document.documentElement.offsetHeight || document.body.offsetHeight;
				this.heightData = height - 38;
				return this.heightData;
			}
		},
		mounted() {

		},
		methods: {
			
		}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.user-name{
		background: linear-gradient( #f4b02d, #c4090c);
		border-radius: 10px;
		text-align: center;
		padding: 50px 0;
		margin-bottom: 30px;
		color: #fff;
		div{
			background: #fff;
			width: 150px;
			height: 150px;
			border-radius: 50%;
			margin: 20px auto;
			margin-top: 0
		}
		img{
			width: 150px;
		}
		p{
			font-weight: bolder;
			letter-spacing: 5px
		}
	}
	fieldset{
		border-color: #f8f8f8;
		font-size: 20px;
		ul{
			display: inline-block;
			width: 100%;
			padding: 30px 0;
			font-size: 16px;
			li{
				display: inline-block;
				float: left;
				width: 33%;
				margin: 10px 0;
				padding-left: 5%
			}
		}
	}
</style>