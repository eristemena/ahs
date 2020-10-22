import React from 'react';
import TooltipTrigger from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

const InfoTooltip = ({ info }) => {
	const Tooltip = ({
		getTooltipProps,
		getArrowProps,
		tooltipRef,
		arrowRef,
		placement,
	}) => {
		return (
			<div
				{...getTooltipProps({
					ref: tooltipRef,
					className: 'tooltip-container',
				})}>
				<div
					{...getArrowProps({
						ref: arrowRef,
						'data-placement': placement,
						className: 'tooltip-arrow',
					})}
				/>
				<div className="tooltip-body">{info}</div>
			</div>
		);
	};

	const Trigger = ({ getTriggerProps, triggerRef }) => {
		return (
			<span
				{...getTriggerProps({
					ref: triggerRef,
					className: 'trigger',
				})}>
				<i className="far fa-question-circle info-icon"></i>
			</span>
		);
	};

	return (
		<TooltipTrigger tooltip={Tooltip} placement="top">
			{Trigger}
		</TooltipTrigger>
	);
};

export default InfoTooltip;
