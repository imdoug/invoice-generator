import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import ProfilePage from "./ProfilePage";

const Profile = async () => {

  const session = await getServerSession(authOptions);
  
    if (!session || !session.user?.email) redirect("/login");
  return (
    <ProfilePage />
  )
}

export default Profile