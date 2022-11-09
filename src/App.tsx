import PluginRoot from "./plugin-root.ts";
import Sidebar from "./sidebar.tsx";

export default function App() {
    if (window.location.search === "?sidebar") {
        return <Sidebar />
      } else if  (window.location.search === "") {
        return <PluginRoot />
      } else {
        return null;
      }
}