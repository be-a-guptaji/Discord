import { ReactNode } from "react";

// app/(auth)/layout.tsx The auth layout of the Next.js app
const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
