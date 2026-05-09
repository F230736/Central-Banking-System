import React, { useState } from "react";
import { LayoutDashboard, Send, History, Users, Bell, Shield, User, LogOut, CreditCard } from "lucide-react";

const Navbar = ({ currentPage, setCurrentPage, logout }) => {
  const [hovered, setHovered] = useState("");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transfer", label: "Transfer", icon: Send },
    { id: "history", label: "History", icon: History },
    { id: "beneficiaries", label: "Beneficiaries", icon: Users },
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield }
  ];

  return (
    <div style={navStyle}>
      <div style={logoSection}>
        <div style={logoIcon}><CreditCard size={28} style={{ color: "#60a5fa" }} /></div>
        <div><h2 style={logoText}>CBS Bank</h2><p style={logoSubtext}>Secure Banking</p></div>
      </div>
      <nav style={navContainer}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isHovered = hovered === item.id;
          return (<button key={item.id} onClick={() => setCurrentPage(item.id)} onMouseEnter={() => setHovered(item.id)} onMouseLeave={() => setHovered("")} style={{ ...buttonStyle, background: isActive ? "#3b82f6" : isHovered ? "#334155" : "transparent" }}><Icon size={18} style={{ color: isActive ? "white" : isHovered ? "#60a5fa" : "#94a3b8" }} /><span style={{ ...navLabel, color: isActive ? "white" : isHovered ? "white" : "#cbd5e1", fontWeight: isActive ? "600" : "400" }}>{item.label}</span></button>);
        })}
      </nav>
      <button onClick={logout} onMouseEnter={() => setHovered("logout")} onMouseLeave={() => setHovered("")} style={{ ...buttonStyle, ...logoutButtonStyle, background: hovered === "logout" ? "#dc2626" : "transparent", marginTop: "auto" }}><LogOut size={18} style={{ color: hovered === "logout" ? "white" : "#ef4444" }} /><span style={{ ...navLabel, color: hovered === "logout" ? "white" : "#ef4444" }}>Logout</span></button>
      <div style={versionInfo}><p>Version 2.0</p></div>
    </div>
  );
};

const navStyle = { width: "260px", background: "#0f172a", minHeight: "100vh", padding: "24px 16px", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, borderRight: "1px solid #1e293b", zIndex: 100 };
const logoSection = { display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #1e293b" };
const logoIcon = { width: "40px", height: "40px", background: "#1e293b", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" };
const logoText = { fontSize: "18px", fontWeight: "bold", color: "white", marginBottom: "2px" };
const logoSubtext = { fontSize: "10px", color: "#64748b" };
const navContainer = { flex: 1, display: "flex", flexDirection: "column", gap: "4px" };
const buttonStyle = { display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", border: "none", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s ease", fontSize: "14px", width: "100%" };
const navLabel = { flex: 1, textAlign: "left" };
const logoutButtonStyle = { marginTop: "20px" };
const versionInfo = { marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #1e293b", textAlign: "center", fontSize: "10px", color: "#475569" };

export default Navbar;