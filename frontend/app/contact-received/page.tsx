import { Metadata } from "next";
import ContactReceivedClient from "./ContactReceivedClient";

export const metadata: Metadata = {
  title: "Contact Received - Thank You",
  description:
    "Thank you for contacting SB. Your message has been received and I will get back to you within 24 hours.",
  robots: {
    index: false, // Don't index this page in search results
    follow: false,
  },
};

export default function ContactReceivedPage() {
  return <ContactReceivedClient />;
}
