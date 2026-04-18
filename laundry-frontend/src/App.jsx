import { useState, useMemo, useRef, useCallback } from "react";

const STATUS_FLOW = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];
const STATUS_LABELS = {
  RECEIVED: "Received",
  PROCESSING: "Processing",
  READY: "Ready",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS = {
  RECEIVED: { bg: "#f3f4f6", color: "#374151" },
  PROCESSING: { bg: "#dbeafe", color: "#1d4ed8" },
  READY: { bg: "#fef3c7", color: "#92400e" },
  DELIVERED: { bg: "#dcfce7", color: "#166534" },
  CANCELLED: { bg: "#fee2e2", color: "#991b1b" },
};

const ITEMS_CATALOG = [
  { name: "Shirt", price: 30 },
  { name: "Trouser", price: 40 },
  { name: "Saree", price: 80 },
  { name: "Kurta", price: 35 },
  { name: "Bedsheet", price: 60 },
  { name: "Jacket", price: 70 },
  { name: "Towel", price: 20 },
  { name: "Suit", price: 120 },
];

let _seq = 5;
function genId() {
  return `ORD-${String(_seq++).padStart(4, "0")}`;
}

const SEED = [
  {
    id: "ORD-0001",
    name: "Rohit Sharma",
    phone: "9876543210",
    items: [
      { name: "Shirt", qty: 3, price: 30 },
      { name: "Trouser", qty: 2, price: 40 },
    ],
    total: 170,
    status: "DELIVERED",
    note: "",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "ORD-0002",
    name: "Priya Mehta",
    phone: "9123456780",
    items: [
      { name: "Saree", qty: 2, price: 80 },
      { name: "Suit", qty: 1, price: 120 },
    ],
    total: 280,
    status: "READY",
    note: "Handle with care",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "ORD-0003",
    name: "Amit Joshi",
    phone: "9988776655",
    items: [{ name: "Bedsheet", qty: 3, price: 60 }],
    total: 180,
    status: "PROCESSING",
    note: "",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ORD-0004",
    name: "Sunita Gupta",
    phone: "9765432100",
    items: [{ name: "Kurta", qty: 4, price: 35 }],
    total: 140,
    status: "RECEIVED",
    note: "",
    createdAt: new Date().toISOString(),
  },
];

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  app: {
    display: "flex",
    minHeight: "100vh",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    color: "#111827",
    background: "#f9fafb",
  },
  sidebar: {
    width: 210,
    flexShrink: 0,
    background: "#fff",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  brand: {
    padding: "20px 16px 16px",
    borderBottom: "1px solid #e5e7eb",
  },
  brandName: { fontWeight: 700, fontSize: 16, color: "#1d4ed8" },
  brandSub: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  nav: { padding: "8px 0", flex: 1 },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 16px",
    margin: "1px 8px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    color: active ? "#1d4ed8" : "#6b7280",
    background: active ? "#eff6ff" : "transparent",
    transition: "all .15s",
    userSelect: "none",
  }),
  sidebarFoot: {
    padding: "12px 16px",
    fontSize: 11,
    color: "#9ca3af",
    borderTop: "1px solid #e5e7eb",
  },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  header: {
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontWeight: 600, fontSize: 15 },
  content: { flex: 1, overflow: "auto", padding: 20, width: "100%" },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "16px 20px",
  },
  statCard: {
    background: "#f3f4f6",
    borderRadius: 8,
    padding: 16,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: ".06em",
  },
  statValue: (color) => ({
    fontSize: 28,
    fontWeight: 700,
    color: color || "#111827",
    marginTop: 4,
    lineHeight: 1,
  }),
  grid: (cols) => ({
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(${cols}px, 1fr))`,
    gap: 12,
  }),
  formGroup: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 12, fontWeight: 600, color: "#374151" },
  input: {
    fontSize: 13,
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    outline: "none",
    width: "100%",
    background: "#fff",
    color: "#111827",
    fontFamily: "inherit",
    transition: "border-color .15s",
  },
  error: { fontSize: 11, color: "#dc2626", marginTop: 2 },
  btnPrimary: {
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background .15s",
  },
  btnGhost: {
    background: "transparent",
    color: "#6b7280",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all .15s",
  },
  btnSm: { padding: "4px 10px", fontSize: 12 },
  badge: (status) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 9px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.02em",
    background: STATUS_COLORS[status]?.bg || "#f3f4f6",
    color: STATUS_COLORS[status]?.color || "#374151",
  }),
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left",
    padding: "8px 12px",
    fontSize: 11,
    fontWeight: 600,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: ".06em",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "middle",
  },
  tag: {
    display: "inline-block",
    padding: "2px 7px",
    borderRadius: 4,
    fontSize: 11,
    background: "#f3f4f6",
    color: "#6b7280",
    margin: "1px 2px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff",
    borderRadius: 14,
    padding: 24,
    width: "min(480px, 95vw)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  progressBar: { display: "flex", gap: 3, margin: "8px 0" },
  progressStep: (done, current) => ({
    height: 5,
    flex: 1,
    borderRadius: 3,
    background: done ? "#1d4ed8" : current ? "#93c5fd" : "#e5e7eb",
    transition: "background .3s",
  }),
  toast: {
    position: "fixed",
    bottom: 20,
    right: 20,
    background: "#111827",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
    fontSize: 13,
    zIndex: 999,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    animation: "slideUp .2s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 16px",
    color: "#9ca3af",
  },
};

/* ─── Badge ──────────────────────────────────────────────────────────────── */
function Badge({ status }) {
  return <span style={S.badge(status)}>{STATUS_LABELS[status]}</span>;
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ msg }) {
  return msg ? <div style={S.toast}>{msg}</div> : null;
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
function Dashboard({ orders, setPage, setModalOrder }) {
  const stats = useMemo(() => {
    const counts = {};
    [...STATUS_FLOW, "CANCELLED"].forEach((s) => (counts[s] = 0));
    let revenue = 0;
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
      if (o.status !== "CANCELLED") revenue += o.total;
    });
    return { total: orders.length, revenue, counts };
  }, [orders]);

  const recent = orders.slice(0, 6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stat Cards */}
      <div style={S.grid(140)}>
        {[
          { label: "Total Orders", value: stats.total, color: "#1d4ed8" },
          {
            label: "Revenue",
            value: `₹${stats.revenue.toLocaleString()}`,
            color: "#059669",
          },
          {
            label: "Pending",
            value:
              (stats.counts.RECEIVED || 0) + (stats.counts.PROCESSING || 0),
            color: "#d97706",
          },
          { label: "Delivered", value: stats.counts.DELIVERED || 0, color: "#7c3aed" },
        ].map((s) => (
          <div key={s.label} style={S.statCard}>
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statValue(s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={S.grid(200)}>
        {/* Status Breakdown */}
        <div style={S.card}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Status Breakdown
          </div>
          {[...STATUS_FLOW, "CANCELLED"].map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: STATUS_COLORS[s]?.color || "#9ca3af",
                  }}
                />
                <span style={{ fontSize: 13 }}>{STATUS_LABELS[s]}</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {stats.counts[s] || 0}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div style={S.card}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#6b7280",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Recent Orders
          </div>
          {recent.length === 0 && (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>No orders yet</div>
          )}
          {recent.map((o) => (
            <div
              key={o.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 0",
                borderBottom: "1px solid #f3f4f6",
                cursor: "pointer",
              }}
              onClick={() => setModalOrder(o)}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{o.name}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{o.id}</div>
              </div>
              <Badge status={o.status} />
            </div>
          ))}
          <button
            style={{ ...S.btnGhost, ...S.btnSm, width: "100%", marginTop: 10 }}
            onClick={() => setPage("orders")}
          >
            View all orders →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Order Form ─────────────────────────────────────────────────────────── */
function OrderForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", phone: "", note: "" });
  const [items, setItems] = useState([{ name: "Shirt", qty: 1, price: 30 }]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  function setField(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  function addItem() {
    setItems((p) => [...p, { name: "Shirt", qty: 1, price: 30 }]);
    setErrors((e) => ({ ...e, items: "" }));
  }

  function removeItem(i) {
    setItems((p) => p.filter((_, j) => j !== i));
  }

  function setItemName(i, name) {
    const cat = ITEMS_CATALOG.find((c) => c.name === name);
    setItems((p) =>
      p.map((it, j) => (j === i ? { ...it, name, price: cat ? cat.price : it.price } : it))
    );
  }

  function setItemField(i, k, raw) {
    const v = Math.max(1, parseInt(raw) || 1);
    setItems((p) => p.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone.trim()))
      e.phone = "Enter valid 10-digit phone number";
    if (items.length === 0) e.items = "Add at least one item";
    if (items.some((i) => i.qty < 1)) e.items = "Quantity must be at least 1";
    if (total <= 0) e.items = "Order total must be greater than zero";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ ...form, items, total, status: "RECEIVED" });
      setForm({ name: "", phone: "", note: "" });
      setItems([{ name: "Shirt", qty: 1, price: 30 }]);
      setErrors({});
      setSubmitting(false);
    }, 300);
  }

  return (
    <div style={{ ...S.card, width: "100%" }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18 }}>
        Create New Order
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Name & Phone */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div style={S.formGroup}>
            <label style={S.label}>Customer Name</label>
            <input
              style={S.input}
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
            {errors.name && <div style={S.error}>{errors.name}</div>}
          </div>
          <div style={S.formGroup}>
            <label style={S.label}>Phone Number</label>
            <input
              style={S.input}
              placeholder="10-digit mobile"
              value={form.phone}
              maxLength={10}
              onChange={(e) =>
                setField("phone", e.target.value.replace(/\D/g, ""))
              }
            />
            {errors.phone && <div style={S.error}>{errors.phone}</div>}
          </div>
        </div>

        {/* Items */}
        <div style={S.formGroup}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label style={S.label}>Items</label>
            <button
              style={{ ...S.btnGhost, ...S.btnSm }}
              onClick={addItem}
            >
              + Add Item
            </button>
          </div>
          {errors.items && <div style={S.error}>{errors.items}</div>}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 4,
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 70px 80px auto",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <select
                  style={S.input}
                  value={item.name}
                  onChange={(e) => setItemName(i, e.target.value)}
                >
                  {ITEMS_CATALOG.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
                <input
                  style={S.input}
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => setItemField(i, "qty", e.target.value)}
                  placeholder="Qty"
                />
                <input
                  style={{ ...S.input, color: "#059669", fontWeight: 600 }}
                  type="number"
                  min={0}
                  value={item.price}
                  onChange={(e) =>
                    setItems((p) =>
                      p.map((it, j) =>
                        j === i
                          ? { ...it, price: Math.max(0, Number(e.target.value)) }
                          : it
                      )
                    )
                  }
                  placeholder="₹"
                />
                {items.length > 1 && (
                  <button
                    style={{
                      ...S.btnGhost,
                      ...S.btnSm,
                      color: "#dc2626",
                      borderColor: "#fca5a5",
                      padding: "5px 8px",
                    }}
                    onClick={() => removeItem(i)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={S.formGroup}>
          <label style={S.label}>Note (optional)</label>
          <input
            style={S.input}
            placeholder="Special instructions..."
            value={form.note}
            onChange={(e) => setField("note", e.target.value)}
          />
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <div>
            <div style={S.statLabel}>Total</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#059669" }}>
              ₹{total.toLocaleString()}
            </div>
          </div>
          <button
            style={{
              ...S.btnPrimary,
              opacity: submitting ? 0.7 : 1,
            }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Order →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Orders List ────────────────────────────────────────────────────────── */
function OrderList({ orders, setModalOrder }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return orders.filter((o) => {
      const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
      const matchSearch =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.id.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          style={{ ...S.input, maxWidth: 240 }}
          placeholder="Search name, phone, order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={{ ...S.input, width: "auto", minWidth: 140 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          {[...STATUS_FLOW, "CANCELLED"].map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "#9ca3af",
            whiteSpace: "nowrap",
          }}
        >
          {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={S.emptyState}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>◎</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>No orders found</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              Try adjusting your search or filters
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead>
                <tr>
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Status",
                    "Date",
                    "",
                  ].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td style={S.td}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#1d4ed8",
                        }}
                      >
                        {o.id}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ fontWeight: 600 }}>{o.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>
                        {o.phone}
                      </div>
                    </td>
                    <td style={{ ...S.td, maxWidth: 160 }}>
                      {o.items.map((it, i) => (
                        <span key={i} style={S.tag}>
                          {it.qty}× {it.name}
                        </span>
                      ))}
                    </td>
                    <td style={S.td}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#059669",
                          fontSize: 14,
                        }}
                      >
                        ₹{o.total.toLocaleString()}
                      </span>
                    </td>
                    <td style={S.td}>
                      <Badge status={o.status} />
                    </td>
                    <td style={{ ...S.td, fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                    <td style={S.td}>
                      <button
                        style={{ ...S.btnGhost, ...S.btnSm }}
                        onClick={() => setModalOrder(o)}
                      >
                        Update ›
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Status Modal ───────────────────────────────────────────────────────── */
function StatusModal({ order, onUpdate, onClose }) {
  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const isFinal =
    order.status === "DELIVERED" || order.status === "CANCELLED";
  const nextStatus =
    !isFinal && currentIdx < STATUS_FLOW.length - 1
      ? STATUS_FLOW[currentIdx + 1]
      : null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div style={S.overlay} onClick={handleOverlayClick}>
      <div style={S.modal}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{order.id}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              {order.name} · {order.phone}
            </div>
          </div>
          <button
            style={{ ...S.btnGhost, ...S.btnSm }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#6b7280",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Progress
          </div>
          <div style={S.progressBar}>
            {STATUS_FLOW.map((s, i) => (
              <div
                key={s}
                style={S.progressStep(i < currentIdx, i === currentIdx)}
                title={STATUS_LABELS[s]}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "#9ca3af",
              marginTop: 4,
            }}
          >
            {STATUS_FLOW.map((s) => (
              <span key={s}>{STATUS_LABELS[s]}</span>
            ))}
          </div>
        </div>

        {/* Items summary */}
        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#6b7280",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Items
          </div>
          {order.items.map((it, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                padding: "3px 0",
              }}
            >
              <span>
                {it.qty}× {it.name}
              </span>
              <span style={{ color: "#6b7280" }}>
                ₹{(it.qty * it.price).toLocaleString()}
              </span>
            </div>
          ))}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              marginTop: 8,
              paddingTop: 8,
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
            }}
          >
            <span>Total</span>
            <span style={{ color: "#059669" }}>
              ₹{order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {order.note && (
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              fontStyle: "italic",
              marginBottom: 14,
              padding: "8px 12px",
              background: "#fffbeb",
              borderRadius: 6,
              border: "1px solid #fde68a",
            }}
          >
            Note: {order.note}
          </div>
        )}

        {/* Current status */}
        <div style={{ fontSize: 13, marginBottom: 14 }}>
          Current:{" "}
          <Badge status={order.status} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {nextStatus && (
            <button
              style={{ ...S.btnPrimary, flex: 1 }}
              onClick={() => onUpdate(order.id, nextStatus)}
            >
              Mark as {STATUS_LABELS[nextStatus]} →
            </button>
          )}
          {!isFinal && (
            <button
              style={{
                ...S.btnGhost,
                color: "#dc2626",
                borderColor: "#fca5a5",
              }}
              onClick={() => onUpdate(order.id, "CANCELLED")}
            >
              Cancel Order
            </button>
          )}
          {isFinal && (
            <div style={{ fontSize: 13, color: "#9ca3af", padding: "7px 0" }}>
              This order is finalized and cannot be updated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [orders, setOrders] = useState(SEED);
  const [modalOrder, setModalOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  function addOrder(order) {
    const newOrder = { ...order, id: genId(), createdAt: new Date().toISOString() };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`✓ Order ${newOrder.id} created successfully`);
    setPage("orders");
  }

  function updateStatus(id, nextStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
    );
    // Keep modal in sync
    setModalOrder((prev) =>
      prev && prev.id === id ? { ...prev, status: nextStatus } : prev
    );
    showToast(`Status updated → ${STATUS_LABELS[nextStatus]}`);
  }

  const NAV = [
    { key: "dashboard", label: "Dashboard", icon: "◈" },
    { key: "new", label: "New Order", icon: "＋" },
    { key: "orders", label: "Orders", icon: "☰" },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        input:focus, select:focus, textarea:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }
        button:hover { opacity: 0.88; }
        button:active { transform: scale(0.97); }
        tr:hover td { background: #f9fafb; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .sidebar { display: none !important; }
        }
      `}</style>

      <div style={S.app}>
        {/* Sidebar */}
        <div className="sidebar" style={S.sidebar}>
          <div style={S.brand}>
            <div style={S.brandName}>WashDesk</div>
            <div style={S.brandSub}>Laundry Management</div>
          </div>
          <nav style={S.nav}>
            {NAV.map((n) => (
              <div
                key={n.key}
                style={S.navItem(page === n.key)}
                onClick={() => setPage(n.key)}
              >
                <span style={{ fontSize: 15 }}>{n.icon}</span>
                <span>{n.label}</span>
              </div>
            ))}
          </nav>
          <div style={S.sidebarFoot}>{orders.length} total orders</div>
        </div>

        {/* Main */}
        <div style={S.main}>
          <header style={S.header}>
            <div style={S.headerTitle}>
              {page === "dashboard"
                ? "Dashboard"
                : page === "new"
                ? "New Order"
                : "Orders"}
            </div>
            <button style={S.btnPrimary} onClick={() => setPage("new")}>
              + New Order
            </button>
          </header>

          <main style={S.content}>
            {page === "dashboard" && (
              <Dashboard
                orders={orders}
                setPage={setPage}
                setModalOrder={setModalOrder}
              />
            )}
            {page === "new" && <OrderForm onSubmit={addOrder} />}
            {page === "orders" && (
              <OrderList orders={orders} setModalOrder={setModalOrder} />
            )}
          </main>
        </div>

        {/* Modal */}
        {modalOrder && (
          <StatusModal
            order={modalOrder}
            onUpdate={updateStatus}
            onClose={() => setModalOrder(null)}
          />
        )}

        {/* Toast */}
        <Toast msg={toast} />
      </div>
    </>
  );
}
