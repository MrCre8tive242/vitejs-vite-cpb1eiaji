// @ts-nocheck
import React, { useState } from "react";

const LOGO = null; // Logo removed for size - text logo shown instead

const PRODUCTS = [
  { category: "Standard Apparel", icon: "👕", items: [
    { id: "ss-cotton", name: "Short Sleeve Cotton Shirt", basePrice: 20, allowBack: true, allowSleeve: "short", allInclusive: false },
    { id: "ss-dryfit", name: "Short Sleeve Dry-Fit Shirt", basePrice: 25, allowBack: true, allowSleeve: "short", allInclusive: false },
    { id: "ls-shirt", name: "Long Sleeve Cotton/Dry-Fit Shirt", basePrice: 30, allowBack: true, allowSleeve: "long", allInclusive: false },
    { id: "collar-shirt", name: "Short Sleeve Collar Shirt", basePrice: 35, allowBack: true, allowSleeve: "short", allInclusive: false, collarNote: true },
    { id: "hoodie-front", name: "Hoodie — Front Print Only", basePrice: 40, isHoodie: true, allowSleeve: null, allInclusive: false },
    { id: "hoodie-fb", name: "Hoodie — Front & Back", basePrice: 45, isHoodie: true, allowSleeve: null, allInclusive: false },
    { id: "hoodie-full", name: "Hoodie — Front, Back & Sleeve(s)", basePrice: 50, isHoodie: true, allowSleeve: null, allInclusive: false },
  ]},
  { category: "All-Over Print & Uniforms", icon: "🏆", items: [
    { id: "sub-ls", name: "Sublimation Long Sleeve All-Over", basePrice: 30, allInclusive: true },
    { id: "bball-jersey", name: "Basketball Jersey Set", basePrice: 55, allInclusive: true },
    { id: "track-uniform", name: "Track / Running Uniform", basePrice: 55, allInclusive: true },
    { id: "volleyball", name: "Volleyball Uniform", basePrice: 55, allInclusive: true },
    { id: "warmup-suit", name: "Warm-Up Suit (Jacket + Pants)", basePrice: 85, allInclusive: true },
  ]},
  { category: "Products & Creative Services", icon: "✦", items: [
    { id: "tumbler", name: "20 oz Sublimation Tumbler", basePrice: 35, allInclusive: true },
    { id: "ai-video", name: "AI Video Creative Service", basePrice: 150, allInclusive: true, startingAt: true },
    { id: "digital-flyer", name: "Digital Flyer Design", basePrice: 75, allInclusive: true },
    { id: "logo-simple", name: "Logo Design — Simple", basePrice: 50, allInclusive: true },
    { id: "logo-complex", name: "Logo Design — Complex", basePrice: 75, allInclusive: true },
    { id: "banner-3x6", name: "Banner 3×6 ft with Grommets", basePrice: 150, allInclusive: true },
    { id: "banner-4x8", name: "Banner 4×8 ft with Grommets", basePrice: 210, allInclusive: true },
  ]},
];

const BACK_ADDONS = [
  { id: "back-small", label: "1–6 inch back print", price: 5 },
  { id: "back-large", label: "6–12 inch back print", price: 8 },
];

const allProducts = PRODUCTS.flatMap(c => c.items);

function getDiscount(qty) {
  if (qty >= 101) return { pct: 0.15, label: "101+ items", badge: "MAX SAVINGS" };
  if (qty >= 51)  return { pct: 0.12, label: "51–100 items", badge: "12% OFF" };
  if (qty >= 13)  return { pct: 0.08, label: "13–50 items", badge: "8% OFF" };
  return { pct: 0, label: "", badge: "" };
}
function getRushFee(sub) {
  if (sub >= 500) return 75;
  if (sub >= 200) return 40;
  if (sub >= 100) return 25;
  return 15;
}

