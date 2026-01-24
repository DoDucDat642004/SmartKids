"use client";

import { useState, useEffect } from "react";
import styles from "@/components/clients/css/subscription.module.css";
import Link from "next/link";
import { financeService } from "@/services/finance.service";
import { Loader2 } from "lucide-react";
import PaymentModal from "@/components/clients/payment/PaymentModal";

export default function SubscriptionPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal Thanh toán
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [selectedPackName, setSelectedPackName] = useState("");

  // 1. Fetch Gói cước thật từ Backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res: any = await financeService.getPublicPackages();
        setPackages(res);
      } catch (error) {
        console.error("Lỗi tải gói cước", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // 2. Xử lý khi bấm "Nâng cấp"
  const handleSubscribe = async (pack: any) => {
    try {
      // Gọi API tạo giao dịch Pending
      const tx: any = await financeService.createPayment(pack._id, pack.price);

      // Mở modal thanh toán
      setPendingTx(tx);
      setSelectedPackName(pack.name);
      setPaymentOpen(true);
    } catch (error) {
      alert("Vui lòng đăng nhập để mua gói!");
    }
  };

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Lọc gói theo Tab (Logic: Gói < 100 ngày là tháng, > 300 ngày là năm)
  const filteredPackages = packages.filter((p) =>
    billing === "monthly" ? p.duration < 100 : p.duration > 300,
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>💎</div>
        <h1 className={styles.title}>Cửa Hàng Siêu Năng Lực</h1>
        <p className={styles.subtitle}>
          Mở khóa toàn bộ sức mạnh để bé học giỏi hơn!
        </p>
      </div>

      {/* TOGGLE SWITCH */}
      <div className={styles.toggleContainer}>
        <span
          className={`${styles.toggleLabel} ${
            billing === "monthly" ? styles.active : ""
          }`}
          onClick={() => setBilling("monthly")}
        >
          Theo Tháng
        </span>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={billing === "yearly"}
            onChange={() =>
              setBilling(billing === "monthly" ? "yearly" : "monthly")
            }
          />
          <span className={styles.slider}></span>
        </label>
        <span
          className={`${styles.toggleLabel} ${
            billing === "yearly" ? styles.active : ""
          }`}
          onClick={() => setBilling("yearly")}
        >
          Theo Năm <span className={styles.discountBadge}>-30%</span>
        </span>
      </div>

      {/* PRICING CARDS */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="animate-spin inline" /> Đang tải gói cước...
        </div>
      ) : (
        <div className={styles.cardsWrapper}>
          {/* GÓI FREE */}
          <div className={`${styles.card} ${styles.btnFree}`}>
            <div className={styles.icon}>🐣</div>
            <h2 className={styles.planName}>Bé Tập Sự</h2>
            <div className={styles.price}>0đ</div>
            <div className={styles.period}>Mãi mãi</div>
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <span className={styles.check}>✓</span> Học 2 bài mỗi ngày
              </div>
              <div className={styles.featureItem}>
                <span className={styles.cross}>×</span> Chat với AI Lion
              </div>
            </div>
            <button className={`${styles.btn} ${styles.btnFree}`} disabled>
              Đang sử dụng
            </button>
          </div>

          {/* CÁC GÓI TỪ DB */}
          {filteredPackages.map((plan) => (
            <div
              key={plan._id}
              className={`${styles.card} ${plan.badge ? styles.popular : ""}`}
            >
              {plan.badge && <div className={styles.ribbon}>{plan.badge}</div>}

              <div className={styles.icon}>🦸‍♂️</div>
              <h2 className={styles.planName}>{plan.name}</h2>

              <div className={styles.price}>
                {formatMoney(plan.price)}
                {plan.originalPrice > plan.price && (
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "#999",
                      textDecoration: "line-through",
                      marginLeft: "10px",
                    }}
                  >
                    {formatMoney(plan.originalPrice)}
                  </span>
                )}
              </div>
              <div className={styles.period}>/{plan.duration} ngày</div>

              <div className={styles.features}>
                {plan.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className={styles.featureItem}>
                    <span className={styles.check}>✓</span> {benefit}
                  </div>
                ))}
              </div>

              <button
                className={`${styles.btn} ${styles.btnPro}`}
                onClick={() => handleSubscribe(plan)}
              >
                Nâng cấp ngay
              </button>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER */}
      <div style={{ marginTop: "50px" }}>
        <Link href="/profile" style={{ color: "#003580", fontWeight: "bold" }}>
          Để sau, quay lại trang cá nhân
        </Link>
      </div>

      {/* MODAL THANH TOÁN */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setPaymentOpen(false)}
        transaction={pendingTx}
        packName={selectedPackName}
      />
    </div>
  );
}
