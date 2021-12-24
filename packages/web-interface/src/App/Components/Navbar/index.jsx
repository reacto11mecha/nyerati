import { createSignal, For } from "solid-js";
import { Link } from "solid-app-router";
import styles from "./Navbar.module.css";

import { useDarkMode } from "../../Context/DarkMode";

function Navbar() {
  const { isDarkMode, setDarkMode } = useDarkMode();
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
    <nav className={styles.automaticChangeColor}>
      <Link href="/" className={`brand ${styles.noDecor}`}>
        <span>Nyerati</span>
      </Link>

      <input id="bmenub" type="checkbox" className="show" ref={checkbox} />
      <label for="bmenub" className="burger pseudo button">
        &#8801;
      </label>

      <div className={`menu ${styles.automaticChangeColor}`}>
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
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={isDarkMode()}
            onChange={() => setDarkMode((prev) => !prev)}
            className={styles.checkboxInput}
          />
          <span className={`${styles.slider} ${styles.sliderRound}`}></span>
        </label>
      </div>
    </nav>
  );
}

export default Navbar;
