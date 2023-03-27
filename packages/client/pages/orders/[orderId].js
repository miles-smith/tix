import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { apiClient } from "../../api/client";
import { useRequest } from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "POST",
    body: {
      orderId: order.id,
    },
    onSuccess: () => router.push("/orders")
  });

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

  return (
    <div>
      {errors}
      <p>Order expires in {remainingTime} seconds</p>
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY}
        amount={Number(order.ticket.price) * 100}
        currency="GBP"
        email={currentUser.email}
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context) => {
  const axios       = apiClient(context);
  const { orderId } = context.query;
  const { data }    = await axios.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default OrderShow;
