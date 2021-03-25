import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Results from './Results';
import Page from 'src/components/Page';
import Header from 'src/components/HeaderBreadcrumbs';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import axios from 'src/utils/axios';

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

const ExamsListView = ({ intl, currentLanguage }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [results, setResults] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [tabvalue, setTabvalue] = React.useState(0)

  const deleteItems = (selectedItems) => {
    // let temp = [];
    // const eliminatedList = [];
    // results.forEach((n) => {
    //   if (!selectedItems.includes(n.id)) {
    //     temp.push(n)
    //   } else {
    //     eliminatedList.push(deleteItem(n.id));
    //   }
    // })
    // return eliminatedList;
  }

  const deleteItem = (id) => {
    // httpClient.delete(`api/exams/${id}`);
    // setResults((prevState) => prevState.filter((el) => el.id != id))
    // return id;
  }

  const getResults = useCallback(async () => {
    try {
      const response = await axios.get(`api/more/exams/results/all`);
      if (isMountedRef.current) {
        // console.log('response.data.exams_results------->', response.data.exams_results)
        setResults(response.data.exams_results);
        setTabvalue(0)
      }
    } catch (err) {
      console.log(err)
    }
  }, [isMountedRef]);

  const getSchemes = useCallback(async () => {
    try {
      const response = await axios.get(`api/more/exams/schemes/all`);
      if (isMountedRef.current) {
        // console.log('response.data.exams_schemes------->', response.data.exams_schemes)
        setResults(response.data.exams_schemes);
        setTabvalue(1)
      }
    } catch (err) {
      console.log(err)
    }
  }, [isMountedRef]);

  useEffect(() => {
    getResults();
  }, [getResults]);


  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.exams)}
    >
      <Container maxWidth={false}>
        <Header
          actualPage={formatMessage(intl.exams)}
        />
        <Box mt={3}>
          <Results
            results={results}
            deleteItem={deleteItem}
            deleteItems={deleteItems}
            getResults={getResults}
            getSchemes={getSchemes}
            tabvalue={tabvalue}
          />
        </Box>
      </Container>
    </Page>
  );
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(ExamsListView);
