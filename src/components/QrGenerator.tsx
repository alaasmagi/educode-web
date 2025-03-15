import React from "react";
import QRCode from "react-qr-code";
import "../styles/QrGenerator.css";

interface QrGeneratorProperties {
  value: string;
}

const QrGenerator: React.FC<QrGeneratorProperties> = ({ value }) => {
  return (
    <div className="qr-container">
      <QRCode className="qr-code" value={value} size={350} bgColor="#BCBCBD" />
    </div>
  );
};

export default QrGenerator;
