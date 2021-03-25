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
import ExamEditForm from '../Form/ExamAddEditForm';
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

const ExamEditView = ({ match, intl }) => {
  const params = useParams();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [result, setResult] = useState(null);

  const getResult = useCallback(async () => {
    try {
      const response = await axios.get(`api/more/${params.itemType}/1`);
      if (isMountedRef.current) {
        setResult(response.data.result);
      }
    } catch (err) {
      console.log(err)
    }
  }, [isMountedRef, params.itemId]);

  useEffect(() => {
    getResult();
  }, [getResult]);

  if (!result) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.editExam)}
    >
      <Container maxWidth={false}>
        <Header goBack />
      </Container>
      <Box mt={3}>
        <Container maxWidth="lg">
          <ExamEditForm update result={result} itemType={params.itemType} />
        </Container>
      </Box>
    </Page>
  );
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(ExamEditView);
