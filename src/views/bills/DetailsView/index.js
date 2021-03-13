import React, {
	useCallback,
	useState,
	useEffect
} from 'react';
import {
	Box,
	Container,
	makeStyles
} from '@material-ui/core';
import Details from './Details';
import Page from 'src/components/Page';
import { useParams } from 'react-router-dom';
import { Edit as EditIcon } from 'react-feather';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

/* utils */
import httpClient from 'src/utils/httpClient';
import axios from 'src/utils/axios';

/* connectIntl */
import { connectIntl, formatMessage } from 'src/contexts/Intl';

const useStyles = makeStyles((theme) => ({
	root: {
		minHeight: '100%',
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		backgroundColor: theme.palette.background.dark,
	}
}));

const BillDetailView = ({ intl }) => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [bill, setBill] = useState(null);

	const getBill = useCallback(async () => {
		try {
			const response = await axios.get(`api/bill/1`);
			// const response = await axios.get(`api/bill/${params.billId}`);
			if (isMountedRef.current) {
				setBill(response.data.bill);
				console.log(response.data.bill)
			}
		} catch (err) {
			console.log(err)
		}
	}, [isMountedRef]);

	useEffect(() => {
		getBill();
	}, [getBill]);

	if (!bill) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.billDetail)}
		>
			<Container maxWidth={false}>
				<Header
					goBack
					actualPage={formatMessage(intl.billDetail)}
				/>
				<Box mt={3}>
					<Details bill={bill} />
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(BillDetailView);
