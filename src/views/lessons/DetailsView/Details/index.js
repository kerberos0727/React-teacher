import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import LessonInfo from './LessonInfo';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {}
}));

const Details = ({ lesson, className }) => {
	const classes = useStyles();

	return (
		<Grid className={clsx(classes.root)} container spacing={3} >
			<Grid item lg={12} md={12} xl={12} xs={12} >
				<LessonInfo lesson={lesson} />
			</Grid>
		</Grid>
	);
};

Details.propTypes = {
	className: PropTypes.string,
	lesson: PropTypes.object.isRequired
};

export default Details;
