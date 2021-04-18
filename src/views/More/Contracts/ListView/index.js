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

const ContractsListView = ({ intl, currentLanguage }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [contracts, setContracts] = useState([]);

  const deletecontracts = (selectedContracts) => {
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

  const deletecontract = (id) => {
    // httpClient.delete(`api/contracts/${id}`);
    // setResults((prevState) => prevState.filter((el) => el.id != id))
    // return id;
  }

  const getContracts = useCallback(async () => {
    try {
      const response = await axios.get(`api/more/contracts/all`);
      if (isMountedRef.current) {
        setContracts(response.data.contracts);
      }
    } catch (err) {
      console.log(err)
    }
  }, [isMountedRef]);

  useEffect(() => {
    getContracts();
  }, [getContracts]);


  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.contracts)}
    >
      <Container maxWidth={false}>
        <Header
          actualPage={formatMessage(intl.contracts)}
          buttonRight={{ to: formatMessage(intl.urlContractAdd), label: 'new Contract' }}
        />
        <Box mt={3}>
          <Results
            contracts={contracts}
            deletecontract={deletecontract}
            deletecontracts={deletecontracts}
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

export default connectIntl(mapStateToProps)(ContractsListView);
