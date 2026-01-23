import { useState } from "react";

const API_URL = "http://localhost:5000/api/auth"; // Change to deployed URL if needed

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  // Register
  const handleRegister = async () => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.userId) setUserId(data.userId);
    setMessage(JSON.stringify(data));
  };

  // Setup 2FA
  const handleSetup2FA = async () => {
    const res = await fetch(`${API_URL}/2fa/setup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setMessage("2FA Secret (add to Authenticator): " + data.base32);
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const res = await fetch(`${API_URL}/2fa/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, token: otp }),
    });
    const data = await res.json();
    setMessage(JSON.stringify(data));
  };

  // Login
  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, token: otp }),
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("jwt", data.token);
    }
    setMessage(JSON.stringify(data));
  };

  // Fetch protected profile
  const handleFetchProfile = async () => {
    const jwtToken = token || localStorage.getItem("jwt");
    if (!jwtToken) {
      setMessage("Please login first to get JWT");
      return;
    }

    const res = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${jwtToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setMessage("Profile fetched successfully");
    } else {
      const err = await res.json();
      setMessage(JSON.stringify(err));
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>2FA Authentication Demo</h1>

      <div>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div style={{ margin: "10px 0" }}>
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleSetup2FA}>Setup 2FA</button>
      </div>

      <div>
        <input
          placeholder="OTP from Authenticator"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerifyOTP}>Verify OTP</button>
      </div>

      <div style={{ margin: "10px 0" }}>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleFetchProfile}>Fetch Profile</button>
      </div>

      {token && <div style={{ color: "green" }}>JWT: {token}</div>}

      {profile && (
        <div style={{ marginTop: "10px" }}>
          <h3>User Profile:</h3>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      <pre>{message}</pre>
    </div>
  );
}

export default App;
