import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  //Go to check session from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/users/sessionCheck", {
      credentials: "include" //Include session credential
    })
      .then(res => {
        if (res.ok) setIsAuth(true);
        else setIsAuth(false);
      })
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <div>Session not found...</div>; //Loading until user is sent to login

  return isAuth ? children : <Navigate to="/" />;
}
