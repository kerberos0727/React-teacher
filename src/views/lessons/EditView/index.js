import React, {
  useState,
  useCallback,
  useEffect
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useParams } from 'react-router-dom';
import LessonEditForm from '../Form/LessonAddEditForm';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

/* utils */
import httpClient from 'src/utils/httpClient';

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

const LessonEditView = ({ match, intl }) => {
  const params = useParams();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [lesson, setLesson] = useState(null);

  const getLesson = useCallback(async () => {
    httpClient.get(`api/lessons/${params.lessonId}`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          setLesson(json.lesson);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef, params.lessonId]);

  useEffect(() => {
    getLesson();
  }, [getLesson]);

  if (!lesson) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.editLesson)}
    >
      <Container maxWidth={false}>
        <Header goBack />
      </Container>
      <Box mt={3}>
        <Container maxWidth={false}>
          <LessonEditForm update lesson={lesson} />
        </Container>
      </Box>
    </Page>
  );
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(LessonEditView);
