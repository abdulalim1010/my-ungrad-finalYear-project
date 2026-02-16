"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/app/components/firebase";

export default function useAdmin() {

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {

    const unsub = onAuthStateChanged(auth, async (user) => {

      if (!user) {

        setIsAdmin(false);

        if (pathname?.startsWith("/admin")) {
          router.push("/auth");
        }

        setLoading(false);
        return;
      }

      try {

        console.log("Checking admin for:", user.email);

        const res = await fetch(
          `/api/admin/check?email=${user.email}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        console.log("Admin check response:", data);

        if (data.role === "admin") {

          setIsAdmin(true);

        } else {

          setIsAdmin(false);

          if (pathname?.startsWith("/admin")) {
            router.push("/unauthorized");
          }

        }

      } catch (err) {

        console.error(err);
        setIsAdmin(false);

      } finally {

        setLoading(false);

      }

    });

    return () => unsub();

  }, [router, pathname]);

  return { isAdmin, loading };
}
