import { Link } from "@rturnq/solid-router";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav>
      <Link href="/" className={`brand ${styles.noDecor}`}>
        <span>Nyerati</span>
      </Link>

      <input id="bmenub" type="checkbox" className="show" />
      <label for="bmenub" className="burger pseudo button">
        &#8801;
      </label>

      <div className="menu">
        <Link
          href="/"
          className={`pseudo button icon-picture ${styles.noDecor}`}
        >
          Touch Area
        </Link>
        <Link
          href="/replay"
          className={`pseudo button icon-picture ${styles.noDecor}`}
        >
          Replay
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
