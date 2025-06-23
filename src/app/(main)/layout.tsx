import DrawerMenu from "../../components/DrawerMenu";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <DrawerMenu />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
