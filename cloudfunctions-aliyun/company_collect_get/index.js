'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const skipCount = (event.page - 1) * event.size;
	
	// if(!event.company) {
	// 	return '查询异常';
	// }
	const whereArr = {
		company: `${event.company}` || ''
	};
	if(event.advice>0) {
		whereArr.advice = event.advice;
	}
	if(event.name) {
		whereArr.name = event.name;
	}
	if(event.department) {
		whereArr.department = event.department;
	}
	let collection = db.collection('company_collect').where(whereArr);
	const totalRes = await collection.count();
	let res = {};
	if (totalRes.total>0) {
	// const res = await collection.limit(size).get()
		res = await collection.skip(skipCount).limit(event.size).orderBy("createTime", "desc").get();
	}
	return {
		page: event.page,
		size: event.size,
		total: totalRes.total || 0,
		data: res.data || []
	};
};
