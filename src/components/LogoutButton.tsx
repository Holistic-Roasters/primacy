"use client";

export default function LogoutButton() {
  const logout = () => {
    window.location.href = "/api/auth/logout";
  };

  return <button onClick={logout}>Logout</button>;
}
