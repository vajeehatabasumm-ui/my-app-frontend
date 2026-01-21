import { useState } from "react";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://my-app-backend.onrender.com/api/auth/login",
        form
      );
      alert("Login successful! Token: " + res.data.token);
      // You can store token in localStorage for authentication
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      alert("Login failed: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        type="email"
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        placeholder="Password"
        type="password"
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
}

export default Login;
<p>
  Don't have an account? <a href="/register">Sign Up</a>
</p>