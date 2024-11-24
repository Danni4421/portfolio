import Link from "next/link";
import { TbStack3 } from "react-icons/tb";

export default function Navbar() {
  return (
    <div className="navbar flex justify-between">
      <h1 className="text-xl font-serif">Aji Hamdani Ahmad</h1>
      <div className="dropdown dropdown-end lg:hidden">
        <button tabIndex={0} className="btn">
          <TbStack3 className="text-xl" />
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 mt-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <Link href="/not-available">Work Experiences</Link>
          </li>
          <li>
            <Link href="/not-available">Services</Link>
          </li>
          <li>
            <Link href="/not-available">About Me</Link>
          </li>
        </ul>
      </div>
      <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box hidden lg:flex">
        <li>
          <Link href="/not-available">Work Experiences</Link>
        </li>
        <li>
          <Link href="/not-available">Services</Link>
        </li>
        <li>
          <Link href="/not-available">About Me</Link>
        </li>
      </ul>
      <Link
        href="/not-available"
        className="btn btn-outline rounded-full hidden lg:flex lg:items-center lg:justify-center"
      >
        See My Work
      </Link>
    </div>
  );
}
