"use client";

import { useState, useEffect, useRef } from "react";

export default function LoginButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [customer, setCustomer] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // (Optional) Replace with your real customer info logic
  useEffect(() => {
    // Fetch `/api/me` or check cookie/JWT for logged-in state
    // For now, let's fake it:
    const customerInfo =
      typeof window !== "undefined"
        ? window.localStorage.getItem("customer")
        : null;
    if (customerInfo) {
      setCustomer(JSON.parse(customerInfo));
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  const handleLogout = () => {
    window.localStorage.removeItem("customer");
    setLoggedIn(false);
    setCustomer(null);
    window.location.href = "/";
  };

  // Dropdown open/close logic
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!loggedIn) {
    return (
      <button
        className="text-[var(--color-accent)] font-semibold px-4 py-2 rounded-full border border-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-black)]"
        onClick={handleLogin}
      >
        Login
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center"
      >
        <span className="text-[var(--color-black)] font-bold">
          {customer?.name?.[0] ?? "U"}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-dark-grey)] border border-[var(--color-mid-grey)] rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 text-xs text-[var(--color-light-grey)]">
            {customer?.email ?? "you@primacy.io"}
          </div>
          <hr className="border-[var(--color-mid-grey)] my-1" />
          <a
            href="/dashboard"
            className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-mid-grey)]"
          >
            Dashboard
          </a>
          <a
            href="/orders"
            className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-mid-grey)]"
          >
            Orders
          </a>
          <a
            href="/subscription"
            className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-mid-grey)]"
          >
            Subscriptions
          </a>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-[var(--color-light-grey)] hover:bg-[var(--color-mid-grey)]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
