import { SidebarTrigger } from "~/components/ui/sidebar";

export default function SidebarControls() {
  return (
    <div className="fixed top-2 left-2 z-50 h-8 w-8 border rounded flex items-center justify-center">
      <SidebarTrigger />
    </div>
  );
}
