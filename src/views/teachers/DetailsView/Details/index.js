import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import TeacherInfo from './TeacherInfo';
import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {}
}));

const Details = ({ teacher, className }) => {
	const classes = useStyles();

	return (
		<Grid className={clsx(classes.root)} container spacing={3} >
			<Grid item lg={12} md={12} xl={12} xs={12} >
				<TeacherInfo teacher={teacher} />
			</Grid>
		</Grid>
	);
};

Details.propTypes = {
	className: PropTypes.string,
	teacher: PropTypes.object.isRequired
};

export default Details;
