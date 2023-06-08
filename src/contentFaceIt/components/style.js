import { EXTENSION_NAME } from '../../shared/constants';

export const createStylingElement = (parent) => {
	const rootStyling = document.createElement('style');

	rootStyling.setAttribute('id', `${EXTENSION_NAME}-styling`);
	rootStyling.textContent = `
		div#${EXTENSION_NAME}-button-group {
			text-align: start;
		}
	
		div#${EXTENSION_NAME}-button-group > button.${EXTENSION_NAME}-toggle:first-child {
			border-radius: 4px 0 0 4px;
		}
	
		div#${EXTENSION_NAME}-button-group > button.${EXTENSION_NAME}-toggle:last-child {
			border-radius: 0 4px 4px 0;
		}
	
		button.${EXTENSION_NAME}-toggle {
			background: #1f1f1f;
			border: 1px solid #303030;
			color: rgba(255, 255, 255, 0.6);
			cursor: pointer;
			overflow: hidden;
			padding: 6px 12px;
			transition: background 100ms;
		}
	
		button.${EXTENSION_NAME}-toggle:hover:not(.${EXTENSION_NAME}-toggle-active) {
			background: #282828;
		}
	
		button.${EXTENSION_NAME}-toggle-active {
			background: #303030;
			color: #fff;
		}
	
		div.${EXTENSION_NAME}-stats {
			display: flex;
			align-items: center;
		}
	
		span.${EXTENSION_NAME}-bar {
			background:  #303030;
			display: inline-block;
			height: 100%;
			width: 7px;
		}
		
		div.${EXTENSION_NAME}-win-rate {
			color:  #303030;
			font-weight: bold;
			padding-left: 8px;
			text-align: center;
			width: 50px;
		}

		div.${EXTENSION_NAME}-popover {
			background: #161616;
			box-shadow: 0px 2px 8px 4px rgb(0, 0, 0, 0.38);
			color: rgba(255,255,255,0.6);
			display: block; 
			font-family: Play, sans-serif;
			font-size: 14px;
			padding: 10px 18px;
			position: fixed; 
			z-index: 3000;
		}

		div.${EXTENSION_NAME}-popover-heading {
			display: flex;
			font-weight: bold;
			justify-content: space-between;
			padding-bottom: 16px;
			padding-top: 12px;
		}
	
		div.${EXTENSION_NAME}-map {
			color: #fff; 
			font-size: 17px;
		}
		
		div.${EXTENSION_NAME}-time-frame {
			color: #ff5500; 
			font-size: 14px;
		}
		
		div.${EXTENSION_NAME}-player-div:not(:last-of-type), 
		div.${EXTENSION_NAME}-player-div-compact:not(:last-of-type) {
			border-bottom: 1px solid #303030;
		}
	
		div.${EXTENSION_NAME}-player-div {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			grid-auto-flow: column;
			grid-column-gap: 55px;
			padding: 16px 0px;
			width: 100%;
		}
		
		span.${EXTENSION_NAME}-player-name {
			font-weight: bold;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	
		span.${EXTENSION_NAME}-player-matches {
			text-align: center;
		}
		
		span.${EXTENSION_NAME}-player-win-rate {
			display: inline-block;
			font-size: 16px;
			font-weight: bold;
			text-align: end;
			width: auto;
		}

		div.${EXTENSION_NAME}-stats-div-compact {
			display: grid;
			grid-auto-flow: column;
			grid-column-gap: 20px;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			padding: 14px 0px;
			padding-top: 0px;
			width: 100%;
		}
		
		div.${EXTENSION_NAME}-team-div-compact {
			border-bottom: 3px solid #303030;
			display: grid;
			font-size: 15px;
			font-weight: bold;
			grid-auto-flow: column;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			padding: 14px 0px;
			width: 100%;
		}

		div.${EXTENSION_NAME}-team-div-compact > span.${EXTENSION_NAME}-player-win-rate-compact {
			font-size: 15px;
			font-weight: bold;
		}

		div.${EXTENSION_NAME}-player-div-compact {
			display: grid;
			font-size: 12px;
			font-weight: bold;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			grid-auto-flow: column;
			padding: 14px 0px;
			width: 100%;
		}

		span.${EXTENSION_NAME}-player-name-compact{
			font-weight: bold;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		span.${EXTENSION_NAME}-player-matches-compact {
			text-align: center;
		}
		
		span.${EXTENSION_NAME}-player-win-rate-compact {
			display: inline-block;
			font-size: 12px;
			font-weight: bold;
			text-align: end;
			width: auto;
		}
		
		div#${EXTENSION_NAME}-badge {
			display: inline-block;
			color: #ff5500;
			font-size: 14px;
			font-weight: bold;
			padding-bottom: 3px;
		}
		
		@keyframes ripple {
			to {
				transform: scale(4);
				opacity: 0;
			}
		}`;

	parent.appendChild(rootStyling);
};
