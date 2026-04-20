import { Home, BookOpen, PenLine, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home", label: "Home", icon: Home },
  { key: "shows", label: "Records", icon: BookOpen },
  { key: "journal", label: "Journal", icon: PenLine },
  { key: "review", label: "Insights", icon: BarChart3 },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-macaron-vanilla/95 backdrop-blur-md border-t border-macaron-rose-pale/50 rounded-t-3xl pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-16 h-14 rounded-2xl transition-all duration-200",
                isActive
                  ? "text-macaron-rose"
                  : "text-macaron-cocoa hover:text-macaron-text-primary"
              )}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={cn("transition-all duration-200", isActive && "scale-110")}
              />
              <span className={cn("text-[11px] font-semibold", isActive && "font-bold")}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-macaron-rose" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
