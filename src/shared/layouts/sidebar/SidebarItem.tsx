import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export interface SidebarSubItem {
  label: string;
  to: string;
}

interface SidebarItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  collapsed?: boolean;
  subItems?: SidebarSubItem[];
  onClick?: () => void;
}

export default function SidebarItem({
  to,
  label,
  icon: Icon,
  collapsed = false,
  subItems = [],
  onClick,
}: SidebarItemProps) {
  const [open, setOpen] = useState(false);
  const hasSubItems = subItems.length > 0;

  if (hasSubItems) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/50 hover:text-slate-100"
        >
          <Icon size={18} className="text-slate-400" />

          {!collapsed && (
            <>
              <span className="flex-1 text-left font-medium">{label}</span>

              {open ? (
                <ChevronDown size={15} className="text-slate-500" />
              ) : (
                <ChevronRight size={15} className="text-slate-500" />
              )}
            </>
          )}
        </button>

        {!collapsed && open && (
          <div className="ml-8 mt-2 space-y-1 border-l border-slate-600/60 pl-4">
            {subItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClick}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm transition-all ${
                    isActive
                      ? "text-cyan-300"
                      : "text-slate-500 hover:text-slate-200"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
          isActive
            ? "bg-cyan-400/5 text-cyan-300"
            : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-2 h-9 w-1 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
          )}

          <Icon
            size={18}
            className={isActive ? "text-cyan-300" : "text-slate-400"}
          />

          {!collapsed && <span className="flex-1 font-medium">{label}</span>}
        </>
      )}
    </NavLink>
  );
}