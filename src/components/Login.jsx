import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../Api/api";
import "../assets/style/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API_URL.post("/login", { email, password });
      const token = res.data.token;

      if (!token) {
        setError("Token មិនបានទទួលពី server");
        return;
      }

      // ✅ ១. រក្សាទុក Token និង User ទិន្នន័យ
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ ២. បាញ់ Event "authChange" ដើម្បីឱ្យ Navbar ដឹងខ្លួនរត់ទៅ Fetch Profile
      window.dispatchEvent(new Event("authChange"));

      // ✅ ៣. រុញទៅទំព័រ Dashboard
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login មិនជោគជ័យ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>ចូលប្រើប្រាស់</h2>
        {error && <div className="login-error" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="បញ្ចូល Email" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="បញ្ចូល Password" required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "កំពុងចូល..." : "ចូលប្រើ"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;