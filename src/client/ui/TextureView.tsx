import * as React from 'react';
import type { PackResultsData } from 'types';
import type { Rect } from 'api/types';
import TypedObserver from 'TypedObserver';
import { Observer, GLOBAL_EVENT } from '../Observer';
import I18 from '../locale/I18';

interface TextureViewProps {
	readonly data: PackResultsData;
	readonly scale: number;
	readonly selectedImages: string[];
	readonly displayOutline: boolean;
	readonly textureBack: string;
}

class TextureView extends React.Component<TextureViewProps> {
	readonly backRef: React.RefObject<HTMLDivElement>;
	readonly viewRef: React.RefObject<HTMLCanvasElement>;

	constructor(props: TextureViewProps) {
		super(props);

		this.backRef = React.createRef();
		this.viewRef = React.createRef();
	}

	override componentDidMount = () => {
		this.updateView();
	}

	override componentDidUpdate() {
		this.updateView();
	}

	updateView = () => {
		const view = this.viewRef.current;
		if(view) {
			view.width = this.props.data.buffer.width;
			view.height = this.props.data.buffer.height;

			view.style.width = Math.floor(view.width * this.props.scale) + "px";
			view.style.height = Math.floor(view.height * this.props.scale) + "px";

			const ctx = view.getContext("2d");
			if(!ctx) {
				Observer.emit(GLOBAL_EVENT.HIDE_PROCESSING);
				TypedObserver.showMessage.emit(I18.f('ERROR_NO_CONTEXT'));

				return;
			}

			ctx.clearRect(0, 0, view.width, view.height);

			if(this.props.selectedImages.length) {
				ctx.globalAlpha = 0.35;
			}

			ctx.drawImage(this.props.data.buffer, 0, 0, view.width, view.height, 0, 0, view.width, view.height);

			if(this.props.displayOutline) {
				for (const item of this.props.data.data) {
					if(!item.cloned) {
						this.drawOutline(ctx, item);
					}
				}
			}

			ctx.globalAlpha = 1;

			for (let item of this.props.data.data) {
				if(this.props.selectedImages.indexOf(item.file) >= 0 || this.props.selectedImages.indexOf(item.originalFile) >= 0) {
					let frame = item.frame;

					let w = frame.w, h = frame.h;
					if(item.rotated) {
						w = frame.h;
						h = frame.w;
					}

					ctx.clearRect(frame.x, frame.y, w, h);
					ctx.drawImage(this.props.data.buffer, frame.x, frame.y, w, h, frame.x, frame.y, w, h);

					if(this.props.displayOutline) this.drawOutline(ctx, item);

					ctx.beginPath();

					if(ctx.setLineDash) ctx.setLineDash([4, 2]);
					ctx.strokeStyle = "#000";
					ctx.lineWidth = 1;
					ctx.rect(frame.x, frame.y, w, h);

					ctx.stroke();
				}
			}

			let back = this.backRef.current;
			back.className = "texture-view " + this.props.textureBack;
		}
	}

	drawOutline(ctx: CanvasRenderingContext2D, item: Rect) {
		let frame = item.frame;
		let w = frame.w, h = frame.h;
		if(item.rotated) {
			w = frame.h;
			h = frame.w;
		}

		ctx.strokeStyle = "#00F";
		ctx.fillStyle = "rgba(0,0,255,0.25)";
		ctx.lineWidth = 1;

		ctx.beginPath();
		ctx.fillRect(frame.x, frame.y, w, h);
		ctx.rect(frame.x, frame.y, w, h);
		ctx.moveTo(frame.x, frame.y);
		ctx.lineTo(frame.x + w, frame.y + h);
		ctx.stroke();
	}

	onViewClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		let selectedItem = null;

		let canvas = this.viewRef.current;
		let rect = canvas.getBoundingClientRect();
		let x = (e.clientX - rect.left) / this.props.scale;
		let y = (e.clientY - rect.top) / this.props.scale;

		for (let item of this.props.data.data) {
			let w = item.frame.w;
			let h = item.frame.h;
			if(item.rotated) {
				w = item.frame.h;
				h = item.frame.w;
			}

			if(x >= item.frame.x &&
				x < item.frame.x + w &&
				y >= item.frame.y &&
				y < item.frame.y + h
			) {
				selectedItem = item;
				break;
			}
		}

		if(selectedItem) {
			TypedObserver.imageSelected.emit({
				isFolder: false,
				path: selectedItem.file,
				ctrlKey: e.ctrlKey || e.shiftKey,
				shiftKey: false
			});

			this.selectCloned(selectedItem);
		}

		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	selectCloned = (selectedItem: Rect) => {
		for (let item of this.props.data.data) {
			if(item.cloned && item.file === selectedItem.file) {
				TypedObserver.imageSelected.emit({
					isFolder: false,
					path: item.originalFile,
					ctrlKey: true,
					shiftKey: false
				});
			}
		}
	}

	override render() {
		return (
			<div ref={this.backRef} className="texture-view">
				<canvas ref={this.viewRef} onClick={this.onViewClick}></canvas>
			</div>
		);
	}
}

export default TextureView;