import Link from 'next/link';
import NavLink from './NavLink';
import SignOutButton from './sign-out-button';

const Header = ({ currentUser }) => {
  const unauthenticatedLinks =
    <>
      <NavLink href="/auth/signup" label="Sign Up" />
      <NavLink href="/auth/signin" label="Sign In" />
    </>;

  const authenticatedLinks =
    <>
      <NavLink href="/tickets/new" label="Sell Tickets" />
      <NavLink href="/orders" label="My Orders" />
      <SignOutButton />
    </>;

  return(
    <nav className="navbar navbar-expand navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          {
            currentUser
            ? authenticatedLinks
            : unauthenticatedLinks
          }
        </ul>
      </div>
    </nav>
  );
}

export default Header;
