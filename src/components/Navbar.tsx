"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// Helper to read the customer_info cookie (client-side, non-HTTP-only cookie)
function getCustomerInfo() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )customer_info=([^;]*)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const [customer, setCustomer] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomer(getCustomerInfo());
  }, []);

  // Handle outside click for dropdown
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Nav items
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    ...(customer
      ? [
          { label: "Orders", href: "/account/order-details" },
          { label: "Subscription", href: "/account/subscriptions" },
        ]
      : []),
  ];

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  const handleLogout = () => {
    document.cookie = "customer_info=; Max-Age=0; path=/; secure; samesite=lax";
    window.location.href = "/api/auth/logout"; // this clears httpOnly cookies on the server
  };

  return (
    <header className="w-full bg-[var(--color-dark-grey)] border-b border-[var(--color-mid-grey)] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand/logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-2xl font-display tracking-wide text-white no-underline"
        >
          <Image
            src="https://primacy.io/primacy_logo.png"
            alt="PRIMACY Logo"
            width={44}
            height={44}
            className="h-10 w-auto"
          />
          <span className="font-display">
            PRIMACY<span className="text-[var(--color-accent)]">:APEX</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex gap-3 items-center ml-12">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded font-medium text-sm uppercase tracking-wider transition-colors ${
                pathname === item.href
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-light-grey)] hover:text-[var(--color-accent)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Login/Profile */}
        <div className="ml-auto flex items-center gap-2">
          {!customer ? (
            <button
              onClick={handleLogin}
              className="text-[var(--color-accent)] font-semibold px-4 py-2 rounded-full border border-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-black)]"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center"
                aria-label="Open profile menu"
              >
                <span className="text-[var(--color-black)] font-bold">
                  {customer.name?.[0] || "U"}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-dark-grey)] border border-[var(--color-mid-grey)] rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-xs text-[var(--color-light-grey)]">
                    {customer.email}
                  </div>
                  <hr className="border-[var(--color-mid-grey)] my-1" />
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-mid-grey)]"
                  >
                    Dashboard
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-[var(--color-light-grey)] hover:bg-[var(--color-mid-grey)]"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
