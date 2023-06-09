import Link from "next/link";
import { apiClient } from "../api/client";
import { gbp } from "../utils";

const HomePage = ({ currentUser, tickets }) => {
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            tickets.map(ticket => {
              return(
                <tr key={ticket.id} className="ticket" id={`ticket-${ticket.id}`}>
                  <td>{ticket.title}</td>
                  <td>{gbp(ticket.price).format()}</td>
                  <td>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                      <a>show</a>
                    </Link>
                  </td>
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
