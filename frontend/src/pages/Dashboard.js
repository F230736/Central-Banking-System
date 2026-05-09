import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Beneficiaries from "./Beneficiaries";
import { 
  CreditCard, 
  Send, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Bell, 
  Shield 
} from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [copied, setCopied] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [totalSent, setTotalSent] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);

  const navigate = useNavigate();

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await API.get("/auth/me");
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (accountId) => {
    try {
      const res = await API.get(`/transactions/history/${accountId}`);
      const allTransactions = res.data;
      setTransactions(allTransactions.slice(0, 10));
      
      let sent = 0, received = 0;
      allTransactions.forEach(transaction => {
        if (transaction.displayType === "sent") sent += transaction.amount;
        else if (transaction.displayType === "received") received += transaction.amount;
      });
      setTotalSent(sent);
      setTotalReceived(received);
    } catch (err) {
      console.log(err);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.slice(0, 5));
    } catch (err) {
      console.log(err);
    }
  };

  const transferMoney = async () => {
    if (!receiverEmail || !amount) return alert("Please fill all fields");
    if (Number(amount) <= 0) return alert("Please enter a valid amount");
    setTransferLoading(true);
    try {
      await API.post("/transactions/transfer", { 
        senderId: data.account._id, 
        receiverEmail, 
        amount: Number(amount) 
      });
      alert("✅ Transfer Successful!");
      setReceiverEmail("");
      setAmount("");
      await loadUser();
      await loadTransactions(data.account._id);
      await loadNotifications();
    } catch (err) {
      alert(err.response?.data || "Transfer failed");
    } finally {
      setTransferLoading(false);
    }
  };

  const changePassword = async () => {
    if (!oldPassword || !newPassword) return alert("Please fill both password fields");
    if (newPassword.length < 6) return alert("New password must be at least 6 characters");
    try {
      await API.put("/auth/change-password", { oldPassword, newPassword });
      alert("✅ Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data || "Password change failed");
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(data.account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    loadUser();
    loadNotifications();
  }, []);

  useEffect(() => {
    if (data?.account?._id) loadTransactions(data.account._id);
  }, [data]);

  if (loading) {
    return (
      <div style={loadingContainer}>
        <div className="spinner"></div>
        <h3>Loading your dashboard...</h3>
      </div>
    );
  }

  if (!data?.account) {
  // Clear localStorage to prevent auto-login loop
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  return (
    <div style={errorContainer}>
      <h2>⚠️ Account Not Found</h2>
      <p>No bank account associated with this user.</p>
      <p style={{ fontSize: "13px", marginTop: "8px", color: "#64748b" }}>
        Please sign up for a new account or contact support.
      </p>
      <button 
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }} 
        style={goBackButton}
        onMouseEnter={(e) => {
          e.target.style.background = "#3b82f6";
          e.target.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#60a5fa";
          e.target.style.transform = "translateY(0)";
        }}
      >
        ← Go Back to Login
      </button>
    </div>
  );
}

  return (
    <div style={appWrapper}>
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        logout={logout} 
      />
      
      <div style={mainContentArea}>
        {/* Welcome Section */}
        <div style={welcomeSection}>
          <div>
            <h1 style={welcomeTitle}>
              Welcome back, <span style={{ color: "#60a5fa" }}>{data.user.name}</span>
            </h1>
            <p style={welcomeSubtitle}>Manage your finances effortlessly</p>
          </div>
          <div style={dateBadge}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Dashboard Home */}
        {currentPage === "dashboard" && (
          <div>
            {/* Bank Card */}
            <div style={bankCard}>
              <div style={bankCardHeader}>
                <div>
                  <h3 style={bankName}>CBS BANK</h3>
                  <p style={cardType}>Premium Debit Card</p>
                </div>
                <CreditCard size={48} style={{ opacity: 0.8 }} />
              </div>
              
              <div style={cardNumberSection}>
                <p style={cardLabel}>Card Number</p>
                <div style={cardNumberRow}>
                  <h2 style={cardNumber}>
                    •••• •••• •••• {String(data.account.accountNumber).slice(-4)}
                  </h2>
                  <button onClick={copyAccountNumber} style={copyBtn}>
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div style={cardFooter}>
                <div>
                  <p style={cardLabel}>Card Holder</p>
                  <p style={cardValue}>{data.user.name.toUpperCase()}</p>
                </div>
                <div>
                  <p style={cardLabel}>Expires</p>
                  <p style={cardValue}>12/28</p>
                </div>
                <div>
                  <p style={cardLabel}>Balance</p>
                  <div style={balanceRow}>
                    <p style={balanceAmount}>
                      {showBalance ? `₨ ${data.account.balance.toLocaleString()}` : '••••••'}
                    </p>
                    <button onClick={() => setShowBalance(!showBalance)} style={hideBtn}>
                      {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={quickStats}>
              <div style={statBox}>
                <div style={statIconBlue}>
                  <ArrowUp size={20} color="white" />
                </div>
                <div>
                  <p style={statLabel}>Total Sent</p>
                  <h4 style={statNumber}>₨ {totalSent.toLocaleString()}</h4>
                </div>
              </div>
              <div style={statBox}>
                <div style={statIconGreen}>
                  <ArrowDown size={20} color="white" />
                </div>
                <div>
                  <p style={statLabel}>Total Received</p>
                  <h4 style={statNumber}>₨ {totalReceived.toLocaleString()}</h4>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div style={transactionsCard}>
              <div style={cardHeader}>
                <h3 style={sectionTitle}>Recent Transactions</h3>
                <button onClick={() => setCurrentPage("history")} style={viewAllBtn}>
                  View All →
                </button>
              </div>
              
              {transactions.length === 0 ? (
                <div style={emptyState}>
                  <p>No transactions yet</p>
                </div>
              ) : (
                transactions.map((t, i) => (
                  <div key={i} style={transactionItem}>
                    <div style={transactionIcon}>
                      {t.displayType === "sent" ? '⬆️' : '⬇️'}
                    </div>
                    <div style={transactionInfo}>
                      <p style={transactionType}>
                        {t.displayType === "sent" ? 'Money Sent' : 'Money Received'}
                      </p>
                      <p style={transactionDate}>
                        {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p style={{ 
                      ...transactionAmount, 
                      color: t.displayType === "sent" ? '#ef4444' : '#10b981' 
                    }}>
                      {t.displayType === "sent" ? '-' : '+'} ₨ {t.amount.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Transfer Page */}
        {currentPage === "transfer" && (
          <div style={formCard}>
            <h2 style={formTitle}>Make a Transfer</h2>
            <p style={formSubtitle}>Send money securely to any account</p>
            
            <div style={formGroup}>
              <label style={inputLabel}>Recipient Email</label>
              <input 
                type="email" 
                placeholder="Enter recipient's email address" 
                value={receiverEmail} 
                onChange={(e) => setReceiverEmail(e.target.value)} 
                style={modernInput} 
              />
            </div>
            
            <div style={formGroup}>
              <label style={inputLabel}>Amount (PKR)</label>
              <input 
                type="number" 
                placeholder="Enter amount" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                style={modernInput} 
              />
            </div>
            
            <button 
              onClick={transferMoney} 
              disabled={transferLoading} 
              style={sendMoneyBtn}
            >
              {transferLoading ? (
                <div className="spinner small"></div>
              ) : (
                <>
                  <Send size={18} /> Send Money
                </>
              )}
            </button>
          </div>
        )}

        {/* History Page */}
        {currentPage === "history" && (
          <div style={formCard}>
            <h2 style={formTitle}>Transaction History</h2>
            
            <div style={searchBox}>
              <Search size={18} style={{ color: "#64748b" }} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                style={searchInput} 
              />
            </div>
            
            <div style={historyList}>
              {transactions
                .filter(t => t.amount.toString().includes(search))
                .map((t, i) => (
                  <div key={i} style={historyItem}>
                    <div>
                      <p style={historyAmount}>₨ {t.amount.toLocaleString()}</p>
                      <p style={{ 
                        ...historyType, 
                        color: t.displayType === "sent" ? "#ef4444" : "#10b981" 
                      }}>
                        {t.displayType === "sent" ? "Money Sent" : "Money Received"}
                      </p>
                    </div>
                    <p style={historyDate}>
                      {new Date(t.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Beneficiaries Page */}
        {currentPage === "beneficiaries" && (
          <Beneficiaries 
            setReceiverEmail={setReceiverEmail} 
            setCurrentPage={setCurrentPage} 
          />
        )}

        {/* Profile Page */}
        {currentPage === "profile" && (
          <div style={formCard}>
            <div style={profileHeader}>
              <div style={avatar}>
                {data.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={profileName}>{data.user.name}</h2>
                <p style={profileEmail}>{data.user.email}</p>
              </div>
            </div>
            
            <div style={profileDetails}>
              <div style={detailRow}>
                <span style={detailLabel}>Role</span>
                <span style={detailValue}>{data.user.role}</span>
              </div>
              <div style={detailRow}>
                <span style={detailLabel}>Account ID</span>
                <span style={detailValue}>{data.account._id}</span>
              </div>
              <div style={detailRow}>
                <span style={detailLabel}>Account Number</span>
                <span style={detailValue}>{data.account.accountNumber}</span>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Page */}
        {currentPage === "notifications" && (
          <div style={formCard}>
            <h2 style={formTitle}>Notifications</h2>
            {notifications.length === 0 ? (
              <div style={emptyState}>
                <Bell size={48} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} style={notificationItem}>
                  <div style={notificationIcon}>🔔</div>
                  <div>
                    <p style={notificationMsg}>{n.message}</p>
                    <p style={notificationTime}>
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Security Page */}
        {currentPage === "security" && (
          <div style={formCard}>
            <h2 style={formTitle}>Security Settings</h2>
            <p style={formSubtitle}>Change your account password</p>
            
            <div style={formGroup}>
              <label style={inputLabel}>Current Password</label>
              <input 
                type="password" 
                placeholder="Enter current password" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} 
                style={modernInput} 
              />
            </div>
            
            <div style={formGroup}>
              <label style={inputLabel}>New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password (min 6 characters)" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                style={modernInput} 
              />
            </div>
            
            <button onClick={changePassword} style={updatePasswordBtn}>
              <Shield size={18} /> Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const appWrapper = {
  display: "flex",
  minHeight: "100vh",
  background: "#0f172a"
};

const mainContentArea = {
  flex: 1,
  marginLeft: "260px",
  padding: "30px 40px",
  overflowY: "auto",
  minHeight: "100vh"
};

const welcomeSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  flexWrap: "wrap",
  gap: "16px"
};

const welcomeTitle = {
  fontSize: "28px",
  fontWeight: "600",
  marginBottom: "8px",
  color: "white"
};

const welcomeSubtitle = {
  color: "#94a3b8",
  fontSize: "14px"
};

const dateBadge = {
  background: "#1e293b",
  padding: "8px 16px",
  borderRadius: "10px",
  fontSize: "14px",
  color: "#94a3b8"
};

const bankCard = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "24px",
  padding: "28px",
  marginBottom: "24px",
  color: "white",
  boxShadow: "0 20px 35px -10px rgba(0,0,0,0.3)"
};

const bankCardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "30px"
};

const bankName = {
  fontSize: "18px",
  fontWeight: "600",
  letterSpacing: "1px",
  marginBottom: "4px"
};

const cardType = {
  fontSize: "12px",
  opacity: 0.8
};

const cardNumberSection = {
  marginBottom: "30px"
};

const cardLabel = {
  fontSize: "11px",
  opacity: 0.7,
  marginBottom: "8px"
};

const cardNumberRow = {
  display: "flex",
  alignItems: "center",
  gap: "12px"
};

const cardNumber = {
  fontSize: "20px",
  letterSpacing: "2px"
};

const copyBtn = {
  background: "rgba(255,255,255,0.2)",
  border: "none",
  borderRadius: "8px",
  padding: "6px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "white"
};

const cardFooter = {
  display: "flex",
  justifyContent: "space-between"
};

const cardValue = {
  fontSize: "14px",
  fontWeight: "600"
};

const balanceRow = {
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const balanceAmount = {
  fontSize: "18px",
  fontWeight: "700"
};

const hideBtn = {
  background: "rgba(255,255,255,0.2)",
  border: "none",
  borderRadius: "6px",
  padding: "4px 8px",
  cursor: "pointer"
};

const quickStats = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "16px",
  marginBottom: "24px"
};

const statBox = {
  background: "#1e293b",
  borderRadius: "16px",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: "12px"
};

const statIconBlue = {
  width: "40px",
  height: "40px",
  background: "#3b82f6",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const statIconGreen = {
  width: "40px",
  height: "40px",
  background: "#10b981",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const statLabel = {
  color: "#94a3b8",
  fontSize: "12px",
  marginBottom: "4px"
};

const statNumber = {
  color: "white",
  fontSize: "18px",
  fontWeight: "600"
};

const transactionsCard = {
  background: "#1e293b",
  borderRadius: "16px",
  padding: "24px"
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "white"
};

const viewAllBtn = {
  background: "transparent",
  border: "none",
  color: "#60a5fa",
  cursor: "pointer",
  fontSize: "14px"
};

const transactionItem = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 0",
  borderBottom: "1px solid #334155"
};

const transactionIcon = {
  fontSize: "24px"
};

const transactionInfo = {
  flex: 1,
  marginLeft: "12px"
};

const transactionType = {
  fontWeight: "500",
  marginBottom: "4px"
};

const transactionDate = {
  fontSize: "12px",
  color: "#94a3b8"
};

const transactionAmount = {
  fontWeight: "600",
  fontSize: "16px"
};

const formCard = {
  background: "#1e293b",
  borderRadius: "16px",
  padding: "28px"
};

const formTitle = {
  fontSize: "22px",
  fontWeight: "600",
  marginBottom: "8px",
  color: "white"
};

const formSubtitle = {
  color: "#94a3b8",
  fontSize: "14px",
  marginBottom: "24px"
};

const formGroup = {
  marginBottom: "20px"
};

const inputLabel = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#cbd5e1"
};

const modernInput = {
  width: "100%",
  padding: "12px 16px",
  background: "#334155",
  border: "1px solid #475569",
  borderRadius: "10px",
  color: "white",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box"
};

const sendMoneyBtn = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px"
};

const updatePasswordBtn = {
  width: "100%",
  padding: "12px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px"
};

const searchBox = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "#334155",
  padding: "8px 16px",
  borderRadius: "10px",
  marginBottom: "20px"
};

const searchInput = {
  background: "transparent",
  border: "none",
  color: "white",
  flex: 1,
  outline: "none"
};

const historyList = {
  maxHeight: "500px",
  overflowY: "auto"
};

const historyItem = {
  background: "#334155",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const historyAmount = {
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "4px"
};

const historyType = {
  fontSize: "12px",
  color: "#94a3b8"
};

const historyDate = {
  fontSize: "12px",
  color: "#94a3b8"
};

const profileHeader = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px",
  paddingBottom: "20px",
  borderBottom: "1px solid #334155"
};

const avatar = {
  width: "80px",
  height: "80px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "32px",
  fontWeight: "bold",
  color: "white"
};

const profileName = {
  fontSize: "24px",
  fontWeight: "600",
  marginBottom: "4px"
};

const profileEmail = {
  color: "#94a3b8"
};

const profileDetails = {
  display: "flex",
  flexDirection: "column",
  gap: "16px"
};

const detailRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #334155"
};

const detailLabel = {
  color: "#94a3b8",
  fontWeight: "500"
};

const detailValue = {
  color: "white",
  fontWeight: "500"
};

const notificationItem = {
  display: "flex",
  gap: "12px",
  padding: "16px",
  background: "#334155",
  borderRadius: "12px",
  marginBottom: "12px"
};

const notificationIcon = {
  fontSize: "20px"
};

const notificationMsg = {
  marginBottom: "4px"
};

const notificationTime = {
  fontSize: "12px",
  color: "#94a3b8"
};

const emptyState = {
  textAlign: "center",
  padding: "60px 20px",
  color: "#94a3b8"
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

const errorContainer = {
  minHeight: "100vh",
  background: "#0f172a",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  color: "white",
  textAlign: "center",
  padding: "20px"
};

const goBackButton = {
  marginTop: "20px",
  padding: "12px 24px",
  background: "#60a5fa",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease"
};

export default Dashboard;