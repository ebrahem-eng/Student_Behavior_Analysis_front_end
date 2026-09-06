import { useAppStore } from "@/lib/store";
import type { ReactNode } from "react";

interface RequireRoleProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireRole({ allowedRoles, children, fallback = null }: RequireRoleProps) {
  const userRole = useAppStore((state) => state.userRole);

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
