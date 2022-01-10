import 'bootstrap/dist/css/bootstrap.css';
import App from 'next/app';
import Layout from '../components/layout';
import { apiClient } from '../api/client';

const AppComponent = ({ Component, pageProps }) => {
  return(
    <Layout currentUser={pageProps.currentUser}>
      <Component {...pageProps} />
    </Layout>
  );
}

AppComponent.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const { pageProps } = appProps

  const axios = apiClient(appContext.ctx);
  const { data } = await axios.get('/api/users/current');

  return {
    pageProps: { ...pageProps, currentUser: data.user }
  };
};

export default AppComponent;
