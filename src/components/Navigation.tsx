import { LayoutDashboard, FileText, Megaphone, Network, BarChart3, Settings, Coins, Lightbulb } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Navigation = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: "대시보드", href: "/" },
    { icon: Lightbulb, label: "전략", href: "/strategy" },
    { icon: FileText, label: "콘텐츠", href: "/content" },
    { icon: Megaphone, label: "캠페인", href: "/campaigns" },
    { icon: Network, label: "채널", href: "/channels" },
    { icon: BarChart3, label: "분석", href: "/analytics" },
    { icon: Settings, label: "설정", href: "/settings" },
  ];

  return (
    <nav className="glass border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Aberry"
              className="h-8 transition-all duration-300 drop-shadow-[0_0_8px_rgba(155,59,229,0.4)] hover:drop-shadow-[0_0_16px_rgba(155,59,229,0.6)]"
            />
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all"
                activeClassName="bg-primary/10 text-primary"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Credits */}
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">1,000 크레딧</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
