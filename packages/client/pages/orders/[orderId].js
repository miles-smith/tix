import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";

const OrderShow = ({ order }) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const milliseconds = new Date(order.expiresAt) - Date.now();
      
      setRemainingTime(Math.round(milliseconds/1000));
    }

    calculateRemainingTime();

    const intervalId = setInterval(calculateRemainingTime, 1000);

    return () => { clearInterval(intervalId) };
  }, []);

  if(remainingTime <= 0) {
    return <div>Order expired</div>
  }

  return <div>Order expires in {remainingTime} seconds</div>;
};

OrderShow.getInitialProps = async (context) => {
  const axios       = apiClient(context);
  const { orderId } = context.query;
  const { data }    = await axios.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default OrderShow;
