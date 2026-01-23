import { useState, useEffect } from "react";
import axios from "axios";

export default function Setup2FA({ userId }) {
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const fetchQRCode = async () => {
      const res = await axios.get(`/api/auth/setup-2fa/${userId}`);
      setQrCode(res.data.qrCode);
    };
    fetchQRCode();
  }, [userId]);

  const enable2FA = async () => {
    await axios.post(`/api/auth/enable-2fa/${userId}`);
    alert("2FA enabled!");
  };

  return (
    <div>
      <h2>Setup 2FA</h2>
      {qrCode && (
        <>
          <img src={qrCode} alt="Scan QR code with Google Authenticator" />
          <button onClick={enable2FA}>Enable 2FA</button>
        </>
      )}
    </div>
  );
}
import Setup2FA from "./components/Setup2FA";

function App() {
  const userId = "12345"; // Replace with logged-in userId from login response

  return (
    <div>
      <Setup2FA userId={userId} />
    </div>
  );
}

export default App;