import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - ERP AI System',
  description: 'Login or register to access the ERP system',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}