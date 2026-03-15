import React from "react";
import { Outlet } from "react-router";
import { BottomNav } from "./BottomNav";

export function Layout() {
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background relative">
      <Outlet />
      <BottomNav />
    </div>
  );
}
