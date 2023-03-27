import Link from "next/link";

const NavLink = ({ label, href }) => {
  return (
    <li key={href} className="nav-item">
      <Link href={href}>
        <a className="nav-link">{label}</a>
      </Link>
    </li>
  );
};

export default NavLink;
