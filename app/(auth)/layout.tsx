// app/(auth)/layout.tsx The auth layout of the Next.js app

import { ReactNode } from "react";

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
