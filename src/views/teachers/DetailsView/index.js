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

const TeacherDetailView = ({ intl }) => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [teacher, setTeacher] = useState(null);

	const getTeacher = useCallback(async () => {
		try {
			const response = await axios.get(`api/teacher/1`);
			if (isMountedRef.current) {
				setTeacher(response.data.teacher);
				console.log(response.data.teacher)
			}
		} catch (err) {
			console.log(err)
		}
	}, [isMountedRef]);

	useEffect(() => {
		getTeacher();
	}, [getTeacher]);

	if (!teacher) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.teacherDetail)}
		>
			<Container maxWidth={"md"}>
				<Header
					goBack
					actualPage={formatMessage(intl.teacherDetail)}
					buttonRight={{
						icon: (<EditIcon />),
						label: formatMessage(intl.edit),
						to: formatMessage(intl.urlTeacherEdit, { teacherId: params.teacherId }),
					}}
				/>
				<Box mt={3}>
					<Details teacher={teacher} />
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(TeacherDetailView);
