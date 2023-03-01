import Header from './header';

const Layout = ({ children, currentUser }) => {
  return(
    <>
      <Header currentUser={currentUser} />
      <div className="container">
        <main>{children}</main>
      </div>
    </>
  );
}

export default Layout;
