"use client";

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoicePDFProps {
  businessName: string;
  clientName: string;
  clientAddress: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  currency: string;
  logo?: string; 
  invoiceNumber: string;
  issueDate: string; 
}

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  section: { marginBottom: 12 },
  header: { fontSize: 20, marginBottom: 10, fontWeight: "bold" },
  smallText: { fontSize: 10, color: "gray" },
  table: { display: "table", width: "auto", marginTop: 10 },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #eee", paddingBottom: 5, paddingTop: 5 },
  tableColDesc: { width: "60%" },
  tableColQty: { width: "20%", textAlign: "center" },
  tableColPrice: { width: "20%", textAlign: "right" },
  logo: { width: 150, height: "auto", marginBottom: 20, objectFit: "contain",  alignSelf: "center", 
  },
  totalSection: { marginTop: 20, textAlign: "right" },
  divider: { marginVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  footer: {
    position: "absolute",
    bottom: 30, // push near bottom of page
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "gray",
  },
});

export default function InvoicePDF({
  businessName,
  clientName,
  clientAddress,
  dueDate,
  items,
  notes,
  currency,
  logo,
  invoiceNumber
}: InvoicePDFProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);

  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo */}
        {logo && (
            <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Image style={styles.logo} src={logo} />
            </View>
        )}

        {/* Business and Client Info */}
        <View style={styles.section}>
            <Text style={styles.smallText}>Invoice #: {invoiceNumber || "N/A"}</Text>
          <Text style={styles.header}>{businessName || "Your Business Name"}</Text>
          <Text style={styles.smallText}>Due Date: {dueDate || "N/A"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 14, marginBottom: 2 }}>Bill To:</Text>
          <Text>{clientName || "Client Name"}</Text>
          <Text>{clientAddress || "Client Address"}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableColDesc, { fontWeight: "bold" }]}>Description</Text>
            <Text style={[styles.tableColQty, { fontWeight: "bold" }]}>Qty</Text>
            <Text style={[styles.tableColPrice, { fontWeight: "bold" }]}>Price</Text>
          </View>

          {/* Table Rows */}
          {items.map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableColDesc}>{item.description}</Text>
              <Text style={styles.tableColQty}>{item.quantity}</Text>
              <Text style={styles.tableColPrice}>{formatCurrency(item.price)}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Total: {formatCurrency(total)}</Text>
        </View>

        {/* Notes */}
        {notes && (
          <View style={styles.section}>
            <Text style={{ fontSize: 12, marginTop: 10 }}>Notes:</Text>
            <Text>{notes}</Text>
          </View>
        )}
        <View style={styles.footer}>
            <Text>Thank you for your business!</Text>
            <Text style={styles.smallText}>If you have any questions, contact us at support@yourcompany.com</Text>
        </View>
      </Page>
    </Document>
  );
}