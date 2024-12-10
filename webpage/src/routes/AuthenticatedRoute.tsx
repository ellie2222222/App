import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { User } from "../models/user";

interface AuthenticatedRouteProps {
  children: ReactNode;
}

function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const user = useSelector((store: { user: User | null }) => store.user);

  if (user === null) {
    return <Navigate to={"/login"} />;
  }

  return <>{children}</>;
}

export default AuthenticatedRoute;
