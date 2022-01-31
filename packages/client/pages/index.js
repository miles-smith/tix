import { apiClient } from '../api/client';

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

// export const getServerSideProps = async () => {
//   return { props: {} };
// }

export default HomePage;
