"use client";
import { useEffect, useState } from "react";

export function useUser() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => setCustomer(data.customer))
      .finally(() => setLoading(false));
  }, []);

  return { customer, loading };
}
