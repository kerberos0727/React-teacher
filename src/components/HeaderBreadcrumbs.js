import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
	Breadcrumbs,
	Button,
	Grid,
	Link,
	SvgIcon,
	Typography,
	makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import {
	PlusCircle as PlusCircleIcon,
} from 'react-feather';

const useStyles = makeStyles((theme) => ({
	root: {},
	action: {
		marginBottom: theme.spacing(1),
		'& + &': {
			marginLeft: theme.spacing(1)
		}
	}
}));

const HeaderBreadcrumbs = ({ className, ...rest }) => {
	const classes = useStyles();
	const history = useHistory();
	const {
		crumbs,
		goBack,
		buttonRight,
		actualPage,
	} = rest;

	const renderButtonAddEdit = () => {
		return (buttonRight) ? (
			<Grid item>
				<Link
					variant="h6"
					to={buttonRight.to}
					color="inherit"
					component={RouterLink}
				>
					<Button
						color="secondary"
						variant="contained"
						startIcon={
							<SvgIcon fontSize="small">
							{
								(buttonRight.icon)
									? buttonRight.icon
									: <PlusCircleIcon />
							}
							</SvgIcon>
						}
					>
						{(buttonRight.label) ? buttonRight.label : 'Agregar'}
				</Button>
				</Link>
			</Grid>
		) : null;
	}

	const renderGoBack = () => {
		return (goBack) ? (
			<Grid
				container
				direction="row"
				alignItems="center"
				style={{cursor: 'pointer'}}
			>
				<NavigateBeforeIcon fontSize="small" />
				<Typography
					variant="body1"
					color="textPrimary"
					onClick={() => history.goBack()}
				>
					Regresar
				</Typography>
			</Grid>
		) : null;
	}

	const renderCrumbs = () => {
		if(!crumbs) return null;

		let key = 0;

		let links = [(
			<Link
				key={key++}
				variant="body1"
				color="inherit"
				to="/"
				component={RouterLink}
			>
				Dashboard
			</Link>
		)];

		links.push(
			...crumbs.map((el) => (
				<Link
					key={key++}
					to={el.to || '#'}
					variant="body1"
					color="inherit"
					component={RouterLink}
				>
					{el.label}
				</Link>
			))
		)

		links.push((
			<Typography
				key={key++}
				variant="body1"
				color="textPrimary"
			>
				{actualPage}
			</Typography>
		))
		return links;
	}

	return (
		<Grid
			container
			spacing={3}
			justify="space-between"
			className={clsx(classes.root, className)}
		>
			<Grid item>
				{renderGoBack()}

				<Breadcrumbs
					separator={<NavigateNextIcon fontSize="small" />}
					aria-label="breadcrumb"
				>

					{renderCrumbs()}

				</Breadcrumbs>
				<Typography
					variant="h3"
					color="textPrimary"
				>
					{actualPage}
				</Typography>
			</Grid>
			
			{renderButtonAddEdit()}
		</Grid>
	);
};

HeaderBreadcrumbs.propTypes = {
	/**
	 * [goBack ]
	 * activate the button to return to the previous page
	**/
	goBack: PropTypes.bool,
	/**
	 * [crumbs]
	 * Array of objects to assemble the breadcrumbs.
	 * the object must have the following structure
	 * [
	 *		{
	 *			to: {string}
	 *			label: {string}
	 *		}
	 *		...
	 * ]
	 * @type {array => object}
	 */
	crumbs: PropTypes.array,
	className: PropTypes.string,
	actualPage: PropTypes.string,
	buttonRight: PropTypes.object,
};

export default HeaderBreadcrumbs;
