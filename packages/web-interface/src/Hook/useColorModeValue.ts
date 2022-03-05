import { createSignal, createEffect, onMount } from "solid-js";
import { useDarkMode } from "@/Context/DarkMode";

export default function useColorModeValue(
  lightColor: string,
  darkColor: string
) {
  const [color, setColor] = createSignal<string>(lightColor);
  const { isDarkMode } = useDarkMode();

  const colorSetter = () => setColor(isDarkMode() ? darkColor : lightColor);

  createEffect(colorSetter);
  onMount(colorSetter);

  return color;
}
