import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import Banner from "./components/Banner";

export default async function Home() {
  
  const session = await getServerSession(authOptions);
  console.log(session?.user); // TODO: Debug
  
  return (
    <main>
      <Banner />
    </main>
  );
}
