export function smartSortImages(f1: string, f2: string) {
	let t1 = f1.split('/');
	let t2 = f2.split('/');

	let n1 = t1.pop();
	let n2 = t2.pop();

	let p1 = t1.join('/');
	let p2 = t2.join('/');

	if(p1 === p2) {
		t1 = n1.split('.');
		t2 = n2.split('.');

		if(t1.length > 1) t1.pop();
		if(t2.length > 1) t2.pop();

		let nn1 = parseInt(t1.join('.'), 10);
		let nn2 = parseInt(t2.join('.'), 10);

		if(!isNaN(nn1) && !isNaN(nn2)) {
			if(nn1 === nn2) return 0;
			return nn1 > nn2 ? 1 : -1;
		}
	}

	if(f1 === f2) return 0;
	return f1 > f2 ? 1 : -1;
}

export function cleanPrefix(str: string) {
	let parts = str.split(".");
	if(parts.length > 1) parts.pop();
	str = parts.join(".");

	let lastDigit = "";
	let c = "";
	do {
		c = str[str.length-1];
		if(c >= '0' && c <= '9') {
			str = str.slice(0, str.length - 1);
			lastDigit = c;
		}
	} while(c >= '0' && c <= '9');

	return str + lastDigit;
}

export function removeFromArray<T>(arr: T[], item: T) {
	const idx = arr.indexOf(item);

	if (idx !== -1) {
		arr.splice(idx, 1);
	}
}

export function deepClone(obj:any):any {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (Array.isArray(obj)) {
		const newArray = [];
		for (let i = 0; i < obj.length; i++) {
			newArray[i] = deepClone(obj[i]);
		}
		return newArray;
	}

	const newObj:any = {};
	for (const key in obj) {
		if (Object.hasOwn(obj, key)) {
			newObj[key] = deepClone(obj[key]);
		}
	}

	return newObj;
}

export function isNullOrUndefined(val: any) {
	return val === null || val === undefined;
}