import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/upload", label: "Upload" },
  { to: "/configure", label: "Configure" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/prompt-explorer", label: "Prompt Explorer" }
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[--wfa-border] bg-white">
      <div className="h-1 bg-[--wfa-green]" />
      <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center px-4">
        <NavLink to="/upload" className="mr-8 flex items-center gap-2 font-bold text-[--wfa-text]">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[--wfa-green] text-sm text-white">W</span>
          <span>Workforce Analyzer</span>
        </NavLink>

        <nav className="flex h-full items-center gap-0">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                [
                  "flex h-full items-center border-b-[3px] px-4 text-sm font-semibold",
                  isActive
                    ? "border-[--wfa-green] text-[--wfa-green]"
                    : "border-transparent text-[--wfa-text-secondary] hover:text-[--wfa-text]"
                ].join(" ")
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto relative text-[--wfa-text-secondary]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2z" />
          </svg>
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full border border-white bg-[--wfa-green]" />
        </div>
      </div>
    </header>
  );
}
