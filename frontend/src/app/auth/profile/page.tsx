import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import getUserProfile from "@/libraries/userAPI";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";
import EditableProfileDetail from "@/components/EditableProfileDetail";
import { Delete } from "lucide-react";
import DeleteAccountButton from "@/components/DeleteAccountButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const profile = await getUserProfile(session.user.token);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <Image
            src={profile.data.image || "/images/avatar.png"}
            alt="User Avatar"
            width={90}
            height={90}
            className="rounded-full shadow-lg"
          />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            {profile.data.name || "N/A"}
          </h1>
        </div>

        <div className="space-y-4">
          <EditableProfileDetail
            label="Name"
            value={profile.data.name}
            field="name"
            userId={profile.data.id}
            token={session.user.token}
          />

          <EditableProfileDetail
            label="Email"
            value={profile.data.email}
            field="email"
            userId={profile.data.id}
            token={session.user.token}
          />

          <EditableProfileDetail
            label="Phone"
            value={profile.data.telephone}
            field="telephone"
            userId={profile.data.id}
            token={session.user.token}
          />

          <div className="border-b border-gray-200 pb-3">
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg text-gray-900">
              {profile.data.role || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <SignOutButton />
          <DeleteAccountButton userId={profile.data.id} />
        </div>
      </div>
    </main>
  );
}
