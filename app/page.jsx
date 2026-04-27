"use client";

import { useRouter } from "next/navigation";
import WelcomeScreen from "../components/Task/WelcomeScreen";

export default function RootPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/home");
  };

  return <WelcomeScreen onGetStarted={handleGetStarted} />;
}
