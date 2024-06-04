class Filter {
	constructor() {
		// nothing to do
	}

	apply(buffer: HTMLCanvasElement) {

		let retCanvas = document.createElement("canvas");
		let retCtx = retCanvas.getContext("2d");

		retCanvas.width = buffer.width;
		retCanvas.height = buffer.height;

		let bufferCtx = buffer.getContext("2d");
		let imageData = bufferCtx.getImageData(0, 0, buffer.width, buffer.height);

		retCtx.putImageData(this.applyImageData(imageData), 0, 0);

		return retCanvas;
	}

	applyImageData(imageData: ImageData) {
		return imageData;
	}

	static get type() {
		return "none";
	}
}

export default Filter;