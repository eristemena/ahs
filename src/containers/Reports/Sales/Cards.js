import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'reactstrap';
import { formatPrice } from '../../../utilities';

const Cards = ({ title, number, color, cardClassName }) => {
	return (
		<Card className={`h-100 ${cardClassName}`}>
			<CardBody className="text-center">
				<p className={color && 'text-' + color}>{title}</p>
				<h4
					className={
						color ||
						`text-${
							number !== 0
								? number < 0
									? `danger`
									: 'success'
								: ''
						}`
					}>
					{number < 0
						? `- Rp. ${formatPrice(number * -1)}`
						: `Rp. ${formatPrice(number)}`}
				</h4>
			</CardBody>
		</Card>
	);
};

Cards.propTypes = {
	title: PropTypes.string.isRequired,
	number: PropTypes.number.isRequired,
	cardClassName: PropTypes.string,
};

export default Cards;
