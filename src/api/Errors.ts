export const enum ErrorCodes {
	UNKNOWN_ERROR = -1,
	INVALID_SIZE_ERROR = 1000,
	NO_IMAGES_ERROR = 1001,
}

export function getErrorID(code:ErrorCodes) {
	switch (code) {
		case ErrorCodes.INVALID_SIZE_ERROR: return "INVALID_SIZE_ERROR";
		case ErrorCodes.NO_IMAGES_ERROR: return "NO_IMAGES_ERROR";
		default: return "UNKNOWN_ERROR";
	}
}

export class ApiError extends Error {
	public code:ErrorCodes;
	public args:any[];

	constructor(code:ErrorCodes, ...args:any[]) {
		// nothing to do
		super();
		this.code = code;
		this.args = args;
	}

	override toString() {
		return `ApiError: ${getErrorID(this.code)} (${this.code}): ${this.args.join(", ")}`;
	}
}