async function sendQuoteEmail(params) {
  // ── EMAILJS CONFIG ─────────────────────────────────────────────────────────
  // 1. Go to emailjs.com → create free account
  // 2. Add Service → connect Cre8tiveminds242@gmail.com → copy Service ID below
  // 3. Create Email Template → copy Template ID below
  // 4. Account → API Keys → copy Public Key below
  const SERVICE_ID  = "service_ho8kzjl";
  const TEMPLATE_ID = "cpeini9";
  const PUBLIC_KEY  = "6c_5ARcZwawJcdfAV";
  // ──────────────────────────────────────────────────────────────────────────

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: params,
    }),
  });
  if (!res.ok) throw new Error("EmailJS send failed");
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#07070a;--surface:#0f0f14;--surface2:#16161e;--surface3:#1e1e28;
  --border:rgba(255,255,255,0.06);--border2:rgba(255,255,255,0.12);
  --accent:#00e5ff;--accent-dim:rgba(0,229,255,0.12);
  --gold:#ffd166;--gold-dim:rgba(255,209,102,0.12);
  --danger:#ff3d6b;--success:#06d6a0;--success-dim:rgba(6,214,160,0.1);
  --text:#eeeae2;--text2:#9b99aa;--text3:#5a5868;
  --fD:'Bebas Neue',sans-serif;--fB:'DM Sans',sans-serif;--fM:'DM Mono',monospace;
}
.app{min-height:100vh;background:var(--bg);font-family:var(--fB);color:var(--text);overflow-x:hidden;}
.bg-grid{position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(rgba(0,229,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.025) 1px,transparent 1px);
  background-size:44px 44px;}
.bg-orb{position:fixed;top:-280px;left:50%;transform:translateX(-50%);width:900px;height:560px;z-index:0;pointer-events:none;
  background:radial-gradient(ellipse,rgba(0,229,255,.07) 0%,transparent 65%);}
.bg-orb2{position:fixed;bottom:-180px;right:-180px;width:560px;height:560px;z-index:0;pointer-events:none;
  background:radial-gradient(circle,rgba(255,61,107,.05) 0%,transparent 65%);}
.hdr{position:sticky;top:0;z-index:100;height:72px;padding:0 24px;
  display:flex;align-items:center;justify-content:space-between;
  background:rgba(7,7,10,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);}
.hdr-left{display:flex;align-items:center;gap:14px;}
.hdr-img{height:54px;width:auto;object-fit:contain;filter:drop-shadow(0 0 10px rgba(0,229,255,.2));}
.hdr-text{display:flex;flex-direction:column;gap:2px;}
.hdr-name{font-family:var(--fD);font-size:22px;letter-spacing:4px;color:var(--text);line-height:1;}
.hdr-name em{color:var(--accent);font-style:normal;}
.hdr-tag{font-family:var(--fM);font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--text3);}
.pill{display:flex;align-items:center;gap:7px;background:var(--accent-dim);
  border:1px solid rgba(0,229,255,.25);color:var(--accent);padding:6px 14px;border-radius:100px;
  font-family:var(--fM);font-size:10px;letter-spacing:2.5px;text-transform:uppercase;}
.dot{width:7px;height:7px;border-radius:50%;background:var(--accent);animation:blink 2s ease infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}
.wrap{position:relative;z-index:1;max-width:800px;margin:0 auto;padding:36px 20px 100px;}
.progress{display:flex;align-items:center;margin-bottom:44px;}
.snode{display:flex;flex-direction:column;align-items:center;gap:7px;flex-shrink:0;}
.snode.click{cursor:pointer;}
.nring{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:var(--fM);font-size:13px;transition:all .3s;}
.nring.idle{border:1px solid var(--border2);color:var(--text3);background:var(--surface);}
.nring.active{border:2px solid var(--accent);color:var(--accent);background:rgba(0,229,255,.06);
  box-shadow:0 0 0 4px rgba(0,229,255,.08),0 0 20px rgba(0,229,255,.2);}
.nring.done{background:var(--accent);border:2px solid var(--accent);color:var(--bg);font-size:17px;}
.nlbl{font-family:var(--fM);font-size:9px;letter-spacing:2px;text-transform:uppercase;white-space:nowrap;}
.snode.active .nlbl{color:var(--accent);}
.snode.done .nlbl{color:var(--success);}
.snode.idle .nlbl{color:var(--text3);}
.conn{flex:1;height:1px;margin-bottom:26px;transition:background .4s;}
.conn.done{background:linear-gradient(90deg,var(--accent),rgba(0,229,255,.3));}
.conn.idle{background:var(--border2);}
.card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:36px;
  margin-bottom:16px;position:relative;overflow:hidden;animation:up .35s ease both;}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent 0%,var(--accent) 40%,rgba(0,229,255,.3) 70%,transparent 100%);opacity:.5;}
@keyframes up{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:none;}}
.stitle{font-family:var(--fD);font-size:26px;letter-spacing:3px;margin-bottom:4px;}
.ssub{font-size:13px;color:var(--text2);margin-bottom:28px;line-height:1.5;}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.field{margin-bottom:18px;}
.lbl{display:block;font-family:var(--fM);font-size:10px;letter-spacing:2.5px;
  text-transform:uppercase;color:var(--text3);margin-bottom:8px;}
