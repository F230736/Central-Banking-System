import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { CreditCard, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async () => {
    if (!name || !email || !password) return alert("Please fill all fields");
    if (password.length < 6) return alert("Password must be at least 6 characters");
    setLoading(true);
    try {
      await API.post("/auth/register", { name, email, password });
      alert("✅ Account created successfully! Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardContainer}>
        <div style={brandSection}>
          <CreditCard size={48} style={{ marginBottom: "24px" }} />
          <h1 style={brandName}>CBS Bank</h1>
          <p style={brandTagline}>Join the future of banking</p>
        </div>
        <div style={formSection}>
          <h2 style={formTitle}>Create Account</h2>
          <p style={formSubtitle}>Get started with your free account</p>
          
          <div style={inputWrapper}>
            <User size={18} style={inputIconStyle} />
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
          
          <div style={inputWrapper}>
            <Mail size={18} style={inputIconStyle} />
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          
          <div style={inputWrapper}>
            <Lock size={18} style={inputIconStyle} />
            <input type={showPassword ? "text" : "password"} placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            <button onClick={() => setShowPassword(!showPassword)} style={toggleBtn}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          
          <button onClick={registerUser} disabled={loading} style={submitBtn}>
            {loading ? <div style={spinner}></div> : <>Sign Up <ArrowRight size={18} /></>}
          </button>
          
          <div style={loginLink}>
            <p>Already have an account? <button onClick={() => navigate("/")} style={linkBtn}>Login</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle = { minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" };
const cardContainer = { display: "flex", maxWidth: "900px", width: "100%", background: "#1e293b", borderRadius: "32px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" };
const brandSection = { flex: 1, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "48px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white" };
const brandName = { fontSize: "28px", fontWeight: "bold", marginBottom: "8px" };
const brandTagline = { fontSize: "14px", opacity: 0.9 };
const formSection = { flex: 1.2, padding: "48px", background: "#1e293b" };
const formTitle = { fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" };
const formSubtitle = { fontSize: "14px", color: "#94a3b8", marginBottom: "32px" };
const inputWrapper = { position: "relative", marginBottom: "20px" };
const inputIconStyle = { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b" };
const inputStyle = { width: "100%", padding: "12px 16px 12px 44px", background: "#334155", border: "1px solid #475569", borderRadius: "12px", fontSize: "14px", color: "white", outline: "none", boxSizing: "border-box" };
const toggleBtn = { position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer" };
const submitBtn = { width: "100%", padding: "12px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "24px" };
const loginLink = { textAlign: "center", marginTop: "24px", color: "#94a3b8", fontSize: "14px" };
const linkBtn = { background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: "14px", fontWeight: "600" };
const spinner = { width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 1s linear infinite" };

export default Signup;