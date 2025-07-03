import Navbar from "@/components/app-components/Navbar";
import Sidebar from "@/components/app-components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Sidebar />
      {children}
    </>
  );
}
