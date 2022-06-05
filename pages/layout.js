import { Toast } from "primereact/toast";
import Header from "../components/Header";

export default function Layout({ children }) {
  return (
    <>
      <Toast />
      <main>{children}</main>
    </>
  );
}
