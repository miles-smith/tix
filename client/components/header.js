import Link from 'next/link';
import SignOutButton from './sign-out-button';

const Header = ({ currentUser }) => {
  const links = [
    { label: 'Sign Up', href: '/auth/signup' },
    { label: 'Sign In', href: '/auth/signin' },
  ]
    .map(({ label, href }) => {
      return(
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      )
    });

  return(
    <nav className="navbar navbar-expand navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ml-auto">
          {
            currentUser
            ? <SignOutButton />
            : links
          }
        </ul>
      </div>
    </nav>
  );
}

export default Header;
