import { getServerSession } from "next-auth";
import LoginPage from "./LoginPage"
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

const Login = async () => {

  const session = await getServerSession(authOptions);
  
  if (session) redirect("/dashboard");
  return (
    <LoginPage />
  )
}

export default Login