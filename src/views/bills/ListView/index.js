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
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
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

const BillsListView = ({ intl, currentLanguage }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [bills, setBills] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [totalcount, setTotalcount] = useState(0);
  const [totalPrice, setTotalprice] = useState(0);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const deleteBills = (selectedBills) => {
    // let temp = [];
    // const eliminatedList = [];
    // bills.forEach((n) => {
    //   if (!selectedBills.includes(n.id)) {
    //     temp.push(n)
    //   } else {
    //     eliminatedList.push(deleteBill(n.id));
    //   }
    // })
    // return eliminatedList;
  }

  const deleteBill = (id) => {
    // httpClient.delete(`api/bills/${id}`);
    // setBills((prevState) => prevState.filter((el) => el.id != id))
    // return id;
  }

  const getBills = useCallback(async () => {
    httpClient.get(`api/bills/all/${0}/${10}`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          setBills(json.bills);
          setTotalcount(json.total)
          setOpen(false);
          setLoading(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isMountedRef]);

  const handleGetData = (pagenum, limitnum) => {
    httpClient.get(`api/bills/all/${pagenum}/${limitnum}`)
      .then(json => {
        if (json.success && isMountedRef.current) {
          setBills(json.bills);
          setTotalcount(json.total)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSearchData = (data) => {
    const url = `api/bills/search`
    const method = 'post';
    httpClient[method](url, data)
      .then(json => {
        if (json.success && isMountedRef.current) {
          setBills(json.bills);
          setTotalcount(json.total);
          setTotalprice(json.total_price[0].price);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    setOpen(!open);
    getBills();
  }, [getBills]);

  return (
    <Page
      className={classes.root}
      title={formatMessage(intl.bills)}
    >
      <Container maxWidth={false}>
        <Header
          actualPage={formatMessage(intl.bills)}
        // buttonRight={{ to: formatMessage(intl.urlBillAdd), label: 'new Bill' }}
        />
        <Box mt={3}>
          {
            loading ?
              <Results
                bills={bills}
                totalcount={totalcount}
                totalPrice={totalPrice}
                deleteBill={deleteBill}
                deleteBills={deleteBills}
                handleGetData={handleGetData}
                handleSearchData={handleSearchData}
              /> :
              <div>
                <Backdrop className={classes.backdrop} open={open}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </div>
          }
        </Box>
      </Container>
    </Page>
  );
};

const mapStateToProps = (store) => ({
  intl: store.intl.messages,
  currentLanguage: store.intl.language,
})

export default connectIntl(mapStateToProps)(BillsListView);
