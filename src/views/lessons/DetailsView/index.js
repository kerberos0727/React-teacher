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

const LessonDetailView = ({ intl }) => {
	const params = useParams();
	const classes = useStyles();
	const isMountedRef = useIsMountedRef();
	const [ lesson, setLesson ] = useState(null);

	const getLesson = useCallback(async () => {
    try {
      const response = await axios.get(`api/lesson/1`);
      // const response = await axios.get(`api/lesson/${params.lessonId}`);
      if (isMountedRef.current) {
        setLesson(response.data.lesson);
        console.log(response.data.lesson)
      }
    } catch (err) {
      console.log(err)
    }
	}, [isMountedRef]);

	useEffect(() => {
		getLesson();
	}, [getLesson]);

	if (!lesson) {
		return null;
	}

	return (
		<Page
			className={classes.root}
			title={formatMessage(intl.lessonDetail)}
		>
			<Container maxWidth={false}>
				<Header
					goBack
					actualPage={formatMessage(intl.lessonDetail)}
					buttonRight={{
						icon: (<EditIcon/>),
						label: formatMessage(intl.edit),
						to: formatMessage(intl.urlLessonEdit, { lessonId: params.lessonId }),
					}}
				/>
				<Box mt={3}>
					<Details lesson={lesson} />
				</Box>
			</Container>
		</Page>
	);
};

const mapStateToProps = (store) => ({
	intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(LessonDetailView);
