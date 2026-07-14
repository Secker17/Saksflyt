import { LockKeyhole } from "lucide-react";
import Sidebar from "./dashboard/Sidebar";

function NoTeamAccess({ user }) {
  return (
    <div className="dashboard">
      <Sidebar email={user.email} />
      <main className="no-access">
        <LockKeyhole />
        <h1>Du har ikke tilgang til sakene</h1>
        <p>Du er gjest i dette teamet. En teameier må gi deg rollen Medlem eller Admin.</p>
      </main>
    </div>
  );
}

export default NoTeamAccess;
