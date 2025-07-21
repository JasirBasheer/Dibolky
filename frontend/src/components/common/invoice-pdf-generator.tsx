import React, { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { FileDown } from "lucide-react";

const InvoicePDFGenerator = ({ Invoice }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const generatePDF = async () => {
    if (!Invoice || !invoiceRef.current) return;

    setIsGenerating(true);

    try {
      const element = invoiceRef.current;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${Invoice.invoiceNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollY: 0,
        },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={generatePDF}
        disabled={isGenerating || !Invoice}
        className="inline-flex items-center px-4 py-2 text-white bg-black rounded-md text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <FileDown className="h-4 w-4 mr-2" />
        {isGenerating ? "Generating PDF..." : "Download Invoice"}
      </button>

      <div style={{ display: "none" }}>
        <div
          ref={invoiceRef}
          style={{
            width: "100%",
            maxWidth: "8.5in",
            margin: "0 auto",
            backgroundColor: "white",
            fontFamily: "Arial, sans-serif",
            boxSizing: "border-box",
          }}
        >
          {Invoice && (
            <div
              style={{
                padding: "1in",
                backgroundColor: "white",
                minHeight: "10in",
              }}
            >
              {/* Header */}
              <div
                style={{
                  borderBottom: "2px solid #374151",
                  paddingBottom: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "#111827",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      INVOICE
                    </h1>
                    <div style={{ color: "#6B7280" }}>
                      <p
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          margin: "0 0 0.25rem 0",
                        }}
                      >
                        {Invoice.invoiceNumber}
                      </p>
                      <p style={{ margin: "0", fontSize: "0.875rem" }}>
                        Date: {formatDate(Invoice.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "0.5rem 1rem",
                        borderRadius: "1rem",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        backgroundColor: Invoice.isPaid ? "#DCFCE7" : "#FEE2E2",
                        color: Invoice.isPaid ? "#166534" : "#DC2626",
                      }}
                    >
                      {Invoice.isPaid ? "PAID" : "UNPAID"}
                    </div>
                    <div style={{ marginTop: "0.5rem", color: "#6B7280" }}>
                      <p
                        style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          margin: "0",
                        }}
                      >
                        {Invoice.orgName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client & Payment Info */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "2rem",
                  gap: "1rem",
                }}
              >
                <div style={{ width: "48%" }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Bill To:
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#F9FAFB",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "600",
                        color: "#111827",
                        margin: "0 0 0.25rem 0",
                      }}
                    >
                      {Invoice.client.clientName}
                    </p>
                    <p
                      style={{
                        color: "#6B7280",
                        margin: "0",
                        fontSize: "0.875rem",
                      }}
                    >
                      {Invoice.client.email}
                    </p>
                  </div>
                </div>

                <div style={{ width: "48%" }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Payment Details:
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#F9FAFB",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span style={{ color: "#6B7280", fontSize: "0.875rem" }}>
                        Due Date:
                      </span>
                      <span style={{ fontWeight: "500", fontSize: "0.875rem" }}>
                        {formatDate(Invoice.dueDate)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "#6B7280", fontSize: "0.875rem" }}>
                        Status:
                      </span>
                      <span
                        style={{
                          fontWeight: "500",
                          color: Invoice.isPaid ? "#059669" : "#DC2626",
                          fontSize: "0.875rem",
                        }}
                      >
                        {Invoice.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#111827",
                    marginBottom: "0.5rem",
                  }}
                >
                  Service Details:
                </h3>
                <table
                  style={{
                    width: "100%",
                    border: "1px solid #E5E7EB",
                    borderRadius: "0.5rem",
                    borderCollapse: "collapse",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#111827",
                          borderBottom: "1px solid #E5E7EB",
                        }}
                      >
                        Service
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#111827",
                          borderBottom: "1px solid #E5E7EB",
                        }}
                      >
                        Budget
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: "#111827",
                          borderBottom: "1px solid #E5E7EB",
                          textAlign: "right",
                        }}
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ verticalAlign: "top" }}>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          color: "#111827",
                          wordBreak: "break-word",
                        }}
                      >
                        {Invoice.service.serviceName}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          color: "#111827",
                          wordBreak: "break-word",
                        }}
                      >
                        ${Invoice.service.details.budget.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          color: "#111827",
                          wordBreak: "break-word",
                          textAlign: "right",
                          fontWeight: "500",
                        }}
                      >
                        ${Invoice.pricing.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div
                style={{
                  borderTop: "2px solid #374151",
                  paddingTop: "1rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#111827",
                      }}
                    >
                      Total: ${Invoice.pricing.toLocaleString()}
                    </span>
                  </div>
                  {Invoice.isPaid && (
                    <div
                      style={{
                        color: "#059669",
                        fontWeight: "600",
                        fontSize: "1rem",
                      }}
                    >
                      Payment Received
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  paddingTop: "1rem",
                  borderTop: "1px solid #E5E7EB",
                  textAlign: "center",
                  color: "#6B7280",
                  fontSize: "0.75rem",
                }}
              >
                <p style={{ margin: "0" }}>
                  Generated on {formatDate(new Date().toISOString())}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoicePDFGenerator;
