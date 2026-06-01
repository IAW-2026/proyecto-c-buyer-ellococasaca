"use client";

import Link from "next/link";
import { useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface LoadingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Resetear el estado de carga cuando cambia la ruta (la navegación terminó)
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const handleClick = () => {
    // Solo activar si no es la misma ruta
    if (href !== pathname) {
      setIsLoading(true);
    }
    if (onClick) onClick();
  };

  return (
    <Link href={href} onClick={handleClick} className={`relative ${className}`}>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit z-10 animate-in fade-in duration-200">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        </span>
      )}
      <span className={isLoading ? "opacity-0" : "transition-opacity duration-200"}>{children}</span>
    </Link>
  );
}
