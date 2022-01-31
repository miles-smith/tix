import Router from 'next/router';
import { useState } from 'react';
import { useRequest } from '../../hooks/use-request';

export default () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors }   = useRequest({
    url:    '/api/users/signup',
    method: 'POST',
    body:   { email, password },
    onSuccess: () => { Router.push('/'); }
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  return(
    <>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
          />
        </div>
        {errors}
        <button type="submit" className="btn btn-primary">Sign up</button>
      </form>
    </>
  );
};
