// src/Components/MailtoButton.tsx
import React from "react";
import { Button } from "antd";
import { MailOutlined } from "@ant-design/icons";

interface MailtoButtonProps {
  to: string;
  subject?: string;
  body?: string;
  children?: React.ReactNode;
}

const MailtoButton: React.FC<MailtoButtonProps> = ({ to, subject = "", body = "", children }) => {
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a href={href}>
      <Button type="primary" icon={<MailOutlined />} shape="round">
        {children || "Contactar soporte"}
      </Button>
    </a>
  );
};

export default MailtoButton;
