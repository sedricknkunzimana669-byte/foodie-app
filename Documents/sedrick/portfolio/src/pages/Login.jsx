import AdminLogin from "../admin/AdminLogin";
import "../admin/admin.css";

export default function Login() {
  return <AdminLogin onLogin={() => window.location.assign("/admin")} />;
}