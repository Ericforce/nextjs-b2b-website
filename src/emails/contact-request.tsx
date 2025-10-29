import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactRequestEmailProps {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

export function ContactRequestEmail({
  name,
  email,
  company,
  phone,
  message,
}: ContactRequestEmailProps) {
  const previewText = `New contact form submission from ${name}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>
          <Text style={text}>
            You've received a new message from your website contact form.
          </Text>
          <Hr style={hr} />
          <Section style={informationSection}>
            <Text style={informationLabel}>Name</Text>
            <Text style={informationValue}>{name}</Text>
          </Section>
          <Section style={informationSection}>
            <Text style={informationLabel}>Email</Text>
            <Text style={informationValue}>
              <a href={`mailto:${email}`} style={link}>
                {email}
              </a>
            </Text>
          </Section>
          {company && (
            <Section style={informationSection}>
              <Text style={informationLabel}>Company</Text>
              <Text style={informationValue}>{company}</Text>
            </Section>
          )}
          {phone && (
            <Section style={informationSection}>
              <Text style={informationLabel}>Phone</Text>
              <Text style={informationValue}>{phone}</Text>
            </Section>
          )}
          <Hr style={hr} />
          <Section>
            <Text style={informationLabel}>Message</Text>
            <Text style={messageText}>{message}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footerText}>
            This email was sent from your website contact form. To reply, simply
            respond to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactRequestEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "16px 32px",
  padding: "0",
};

const text = {
  color: "#484848",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 32px 16px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 32px",
};

const informationSection = {
  padding: "0 32px",
  marginBottom: "16px",
};

const informationLabel = {
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 4px",
};

const informationValue = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0 0 16px",
};

const link = {
  color: "#2563eb",
  textDecoration: "underline",
};

const messageText = {
  color: "#1a1a1a",
  fontSize: "16px",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap" as const,
  margin: "8px 32px 0",
};

const footerText = {
  color: "#9ca3af",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 32px",
};
