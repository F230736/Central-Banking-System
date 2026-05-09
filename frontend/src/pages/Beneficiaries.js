import React, { useEffect, useState } from "react";
import API from "../services/api";
import { UserPlus, UserMinus, Send, Users as UsersIcon, X } from "lucide-react";

const Beneficiaries = ({ setReceiverEmail, setCurrentPage }) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadBeneficiaries = async () => {
    try {
      const res = await API.get("/beneficiaries");
      setBeneficiaries(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addBeneficiary = async () => {
    if (!email || !nickname) return alert("Please fill all fields");
    setLoading(true);
    try {
      await API.post("/beneficiaries/add", { email, nickname });
      alert("✅ Beneficiary Added Successfully");
      setEmail("");
      setNickname("");
      setShowAddForm(false);
      loadBeneficiaries();
    } catch (err) {
      alert(err.response?.data || "Failed to add beneficiary");
    } finally {
      setLoading(false);
    }
  };

  const removeBeneficiary = async (id) => {
    if (window.confirm("Are you sure you want to remove this beneficiary?")) {
      try {
        await API.delete(`/beneficiaries/${id}`);
        loadBeneficiaries();
      } catch (err) {
        alert("Failed to remove beneficiary");
      }
    }
  };

  const quickTransfer = (b) => {
    if (!b.beneficiaryAccount?.email) return alert("Beneficiary email not found");
    setReceiverEmail(b.beneficiaryAccount.email);
    setCurrentPage("transfer");
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  return (
    <div style={container}>
      <div style={headerSection}><div><h2 style={pageTitle}>Beneficiaries</h2><p style={pageSubtitle}>Manage your saved contacts for quick transfers</p></div><button onClick={() => setShowAddForm(!showAddForm)} style={addButton}><UserPlus size={18} />{showAddForm ? "Cancel" : "Add New"}</button></div>
      
      {showAddForm && (<div style={formCard}><div style={formHeader}><h3 style={formTitle}>Add New Beneficiary</h3><button onClick={() => setShowAddForm(false)} style={closeBtn}><X size={18} /></button></div><div style={formGroup}><label style={inputLabel}>Email Address</label><input type="email" placeholder="Enter beneficiary's email" value={email} onChange={(e) => setEmail(e.target.value)} style={modernInput} /></div><div style={formGroup}><label style={inputLabel}>Nickname</label><input type="text" placeholder="Enter a nickname (e.g., Mom, Friend, etc.)" value={nickname} onChange={(e) => setNickname(e.target.value)} style={modernInput} /></div><button onClick={addBeneficiary} disabled={loading} style={saveButton}>{loading ? "Adding..." : "Save Beneficiary"}</button></div>)}
      
      <div style={listContainer}><div style={listHeader}><UsersIcon size={20} style={{ color: "#60a5fa" }} /><h3 style={listTitle}>Saved Beneficiaries</h3><span style={countBadge}>{beneficiaries.length}</span></div>
        {beneficiaries.length === 0 ? (<div style={emptyState}><UsersIcon size={48} style={{ color: "#475569", marginBottom: "16px" }} /><p>No beneficiaries added yet</p><p style={emptySubtext}>Add your first beneficiary to make quick transfers</p></div>) : (<div style={beneficiariesGrid}>{beneficiaries.map((b, i) => (<div key={i} style={beneficiaryCard}><div style={cardContent}><div style={avatarCircle}>{b.nickname?.charAt(0).toUpperCase() || "U"}</div><div><h4 style={beneficiaryName}>{b.nickname}</h4><p style={beneficiaryEmail}>{b.beneficiaryAccount?.email}</p><p style={beneficiaryActualName}>{b.beneficiaryAccount?.name}</p></div></div><div style={cardActions}><button onClick={() => quickTransfer(b)} style={transferBtn}><Send size={16} /> Transfer</button><button onClick={() => removeBeneficiary(b._id)} style={removeBtn}><UserMinus size={16} /> Remove</button></div></div>))}</div>)}
      </div>
    </div>
  );
};

const container = { padding: "20px 0" };
const headerSection = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "16px" };
const pageTitle = { fontSize: "24px", fontWeight: "600", color: "white", marginBottom: "4px" };
const pageSubtitle = { color: "#94a3b8", fontSize: "14px" };
const addButton = { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "500" };
const formCard = { background: "#1e293b", borderRadius: "16px", padding: "24px", marginBottom: "30px" };
const formHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" };
const formTitle = { fontSize: "18px", fontWeight: "600", color: "white" };
const closeBtn = { background: "#334155", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "white", display: "flex", alignItems: "center" };
const formGroup = { marginBottom: "16px" };
const inputLabel = { display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: "500", color: "#cbd5e1" };
const modernInput = { width: "100%", padding: "10px 14px", background: "#334155", border: "1px solid #475569", borderRadius: "8px", color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box" };
const saveButton = { width: "100%", padding: "10px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", marginTop: "8px" };
const listContainer = { background: "#1e293b", borderRadius: "16px", padding: "24px" };
const listHeader = { display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #334155" };
const listTitle = { fontSize: "18px", fontWeight: "600", color: "white", margin: 0 };
const countBadge = { background: "#3b82f6", padding: "2px 8px", borderRadius: "20px", fontSize: "12px", color: "white" };
const beneficiariesGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" };
const beneficiaryCard = { background: "#334155", borderRadius: "12px", padding: "16px" };
const cardContent = { display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" };
const avatarCircle = { width: "48px", height: "48px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "bold", color: "white" };
const beneficiaryName = { fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "4px" };
const beneficiaryEmail = { fontSize: "12px", color: "#94a3b8", marginBottom: "2px" };
const beneficiaryActualName = { fontSize: "11px", color: "#64748b" };
const cardActions = { display: "flex", gap: "8px" };
const transferBtn = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", background: "#3b82f6", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "500" };
const removeBtn = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px", background: "#dc2626", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "500" };
const emptyState = { textAlign: "center", padding: "60px 20px", color: "#94a3b8" };
const emptySubtext = { fontSize: "12px", marginTop: "8px", color: "#64748b" };

export default Beneficiaries;