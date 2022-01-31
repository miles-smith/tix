import Header from './header';

const Layout = ({ children, currentUser }) => {
  return(
    <>
      <Header currentUser={currentUser} />
      <main>{children}</main>
    </>
  );
}

export default Layout;
