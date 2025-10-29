import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch",
  description:
    "Ready to transform your business? Contact our team to discuss how we can help you achieve your goals. Fill out our contact form or reach us directly.",
  openGraph: {
    title: "Contact Us | Get in Touch",
    description:
      "Ready to transform your business? Contact our team to discuss how we can help you achieve your goals.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
