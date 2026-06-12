"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function useAdmin() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setIsAdmin(false);
          if (pathname?.startsWith("/admin")) {
            router.push("/auth");
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        const user = data.user;

        if (user && user.role?.toLowerCase() === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          if (user) {
            router.push("/unauthorized");
          } else if (pathname?.startsWith("/admin")) {
            router.push("/auth");
          }
        }
      } catch (err) {
        console.error(err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router, pathname]);

  return { isAdmin, loading };
}