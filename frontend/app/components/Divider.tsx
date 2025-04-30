import { useTheme } from "next-themes";

export function Divider() {
  const { theme } = useTheme();

  return <hr className={`w-9/10 my-1 ${theme == undefined || theme === "light" ? "border-black" : "border-white"}`} />;
}
