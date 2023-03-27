import { apiClient } from "../../api/client";
import { gbp } from "../../utils";

const OrderIndex = ({ orders }) => {
  return (
    <>
      <header>
        <h1>My Orders</h1>
      </header>
      <table className="table table-condensed table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {
          orders.map(order => {
            return (
              <tr key={order.id} className="order" id={`order-${order.id}`}>
                <td>{order.ticket.title}</td>
                <td>{gbp(order.ticket.price).format()}</td>
                <td>{order.status}</td>
              </tr>
            );
          })
        }
        </tbody>
      </table>
    </>
  );
}

OrderIndex.getInitialProps = async (context) => {
  const axios = apiClient(context);
  const { data } = await axios.get("/api/orders");

  return { orders: data };
}

export default OrderIndex;
