import React, { useState, useMemo } from "react";
import {
  CalendarDays, Pill, FileText, CreditCard, Activity, Video,
  Search, Bell, ChevronRight, Plus, X, Download, Clock,
  User, LogOut, Settings, Syringe, HeartPulse, CheckCircle2,
  AlertCircle, ArrowUpRight, MapPin
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const INK = "#16302B";
const PRIMARY = "#2E6F5E";
const PRIMARY_DARK = "#1F4D40";
const AMBER = "#C1622D";
const SAGE = "#6B7D78";
const BORDER = "#DDE4E1";
const BG = "#F4F6F5";
const SURFACE = "#FFFFFF";

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    .ppf-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
    .ppf-body { font-family: 'Inter', sans-serif; }
    .ppf-mono { font-family: 'IBM Plex Mono', monospace; }
    @keyframes ppf-pulse-draw {
      0% { stroke-dashoffset: 240; }
      100% { stroke-dashoffset: 0; }
    }
    .ppf-pulse-path {
      stroke-dasharray: 240;
      animation: ppf-pulse-draw 2.4s linear infinite;
    }
    @keyframes ppf-dot {
      0%, 100% { opacity: 0.35; transform: scale(0.85); }
      50% { opacity: 1; transform: scale(1); }
    }
    .ppf-live-dot { animation: ppf-dot 2s ease-in-out infinite; }
    .ppf-scroll::-webkit-scrollbar { width: 6px; }
    .ppf-scroll::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 4px; }
  `}</style>
);

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Activity },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "prescriptions", label: "Prescriptions", icon: Pill },
  { id: "reports", label: "Medical Reports", icon: FileText },
  { id: "bills", label: "Bills & Payments", icon: CreditCard },
  { id: "treatment", label: "Treatment History", icon: HeartPulse },
  { id: "video", label: "Video Consultation", icon: Video },
];

const DEPARTMENTS = ["Cardiology", "Orthopedics", "Dermatology", "Neurology", "Pediatrics", "General Medicine"];

const INITIAL_APPOINTMENTS = [
  { id: 1, date: "12 Jul 2026", time: "10:30 AM", doctor: "Dr. Renu Smith", dept: "Cardiology", status: "Completed" },
  { id: 2, date: "20 Jul 2026", time: "09:00 AM", doctor: "Dr. Arjun Patel", dept: "Orthopedics", status: "Upcoming" },
  { id: 3, date: "02 Jul 2026", time: "04:15 PM", doctor: "Dr. Meera Nair", dept: "Dermatology", status: "Completed" },
  { id: 4, date: "28 Jun 2026", time: "11:00 AM", doctor: "Dr. Renu Smith", dept: "Cardiology", status: "Completed" },
];

const PRESCRIPTIONS = [
  { id: 1, date: "12 Jul 2026", doctor: "Dr. Renu Smith", medicine: "Atorvastatin 10mg", dosage: "1 tablet, once daily (night)", duration: "30 days" },
  { id: 2, date: "02 Jul 2026", doctor: "Dr. Meera Nair", medicine: "Clindamycin gel 1%", dosage: "Apply thin layer, twice daily", duration: "14 days" },
  { id: 3, date: "28 Jun 2026", doctor: "Dr. Renu Smith", medicine: "Aspirin 75mg", dosage: "1 tablet, once daily (morning)", duration: "90 days" },
];

const REPORTS = [
  { id: 1, date: "11 Jul 2026", name: "Lipid Profile", type: "Lab Report", size: "412 KB" },
  { id: 2, date: "10 Jul 2026", name: "ECG Trace", type: "Cardiology", size: "1.1 MB" },
  { id: 3, date: "01 Jul 2026", name: "Skin Biopsy Analysis", type: "Lab Report", size: "298 KB" },
  { id: 4, date: "27 Jun 2026", name: "Chest X-Ray (PA View)", type: "Radiology", size: "3.4 MB" },
];

const BILLS = [
  { id: 1, date: "12 Jul 2026", desc: "Cardiology Consultation", amount: 1200, status: "Due" },
  { id: 2, date: "02 Jul 2026", desc: "Dermatology Consultation + Procedure", amount: 2400, status: "Paid" },
  { id: 3, date: "28 Jun 2026", desc: "Lab Panel — Lipid Profile", amount: 850, status: "Paid" },
];

const TIMELINE = [
  { id: 1, date: "12 Jul 2026", title: "Cardiology Consultation", note: "Routine follow-up. Blood pressure stable. Lipid panel ordered.", type: "Consultation" },
  { id: 2, date: "02 Jul 2026", title: "Dermatology Procedure", note: "Minor skin biopsy performed under local anaesthesia.", type: "Procedure" },
  { id: 3, date: "14 Mar 2026", title: "Appendectomy", note: "Laparoscopic appendectomy. 2-day hospitalisation, uneventful recovery.", type: "Surgery" },
  { id: 4, date: "05 Jan 2026", title: "Annual Health Check-up", note: "General panel within normal limits. Vaccination booster advised.", type: "Check-up" },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
const StatusStamp = ({ status }) => {
  const isDone = status === "Completed" || status === "Paid";
  const color = isDone ? PRIMARY : AMBER;
  return (
    <span
      className="ppf-mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color,
        border: `1px solid ${color}55`,
        background: `${color}12`,
        padding: "3px 9px",
        borderRadius: 20,
        fontWeight: 600,
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 999, background: color }} />
      {status}
    </span>
  );
};

const SectionHeading = ({ eyebrow, title, action }) => (
  <div className="flex items-end justify-between mb-5">
    <div>
      <div className="ppf-mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: SAGE, textTransform: "uppercase", marginBottom: 4 }}>
        {eyebrow}
      </div>
      <h2 className="ppf-display" style={{ fontSize: 26, fontWeight: 600, color: INK }}>{title}</h2>
    </div>
    {action}
  </div>
);

const PulseSignature = ({ width = 130, height = 34, color = PRIMARY }) => (
  <svg width={width} height={height} viewBox="0 0 240 60" fill="none">
    <path
      className="ppf-pulse-path"
      d="M0 30 H60 L72 10 L86 50 L98 30 H120 L132 5 L146 55 L158 30 H240"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EmptyState = ({ label }) => (
  <div
    className="ppf-body"
    style={{
      border: `1px dashed ${BORDER}`,
      borderRadius: 14,
      padding: "36px 20px",
      textAlign: "center",
      color: SAGE,
      fontSize: 14,
    }}
  >
    {label}
  </div>
);

// ---------------------------------------------------------------------------
// Book appointment modal
// ---------------------------------------------------------------------------
const BookModal = ({ onClose, onBook }) => {
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [doctor, setDoctor] = useState("Dr. Renu Smith");
  const [date, setDate] = useState("25 Jul 2026");
  const [time, setTime] = useState("10:00 AM");

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(22,48,43,0.45)", zIndex: 50 }}
      className="flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="ppf-body"
        style={{ background: SURFACE, borderRadius: 18, width: "100%", maxWidth: 440, padding: 28, border: `1px solid ${BORDER}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <div className="ppf-mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: SAGE, textTransform: "uppercase" }}>New Booking</div>
          <button onClick={onClose} style={{ color: SAGE }}><X size={18} /></button>
        </div>
        <h3 className="ppf-display" style={{ fontSize: 22, fontWeight: 600, color: INK, marginBottom: 18 }}>Book an appointment</h3>

        <label className="ppf-mono" style={{ fontSize: 11, color: SAGE, textTransform: "uppercase", letterSpacing: "0.06em" }}>Department</label>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          style={{ width: "100%", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 12px", marginTop: 6, marginBottom: 14, fontSize: 14, color: INK, background: BG }}
        >
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>

        <label className="ppf-mono" style={{ fontSize: 11, color: SAGE, textTransform: "uppercase", letterSpacing: "0.06em" }}>Doctor</label>
        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          style={{ width: "100%", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 12px", marginTop: 6, marginBottom: 14, fontSize: 14, color: INK, background: BG }}
        >
          <option>Dr. Renu Smith</option>
          <option>Dr. Arjun Patel</option>
          <option>Dr. Meera Nair</option>
        </select>

        <div className="flex gap-3 mb-5">
          <div style={{ flex: 1 }}>
            <label className="ppf-mono" style={{ fontSize: 11, color: SAGE, textTransform: "uppercase", letterSpacing: "0.06em" }}>Date</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 12px", marginTop: 6, fontSize: 14, color: INK, background: BG }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="ppf-mono" style={{ fontSize: 11, color: SAGE, textTransform: "uppercase", letterSpacing: "0.06em" }}>Time</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ width: "100%", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 12px", marginTop: 6, fontSize: 14, color: INK, background: BG }}
            >
              <option>09:00 AM</option>
              <option>10:00 AM</option>
              <option>11:30 AM</option>
              <option>02:00 PM</option>
              <option>04:15 PM</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => { onBook({ dept, doctor, date, time }); onClose(); }}
          style={{ width: "100%", background: PRIMARY, color: "#fff", borderRadius: 10, padding: "12px 0", fontWeight: 600, fontSize: 14 }}
          className="ppf-body hover:opacity-90 transition"
        >
          Confirm booking
        </button>
        <p className="ppf-body" style={{ fontSize: 12, color: SAGE, textAlign: "center", marginTop: 10 }}>
          You'll get a confirmation by email and SMS.
        </p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Section: Dashboard
// ---------------------------------------------------------------------------
const QuickCard = ({ icon: Icon, label, sub, onClick, accent }) => (
  <button
    onClick={onClick}
    className="ppf-body text-left transition hover:-translate-y-0.5"
    style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 16,
      padding: "18px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      minHeight: 108,
    }}
  >
    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={18} color={accent} />
    </div>
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{label}</div>
      <div style={{ fontSize: 12, color: SAGE, marginTop: 2 }}>{sub}</div>
    </div>
  </button>
);

