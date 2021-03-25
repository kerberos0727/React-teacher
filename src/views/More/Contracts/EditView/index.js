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
import ContractEditForm from '../Form/ContractAddEditForm';
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

const ContractEditView = ({ match, intl }) => {
  const params = useParams();
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [contract, setContract] = useState(null);

  const getContract = useCallback(async () => {
    try {
      const response = await axios.get(`/api/more/contracts/1`);
      if (isMountedRef.current) {
        setContract(response.data.contract);
      }
    } catch (err) {
      console.log(err)
    }
  }, [isMountedRef, params.contractId]);

  useEffect(() => {
    getContract();
  }, [getContract]);

  if (!contract) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.editContract)}
    >
      <Container maxWidth={false}>
        <Header goBack />
      </Container>
      <Box mt={3}>
        <Container maxWidth="md">
          <ContractEditForm update contract={contract} />
        </Container>
      </Box>
    </Page>
  );
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
})

export default connectIntl(mapStateToProps)(ContractEditView);
