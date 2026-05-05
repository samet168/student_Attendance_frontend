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
      const res = await API_URL.post("/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // 🔥 YOUR BACKEND RETURNS: token
      const token = res.data.token;

      if (!token) {
        setError("Token មិនបានទទួលពី server");
        return;
      }

      // ✅ save token + user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // redirect
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);

      setError(
        err.response?.data?.message || "Login មិនជោគជ័យ"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="បញ្ចូល Email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="បញ្ចូល Password"
              required
            />
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