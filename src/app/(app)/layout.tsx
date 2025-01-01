import Navbar from '@/components/Navbar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className=" h-screen flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}