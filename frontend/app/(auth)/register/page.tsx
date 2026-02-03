"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  GraduationCap,
  Baby,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation cơ bản
    if (formData.password.length < 6)
      return setError("Mật khẩu tối thiểu 6 ký tự.");
    if (formData.password !== formData.confirmPassword)
      return setError("Mật khẩu không khớp.");

    try {
      setLoading(true);

      // 1. Gọi API tạo tài khoản
      // Backend cần xử lý việc tạo user với role tương ứng
      await authService.register({
        fullName: formData.fullname,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // 2. Xử lý điều hướng dựa trên Role
      if (formData.role === "TEACHER") {
        // Nếu là Giáo viên -> Chuyển sang trang nộp hồ sơ
        // Truyền email và tên qua URL để trang bên kia tự điền (Auto-fill)
        const params = new URLSearchParams({
          email: formData.email,
          name: formData.fullname,
          autoStep: "2", // Báo hiệu cho trang kia nhảy sang bước 2 (nếu muốn)
        }).toString();

        alert("Tài khoản đã tạo thành công! Đang chuyển đến bước nộp hồ sơ...");

        router.push(`/become-teacher?${params}`);
      } else {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Helper để chọn Role
  const RoleCard = ({ value, label, icon: Icon }: any) => (
    <div
      onClick={() => setFormData({ ...formData, role: value })}
      className={`relative cursor-pointer rounded-xl p-3 border-2 flex flex-col items-center gap-2 transition-all ${
        formData.role === value
          ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
          : "border-slate-100 bg-slate-50 text-slate-500 hover:border-orange-200"
      }`}
    >
      <Icon
        size={24}
        className={
          formData.role === value ? "text-orange-600" : "text-slate-400"
        }
      />
      <span className="text-xs font-bold uppercase">{label}</span>

      {formData.role === value && (
        <div className="absolute top-1 right-1 text-orange-500">
          <CheckCircle2 size={14} />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-white to-pink-50 font-sans">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-white/50">
        {/* --- CỘT TRÁI: BANNER --- */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-orange-500 to-pink-500 relative flex-col items-center justify-center p-12 text-white overflow-hidden">
          <div className="absolute top-10 right-10 w-40 h-40 bg-yellow-300/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 w-full max-w-md text-center">
            <img
              src="https://img.freepik.com/free-vector/online-learning-isometric-concept_1284-17947.jpg"
              alt="Register"
              className="w-full h-auto mb-8 rounded-2xl shadow-lg border-4 border-white/20"
            />
            <h2 className="text-3xl font-extrabold mb-3 drop-shadow-sm">
              {formData.role === "TEACHER"
                ? "Trở thành Đối tác 🤝"
                : "Tham gia cùng SmartKids 🚀"}
            </h2>
            <p className="text-orange-50 text-base font-medium">
              {formData.role === "TEACHER"
                ? "Kết nối tri thức, chia sẻ đam mê và gia tăng thu nhập."
                : "Bắt đầu hành trình chinh phục tri thức ngay hôm nay."}
            </p>
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white h-full overflow-y-auto">
          {/* Logo */}
          <Link
            href="/home"
            className="flex items-center gap-3 mb-6 group w-fit"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
              <GraduationCap size={20} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-800 tracking-tighter leading-none">
                SmartKids
              </span>
              <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">
                Education System
              </span>
            </div>
          </Link>

          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            {formData.role === "TEACHER"
              ? "Đăng ký Giảng viên"
              : "Tạo tài khoản mới"}
          </h1>
          <p className="text-slate-500 mb-6 text-sm">
            {formData.role === "TEACHER"
              ? "Bước 1: Tạo tài khoản định danh để bắt đầu."
              : "Chọn vai trò và điền thông tin để bắt đầu."}
          </p>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-xs font-bold flex items-center gap-2 rounded-r-xl animate-in fade-in">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* 1. CHỌN ROLE */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">
                Bạn là ai?
              </label>
              <div className="grid grid-cols-3 gap-3">
                <RoleCard value="STUDENT" label="Học sinh" icon={Baby} />
                <RoleCard value="PARENT" label="Phụ huynh" icon={User} />
                <RoleCard value="TEACHER" label="Giáo viên" icon={BookOpen} />
              </div>

              {/* Thông báo lưu ý cho Giáo viên */}
              {formData.role === "TEACHER" && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-100 rounded-xl flex gap-2 items-start text-xs text-orange-700 animate-in slide-in-from-top-2 fade-in">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <p>
                    Lưu ý: Sau khi tạo tài khoản, bạn sẽ được chuyển đến trang
                    nộp hồ sơ (CV & Video dạy thử) để xét duyệt.
                  </p>
                </div>
              )}
            </div>

            {/* 2. NHẬP THÔNG TIN */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Họ và tên
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium text-slate-700 text-sm"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium text-slate-700 text-sm"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium text-slate-700 text-sm"
                    placeholder="Min 6 ký tự"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Xác nhận
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all font-medium text-slate-700 text-sm"
                    placeholder="Nhập lại"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {formData.role === "TEACHER"
                    ? "Tiếp tục nộp hồ sơ"
                    : "Đăng ký ngay"}{" "}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-slate-500 font-medium text-sm">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="text-orange-600 font-bold hover:underline"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
