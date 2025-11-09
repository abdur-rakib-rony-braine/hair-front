import LogoutDialog from "@/components/dashboard/LogoutDialog";

export default function Header({ title }: { title: string }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="flex items-center space-x-4">
        <span className="text-gray-500">Admin</span>
        <LogoutDialog className="cursor-pointer" />
      </div>
    </header>
  );
}