const Dashboard = ({ appointments, setActive, setModalOpen }) => {
  const upcoming = appointments.find((a) => a.status === "Upcoming");
  const dueBill = BILLS.find((b) => b.status === "Due");

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="ppf-mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: SAGE, textTransform: "uppercase", marginBottom: 6 }}>
            Patient Dashboard · Record No. PT-04821
          </div>
          <h1 className="ppf-display" style={{ fontSize: 34, fontWeight: 600, color: INK, lineHeight: 1.1 }}>
            Welcome back, John
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <PulseSignature />
          <span className="ppf-mono ppf-live-dot" style={{ fontSize: 11, color: PRIMARY, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: PRIMARY }} />
            all vitals synced
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <QuickCard icon={CalendarDays} label="Upcoming Appointment" sub={upcoming ? `${upcoming.date} · ${upcoming.dept}` : "None scheduled"} accent={PRIMARY} onClick={() => setActive("appointments")} />
        <QuickCard icon={Pill} label="Prescriptions" sub={`${PRESCRIPTIONS.length} on file`} accent={PRIMARY} onClick={() => setActive("prescriptions")} />
        <QuickCard icon={FileText} label="Medical Reports" sub={`${REPORTS.length} available`} accent={PRIMARY} onClick={() => setActive("reports")} />
        <QuickCard icon={CreditCard} label="Bills & Payments" sub={dueBill ? `₹${dueBill.amount} due` : "All settled"} accent={AMBER} onClick={() => setActive("bills")} />
        <QuickCard icon={HeartPulse} label="Treatment History" sub={`${TIMELINE.length} entries`} accent={PRIMARY} onClick={() => setActive("treatment")} />
        <QuickCard icon={Video} label="Video Consultation" sub="Schedule a call" accent={PRIMARY} onClick={() => setActive("video")} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent appointments */}
        <div className="md:col-span-2">
          <SectionHeading
            eyebrow="Chart · Recent"
            title="Recent Appointments"
            action={
              <button
                onClick={() => setModalOpen(true)}
                style={{ background: PRIMARY, color: "#fff", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
                className="ppf-body hover:opacity-90 transition"
              >
                <Plus size={15} /> Book appointment
              </button>
            }
          />
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
            <table className="w-full ppf-body" style={{ fontSize: 13.5 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["Date", "Doctor", "Department", "Status"].map((h) => (
                    <th key={h} className="ppf-mono" style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: SAGE, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 4).map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: i === appointments.slice(0,4).length - 1 ? "none" : `1px solid ${BORDER}` }}>
                    <td className="ppf-mono" style={{ padding: "13px 16px", color: INK }}>{a.date}</td>
                    <td style={{ padding: "13px 16px", color: INK }}>{a.doctor}</td>
                    <td style={{ padding: "13px 16px", color: SAGE }}>{a.dept}</td>
                    <td style={{ padding: "13px 16px" }}><StatusStamp status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <SectionHeading eyebrow="Alerts" title="Notifications" />
          <div className="flex flex-col gap-3">
            {[
              { icon: Clock, text: "Appointment tomorrow at 10:00 AM with Dr. Arjun Patel", accent: PRIMARY },
              { icon: FileText, text: "Lab report for Lipid Profile is ready to download", accent: PRIMARY },
              { icon: AlertCircle, text: "Bill payment due: ₹1,200 for Cardiology visit", accent: AMBER },
            ].map((n, i) => (
              <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "13px 14px", display: "flex", gap: 10 }}>
                <n.icon size={16} color={n.accent} style={{ marginTop: 2, flexShrink: 0 }} />
                <span className="ppf-body" style={{ fontSize: 13, color: INK, lineHeight: 1.4 }}>{n.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Section: Appointments
// ---------------------------------------------------------------------------
const AppointmentsView = ({ appointments, setModalOpen }) => (
  <div>
    <SectionHeading
      eyebrow="Chart · Full log"
      title="Appointments"
      action={
        <button onClick={() => setModalOpen(true)} style={{ background: PRIMARY, color: "#fff", borderRadius: 10, padding: "9px 14px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }} className="ppf-body hover:opacity-90 transition">
          <Plus size={15} /> Book appointment
        </button>
      }
    />
    <div className="flex flex-col gap-3">
      {appointments.map((a) => (
        <div key={a.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div className="flex items-center gap-4">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${PRIMARY}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CalendarDays size={18} color={PRIMARY} />
            </div>
            <div>
              <div className="ppf-body" style={{ fontSize: 14.5, fontWeight: 600, color: INK }}>{a.doctor} <span style={{ color: SAGE, fontWeight: 400 }}>· {a.dept}</span></div>
              <div className="ppf-mono" style={{ fontSize: 12, color: SAGE, marginTop: 2 }}>{a.date} · {a.time}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusStamp status={a.status} />
            {a.status === "Upcoming" && (
              <>
                <button className="ppf-body" style={{ fontSize: 12.5, color: PRIMARY, fontWeight: 600 }}>Reschedule</button>
                <button className="ppf-body" style={{ fontSize: 12.5, color: AMBER, fontWeight: 600 }}>Cancel</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Section: Prescriptions
// ---------------------------------------------------------------------------
const PrescriptionsView = () => (
  <div>
    <SectionHeading eyebrow="Rx · History" title="Prescriptions" />
    <div className="flex flex-col gap-3">
      {PRESCRIPTIONS.map((p) => (
        <div key={p.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px" }}>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex gap-4">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${PRIMARY}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Pill size={18} color={PRIMARY} />
              </div>
              <div>
                <div className="ppf-body" style={{ fontSize: 14.5, fontWeight: 600, color: INK }}>{p.medicine}</div>
                <div className="ppf-body" style={{ fontSize: 13, color: SAGE, marginTop: 3 }}>{p.dosage}</div>
                <div className="ppf-mono" style={{ fontSize: 11.5, color: SAGE, marginTop: 6 }}>
                  {p.date} · {p.doctor} · {p.duration}
                </div>
              </div>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: PRIMARY }} className="ppf-body">
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Section: Reports
// ---------------------------------------------------------------------------
const ReportsView = () => (
  <div>
    <SectionHeading eyebrow="Archive" title="Medical Reports" />
    <div className="grid sm:grid-cols-2 gap-3">
      {REPORTS.map((r) => (
        <div key={r.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${PRIMARY}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={17} color={PRIMARY} />
            </div>
            <div>
              <div className="ppf-body" style={{ fontSize: 14, fontWeight: 600, color: INK }}>{r.name}</div>
              <div className="ppf-mono" style={{ fontSize: 11.5, color: SAGE, marginTop: 2 }}>{r.type} · {r.date} · {r.size}</div>
            </div>
          </div>
          <Download size={16} color={PRIMARY} style={{ cursor: "pointer" }} />
        </div>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Section: Bills
// ---------------------------------------------------------------------------
const BillsView = () => {
  const total = BILLS.filter((b) => b.status === "Due").reduce((s, b) => s + b.amount, 0);
  return (
    <div>
      <SectionHeading eyebrow="Ledger" title="Bills & Payments" />
      {total > 0 && (
        <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}40`, borderRadius: 14, padding: "14px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div className="flex items-center gap-3">
            <AlertCircle size={18} color={AMBER} />
            <span className="ppf-body" style={{ fontSize: 14, color: INK }}>You have <b>₹{total.toLocaleString("en-IN")}</b> pending across {BILLS.filter(b=>b.status==="Due").length} invoice(s).</span>
          </div>
          <button style={{ background: AMBER, color: "#fff", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600 }} className="ppf-body">Pay now</button>
        </div>
      )}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: "hidden" }}>
        <table className="w-full ppf-body" style={{ fontSize: 13.5 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {["Date", "Description", "Amount", "Status", ""].map((h) => (
                <th key={h} className="ppf-mono" style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: SAGE, fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BILLS.map((b, i) => (
              <tr key={b.id} style={{ borderBottom: i === BILLS.length - 1 ? "none" : `1px solid ${BORDER}` }}>
                <td className="ppf-mono" style={{ padding: "13px 16px", color: INK }}>{b.date}</td>
                <td style={{ padding: "13px 16px", color: INK }}>{b.desc}</td>
                <td className="ppf-mono" style={{ padding: "13px 16px", color: INK }}>₹{b.amount.toLocaleString("en-IN")}</td>
                <td style={{ padding: "13px 16px" }}><StatusStamp status={b.status} /></td>
                <td style={{ padding: "13px 16px" }}>
                  {b.status === "Paid" ? (
                    <button style={{ fontSize: 12.5, color: PRIMARY, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }} className="ppf-body"><Download size={13}/> Receipt</button>
                  ) : (
                    <button style={{ fontSize: 12.5, color: AMBER, fontWeight: 600 }} className="ppf-body">Pay</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Section: Treatment history (timeline)
// ---------------------------------------------------------------------------
const TreatmentView = () => (
  <div>
    <SectionHeading eyebrow="Timeline" title="Treatment History" />
    <div style={{ position: "relative", paddingLeft: 28 }}>
      <div style={{ position: "absolute", left: 8, top: 6, bottom: 6, width: 2, background: BORDER }} />
      <div className="flex flex-col gap-7">
        {TIMELINE.map((t) => (
          <div key={t.id} style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: -28, top: 2, width: 18, height: 18, borderRadius: 999, background: SURFACE, border: `2px solid ${PRIMARY}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: PRIMARY }} />
            </div>
            <div className="ppf-mono" style={{ fontSize: 11.5, color: SAGE, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{t.date} · {t.type}</div>
            <div className="ppf-body" style={{ fontSize: 15, fontWeight: 600, color: INK }}>{t.title}</div>
            <div className="ppf-body" style={{ fontSize: 13.5, color: SAGE, marginTop: 4, lineHeight: 1.5, maxWidth: 560 }}>{t.note}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Section: Video consultation
// ---------------------------------------------------------------------------
const VideoView = () => (
  <div>
    <SectionHeading eyebrow="Telehealth" title="Video Consultation" />
    <div className="grid md:grid-cols-2 gap-6">
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${PRIMARY}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
          <Video size={18} color={PRIMARY} />
        </div>
        <div className="ppf-body" style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 4 }}>Next session</div>
        <div className="ppf-body" style={{ fontSize: 13.5, color: SAGE, marginBottom: 16 }}>Dr. Arjun Patel · Orthopedics follow-up</div>
        <div className="ppf-mono" style={{ fontSize: 12.5, color: INK, background: BG, borderRadius: 10, padding: "10px 12px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={14} color={SAGE} /> 20 Jul 2026 · 09:00 AM
        </div>
        <button style={{ width: "100%", background: PRIMARY, color: "#fff", borderRadius: 10, padding: "12px 0", fontWeight: 600, fontSize: 14 }} className="ppf-body hover:opacity-90 transition">
          Join secure video call
        </button>
        <p className="ppf-body" style={{ fontSize: 12, color: SAGE, textAlign: "center", marginTop: 10 }}>You can share reports and receive a digital prescription during the session.</p>
      </div>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22 }}>
        <div className="ppf-body" style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 12 }}>Schedule a new consultation</div>
        <div className="flex flex-col gap-3">
          {DEPARTMENTS.slice(0, 4).map((d) => (
            <div key={d} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 4px", borderBottom: `1px solid ${BORDER}` }}>
              <span className="ppf-body" style={{ fontSize: 13.5, color: INK }}>{d}</span>
              <ChevronRight size={15} color={SAGE} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// App shell
// ---------------------------------------------------------------------------
export default function PatientPortal() {
  const [active, setActive] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  const handleBook = ({ dept, doctor, date, time }) => {
    setAppointments((prev) => [
      { id: prev.length + 1, date, time, doctor, dept, status: "Upcoming" },
      ...prev,
    ]);
    setActive("appointments");
  };

  const content = useMemo(() => {
    switch (active) {
      case "appointments": return <AppointmentsView appointments={appointments} setModalOpen={setModalOpen} />;
      case "prescriptions": return <PrescriptionsView />;
      case "reports": return <ReportsView />;
      case "bills": return <BillsView />;
      case "treatment": return <TreatmentView />;
      case "video": return <VideoView />;
      default: return <Dashboard appointments={appointments} setActive={setActive} setModalOpen={setModalOpen} />;
    }
  }, [active, appointments]);

  return (
    <div className="ppf-body" style={{ background: BG, minHeight: "100vh", color: INK }}>
      <FontImport />
      <div className="flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside style={{ width: 236, background: PRIMARY_DARK, flexShrink: 0, padding: "22px 16px", display: "flex", flexDirection: "column" }} className="hidden md:flex">
          <div className="flex items-center gap-2 px-2 mb-8">
            <HeartPulse size={20} color="#fff" />
            <span className="ppf-display" style={{ color: "#fff", fontSize: 17, fontWeight: 600 }}>Mediscribe</span>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className="ppf-body transition"
                  style={{
                    display: "flex", alignItems: "center", gap: 11,
                    padding: "10px 12px", borderRadius: 10, fontSize: 13.5,
                    color: isActive ? PRIMARY_DARK : "rgba(255,255,255,0.82)",
                    background: isActive ? "#fff" : "transparent",
                    fontWeight: isActive ? 600 : 500,
                    textAlign: "left",
                  }}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.14)", paddingTop: 14 }} className="flex flex-col gap-1">
            <button className="ppf-body" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 10, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
              <Settings size={15} /> Settings
            </button>
            <button className="ppf-body" style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 12px", borderRadius: 10, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
              <LogOut size={15} /> Log out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 ppf-scroll" style={{ overflowY: "auto" }}>
          {/* Topbar */}
          <div className="flex items-center justify-between gap-4" style={{ padding: "16px 28px", borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
            <div className="flex items-center gap-2 flex-1" style={{ maxWidth: 380 }}>
              <div style={{ position: "relative", width: "100%" }}>
                <Search size={15} color={SAGE} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  placeholder="Search doctors, reports, bills…"
                  className="ppf-body"
                  style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "9px 12px 9px 34px", fontSize: 13 }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Bell size={18} color={INK} style={{ cursor: "pointer" }} />
              <div className="flex items-center gap-2">
                <div style={{ width: 32, height: 32, borderRadius: 999, background: `${PRIMARY}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={15} color={PRIMARY} />
                </div>
                <span className="ppf-body" style={{ fontSize: 13.5, fontWeight: 600, color: INK }} >John Doe</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "28px 28px 60px" }}>
            {content}
          </div>
        </main>
      </div>

      {modalOpen && <BookModal onClose={() => setModalOpen(false)} onBook={handleBook} />}
    </div>
  );
}
