import { useAuth } from "../auth/AuthProvider";

export default function AdminPage() {
  const auth = useAuth();
  return <button onClick={auth.logOut}>Sign Out from Admin</button>;
}
