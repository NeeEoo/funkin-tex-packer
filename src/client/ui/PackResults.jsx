import React from 'react';
import { Observer, GLOBAL_EVENT } from '../Observer';
import TextureView from './TextureView';
import SpritesPlayer from './SpritesPlayer';
import I18 from '../utils/I18';

class PackResults extends React.Component {
	constructor(props) {
		super(props);

		this.spritesPlayerRef = React.createRef();
		this.rangeRef = React.createRef();
		this.wheelRef = React.createRef();

		this.textureBackColors = ["grid-back", "white-back", "pink-back", "black-back"];
		this.step = 0.01;

		this.state = {
			packResult: null,
			textureBack: this.textureBackColors[0],
			displayOutline: false,
			selectedImages: [],
			playerVisible: false,
			scale: 1
		};
	}

	componentDidMount = () => {
		this.wheelRef.current.addEventListener('wheel', this.handleWheel, { passive: false });

		Observer.on(GLOBAL_EVENT.PACK_COMPLETE, this.updatePackResult, this);
		Observer.on(GLOBAL_EVENT.IMAGES_LIST_SELECTED_CHANGED, this.onImagesSelected, this);
	}

	onImagesSelected = (data) => {
		this.setState({selectedImages: data});
	}

	updatePackResult = (data) => {
		//console.log(data);
		Observer.emit(GLOBAL_EVENT.STATS_INFO, {
			packResults: data
		});
		this.setState({packResult: data});
	}

	setBack = (e) => {
		let classNames = e.target.className.split(" ");
		for(let name of classNames) {
			if(this.textureBackColors.indexOf(name) >= 0) {
				this.setState({textureBack: name});
				return;
			}
		}
	}

	clearSelection = () => {
		if(this.state.playerVisible) return;

		Observer.emit(GLOBAL_EVENT.IMAGE_CLEAR_SELECTION, null);
	}

	handleWheel = (event) => {
		if(!event.ctrlKey) return;

		let value = this.state.scale;
		if (event.deltaY >= 0) {
			if (this.state.scale > 0.1) {
				value = Number((this.state.scale - this.step).toPrecision(2));
				if (value < 0.1) {
					value = 0.1;
				}
				this.setState({scale: value});
			}
		} else {
			if (this.state.scale < 2) {
				value = Number((this.state.scale + this.step).toPrecision(2));
				this.setState({scale: value});
			}
		}

		// update range component
		this.rangeRef.current.value = value;

		event.preventDefault();
		event.stopPropagation();
		return false;
	}

	changeOutlines = (e) => {
		this.setState({displayOutline: e.target.checked});
	}

	changeScale = (e) => {
		this.setState({scale: Number(e.target.value)});
	}

	toggleSpritesPlayer = () => {
		this.setState({playerVisible: !this.state.playerVisible});
	}

	render() {
		let views = [], ix=0;
		if(this.state.packResult) {
			for (let item of this.state.packResult) {
				views.push((
					<TextureView key={"tex-view-" + ix} data={item} scale={this.state.scale} textureBack={this.state.textureBack} selectedImages={this.state.selectedImages} displayOutline={this.state.displayOutline} />
				));
				ix++;
			}
		}

		return (
			<div className="results-view border-color-gray">

				<div className="results-view-wrapper">

					<div ref={this.wheelRef} className="results-view-container back-white" onClick={this.clearSelection}>
						<div className={this.state.playerVisible ? "block-hidden" : "block-visible"}>
							{views}
						</div>
						<div className={!this.state.playerVisible ? "block-hidden" : "block-visible"}>
							<SpritesPlayer ref={this.spritesPlayerRef} data={this.state.packResult} start={this.state.playerVisible} textureBack={this.state.textureBack} />
						</div>
					</div>

					<div className="results-view-footer back-white border-color-gray">

						<hr/>

						<table>
							<tbody>
								<tr>
									{this.textureBackColors.map(name => {
										return (
											<td key={"back-color-btn-" + name}>
												<div className={"btn-back-color " + name + (this.state.textureBack === name ? " selected" : "")} onClick={this.setBack}>&nbsp;</div>
											</td>
										)
									})}
									<td>
										{I18.f("DISPLAY_OUTLINES")}
									</td>
									<td>
										<input type="checkbox" id="result-view-outline" onChange={this.changeOutlines} />
									</td>
									<td>
										{I18.f("SCALE")}
									</td>
									<td style={{width: "50%"}}>
										<input ref={this.rangeRef} style={{width: "100%"}} type="range" min="0.1" max="4" step={this.step} defaultValue="1" onChange={this.changeScale}/>
									</td>
									<td>
										<div className="btn back-800 border-color-gray color-white" onClick={this.toggleSpritesPlayer}>{I18.f("SHOW_SPRITES")}</div>
									</td>
								</tr>
								</tbody>
							</table>
					</div>

				</div>
			</div>
		);
	}
}

export default PackResults;