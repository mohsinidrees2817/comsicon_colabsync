import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const role =
    user.user_metadata?.role || // if role was stored during signUp
    (await getUserRoleFromProfileTable(supabase, user.id)); // fallback

  if (role === "manager") {
    return redirect("/manager/dashboard");
  } else if (role === "user") {
    return redirect("/user/dashboard");
  } else {
    return redirect("/sign-in?error=unauthorized");
  }
}

// Optional fallback: in case you use a `profiles` table
async function getUserRoleFromProfileTable(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return data?.role;
}
