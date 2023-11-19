import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/Forms/ProfileForm";

export default async function Profile() {

  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6 border border-white">
      <h1>gg</h1>
    </div>
  )
}
