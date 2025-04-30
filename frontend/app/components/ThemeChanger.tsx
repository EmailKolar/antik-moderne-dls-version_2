import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme((cur) => (cur == undefined || cur == "light" ? "dark" : "light"));

  return (
    <div className="my-4">
      <div className="flex">
        {theme && theme !== "light" ? (
          <button type="button" onClick={toggleTheme} aria-label="Switch to light mode" className="cursor-pointer">
            <FaSun className="text-xl text-yellow-400" />
          </button>
        ) : (
          <button type="button" onClick={toggleTheme} aria-label="Switch to dark mode" className="cursor-pointer">
            <FaMoon className="text-xl text-black" />
          </button>
        )}
      </div>
    </div>
  );
};
