import '../styles/globals.css'
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import { useState, useEffect, React } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from "jwt-decode";
import useSWR, { SWRConfig } from 'swr';

//https://nascentdigital.com/thoughts/how-to-deploy-next-js-without-vercel
//https://jasonwatmore.com/post/2021/08/04/next-js-11-jwt-authentication-tutorial-with-example-app

function MyApp({ Component, pageProps }) {

  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const path = router.asPath
  console.log(path)

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    // run auth check on initial load
    authCheck(router.asPath);

    // set authorized to false to hide page content while changing routes
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // run auth check on route change
    router.events.on('routeChangeComplete', authCheck)

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    }

  }, []);

   function validateToken(token) {

     if (token == undefined || token == null || token == "null" )  {
       console.log("token is undefined")

       return false;
     }

     let decodedToken = jwt_decode(token);
     console.log("Decoded Token", decodedToken);
     let currentDate = new Date();

     // JWT exp is in seconds
     if (decodedToken.exp * 1000 < currentDate.getTime()) {
       console.log("Token expired.");
       return false;
     } else {
       console.log("Token Valid.");
       return true;
     }
  }

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/login', '/signup'];
    const path = url.split('?')[0];
    
    const token = localStorage.getItem("token")
    const invalidToken = !validateToken(token)
    console.log("Token", invalidToken)
    if ( invalidToken && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      });
    } else {
      setAuthorized(true);
    }
  }

  return (
      <div>
        <SWRConfig
            value={{
              refreshInterval: 90000,
              fetcher: (resource, init) => fetch(resource, init).then(res => res.json()),
              onError: (error, key) => {
                if (error.status !== 403 && error.status !== 404) {
                  // We can send the error to Sentry,
                  // or show a notification UI.
                  if(error.status == 500) {
                    router.push("/error")

                  }
                  if(error.status == 401) {
                    router.push("/login")

                  }
                }
              }
            }}
        >
          <Head>
            <title>DataFlix</title>
          </Head>

          {authorized && <Component {...pageProps} />}

        </SWRConfig>
      </div>
    );
}

export default MyApp
