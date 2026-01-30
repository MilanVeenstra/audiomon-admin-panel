// Root page - Redirect naar login

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/login");
}
