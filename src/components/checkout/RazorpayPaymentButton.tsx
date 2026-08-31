"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { CreditCard, Sparkles, CheckCircle2, ShieldCheck, Loader2, Zap } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  amount: number;
  customerData: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  cartItems: any[];
  discount: number;
  disabled?: boolean;
}

export default function RazorpayPaymentButton({
  amount,
  customerData,
  cartItems,
  discount,
  disabled,
}: RazorpayButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [mockOrderData, setMockOrderData] = useState<any>(null);

  // Script Loader Helper
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInitiatePayment = async () => {
    if (!customerData.fullName || !customerData.email || !customerData.street || !customerData.city) {
      toast("Please complete all shipping address fields before payment", "error");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on server via Razorpay API
      const res = await fetch("/api/payment/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer: customerData.fullName,
            email: customerData.email,
          },
        }),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      const isLiveKeys =
        orderData.keyId && !orderData.keyId.startsWith("rzp_test_mock");

      // If live/test real keys exist, attempt Razorpay Official Modal
      if (isLiveKeys) {
        const scriptLoaded = await loadRazorpayScript();
        if (scriptLoaded && window.Razorpay) {
          const options = {
            key: orderData.keyId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "NOTICE Objects Studio",
            description: "Order Checkout Payment",
            order_id: orderData.orderId,
            prefill: {
              name: customerData.fullName,
              email: customerData.email,
              contact: customerData.phone,
            },
            theme: { color: "#004fff" },
            handler: async function (response: any) {
              await verifyAndPlaceOrder({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
            },
          };

          const paymentObj = new window.Razorpay(options);
          paymentObj.open();
          setLoading(false);
          return;
        }
      }

      // 2. Open High-Fidelity Razorpay Checkout Simulator for instant zero-friction sandbox testing
      setMockOrderData(orderData);
      setShowSimulatedModal(true);
    } catch (err: any) {
      toast(err.message || "Failed to initiate payment", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedSuccess = async () => {
    setLoading(true);
    const mockPaymentId = `pay_mock_${Math.random().toString(36).substring(2, 11)}`;
    const mockSignature = `sig_mock_${Math.random().toString(36).substring(2, 16)}`;

    await verifyAndPlaceOrder({
      razorpayOrderId: mockOrderData.orderId,
      razorpayPaymentId: mockPaymentId,
      razorpaySignature: mockSignature,
    });
  };

  const verifyAndPlaceOrder = async (paymentProof: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    try {
      // Step A: Server Signature Verification
      const verifyRes = await fetch("/api/payment/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentProof),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error("Payment signature verification failed");
      }

      // Step B: Create Order in Database Store (Postgres / Supabase)
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerData.fullName,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          items: cartItems.map((item) => ({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            price: item.price,
            quantity: item.quantity,
            selectedVariant: item.selectedVariant,
          })),
          discount,
          shippingAddress: customerData,
          paymentMethod: "RAZORPAY",
          razorpayOrderId: paymentProof.razorpayOrderId,
          razorpayPaymentId: paymentProof.razorpayPaymentId,
          razorpaySignature: paymentProof.razorpaySignature,
        }),
      });

      const placedOrder = await orderRes.json();
      if (!placedOrder.success) {
        throw new Error("Failed to save order in database");
      }

      // Step C: Auto-generate Shipment Manifest
      await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: placedOrder.order.id,
          courier: "Delhivery",
        }),
      });

      toast("Payment verified! Order placed successfully.", "success");
      router.push(`/order-success/${placedOrder.order.id}`);
    } catch (err: any) {
      toast(err.message || "Failed to complete order processing", "error");
      setLoading(false);
      setShowSimulatedModal(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInitiatePayment}
        disabled={disabled || loading}
        className="w-full py-4 px-6 bg-[#004fff] hover:bg-[#003ecc] text-[#fffdf8] font-extrabold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting Gateway...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            <span>Pay {formatCurrency(amount)} with Razorpay</span>
          </>
        )}
      </button>

      {/* Razorpay Interactive Simulator Modal */}
      {showSimulatedModal && mockOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fffdf8] border border-[#121212] max-w-md w-full p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#121212]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#004fff] text-white flex items-center justify-center font-black text-sm">
                  R
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase text-[#121212]">
                    Razorpay Gateway Sandbox
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-500">{mockOrderData.orderId}</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-[#004fff]/10 text-[#004fff] border border-[#004fff]/30">
                SANDBOX
              </span>
            </div>

            {/* Order Value Display */}
            <div className="p-4 bg-[#f4f3ef] border border-[#121212] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">
                  Total Payable
                </span>
                <p className="text-2xl font-black text-[#121212]">{formatCurrency(amount)}</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-[#004fff]" />
            </div>

            {/* Payment Options Preview */}
            <div className="space-y-2 text-xs font-bold uppercase tracking-wider text-zinc-700">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-extrabold block">
                Select Test Instrument:
              </label>
              <div className="p-3.5 border-2 border-[#004fff] bg-[#004fff]/5 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#004fff]" />
                  <span className="font-extrabold text-[#121212]">UPI / Instant NetBanking (Auto-Pass)</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#004fff]" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSimulatedSuccess}
                disabled={loading}
                className="w-full py-4 bg-[#121212] hover:bg-[#004fff] text-[#fffdf8] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Signature...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Successful Payment</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSimulatedModal(false)}
                disabled={loading}
                className="w-full py-2 text-[11px] text-zinc-500 hover:text-[#121212] font-extrabold uppercase tracking-wider text-center"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