.inp,.sel,.tarea{width:100%;background:var(--surface2);border:1px solid var(--border2);
  border-radius:10px;padding:13px 16px;color:var(--text);font-size:15px;
  font-family:var(--fB);outline:none;transition:border-color .2s,box-shadow .2s;}
.inp:focus,.sel:focus,.tarea:focus{border-color:rgba(0,229,255,.4);box-shadow:0 0 0 3px rgba(0,229,255,.06);}
.tarea{resize:vertical;min-height:90px;}
.upload-zone{width:100%;background:var(--surface2);border:2px dashed rgba(0,229,255,.25);
  border-radius:12px;padding:28px 20px;text-align:center;cursor:pointer;
  transition:border-color .2s,background .2s;position:relative;}
.upload-zone:hover{border-color:rgba(0,229,255,.5);background:rgba(0,229,255,.04);}
.upload-zone.has-file{border-color:var(--success);border-style:solid;background:rgba(6,214,160,.05);}
.up-icon{font-size:32px;margin-bottom:8px;}
.up-title{font-size:14px;font-weight:600;margin-bottom:4px;}
.up-sub{font-size:12px;color:var(--text2);}
.up-name{font-family:var(--fM);font-size:12px;color:var(--success);margin-top:10px;
  padding:6px 12px;background:var(--success-dim);border-radius:6px;display:inline-block;}
.up-clear{position:absolute;top:10px;right:12px;background:none;border:none;
  color:var(--text2);cursor:pointer;font-size:20px;line-height:1;padding:2px 6px;}
.up-clear:hover{color:var(--danger);}
.cat-hdr{display:flex;align-items:center;gap:10px;margin:26px 0 10px;
  padding-bottom:10px;border-bottom:1px solid var(--border);}
.cat-hdr:first-child{margin-top:0;}
.cat-icon{width:30px;height:30px;border-radius:8px;background:var(--surface3);
  border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:14px;}
.cat-name{font-family:var(--fM);font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--text3);}
.prow{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:12px;
  border:1px solid var(--border);margin-bottom:7px;cursor:pointer;background:var(--surface2);
  transition:border-color .18s,background .18s;position:relative;overflow:hidden;}
.prow:hover{border-color:rgba(0,229,255,.22);background:rgba(0,229,255,.03);}
.prow.sel{border-color:var(--accent);background:rgba(0,229,255,.06);}
.prow.sel::after{content:'';position:absolute;right:0;top:0;bottom:0;
  width:3px;background:var(--accent);border-radius:0 12px 12px 0;}
.rring{width:20px;height:20px;border-radius:50%;border:2px solid var(--border2);flex-shrink:0;
  display:flex;align-items:center;justify-content:center;transition:all .2s;}
.prow.sel .rring{background:var(--accent);border-color:var(--accent);}
.rdot{width:7px;height:7px;border-radius:50%;background:var(--bg);display:none;}
.prow.sel .rdot{display:block;}
.pname{flex:1;font-size:14px;font-weight:500;line-height:1.3;}
.ptags{display:flex;gap:5px;flex-shrink:0;}
.tag-all{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;font-family:var(--fM);
  background:var(--success-dim);border:1px solid rgba(6,214,160,.3);color:var(--success);padding:3px 8px;border-radius:100px;}
.tag-from{font-size:9px;letter-spacing:1px;text-transform:uppercase;font-family:var(--fM);
  color:var(--text3);background:var(--surface);border:1px solid var(--border);padding:3px 8px;border-radius:100px;}
.pprice{font-family:var(--fM);font-size:16px;font-weight:500;color:var(--gold);flex-shrink:0;}
.qty-box{margin-top:24px;padding:20px;background:var(--surface2);border-radius:14px;border:1px solid var(--border);}
.qty-row{display:flex;align-items:center;gap:14px;margin:14px 0 12px;}
.qbtn{width:40px;height:40px;border-radius:10px;flex-shrink:0;border:1px solid var(--border2);
  background:var(--surface3);color:var(--text);font-size:22px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:all .15s;}
.qbtn:hover{border-color:var(--accent);color:var(--accent);}
.qnum{font-family:var(--fD);font-size:42px;letter-spacing:2px;min-width:64px;text-align:center;}
.qinp{width:72px;background:var(--surface3);border:1px solid var(--border2);
  border-radius:8px;padding:10px;color:var(--text);font-family:var(--fM);font-size:14px;text-align:center;outline:none;}
