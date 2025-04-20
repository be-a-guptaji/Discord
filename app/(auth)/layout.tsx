import { ReactNode } from "react";

// app/(auth)/layout.tsx The auth layout of the Next.js app
const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return <div>{children}</div>;
};

export default AuthLayout;
