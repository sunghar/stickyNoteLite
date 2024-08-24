class idEvent {
	constructor(idName, eventsType, func) {
		this.idName = idName;
		this.eventsType = eventsType;
		this.func = func;
	}
}
class idEventBinder {
	constructor() {
		this.idEventList = [];
	}
	add(...items) {
		this.idEventList.push(...items);
		return this;
	}
	bind() {
		this.idEventList.forEach(function (idEvent, index) {
			document.getElementById(idEvent.idName).addEventListener(idEvent.eventsType, idEvent.func.execute.bind(idEvent.func));
		});
	}
}

class callbackExecutor{
	static withCallback(targetFunc ,callbackFunc) {
		return new callbackExecutor(targetFunc, callbackFunc);
	}

	static noCallback(targetFunc) {
		return new callbackExecutor(targetFunc, null);
	}
	constructor(targetFunc, callbackFunc) {
		this.targetFunc = targetFunc;
		this.callbackFunc = callbackFunc;
	}
	execute(event) {
		//console.log("targetFunc" + this.targetFunc);
		//console.log("callbackFunc" + this.callbackFunc);
		if (this.callbackFunc != null) {
			this.callbackFunc(this.targetFunc(event));
		} else {
			this.targetFunc(event);
		}
	}
}