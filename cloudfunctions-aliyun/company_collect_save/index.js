'use strict';
const adviceTxt = {
	1: '可以直接上班',
	2: '专家判断是否需要隔离',
	3: '居家或到当地指定地点隔离14天',
	4: '去定点发烧门诊就诊',
	5: '常规感冒治疗'
}

const db = uniCloud.database()
exports.main = async (event, context) => {
	// 有湖北嫌疑
	if(event.questionB=='1'
	|| event.questionC=='1'
	|| event.questionD=='1'
	|| event.questionE=='1'
	) {
		// 有症状
		if(event.questionG=='1') {
			event.advice = 4;
		}
		// 无症状
		else {
			event.advice = 3;
		}
	}
	// 无湖北嫌疑
	else {
		// 乘坐外地公共交通工具
		if(event.questionF=='1') {
			// 发烧
			if (event.questionG=='1') {
				event.advice = 4;
			}
			// 无发烧
			else {
				event.advice = 3;
			}
		}
		// 无乘坐外地公共交通工具
		// 未出过本地区
		else if(event.questionA=='0'){
			// 发烧
			if (event.questionG=='1') {
				event.advice = 5;
			}
			// 无发烧
			else {
				event.advice = 1;
			}
		}
		else {
			// 发烧
			if (event.questionG=='1') {
				event.advice = 2;
			}
			// 无发烧
			else {
				event.advice = 1;
			}
		}
	}
	event.createTime = Date.now();
	const collection = db.collection('company_collect');
	const userRes = await collection.where({'jobnumber':event.jobnumber,'company':event.company}).get();
	
	if(userRes.data.length>0) {
		await collection.where({'jobnumber':event.jobnumber,'company':event.company}).update(event);
	}
	else {
		await collection.add(event);
	}
	return adviceTxt[event.advice];
};
