import { verifySession } from "@/lib/session";
import StudentProfileSettingEditor from "@/app/Components/StudentProfileSettingEditor";
import { updateStudentProfile } from "@/app/actions"

const Profile = async () => {
    const auth = await verifySession();
    
    if (!auth?.account || !("userCode" in auth.account)) {
        return <div>Student not found</div>;
    }

    const student = {
    fullName: auth.account.name,
    studentId: auth.account.userCode,
    email: auth.account.email,
    phone: auth.account.phone ?? "",
    department:  "Not assigned",
    year: auth.account.year ?? 0,
    section:  "Not assigned",
    profileImage: auth.account.profileUrl ?? null,
  };

    return <StudentProfileSettingEditor onSave={updateStudentProfile} student={student} />;
    
}

export default Profile;