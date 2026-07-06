"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface CartQtyButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export function CartQtyButton({ children, disabled }: CartQtyButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="p-1 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center h-8 w-8 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 duration-100"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

interface CartRemoveButtonProps {
  disabled?: boolean;
  children: React.ReactNode;
}

export function CartRemoveButton({ children, disabled }: CartRemoveButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="-m-2 inline-flex p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center"
    >
      {pending ? (
        <Loader2 className="h-5 w-5 text-red-500 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
