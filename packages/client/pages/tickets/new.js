import { useRouter } from "next/router";
import { useState } from "react";
import { useRequest } from "../../hooks/use-request";

const NewTicket = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "POST",
    body: {
      title,
      price,
    },
    onSuccess: () => { router.push("/"); },
  });

  function onBlur() {
    const value = parseFloat(price);

    if(isNaN(value)) {
      return
    }

    setPrice(value.toFixed(2));
  };

  function onSubmit(e) {
    e.preventDefault();
    doRequest();
  }

  return(
    <div>
      <h1>Create a Ticket</h1>
      {errors}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} onBlur={onBlur} />
        </div>
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  )
};

export default NewTicket;
