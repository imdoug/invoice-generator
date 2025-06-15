import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import RegisterPage from "./RegisterPage";

const Register = async () => {

  const session = await getServerSession(authOptions);
  
  if (session) {
      redirect("/dashboard");
  }
  return (
    <RegisterPage />
  )
}

export default Register