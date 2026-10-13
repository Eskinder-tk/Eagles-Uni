import StudentProfileOverview from "@/app/Components/StudentProfileOverview";
import { verifySession } from "@/lib/session";

const Dashboard = async () => {
  const auth = await verifySession();

  if (!auth?.account || !("userCode" in auth.account)) {
    return <div>Student not found</div>;
  }

  return <StudentProfileOverview student={auth.account} />;
};

export default Dashboard;