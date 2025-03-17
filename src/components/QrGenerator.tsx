import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import "../styles/QrGenerator.css";

interface QrGeneratorProperties {
  value: string;
}

const QrGenerator: React.FC<QrGeneratorProperties> = ({ value }) => {
  const [qrSize, setQrSize] = useState(400);

  useEffect(() => {
    const handleResize = () => {
      setQrSize(window.innerWidth < 600 ? 250 : 500);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="qr-container">
      <QRCode
        className="qr-code"
        value={value}
        size={qrSize}
        bgColor="#BCBCBD"
      />
    </div>
  );
};

export default QrGenerator;
