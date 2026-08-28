"use client";

export default function Sidebar({ activeSection = "Drafts", onSelectSection }) {
  const menuItems = [
    { id: "Projects", label: "Projects", icon: "folder" },
    { id: "Drafts", label: "Drafts", icon: "edit_note" },
    { id: "Executed", label: "Executed", icon: "history_edu" },
    { id: "Counterparties", label: "Counterparties", icon: "handshake" },
    { id: "Archive", label: "Archive", icon: "inventory_2" },
  ];

  return (
    <aside className="side-navbar">
      <div style={{ padding: "0 8px", marginBottom: "20px" }}>
        <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Enterprise Legal
        </span>
        <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-on-surface)", marginTop: "4px" }}>
          Workspace Freelance
        </h4>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection && onSelectSection(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "var(--color-on-surface)" : "var(--color-on-surface-variant)",
                backgroundColor: isActive ? "var(--bg-surface-bright)" : "transparent",
                borderLeft: isActive ? "4px solid var(--color-primary)" : "4px solid transparent",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: isActive ? "var(--color-primary)" : "inherit" }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--color-outline-variant)", display: "flex", flexDirection: "column", gap: "12px" }}>
        <button className="btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
          <span className="material-symbols-outlined" style={{ color: "var(--color-tertiary)", fontSize: "16px" }}>star</span>
          Upgrade Plan
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <a href="#support" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", color: "var(--color-on-surface-variant)", textDecoration: "none", fontSize: "12px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>help_outline</span>
            Support
          </a>
          <a href="#signout" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", color: "var(--color-on-surface-variant)", textDecoration: "none", fontSize: "12px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>logout</span>
            Sign Out
          </a>
        </div>
      </div>
    </aside>
  );
}