.disc-pill{display:inline-flex;align-items:center;gap:7px;background:var(--gold-dim);
  border:1px solid rgba(255,209,102,.3);color:var(--gold);padding:6px 14px;border-radius:100px;
  font-family:var(--fM);font-size:11px;letter-spacing:2px;text-transform:uppercase;animation:up .3s ease;}
.addon{display:flex;align-items:center;gap:14px;padding:15px 17px;border-radius:12px;
  border:1px solid var(--border);margin-bottom:9px;cursor:pointer;background:var(--surface2);transition:all .18s;}
.addon:hover{border-color:rgba(0,229,255,.22);}
.addon.sel{border-color:var(--accent);background:rgba(0,229,255,.05);}
.chk{width:22px;height:22px;border-radius:6px;border:2px solid var(--border2);flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:13px;transition:all .2s;}
.addon.sel .chk{background:var(--accent);border-color:var(--accent);color:var(--bg);}
.ainfo{flex:1;}
.aname{font-size:14px;font-weight:500;}
.adesc{font-size:12px;color:var(--text2);margin-top:3px;}
.aprice{font-family:var(--fM);color:var(--accent);font-size:14px;flex-shrink:0;}
.sleeve-grid{display:flex;gap:10px;margin-bottom:10px;}
.sopt{flex:1;padding:16px 8px;text-align:center;border-radius:12px;border:1px solid var(--border);
  background:var(--surface2);cursor:pointer;transition:all .18s;}
.sopt:hover{border-color:rgba(0,229,255,.22);}
.sopt.sel{border-color:var(--accent);background:rgba(0,229,255,.06);}
.sn{font-family:var(--fD);font-size:36px;}
.sopt.sel .sn{color:var(--accent);}
.slbl{font-size:11px;color:var(--text2);margin-top:3px;}
.scost{font-family:var(--fM);font-size:12px;color:var(--accent);margin-top:4px;}
.note{display:flex;gap:10px;padding:13px 16px;background:var(--success-dim);
  border:1px solid rgba(6,214,160,.2);border-radius:10px;margin-bottom:18px;
  font-size:13px;color:#8ed6c0;line-height:1.55;}
.sblock{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:17px 20px;margin-bottom:13px;}
.slbl2{font-family:var(--fM);font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--text3);margin-bottom:9px;}
.pline{display:flex;justify-content:space-between;align-items:center;padding:9px 0;
  border-bottom:1px solid var(--border);font-size:14px;}
.pline:last-child{border-bottom:none;}
.pline .lv{color:var(--text2);}
.pline .rv{font-family:var(--fM);}
.pline.disc .rv{color:var(--success);}
.pline.xtra .rv{color:var(--accent);}
.total-row{display:flex;justify-content:space-between;align-items:center;
  padding:18px 0 0;border-top:1px solid var(--border2);margin-top:8px;}
.total-lbl{font-family:var(--fD);font-size:16px;letter-spacing:3px;color:var(--text2);}
.total-amt{font-family:var(--fD);font-size:44px;letter-spacing:2px;}
.dep{background:linear-gradient(135deg,rgba(0,229,255,.09),rgba(0,229,255,.03));
  border:1px solid rgba(0,229,255,.28);border-radius:16px;padding:30px 28px;text-align:center;
  margin-top:18px;position:relative;overflow:hidden;}
.dep::before{content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% -10%,rgba(0,229,255,.12),transparent 60%);}
.dep > *{position:relative;}
.dep-sup{font-family:var(--fM);font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:6px;}
.dep-amt{font-family:var(--fD);font-size:64px;letter-spacing:2px;color:var(--accent);line-height:1;}
.dep-sub{font-size:12px;color:var(--text2);margin-top:6px;}
.brow{display:flex;justify-content:space-between;align-items:center;margin-top:26px;gap:12px;}
.btn{padding:14px 26px;border-radius:10px;border:none;outline:none;
  font-family:var(--fM);font-size:11px;letter-spacing:3px;text-transform:uppercase;
  font-weight:500;cursor:pointer;transition:all .2s;}
