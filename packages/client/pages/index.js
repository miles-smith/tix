import currency from "currency.js";
import { apiClient } from "../api/client";

const HomePage = ({ currentUser, tickets }) => {
  const gbp = (value) => currency(value.toString(), { symbol: '£' });

  return(
    <>
      <header>
        <h1>Tickets</h1>
      </header>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {
            tickets.map(ticket => {
              return(
                <tr key={ticket.id} className="ticket" id={`ticket-${ticket.id}`}>
                  <td>{ticket.title}</td>
                  <td>{gbp(ticket.price).format()}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </>
  );
}

HomePage.getInitialProps = async (context) => {
  const axios = apiClient(context);
  const { data } = await axios.get('/api/tickets');

  return {
    tickets: data
  }
};

export default HomePage;
