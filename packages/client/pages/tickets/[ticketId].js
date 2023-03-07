import { useRequest } from "../../hooks/use-request";
import { apiClient } from "../../api/client";
import { gbp } from "../../utils";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "POST",
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => { console.log(order); }
  });

  return (
    <>
    <div>{errors}</div>
    <div className="ticket" id={`ticket-${ticket.id}`}>
      <h1>{ticket.title}</h1>
      <dl>
        <dt>Price:</dt>
        <dd>{gbp(ticket.price).format()}</dd>
      </dl>
      <button className="btn btn-primary" onClick={doRequest}>Buy</button>
    </div>
    </>
  );
};

TicketShow.getInitialProps = async (context) => {
  const axios = apiClient(context);
  const { ticketId } = context.query;

  const { data } = await axios.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
}

export default TicketShow;
