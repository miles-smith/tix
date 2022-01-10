import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' }
  ]
    .filter(link => link)
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
          {links}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
