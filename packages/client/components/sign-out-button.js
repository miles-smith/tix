import Router from 'next/router';
import { useRequest } from '../hooks/use-request';

const SignOutButton = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'DELETE',
    body: {},
    onSuccess: () => { Router.push('/'); }
  });

  const onClick = async () => {
    await doRequest();
  }

  return(
    <button type="button" className="btn btn-outline-danger" onClick={onClick}>
      Sign Out
    </button>
  );
}

export default SignOutButton;
