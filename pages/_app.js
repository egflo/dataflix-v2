import '../styles/globals.css'
import Head from 'next/head';
import { useState, useEffect, React } from 'react';
import { useRouter } from 'next/router';
import useSWR, { SWRConfig } from 'swr';
import { CacheProvider } from '@emotion/react';
import {CssBaseline, Snackbar, Alert} from '@mui/material';
import { createEmotionCache } from '../utils/create-emotion-cache';


//import 'bootstrap/dist/css/bootstrap.min.css'
//import '@fontsource/roboto';
//https://nascentdigital.com/thoughts/how-to-deploy-next-js-without-vercel
//https://jasonwatmore.com/post/2021/08/04/next-js-11-jwt-authentication-tutorial-with-example-app

function MyApp(props) {
  const { Component, pageProps } = props;
  const { vertical, horizontal } = { vertical: 'top', horizontal: 'center' };

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({
      open: false,
      message: '',
      severity: 'info'
    });
  };

  return (
      <>
        <SWRConfig
            value={{
              refreshInterval: 9000,
              errorRetryInterval: 9000,
              onError:(error, key) => {
                  if(error.status == 401) {
                      router.push("/login")
                  }
              }
            }
        }
        >
          <Head>
            <title>DataFlix</title>
          </Head>

            <CacheProvider value={createEmotionCache()}>
              {getLayout(<Component {...pageProps} alert={alert} setalert={setAlert}/>)}
              <Snackbar
                  open={alert.open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                  key={vertical + horizontal}
                  anchorOrigin={{ vertical, horizontal }}
              >
                <Alert onClose={handleClose} severity={alert.type}>
                  {alert.message}
                </Alert>
              </Snackbar>
            </CacheProvider>
        </SWRConfig>
      </>
    );
}

export default MyApp
