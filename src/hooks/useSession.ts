"use client";
import { useEffect, useState } from "react";

export function useSession() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setAuthenticated(data.isAuthenticated);
      setLoading(false);
    })();
  }, []);

  return { loading, authenticated };
}
