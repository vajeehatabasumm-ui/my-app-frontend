import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.data.twoFactor) {
        setShow2FA(true);
        setUserId(res.data.userId);
      } else {
        localStorage.setItem("token", res.data.token);
        alert("Logged in successfully!");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/verify-2fa", { userId, token });
      localStorage.setItem("token", res.data.token);
      alert("2FA Verified! Logged in successfully!");
      setShow2FA(false);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div>
      {!show2FA ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleVerify2FA}>
          <h2>Enter 2FA Code</h2>
          <input
            type="text"
            placeholder="6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <button type="submit">Verify 2FA</button>
        </form>
      )}
    </div>
  );
}
