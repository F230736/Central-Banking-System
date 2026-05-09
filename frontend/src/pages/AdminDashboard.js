import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Receipt, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Shield, 
  Activity, 
  LogOut, 
  RefreshCw, 
  Search, 
  Filter, 
  Clock, 
  UserCheck 
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState("stats");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate();

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
      setCurrentPage("stats");
    } catch (err) {
      console.log(err);
      alert("Admin access failed");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
      setCurrentPage("users");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/transactions");
      setTransactions(res.data);
      setCurrentPage("transactions");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/logs");
      setLogs(res.data);
      setCurrentPage("logs");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    loadStats();
  }, []);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t => {
    if (filterType === "all") return true;
    if (filterType === "high") return t.amount > 50000;
    if (filterType === "medium") return t.amount <= 50000 && t.amount > 10000;
    if (filterType === "low") return t.amount <= 10000;
    return true;
  }).filter(t => t.amount.toString().includes(searchTerm));

  if (!stats && loading) {
    return (
      <div style={loadingContainer}>
        <div className="spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={adminContainer}>
      {/* Sidebar */}
      <div style={sidebar}>
        <div style={sidebarTop}>
          <div style={sidebarHeader}>
            <Shield size={28} style={{ color: "#60a5fa" }} />
            <div>
              <h2 style={sidebarTitle}>Admin Panel</h2>
              <p style={sidebarSubtitle}>Central Banking System</p>
            </div>
          </div>
          
          <nav style={sidebarNav}>
            <button 
              onClick={loadStats} 
              style={{
                ...sidebarButton, 
                ...(currentPage === "stats" ? activeButton : {})
              }}
            >
              <Activity size={18} />
              <span>Dashboard</span>
              {currentPage === "stats" && <div style={activeIndicator}></div>}
            </button>
            
            <button 
              onClick={loadUsers} 
              style={{
                ...sidebarButton, 
                ...(currentPage === "users" ? activeButton : {})
              }}
            >
              <Users size={18} />
              <span>Users</span>
              {currentPage === "users" && <div style={activeIndicator}></div>}
            </button>
            
            <button 
              onClick={loadTransactions} 
              style={{
                ...sidebarButton, 
                ...(currentPage === "transactions" ? activeButton : {})
              }}
            >
              <Receipt size={18} />
              <span>Transactions</span>
              {currentPage === "transactions" && <div style={activeIndicator}></div>}
            </button>
            
            <button 
              onClick={loadLogs} 
              style={{
                ...sidebarButton, 
                ...(currentPage === "logs" ? activeButton : {})
              }}
            >
              <FileText size={18} />
              <span>Audit Logs</span>
              {currentPage === "logs" && <div style={activeIndicator}></div>}
            </button>
          </nav>
        </div>
        
        <div style={sidebarBottom}>
          <button onClick={logout} style={logoutButton}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContent}>
        {/* Header */}
        <div style={header}>
          <div>
            <h1 style={title}>Admin Dashboard</h1>
            <p style={subtitle}>Monitor and manage your banking system</p>
          </div>
          <button 
            onClick={() => {
              if (currentPage === "stats") loadStats();
              if (currentPage === "users") loadUsers();
              if (currentPage === "transactions") loadTransactions();
              if (currentPage === "logs") loadLogs();
            }} 
            style={refreshBtn}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Stats Cards */}
        {currentPage === "stats" && stats && (
          <div style={statsGrid}>
            <div style={statCard} onClick={loadUsers}>
              <div style={{ ...statIcon, background: "#3b82f6" }}>
                <Users size={22} color="white" />
              </div>
              <div>
                <p style={statLabel}>Total Users</p>
                <h2 style={statValue}>{stats.totalUsers?.toLocaleString()}</h2>
                <p style={statTrend}>
                  <TrendingUp size={10} /> +12% this month
                </p>
              </div>
            </div>

            <div style={statCard} onClick={loadTransactions}>
              <div style={{ ...statIcon, background: "#10b981" }}>
                <Receipt size={22} color="white" />
              </div>
              <div>
                <p style={statLabel}>Total Transactions</p>
                <h2 style={statValue}>{stats.totalTransactions?.toLocaleString()}</h2>
                <p style={statTrend}>
                  <TrendingUp size={10} /> +8% this month
                </p>
              </div>
            </div>

            <div style={statCard} onClick={loadLogs}>
              <div style={{ ...statIcon, background: "#8b5cf6" }}>
                <FileText size={22} color="white" />
              </div>
              <div>
                <p style={statLabel}>Audit Logs</p>
                <h2 style={statValue}>{stats.totalLogs?.toLocaleString()}</h2>
                <p style={statTrend}>Total recorded events</p>
              </div>
            </div>

            <div style={statCard}>
              <div style={{ ...statIcon, background: "#f59e0b" }}>
                <DollarSign size={22} color="white" />
              </div>
              <div>
                <p style={statLabel}>Total Transferred</p>
                <h2 style={statValue}>
                  ₨ {stats.totalMoneyTransferred[0]?.total?.toLocaleString() || 0}
                </h2>
                <p style={statTrend}>System wide volume</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        {currentPage === "users" && (
          <div style={dataCard}>
            <div style={cardHeader}>
              <div>
                <h3 style={cardTitle}>System Users</h3>
                <p style={cardSubtitle}>Manage all registered users</p>
              </div>
              <div style={searchWrapper}>
                <Search size={16} style={{ color: "#64748b" }} />
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  style={searchInput} 
                />
              </div>
            </div>
            
            <div style={tableContainer}>
              <table style={dataTable}>
                <thead>
                  <tr style={tableHeader}>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>User ID</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={i} style={tableRow}>
                      <td style={tdStyle}>
                        <div style={userCell}>
                          <div style={userAvatar}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>
                        <span style={{
                          ...roleBadge,
                          ...(u.role === "admin" ? adminBadge : userBadge)
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <code style={codeStyle}>{u._id.slice(-8)}</code>
                      </td>
                      <td style={tdStyle}>
                        <button 
                          onClick={() => {
                            setSelectedUser(u);
                            setShowUserModal(true);
                          }} 
                          style={viewBtn}
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div style={emptyState}>
                <Users size={40} />
                <p>No users found</p>
              </div>
            )}
          </div>
        )}

        {/* Transactions Table */}
        {currentPage === "transactions" && (
          <div style={dataCard}>
            <div style={cardHeader}>
              <div>
                <h3 style={cardTitle}>Transaction History</h3>
                <p style={cardSubtitle}>Monitor all system transactions</p>
              </div>
              <div style={filterGroup}>
                <Filter size={16} />
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)} 
                  style={filterSelect}
                >
                  <option value="all">All Amounts</option>
                  <option value="high">High (&gt; ₨50k)</option>
                  <option value="medium">Medium (₨10k-₨50k)</option>
                  <option value="low">Low (&lt; ₨10k)</option>
                </select>
              </div>
            </div>
            
            <div style={searchWrapper}>
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                style={searchInput} 
              />
            </div>
            
            <div style={tableContainer}>
              <table style={dataTable}>
                <thead>
                  <tr style={tableHeader}>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Date & Time</th>
                    <th style={thStyle}>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t, i) => (
                    <tr key={i} style={tableRow}>
                      <td style={tdStyle}>
                        <span style={amountHighlight}>₨ {t.amount?.toLocaleString()}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          ...typeBadge,
                          ...(t.type === "transfer" ? transferBadge : receiveBadge)
                        }}>
                          {t.type === "transfer" ? "Sent" : "Received"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div>{new Date(t.createdAt).toLocaleDateString()}</div>
                        <div style={timeText}>{new Date(t.createdAt).toLocaleTimeString()}</div>
                      </td>
                      <td style={tdStyle}>
                        <code style={codeStyle}>{t._id?.slice(-8)}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredTransactions.length === 0 && (
              <div style={emptyState}>
                <Receipt size={40} />
                <p>No transactions found</p>
              </div>
            )}
          </div>
        )}

        {/* Audit Logs */}
        {currentPage === "logs" && (
          <div style={dataCard}>
            <h3 style={cardTitle}>Audit Trail</h3>
            <p style={cardSubtitle}>System activity and security logs</p>
            
            <div style={timeline}>
              {logs.map((l, i) => (
                <div key={i} style={logEntry}>
                  <div style={logTimeline}>
                    <div style={logDot}></div>
                    {i < logs.length - 1 && <div style={logLine}></div>}
                  </div>
                  <div style={logContent}>
                    <div style={logHeader}>
                      <p style={logAction}>{l.action}</p>
                      <p style={logTime}>
                        <Clock size={10} /> {new Date(l.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p style={logDetails}>{l.details}</p>
                    {l.user && (
                      <div style={logUser}>
                        <UserCheck size={12} />
                        <span>By: {l.user.name || l.user.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {logs.length === 0 && (
              <div style={emptyState}>
                <FileText size={40} />
                <p>No audit logs found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div style={modalOverlay} onClick={() => setShowUserModal(false)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <h3>User Details</h3>
              <button onClick={() => setShowUserModal(false)} style={closeModalBtn}>
                ×
              </button>
            </div>
            <div style={modalBody}>
              <div style={modalAvatar}>
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div style={modalInfo}>
                <div style={modalRow}>
                  <span style={modalLabel}>Name:</span>
                  <span style={modalValue}>{selectedUser.name}</span>
                </div>
                <div style={modalRow}>
                  <span style={modalLabel}>Email:</span>
                  <span style={modalValue}>{selectedUser.email}</span>
                </div>
                <div style={modalRow}>
                  <span style={modalLabel}>Role:</span>
                  <span style={{
                    ...modalRoleBadge,
                    ...(selectedUser.role === "admin" ? adminBadge : userBadge)
                  }}>
                    {selectedUser.role}
                  </span>
                </div>
                <div style={modalRow}>
                  <span style={modalLabel}>User ID:</span>
                  <code style={modalCode}>{selectedUser._id}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const adminContainer = {
  display: "flex",
  minHeight: "100vh",
  background: "#0f172a"
};

const sidebar = {
  width: "250px",
  background: "#1e293b",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "fixed",
  left: 0,
  top: 0,
  bottom: 0,
  borderRight: "1px solid #334155",
  zIndex: 100,
  overflowY: "auto"
};

const sidebarTop = {
  flex: 1,
  padding: "20px 16px"
};

const sidebarBottom = {
  padding: "16px",
  borderTop: "1px solid #334155",
  background: "#1e293b"
};

const sidebarHeader = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "30px",
  paddingBottom: "16px",
  borderBottom: "1px solid #334155"
};

const sidebarTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "white",
  marginBottom: "2px"
};

const sidebarSubtitle = {
  fontSize: "10px",
  color: "#64748b"
};

const sidebarNav = {
  display: "flex",
  flexDirection: "column",
  gap: "4px"
};

const sidebarButton = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 12px",
  background: "transparent",
  border: "none",
  borderRadius: "8px",
  color: "#94a3b8",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  width: "100%",
  position: "relative"
};

const activeButton = {
  background: "#3b82f6",
  color: "white"
};

const activeIndicator = {
  width: "3px",
  height: "3px",
  background: "white",
  borderRadius: "50%",
  position: "absolute",
  right: "12px"
};

const logoutButton = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px 12px",
  background: "#dc2626",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  width: "100%"
};

const mainContent = {
  flex: 1,
  marginLeft: "250px",
  padding: "24px 32px",
  minHeight: "100vh"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "28px"
};

const title = {
  fontSize: "24px",
  fontWeight: "600",
  color: "white",
  marginBottom: "4px"
};

const subtitle = {
  color: "#94a3b8",
  fontSize: "13px"
};

const refreshBtn = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 14px",
  background: "#334155",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  fontSize: "13px"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
  marginBottom: "28px"
};

const statCard = {
  background: "#1e293b",
  borderRadius: "14px",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  cursor: "pointer"
};

const statIcon = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const statLabel = {
  color: "#94a3b8",
  fontSize: "12px",
  marginBottom: "2px"
};

const statValue = {
  color: "white",
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "2px"
};

const statTrend = {
  color: "#10b981",
  fontSize: "10px",
  display: "flex",
  alignItems: "center",
  gap: "3px"
};

const dataCard = {
  background: "#1e293b",
  borderRadius: "14px",
  padding: "20px"
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  flexWrap: "wrap",
  gap: "12px"
};

const cardTitle = {
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "2px"
};

const cardSubtitle = {
  color: "#94a3b8",
  fontSize: "12px"
};

const searchWrapper = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#334155",
  padding: "6px 12px",
  borderRadius: "8px",
  minWidth: "220px"
};

const searchInput = {
  background: "transparent",
  border: "none",
  color: "white",
  flex: 1,
  outline: "none",
  fontSize: "12px"
};

const filterGroup = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#334155",
  padding: "6px 12px",
  borderRadius: "8px"
};

const filterSelect = {
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
  outline: "none",
  fontSize: "12px"
};

const tableContainer = {
  overflowX: "auto",
  marginTop: "16px"
};

const dataTable = {
  width: "100%",
  borderCollapse: "collapse"
};

const tableHeader = {
  borderBottom: "1px solid #334155"
};

const thStyle = {
  textAlign: "left",
  padding: "12px 10px",
  color: "#94a3b8",
  fontWeight: "500",
  fontSize: "12px"
};

const tableRow = {
  borderBottom: "1px solid #334155"
};

const tdStyle = {
  padding: "12px 10px",
  color: "#e2e8f0",
  fontSize: "12px"
};

const userCell = {
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const userAvatar = {
  width: "28px",
  height: "28px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "600",
  color: "white"
};

const roleBadge = {
  padding: "3px 8px",
  borderRadius: "20px",
  fontSize: "10px",
  fontWeight: "500",
  display: "inline-block"
};

const adminBadge = {
  background: "#8b5cf6",
  color: "white"
};

const userBadge = {
  background: "#3b82f6",
  color: "white"
};

const codeStyle = {
  background: "#334155",
  padding: "3px 6px",
  borderRadius: "4px",
  fontSize: "10px",
  fontFamily: "monospace"
};

const viewBtn = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "4px 8px",
  background: "#3b82f6",
  border: "none",
  borderRadius: "5px",
  color: "white",
  cursor: "pointer",
  fontSize: "11px"
};

const amountHighlight = {
  fontWeight: "600",
  color: "#fbbf24"
};

const typeBadge = {
  padding: "3px 8px",
  borderRadius: "20px",
  fontSize: "10px",
  fontWeight: "500",
  display: "inline-block"
};

const transferBadge = {
  background: "#dc2626",
  color: "white"
};

const receiveBadge = {
  background: "#10b981",
  color: "white"
};

const timeText = {
  fontSize: "9px",
  color: "#64748b",
  marginTop: "2px"
};

const timeline = {
  display: "flex",
  flexDirection: "column",
  gap: "0",
  marginTop: "16px"
};

const logEntry = {
  display: "flex",
  gap: "12px",
  position: "relative"
};

const logTimeline = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  width: "14px"
};

const logDot = {
  width: "6px",
  height: "6px",
  background: "#3b82f6",
  borderRadius: "50%",
  marginTop: "14px"
};

const logLine = {
  width: "2px",
  flex: 1,
  background: "#334155",
  marginTop: "4px"
};

const logContent = {
  flex: 1,
  background: "#334155",
  borderRadius: "10px",
  padding: "12px",
  marginBottom: "12px"
};

const logHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "6px",
  flexWrap: "wrap",
  gap: "6px"
};

const logAction = {
  color: "white",
  fontWeight: "600",
  fontSize: "12px"
};

const logTime = {
  color: "#64748b",
  fontSize: "9px",
  display: "flex",
  alignItems: "center",
  gap: "3px"
};

const logDetails = {
  color: "#94a3b8",
  fontSize: "11px",
  marginBottom: "6px"
};

const logUser = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  color: "#64748b",
  fontSize: "10px"
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modalContent = {
  background: "#1e293b",
  borderRadius: "14px",
  width: "380px",
  maxWidth: "90%"
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  borderBottom: "1px solid #334155"
};

const closeModalBtn = {
  background: "none",
  border: "none",
  fontSize: "22px",
  color: "#94a3b8",
  cursor: "pointer",
  lineHeight: 1
};

const modalBody = {
  padding: "20px"
};

const modalAvatar = {
  width: "60px",
  height: "60px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  fontWeight: "bold",
  color: "white",
  margin: "0 auto 16px auto"
};

const modalInfo = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const modalRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "6px 0",
  borderBottom: "1px solid #334155"
};

const modalLabel = {
  color: "#94a3b8",
  fontSize: "11px",
  fontWeight: "500"
};

const modalValue = {
  color: "white",
  fontSize: "12px",
  fontWeight: "500"
};

const modalRoleBadge = {
  padding: "3px 8px",
  borderRadius: "20px",
  fontSize: "10px"
};

const modalCode = {
  background: "#334155",
  padding: "3px 6px",
  borderRadius: "4px",
  fontSize: "10px",
  fontFamily: "monospace",
  color: "#60a5fa"
};

const emptyState = {
  textAlign: "center",
  padding: "40px 20px",
  color: "#64748b"
};

const loadingContainer = {
  minHeight: "100vh",
  background: "#0f172a",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  color: "white"
};

export default AdminDashboard;