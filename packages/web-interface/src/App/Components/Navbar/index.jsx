import { createSignal, For } from "solid-js";
import { Link } from "@rturnq/solid-router";
import styles from "./Navbar.module.css";

function Navbar() {
  const [navLink] = createSignal([
    {
      href: "/",
      text: "Touch Area",
    },
    {
      href: "/replay",
      text: "Replay",
    },
  ]);

  let checkbox;

  return (
    <nav>
      <Link href="/" className={`brand ${styles.noDecor}`}>
        <span>Nyerati</span>
      </Link>

      <input id="bmenub" type="checkbox" className="show" ref={checkbox} />
      <label for="bmenub" className="burger pseudo button">
        &#8801;
      </label>

      <div className="menu">
        <For each={navLink()}>
          {(nav) => (
            <Link
              href={nav.href}
              className={`pseudo button icon-picture ${styles.noDecor}`}
              onClick={() => {
                if (checkbox.checked) {
                  checkbox.checked = false;
                }
              }}
            >
              {nav.text}
            </Link>
          )}
        </For>
      </div>
    </nav>
  );
}

export default Navbar;
