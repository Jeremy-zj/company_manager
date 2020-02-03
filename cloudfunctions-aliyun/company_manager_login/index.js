'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	
	// return event;
	let whereArr = {
		username:event.username
	};
	let collection = db.collection('company_accout').where(whereArr);
	const userRes = await collection.get();
	if (userRes.data.length==0) {
		return {
			status:0,
			errorMsg:'帐号不存在'
		}
	}
	if(userRes.data[0].password!=event.password) {
		return {
			status:0,
			errorMsg:'帐号密码不正确'
		}
	}
	delete userRes.data[0].password;
	return {
		status:1,
		data:userRes.data[0]
	};
};
