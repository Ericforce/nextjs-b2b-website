import * as React from "react";

export interface ContactEmailProps {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
}

const cellStyle: React.CSSProperties = {
  padding: "4px 0"
};

export default function ContactEmailTemplate({
  name,
  email,
  company,
  budget,
  message
}: ContactEmailProps) {
  const paragraphs = message
    .split(/[\r\n]+/)
    .filter((line) => line.trim().length > 0);

  return (
    <div style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: "#111827" }}>
      <h2 style={{ marginBottom: "16px" }}>New contact form submission</h2>
      <table cellPadding={0} cellSpacing={0} style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={cellStyle}><strong>Name</strong></td>
            <td style={cellStyle}>{name}</td>
          </tr>
          <tr>
            <td style={cellStyle}><strong>Email</strong></td>
            <td style={cellStyle}>{email}</td>
          </tr>
          {company ? (
            <tr>
              <td style={cellStyle}><strong>Company</strong></td>
              <td style={cellStyle}>{company}</td>
            </tr>
          ) : null}
          {budget ? (
            <tr>
              <td style={cellStyle}><strong>Budget</strong></td>
              <td style={cellStyle}>{budget}</td>
            </tr>
          ) : null}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <strong>Message</strong>
        <div style={{ marginTop: "12px", lineHeight: 1.6 }}>
          {paragraphs.length > 0
            ? paragraphs.map((paragraph, index) => (
                <p key={index} style={{ margin: "0 0 12px" }}>
                  {paragraph}
                </p>
              ))
            : (
                <p style={{ margin: 0 }}>{message}</p>
              )}
        </div>
      </div>
    </div>
  );
}
