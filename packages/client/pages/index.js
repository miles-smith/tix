const HomePage = ({ currentUser }) => {
  return(
    <section>
      <header>
        <h1>Hello NextJS</h1>
      </header>
      <footer>
        <small>
          {currentUser && `Signed in as ${currentUser.email}`}
        </small>
      </footer>
    </section>
  );
}

export default HomePage;