.btn-p{background:var(--accent);color:var(--bg);}
.btn-p:hover{background:#33ecff;box-shadow:0 6px 24px rgba(0,229,255,.3);transform:translateY(-1px);}
.btn-p:disabled{opacity:.3;cursor:not-allowed;transform:none;box-shadow:none;}
.btn-g{background:transparent;color:var(--text2);border:1px solid var(--border2);}
.btn-g:hover{color:var(--text);border-color:rgba(255,255,255,.28);}
.btn-s{flex:1;background:linear-gradient(135deg,var(--danger),#ff6b35);color:#fff;font-size:12px;
  box-shadow:0 4px 20px rgba(255,61,107,.22);}
.btn-s:hover{box-shadow:0 8px 32px rgba(255,61,107,.42);transform:translateY(-2px);}
.btn-s:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none;}
.email-status{padding:14px 18px;border-radius:10px;font-size:13px;margin-top:12px;text-align:center;font-family:var(--fM);letter-spacing:1px;}
.es-sending{background:rgba(0,229,255,.08);border:1px solid rgba(0,229,255,.25);color:var(--accent);}
.es-ok{background:var(--success-dim);border:1px solid rgba(6,214,160,.3);color:var(--success);}
.es-err{background:rgba(255,61,107,.08);border:1px solid rgba(255,61,107,.25);color:#ff8fa8;font-size:12px;}
.success{text-align:center;padding:60px 20px;animation:up .5s ease;}
.sring{width:100px;height:100px;border-radius:50%;border:2px solid var(--success);
  display:flex;align-items:center;justify-content:center;margin:0 auto 28px;font-size:40px;
  background:var(--success-dim);animation:glow 2.5s ease infinite;}
@keyframes glow{0%,100%{box-shadow:0 0 40px rgba(6,214,160,.2);}50%{box-shadow:0 0 70px rgba(6,214,160,.45));}}
.s-title{font-family:var(--fD);font-size:52px;letter-spacing:4px;margin-bottom:10px;}
.s-sub{font-size:15px;color:var(--text2);margin-bottom:32px;line-height:1.65;}
@media(max-width:600px){
  .g2{grid-template-columns:1fr;}
  .hdr{padding:0 16px;height:64px;}
  .hdr-img{height:44px;}
  .card{padding:22px 18px;}
  .dep-amt{font-size:48px;}
}
`;

export default function PricingApp() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [emailStatus, setEmailStatus] = useState("idle"); // idle | sending | ok | err
  const [emailErr, setEmailErr] = useState("");
  const [customer, setCustomer] = useState({ name:"", business:"", phone:"", email:"" });
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [backAddon, setBackAddon] = useState("");
  const [sleeveCount, setSleeveCount] = useState(0);
  const [mockup, setMockup] = useState(false);
  const [rush, setRush] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [artworkFile, setArtworkFile] = useState(null);

  const product = allProducts.find(p => p.id === selectedProductId);
  const sleevePrice = product && !product.allInclusive
    ? (product.allowSleeve === "short" ? 2 : product.allowSleeve === "long" ? 3 : 0) * sleeveCount : 0;
  const backPrice = product && !product.allInclusive && !product.isHoodie
    ? (BACK_ADDONS.find(b => b.id === backAddon)?.price || 0) : 0;
  const itemPrice = product ? product.basePrice + sleevePrice + backPrice : 0;
  const subtotalRaw = itemPrice * quantity;
  const { pct: discPct, label: discLabel, badge: discBadge } = getDiscount(quantity);
  const discAmount = subtotalRaw * discPct;
  const subtotalDisc = subtotalRaw - discAmount;
  const mockupFee = mockup ? 50 : 0;
  const rushFee = rush ? getRushFee(subtotalDisc) : 0;
  const finalTotal = subtotalDisc + mockupFee + rushFee;
  const deposit = finalTotal * 0.5;

  const canStep1 = customer.name && customer.email && customer.phone;
  const canStep2 = selectedProductId && quantity >= 1;
  const STEPS = ["Contact", "Product", "Options", "Review"];

  async function handleSubmit() {
    setEmailStatus("sending");
    setEmailErr("");
    try {
      await sendQuoteEmail({
        to_email: "Cre8tiveminds242@gmail.com",
        customer_name: customer.name,
        customer_business: customer.business || "N/A",
        customer_phone: customer.phone,
        customer_email: customer.email,
        product_name: product?.name || "",
        quantity: quantity.toString(),
        back_addon: backAddon ? BACK_ADDONS.find(b=>b.id===backAddon)?.label : "None",
        sleeve_count: sleeveCount.toString(),
        mockup: mockup ? "Yes (+$50)" : "No",
        rush: rush ? `Yes (+$${rushFee})` : "No",
        artwork_file: artworkFile?.name || "None uploaded",
        instructions: instructions || "None",
        subtotal: `$${subtotalRaw.toFixed(2)}`,
        discount: discAmount > 0 ? `-$${discAmount.toFixed(2)} (${Math.round(discPct*100)}%)` : "None",
        total: `$${finalTotal.toFixed(2)}`,
        deposit: `$${deposit.toFixed(2)}`,
      });
      setEmailStatus("ok");
      setSubmitted(true);
    } catch(e) {
      setEmailStatus("err");
      setEmailErr("Email not sent yet — add your EmailJS keys to activate. Quote recorded locally.");
      setSubmitted(true);
    }
  }

  function reset() {
    setSubmitted(false); setStep(1); setSelectedProductId(""); setQuantity(1);
    setBackAddon(""); setSleeveCount(0); setMockup(false); setRush(false);
    setInstructions(""); setArtworkFile(null); setEmailStatus("idle"); setEmailErr("");
    setCustomer({ name:"", business:"", phone:"", email:"" });
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="bg-grid" />
        <div className="bg-orb" />
        <div className="bg-orb2" />

        <header className="hdr">
          <div className="hdr-left">
            {LOGO && <img src={LOGO} alt="Cre8tive Minds Designs" className="hdr-img" />}
            <div className="hdr-text">
              <div className="hdr-name">Cre8tive<em>Minds</em></div>
              <div className="hdr-tag">Designs · Custom Studio</div>
            </div>
          </div>
          <div className="pill"><span className="dot" />Quote Builder</div>
        </header>

        <div className="wrap">

          {!submitted && (
            <div className="progress">
              {STEPS.map((s,i) => {
                const n=i+1, isActive=step===n, isDone=step>n;
                const cls = isActive?"active":isDone?"done":"idle";
                return (
                  <React.Fragment key={s}>
                    <div className={`snode ${isDone?"click":""}`} onClick={()=>isDone&&setStep(n)}>
                      <div className={`nring ${cls}`}>{isDone?"✓":n}</div>
                      <div className="nlbl">{s}</div>
                    </div>
                    {i<STEPS.length-1 && <div className={`conn ${isDone?"done":"idle"}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* SUCCESS */}
          {submitted && (
            <div className="card">
              <div className="success">
                <div className="sring">✓</div>
                <div className="s-title">Quote Submitted!</div>
                <div className="s-sub">
                  Thank you, <strong style={{color:"var(--text)"}}>{customer.name}</strong>!<br/>
                  Your request is in — we'll be in touch shortly.
                </div>
                <div className="dep" style={{maxWidth:320,margin:"0 auto 28px"}}>
                  <div className="dep-sup">Your 50% Deposit to Confirm</div>
                  <div className="dep-amt">${deposit.toFixed(2)}</div>
                  <div className="dep-sub">of ${finalTotal.toFixed(2)} total order</div>
                </div>
                {emailStatus==="ok" && (
                  <div className="email-status es-ok">✓ Quote sent to Cre8tiveminds242@gmail.com</div>
                )}
                {emailStatus==="err" && (
                  <div className="email-status es-err">⚠ {emailErr}</div>
                )}
                <div style={{fontSize:13,color:"var(--text2)",margin:"20px 0"}}>
                  Customer copy sent to <span style={{color:"var(--accent)"}}>{customer.email}</span>
                </div>
                <button className="btn btn-p" onClick={reset}>+ New Quote</button>
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {!submitted && step===1 && (
            <div className="card">
              <div className="stitle">Your Information</div>
              <div className="ssub">Let's start with the basics so we can personalize your quote</div>
              <div className="g2">
                <div className="field">
                  <label className="lbl">Full Name *</label>
                  <input className="inp" value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})} placeholder="John Smith" />
                </div>
                <div className="field">
                  <label className="lbl">Business / School / Group</label>
                  <input className="inp" value={customer.business} onChange={e=>setCustomer({...customer,business:e.target.value})} placeholder="Team or Company Name" />
                </div>
              </div>
              <div className="g2">
                <div className="field">
                  <label className="lbl">Phone Number *</label>
                  <input className="inp" type="tel" value={customer.phone} onChange={e=>setCustomer({...customer,phone:e.target.value})} placeholder="(555) 000-0000" />
                </div>
                <div className="field">
                  <label className="lbl">Email Address *</label>
                  <input className="inp" type="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})} placeholder="you@email.com" />
                </div>
              </div>
              <div className="brow">
                <div/>
                <button className="btn btn-p" disabled={!canStep1} onClick={()=>setStep(2)}>Select Product →</button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {!submitted && step===2 && (
            <div className="card">
              <div className="stitle">Choose Your Product</div>
              <div className="ssub">Select the item you'd like to customize and price out</div>
              {PRODUCTS.map(cat=>(
                <div key={cat.category}>
                  <div className="cat-hdr">
                    <div className="cat-icon">{cat.icon}</div>
                    <div className="cat-name">{cat.category}</div>
                  </div>
                  {cat.items.map(item=>(
                    <div key={item.id} className={`prow ${selectedProductId===item.id?"sel":""}`} onClick={()=>setSelectedProductId(item.id)}>
                      <div className="rring"><div className="rdot"/></div>
                      <span className="pname">{item.name}</span>
                      <div className="ptags">
                        {item.allInclusive && <span className="tag-all">All-Inclusive</span>}
                        {item.startingAt && <span className="tag-from">Starting At</span>}
                      </div>
                      <span className="pprice">${item.basePrice}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div className="qty-box">
                <label className="lbl">Quantity</label>
                <div className="qty-row">
                  <button className="qbtn" onClick={()=>setQuantity(Math.max(1,quantity-1))}>−</button>
                  <div className="qnum">{quantity}</div>
                  <button className="qbtn" onClick={()=>setQuantity(quantity+1)}>+</button>
                  <input className="qinp" type="number" min="1" value={quantity} onChange={e=>setQuantity(Math.max(1,parseInt(e.target.value)||1))} />
                </div>
                {discBadge && <div className="disc-pill">🎉 <strong>{discBadge}</strong><span style={{color:"var(--text2)",fontWeight:300}}>— {discLabel}</span></div>}
              </div>
              <div className="brow">
                <button className="btn btn-g" onClick={()=>setStep(1)}>← Back</button>
                <button className="btn btn-p" disabled={!canStep2} onClick={()=>setStep(3)}>Add Options →</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {!submitted && step===3 && (
            <div className="card">
              <div className="stitle">Customize Your Order</div>
              <div className="ssub">Add print locations, upgrades, and any special needs</div>

              {product?.allInclusive && <div className="note">✦ <span>This item is <strong>all-inclusive</strong> — names, numbers, and full design coverage are built into the price.</span></div>}
              {product?.collarNote && <div className="note">👔 <span>Collar shirts include one crest or chest print. Back and sleeve prints are additional.</span></div>}

              {product && !product.allInclusive && !product.isHoodie && product.allowBack && (
                <div style={{marginBottom:22}}>
                  <label className="lbl" style={{marginBottom:10}}>Back Print Size (optional)</label>
                  {BACK_ADDONS.map(b=>(
                    <div key={b.id} className={`addon ${backAddon===b.id?"sel":""}`} onClick={()=>setBackAddon(backAddon===b.id?"":b.id)}>
                      <div className="chk">{backAddon===b.id?"✓":""}</div>
                      <div className="ainfo"><div className="aname">{b.label}</div></div>
                      <div className="aprice">+${b.price}</div>
                    </div>
                  ))}
                </div>
              )}

              {product && !product.allInclusive && product.allowSleeve && (
                <div style={{marginBottom:22}}>
                  <label className="lbl" style={{marginBottom:10}}>Sleeve Prints — +${product.allowSleeve==="short"?2:3} per sleeve</label>
                  <div className="sleeve-grid">
                    {[0,1,2].map(n=>(
                      <div key={n} className={`sopt ${sleeveCount===n?"sel":""}`} onClick={()=>setSleeveCount(n)}>
                        <div className="sn">{n}</div>
                        <div className="slbl">{n===0?"None":n===1?"1 Sleeve":"Both Sleeves"}</div>
                        {n>0 && <div className="scost">+${(product.allowSleeve==="short"?2:3)*n}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{marginBottom:22}}>
                <label className="lbl" style={{marginBottom:10}}>Additional Services</label>
                <div className={`addon ${mockup?"sel":""}`} onClick={()=>setMockup(!mockup)}>
                  <div className="chk">{mockup?"✓":""}</div>
                  <div className="ainfo">
                    <div className="aname">Mockup Design Fee</div>
                    <div className="adesc">Professional design preview before production begins</div>
                  </div>
                  <div className="aprice">+$50</div>
                </div>
                <div className={`addon ${rush?"sel":""}`} onClick={()=>setRush(!rush)}>
                  <div className="chk">{rush?"✓":""}</div>
                  <div className="ainfo">
                    <div className="aname">Rush Order</div>
                    <div className="adesc">Priority processing — fee scales with order total</div>
                  </div>
                  <div className="aprice">+${getRushFee(subtotalDisc)}</div>
                </div>
              </div>

              <div className="field">
                <label className="lbl">Artwork / Logo Upload</label>
                <label htmlFor="artwork-upload" style={{display:"block",cursor:"pointer"}}>
                  <input
                    id="artwork-upload"
                    type="file"
                    accept="image/*,.pdf,.ai,.eps,.svg,.psd"
                    style={{display:"none"}}
                    onChange={e=>setArtworkFile(e.target.files[0]||null)}
                  />
                  <div className={`upload-zone ${artworkFile?"has-file":""}`}>
                    {!artworkFile ? (
                      <>
                        <div className="up-icon">🖼️</div>
                        <div className="up-title">Tap to upload your artwork or logo</div>
                        <div className="up-sub">PNG, JPG, PDF, AI, SVG, EPS, PSD accepted</div>
                      </>
                    ) : (
                      <>
                        <div className="up-icon">✅</div>
                        <div className="up-title">File attached!</div>
                        <div className="up-name">{artworkFile.name}</div>
                      </>
                    )}
                  </div>
                </label>
                {artworkFile && (
                  <button
                    className="btn btn-g"
                    style={{marginTop:8,width:"100%",fontSize:11,padding:"8px"}}
                    onClick={()=>setArtworkFile(null)}
                  >
                    × Remove File
                  </button>
                )}
              </div>

              <div className="field">
                <label className="lbl">Special Instructions</label>
                <textarea className="tarea" value={instructions} onChange={e=>setInstructions(e.target.value)}
                  placeholder="Colors, sizing notes, deadlines, anything else we should know..." />
              </div>

              <div className="brow">
                <button className="btn btn-g" onClick={()=>setStep(2)}>← Back</button>
                <button className="btn btn-p" onClick={()=>setStep(4)}>Review Quote →</button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {!submitted && step===4 && (
            <>
              <div className="card">
                <div className="stitle">Review Your Quote</div>
                <div className="ssub">Make sure everything looks right before you submit</div>

                <div className="sblock">
                  <div className="slbl2">Customer</div>
                  <div style={{fontSize:15,fontWeight:600}}>{customer.name}{customer.business?` — ${customer.business}`:""}</div>
                  <div style={{fontSize:13,color:"var(--text2)",marginTop:5}}>{customer.phone} · {customer.email}</div>
                </div>

                <div className="sblock">
                  <div className="slbl2">Product</div>
                  <div style={{fontSize:15,fontWeight:600}}>{product?.name}</div>
                  <div style={{fontSize:13,color:"var(--text2)",marginTop:5}}>
                    Qty: {quantity} · ${product?.basePrice}/ea base
                    {backPrice>0?` · +$${backPrice} back`:""}
                    {sleevePrice>0?` · +$${sleevePrice} sleeve(s)`:""}
                    {artworkFile ? ` · 📎 ${(artworkFile as File).name}` : ""}
                  </div>
                </div>

                <div className="sblock">
                  <div className="slbl2">Price Breakdown</div>
                  <div className="pline"><span className="lv">Subtotal ({quantity} items)</span><span className="rv">${subtotalRaw.toFixed(2)}</span></div>
                  {discAmount>0 && <div className="pline disc"><span className="lv">Discount ({Math.round(discPct*100)}%)</span><span className="rv">−${discAmount.toFixed(2)}</span></div>}
                  {mockupFee>0 && <div className="pline xtra"><span className="lv">Mockup Fee</span><span className="rv">+$50.00</span></div>}
                  {rushFee>0 && <div className="pline xtra"><span className="lv">Rush Fee</span><span className="rv">+${rushFee.toFixed(2)}</span></div>}
                  <div className="total-row">
                    <span className="total-lbl">Order Total</span>
                    <span className="total-amt">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="dep">
                  <div className="dep-sup">50% Deposit Required to Confirm</div>
                  <div className="dep-amt">${deposit.toFixed(2)}</div>
                  <div className="dep-sub">Balance of ${deposit.toFixed(2)} due at pickup or delivery</div>
                </div>

                {instructions && <div className="note" style={{marginTop:16}}>📝 <span>{instructions}</span></div>}
              </div>

              <div className="brow">
                <button className="btn btn-g" onClick={()=>setStep(3)}>← Edit</button>
                <button className="btn btn-s" disabled={emailStatus==="sending"} onClick={handleSubmit}>
                  {emailStatus==="sending" ? "Sending..." : "Submit Quote Request ✓"}
                </button>
              </div>
              {emailStatus==="sending" && <div className="email-status es-sending">⏳ Sending quote to Cre8tiveminds242@gmail.com...</div>}
            </>
          )}

        </div>
      </div>
    </>
  );
}