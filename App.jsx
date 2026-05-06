import { useState, useRef } from "react";

const COLORS = {
  bg: "#0f1117", card: "#1a1e2e", cardBorder: "#252a3d",
  accent: "#f5a623", green: "#22c55e", red: "#ef4444",
  blue: "#3b82f6", text: "#f0f0f0", muted: "#8892a4", inputBg: "#111420",
};

const today = () => new Date().toISOString().slice(0, 10);
const daysDiff = (d) => Math.ceil((new Date(d) - new Date()) / 86400000);
const fmt$ = (n) => `$${Number(n).toLocaleString("es-AR")}`;
const fmtFecha = (d) => { if (!d) return "—"; const [y,m,dd]=d.split("-"); return `${dd}/${m}/${y}`; };
const fmtKm = (k) => k ? Number(k).toLocaleString("es-AR") + " km" : "—";
const TIPOS_SERVICIO = ["Cambio de aceite","Filtro de aceite","Filtro de aire","Filtro de combustible","Lubricación","Revisión general","Cambio de pastillas","Alineación","Otro"];

// ── UI Primitivos ─────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 20, ...style }}>{children}</div>
);
const Btn = ({ children, onClick, color = "accent", small, style = {} }) => {
  const bg = { accent: COLORS.accent, red: COLORS.red, green: COLORS.green, blue: COLORS.blue }[color] || COLORS.accent;
  return <button onClick={onClick} style={{ background: bg, color: color === "accent" ? "#111" : "#fff", border: "none", borderRadius: 8, padding: small ? "5px 12px" : "9px 20px", fontWeight: 700, fontSize: small ? 12 : 14, cursor: "pointer", ...style }}>{children}</button>;
};
const Inp = ({ label, ...p }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13, color: COLORS.muted }}>
    {label}
    <input {...p} style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "8px 12px", color: COLORS.text, fontSize: 14, outline: "none" }} />
  </label>
);
const Sel = ({ label, children, ...p }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 13, color: COLORS.muted }}>
    {label}
    <select {...p} style={{ background: COLORS.inputBg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "8px 12px", color: COLORS.text, fontSize: 14, outline: "none" }}>{children}</select>
  </label>
);
const Badge = ({ color, children }) => {
  const bg = { green:"#22c55e22", red:"#ef444422", yellow:"#f5a62322", blue:"#3b82f622" }[color]||"#3b82f622";
  const tc = { green:"#22c55e", red:"#ef4444", yellow:"#f5a623", blue:"#3b82f6" }[color]||"#3b82f6";
  return <span style={{ background: bg, color: tc, padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{children}</span>;
};
const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: "fixed", inset: 0, background: "#000c", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20, padding: 24, width: "100%", maxWidth: wide ? 760 : 520, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ margin: 0, color: COLORS.accent, fontSize: 18 }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, fontSize: 22, cursor: "pointer" }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const abrirWa = (tel, msg) => {
  if (!tel) return;
  const t = tel.replace(/[^0-9]/g, "");
  const c = t.startsWith("54") ? t : `54${t}`;
  window.open(`https://wa.me/${c}?text=${encodeURIComponent(msg)}`, "_blank");
};
const WaBtn = ({ tel, msg }) => (
  <button onClick={() => { if (!tel) { alert("El cliente no tiene teléfono cargado."); return; } abrirWa(tel, msg); }}
    style={{ background:"#25D36622", border:"1px solid #25D366", borderRadius:8, color:"#25D366", padding:"5px 10px", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    WhatsApp
  </button>
);

const msgTurno = (t, c, v) => {
  const dias = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
  const f = new Date(t.fecha + "T12:00:00");
  const [a,m,d] = t.fecha.split("-");
  return `Hola ${c.nombre||""} 👋 Te recordamos que tenés un turno en *Lubrand Lubricentro* el *${dias[f.getDay()]} ${d}/${m}/${a}* a las *${t.hora} hs* para *${t.servicio}*${v.marca?` de tu ${v.marca} ${v.modelo}`:""}. ¡Te esperamos! 🛢️\n\n_Mensaje automático, no responder._`;
};
const msgServicio = (s, c, v) => {
  const [a,m,d] = s.fecha.split("-");
  const items = s.tipos?.length>0 ? s.tipos.map(t=>`• ${t}`).join("\n") : "• Servicio general";
  return `Hola ${c.nombre||""} 👋 Te informamos que el servicio de tu ${v.marca?`${v.marca} ${v.modelo}`:"vehículo"}${v.patente?` (${v.patente})`:""} fue realizado el *${d}/${m}/${a}*.\n\n*Servicios realizados:*\n${items}${s.detalle?`\n\n*Detalle:* ${s.detalle}`:""}${s.proximaFecha?`\n\n⚠️ *Próximo servicio:* ${fmtFecha(s.proximaFecha)}${s.proximoKm?` / ${fmtKm(s.proximoKm)}`:""}`:""}  \n\nGracias por elegirnos 🛢️ *Lubrand Lubricentro*\n\n_Mensaje automático, no responder._`;
};

// ── TARJETA LUBRAND ───────────────────────────────────────────────────────────
function TarjetaLubrand({ servicio, cliente, vehiculo }) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef(null);

  const s = servicio, c = cliente, v = vehiculo;
  const aceite = s.tipos?.includes("Cambio de aceite") ? (s.detalle || "✓") : "";
  const filtroAceite = s.tipos?.includes("Filtro de aceite") ? "✓" : "";
  const filtroAire = s.tipos?.includes("Filtro de aire") ? "✓" : "";
  const filtroComb = s.tipos?.includes("Filtro de combustible") ? "✓" : "";
  const otrosItems = s.tipos?.filter(t => !["Cambio de aceite","Filtro de aceite","Filtro de aire","Filtro de combustible"].includes(t)).join(", ");

  const styles = {
    wrapper: { width: "100%", maxWidth: 360, perspective: "800px", cursor: "pointer", margin: "0 auto" },
    inner: { position: "relative", width: "100%", height: 220, transition: "transform 0.7s cubic-bezier(.4,0,.2,1)", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "none" },
    face: { position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" },
    back: { transform: "rotateY(180deg)" },

    // FRONT
    front: { background: "linear-gradient(135deg,#0d2257 0%,#1a3a7c 60%,#0d2257 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" },
    waveRed: { position: "absolute", bottom: 0, left: 0, width: "100%", height: 60, background: "#c0392b", clipPath: "ellipse(60% 100% at 20% 100%)" },
    waveCyan: { position: "absolute", bottom: 0, right: 0, width: "65%", height: 50, background: "#1ab6d4", clipPath: "ellipse(80% 100% at 80% 100%)" },

    // BACK
    backCard: { background: "#fff", color: "#111", display: "flex", flexDirection: "column", fontSize: 11 },
    backHeader: { background: "#0d2257", color: "#fff", padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    backLeft: { width: 20, background: "#0d2257", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", padding: "4px 0" },
    backContent: { flex: 1, padding: "5px 8px", display: "flex", flexDirection: "column", gap: 3 },
    fieldLabel: { fontSize: 7, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
    fieldValue: { fontSize: 11, fontWeight: 700, color: "#0d2257", borderBottom: "1.5px solid #1ab6d4", minHeight: 14, paddingBottom: 1 },
    sectionTitle: { fontSize: 7, fontWeight: 800, color: "#c0392b", textTransform: "uppercase", letterSpacing: 1, marginTop: 3, borderTop: "1px solid #eee", paddingTop: 3 },
    itemRow: { display: "flex", alignItems: "flex-end", gap: 3 },
    itemLbl: { fontSize: 7, color: "#555", whiteSpace: "nowrap" },
    itemVal: { flex: 1, borderBottom: "1px solid #bbb", fontSize: 8, fontWeight: 700, color: "#0d2257", minHeight: 11 },
    nextSvc: { background: "#0d2257", color: "#fff", padding: "5px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    clienteRow: { background: "#f0f6ff", padding: "3px 10px", fontSize: 8, color: "#0d2257", display: "flex", gap: 8, flexWrap: "wrap" },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
      <div style={styles.wrapper} onClick={() => setFlipped(f => !f)}>
        <div style={styles.inner} ref={cardRef}>
          {/* FRENTE */}
          <div style={{ ...styles.face, ...styles.front }}>
            <div style={{ position:"absolute", top:8, right:12, fontSize:9, color:"#ffffff55" }}>Tocá para girar →</div>
            <div style={{ padding:"20px 20px 0", display:"flex", alignItems:"center", gap:10 }}>
              {/* Logo SVG */}
              <svg width="30" height="36" viewBox="0 0 30 36">
                <polygon points="15,0 30,20 0,20" fill="#c0392b"/>
                <polygon points="4,16 26,16 22,36 8,36" fill="#1ab6d4"/>
              </svg>
              <div>
                <div style={{ color:"#fff", fontSize:20, fontWeight:800, fontStyle:"italic", letterSpacing:-0.5 }}>Lubrand</div>
                <div style={{ color:"#a8d4e8", fontSize:10, marginTop:-2 }}>lubricentro</div>
              </div>
            </div>
            <div style={{ padding:"0 20px 16px", position:"relative", zIndex:2 }}>
              <div style={{ fontSize:10, color:"#cce4f5" }}>Av. Agustín Alvarez N° 1179</div>
              <div style={{ fontSize:12, color:"#fff", fontWeight:600, marginTop:2 }}>☎ 2317 - 533031</div>
            </div>
            <div style={styles.waveRed}/>
            <div style={styles.waveCyan}/>
          </div>

          {/* DORSO */}
          <div style={{ ...styles.face, ...styles.back, ...styles.backCard }}>
            <div style={styles.backHeader}>
              <span style={{ fontSize:9, fontWeight:800, letterSpacing:1, textTransform:"uppercase" }}>Control de Lubricación</span>
              <span style={{ fontSize:12, fontWeight:800, fontStyle:"italic", color:"#1ab6d4" }}>Lubrand</span>
            </div>
            <div style={styles.clienteRow}>
              <span>👤 <strong>{c.nombre||"—"}</strong></span>
              <span>🚗 <strong>{(v.patente||"").toUpperCase()||"—"}</strong></span>
              <span>{v.marca} {v.modelo}</span>
            </div>
            <div style={{ display:"flex", flex:1 }}>
              <div style={styles.backLeft}>
                <span style={{ color:"#fff", fontSize:6, fontWeight:800, writingMode:"vertical-rl", transform:"rotate(180deg)", letterSpacing:1 }}>ACEITES</span>
                <span style={{ color:"#fff", fontSize:6, fontWeight:800, writingMode:"vertical-rl", transform:"rotate(180deg)", letterSpacing:1 }}>FILTROS</span>
              </div>
              <div style={styles.backContent}>
                <div style={{ display:"flex", gap:6 }}>
                  <div style={{ flex:1 }}>
                    <div style={styles.fieldLabel}>Fecha</div>
                    <div style={styles.fieldValue}>{fmtFecha(s.fecha)}</div>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={styles.fieldLabel}>KM Actuales</div>
                    <div style={styles.fieldValue}>{fmtKm(s.km)}</div>
                  </div>
                </div>

                <div style={styles.sectionTitle}>Aceites</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px 8px" }}>
                  {[["Motor", aceite],["Caja cambios",""],["Diferencial",""],["Dirección",""]].map(([l,v])=>(
                    <div key={l} style={styles.itemRow}><span style={styles.itemLbl}>{l}</span><span style={styles.itemVal}>{v}</span></div>
                  ))}
                </div>

                <div style={styles.sectionTitle}>Filtros</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px 8px" }}>
                  {[["Aceite",filtroAceite],["Aire",filtroAire],["Cabina",""],["Combustible",filtroComb]].map(([l,v])=>(
                    <div key={l} style={styles.itemRow}><span style={styles.itemLbl}>{l}</span><span style={styles.itemVal}>{v}</span></div>
                  ))}
                </div>

                {otrosItems && <>
                  <div style={styles.sectionTitle}>Otros</div>
                  <div style={{ fontSize:8, color:"#0d2257", fontWeight:700 }}>{otrosItems}</div>
                </>}
              </div>
            </div>
            <div style={styles.nextSvc}>
              <div>
                <div style={{ fontSize:7, fontWeight:700, textTransform:"uppercase", color:"#1ab6d4" }}>Próximo Service</div>
                <div style={{ fontSize:12, fontWeight:800 }}>{fmtFecha(s.proximaFecha)}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:7, fontWeight:700, textTransform:"uppercase", color:"#1ab6d4" }}>Próximos KM</div>
                <div style={{ fontSize:12, fontWeight:800 }}>{fmtKm(s.proximoKm)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ fontSize:11, color:COLORS.muted, textAlign:"center" }}>Tocá la tarjeta para girarla</div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ clientes, vehiculos, servicios, turnos }) {
  const hoy = today();
  const turnosHoy = turnos.filter(t => t.fecha === hoy && t.estado === "pendiente");

  const proximos = servicios.filter(s => s.proximaFecha && daysDiff(s.proximaFecha) >= 0 && daysDiff(s.proximaFecha) <= 30);
  const vencidos = servicios.filter(s => s.proximaFecha && daysDiff(s.proximaFecha) < 0);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <h2 style={{ margin:0, color:COLORS.text }}>🏠 Panel Principal</h2>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        {[{icon:"👥",label:"Clientes",val:clientes.length},{icon:"🚗",label:"Vehículos",val:vehiculos.length},{icon:"🔧",label:"Servicios",val:servicios.length},{icon:"📅",label:"Turnos hoy",val:turnosHoy.length,color:COLORS.blue}].map(s=>(
          <Card key={s.label} style={{ flex:1, minWidth:120 }}>
            <div style={{ fontSize:24 }}>{s.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.color||COLORS.accent, marginTop:4 }}>{s.val}</div>
            <div style={{ fontSize:12, color:COLORS.muted }}>{s.label}</div>
          </Card>
        ))}
      </div>
      {turnosHoy.length > 0 && <Card style={{ borderColor:COLORS.blue }}>
        <div style={{ color:COLORS.blue, fontWeight:700, marginBottom:10 }}>📅 Turnos de hoy</div>
        {turnosHoy.map(t => { const c=clientes.find(c=>c.id===t.clienteId)||{}; const v=vehiculos.find(v=>v.id===t.vehiculoId)||{};
          return <div key={t.id} style={{ background:COLORS.inputBg, borderRadius:8, padding:"8px 12px", marginBottom:6, fontSize:13 }}>
            <strong style={{ color:COLORS.text }}>{t.hora} — {c.nombre}</strong>
            <div style={{ color:COLORS.muted }}>{v.marca} {v.modelo} | {t.servicio}</div>
          </div>;})}
      </Card>}
      {(vencidos.length>0||proximos.length>0) && <Card style={{ borderColor:COLORS.accent }}>
        <div style={{ color:COLORS.accent, fontWeight:700, marginBottom:10 }}>⚠️ Alertas de servicio</div>
        {vencidos.map(s=>{ const v=vehiculos.find(v=>v.id===s.vehiculoId)||{};
          return <div key={s.id} style={{ background:"#ef444415", borderRadius:8, padding:"7px 12px", marginBottom:5, fontSize:13 }}>
            <Badge color="red">VENCIDO</Badge> <strong style={{ color:COLORS.text }}> {v.patente} {v.marca} {v.modelo}</strong>
            <div style={{ color:COLORS.muted }}>Venció el {s.proximaFecha}</div></div>;})}
        {proximos.map(s=>{ const v=vehiculos.find(v=>v.id===s.vehiculoId)||{};
          return <div key={s.id} style={{ background:"#f5a62315", borderRadius:8, padding:"7px 12px", marginBottom:5, fontSize:13 }}>
            <Badge color="yellow">{daysDiff(s.proximaFecha)}d</Badge> <strong style={{ color:COLORS.text }}> {v.patente} {v.marca} {v.modelo}</strong>
            <div style={{ color:COLORS.muted }}>Vence {s.proximaFecha}</div></div>;})}
      </Card>}

      {turnosHoy.length===0&&vencidos.length===0&&proximos.length===0&&
        <Card><div style={{ textAlign:"center", color:COLORS.muted, padding:20 }}>✅ Todo en orden, sin alertas</div></Card>}
    </div>
  );
}

// ── Clientes ──────────────────────────────────────────────────────────────────
function Clientes({ clientes, setClientes, vehiculos, setVehiculos, servicios }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({});
  const F = (k) => e => setForm(f=>({...f,[k]:e.target.value}));
  const filtered = clientes.filter(c=>(c.nombre||"").toLowerCase().includes(search.toLowerCase())||(c.telefono||"").includes(search));
  const saveCliente = () => { if(sel?.tipo==="editar")setClientes(p=>p.map(c=>c.id===sel.id?{...c,...form}:c)); else setClientes(p=>[...p,{...form,id:Date.now()}]); setModal(null); };

  const importarContacto = async () => {
    if (!("contacts" in navigator && "ContactsManager" in window)) {
      alert("Tu navegador no soporta importar contactos. Funciona en Chrome para Android. Ingresá los datos manualmente.");
      return;
    }
    try {
      const props = ["name", "tel", "email"];
      const opts = { multiple: false };
      const contacts = await navigator.contacts.select(props, opts);
      if (contacts && contacts.length > 0) {
        const c = contacts[0];
        setForm(f => ({
          ...f,
          nombre: c.name?.[0] || f.nombre,
          telefono: c.tel?.[0] || f.telefono,
          email: c.email?.[0] || f.email,
        }));
      }
    } catch (e) {
      alert("No se pudo acceder a los contactos.");
    }
  };
  const saveVehiculo = () => { if(sel?.tipo==="editarV")setVehiculos(p=>p.map(v=>v.id===sel.vid?{...v,...form}:v)); else setVehiculos(p=>[...p,{...form,id:Date.now(),clienteId:sel.cid}]); setModal(null); };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
        <h2 style={{ margin:0, color:COLORS.text }}>👥 Clientes</h2>
        <div style={{ display:"flex", gap:8 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{ background:COLORS.inputBg, border:`1px solid ${COLORS.cardBorder}`, borderRadius:8, padding:"8px 12px", color:COLORS.text, fontSize:14, outline:"none", width:150 }} />
          <Btn onClick={()=>{setForm({nombre:"",telefono:"",email:""});setSel(null);setModal("c");}}>+ Cliente</Btn>
        </div>
      </div>
      {filtered.length===0&&<Card><div style={{ textAlign:"center", color:COLORS.muted, padding:30 }}>No hay clientes aún.</div></Card>}
      {filtered.map(c=>{ const vehs=vehiculos.filter(v=>v.clienteId===c.id);
        return <Card key={c.id}>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:16, color:COLORS.text }}>{c.nombre||"Sin nombre"}</div>
              <div style={{ color:COLORS.muted, fontSize:13 }}>📞 {c.telefono||"—"}{c.email&&` • ✉️ ${c.email}`}</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <Btn small color="blue" onClick={()=>{setForm({...c});setSel({tipo:"editar",id:c.id});setModal("c");}}>Editar</Btn>
              <Btn small color="green" onClick={()=>{setForm({patente:"",marca:"",modelo:"",año:"",km:""});setSel({tipo:"nuevo",cid:c.id,nombre:c.nombre});setModal("v");}}>+ Vehículo</Btn>
              <Btn small color="red" onClick={()=>{if(confirm("¿Eliminar cliente?")){setClientes(p=>p.filter(x=>x.id!==c.id));setVehiculos(p=>p.filter(v=>v.clienteId!==c.id));}}}>✕</Btn>
            </div>
          </div>
          {vehs.length>0&&<div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
            {vehs.map(v=>{ const ult=servicios.filter(s=>s.vehiculoId===v.id).sort((a,b)=>b.fecha.localeCompare(a.fecha))[0]; const alerta=ult?.proximaFecha&&daysDiff(ult.proximaFecha)<=30;
              return <div key={v.id} style={{ background:COLORS.inputBg, borderRadius:10, padding:"10px 14px", fontSize:13, minWidth:160, borderLeft:`3px solid ${alerta?COLORS.accent:COLORS.cardBorder}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontWeight:700, color:COLORS.text }}>{v.patente||"Sin patente"}</div>
                  <Btn small color="blue" onClick={()=>{setForm({...v});setSel({tipo:"editarV",vid:v.id});setModal("v");}}>Editar</Btn>
                </div>
                <div style={{ color:COLORS.muted }}>{v.marca} {v.modelo} {v.año}</div>
                <div style={{ color:COLORS.muted }}>🔢 {Number(v.km||0).toLocaleString()} km</div>
                {ult?.proximaFecha&&<div style={{ color:alerta?COLORS.accent:COLORS.muted, fontSize:11, marginTop:4 }}>Próx: {ult.proximaFecha}</div>}
              </div>;})}
          </div>}
        </Card>;})}
      {modal==="c"&&<Modal title={sel?.tipo==="editar"?"Editar Cliente":"Nuevo Cliente"} onClose={()=>setModal(null)}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {!sel?.tipo&&<button onClick={importarContacto} style={{ background:"#25D36622", border:"1px solid #25D366", borderRadius:10, color:"#25D366", padding:"10px", fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            📱 Importar desde contactos del celu
          </button>}
          <Inp label="Nombre" value={form.nombre||""} onChange={F("nombre")} />
          <Inp label="Teléfono" value={form.telefono||""} onChange={F("telefono")} />
          <Inp label="Email" value={form.email||""} onChange={F("email")} />
          <Btn onClick={saveCliente} style={{ marginTop:8 }}>Guardar</Btn>
        </div>
      </Modal>}
      {modal==="v"&&<Modal title={sel?.tipo==="editarV"?"Editar Vehículo":`Nuevo Vehículo — ${sel?.nombre}`} onClose={()=>setModal(null)}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Inp label="Patente" value={form.patente||""} onChange={e=>setForm(f=>({...f,patente:e.target.value.toUpperCase()}))} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Inp label="Marca" value={form.marca||""} onChange={F("marca")} />
            <Inp label="Modelo" value={form.modelo||""} onChange={F("modelo")} />
            <Inp label="Año" type="number" value={form.año||""} onChange={F("año")} />
            <Inp label="KM" type="number" value={form.km||""} onChange={F("km")} />
          </div>
          <Btn onClick={saveVehiculo} style={{ marginTop:8 }}>Guardar</Btn>
        </div>
      </Modal>}
    </div>
  );
}

// ── Servicios ─────────────────────────────────────────────────────────────────
function Servicios({ servicios, setServicios, vehiculos, setVehiculos, clientes }) {
  const [modal, setModal] = useState(false);
  const [tarjetaModal, setTarjetaModal] = useState(null);
  const [form, setForm] = useState({});
  const [filtro, setFiltro] = useState("");
  const F = (k) => e => setForm(f=>({...f,[k]:e.target.value}));
  const toggleTipo = (t) => setForm(f=>({...f,tipos:(f.tipos||[]).includes(t)?(f.tipos||[]).filter(x=>x!==t):[...(f.tipos||[]),t]}));

  const save = () => {
    if (!form.vehiculoId||!form.fecha) return;
    const tipo = form.tipos?.length>0 ? form.tipos.join(" + ") : "Servicio general";
    const nuevo = {...form, tipo, id:Date.now(), estado:"completado"};
    setServicios(p=>[...p,nuevo]);
    if (form.km) setVehiculos(p=>p.map(v=>v.id===Number(form.vehiculoId)?{...v,km:form.km}:v));
    setModal(false);
    // Mostrar tarjeta
    const v=vehiculos.find(v=>v.id===Number(form.vehiculoId))||{};
    const c=clientes.find(c=>c.id===v.clienteId)||{};
    setTarjetaModal({ servicio: nuevo, cliente: c, vehiculo: v });
    // WhatsApp
    if (c.telefono) setTimeout(() => abrirWa(c.telefono, msgServicio(nuevo,c,v)), 500);
  };

  const sorted = [...servicios].filter(s=>{ if(!filtro)return true; const v=vehiculos.find(v=>v.id===s.vehiculoId)||{}; const c=clientes.find(c=>c.id===v.clienteId)||{}; return (v.patente||"").includes(filtro.toUpperCase())||(c.nombre||"").toLowerCase().includes(filtro.toLowerCase()); }).sort((a,b)=>b.fecha.localeCompare(a.fecha));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
        <h2 style={{ margin:0, color:COLORS.text }}>🔧 Servicios</h2>
        <div style={{ display:"flex", gap:8 }}>
          <input value={filtro} onChange={e=>setFiltro(e.target.value)} placeholder="Filtrar..." style={{ background:COLORS.inputBg, border:`1px solid ${COLORS.cardBorder}`, borderRadius:8, padding:"8px 12px", color:COLORS.text, fontSize:14, outline:"none", width:140 }} />
          <Btn onClick={()=>{setForm({fecha:today(),tipos:[],vehiculoId:"",km:"",detalle:"",costo:"",proximoKm:"",proximaFecha:""});setModal(true);}}>+ Servicio</Btn>
        </div>
      </div>
      {sorted.length===0&&<Card><div style={{ textAlign:"center", color:COLORS.muted, padding:30 }}>Sin servicios registrados.</div></Card>}
      {sorted.map(s=>{ const v=vehiculos.find(v=>v.id===s.vehiculoId)||{}; const c=clientes.find(c=>c.id===v.clienteId)||{}; const dias=s.proximaFecha?daysDiff(s.proximaFecha):null;
        return <Card key={s.id}>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ fontWeight:700, color:COLORS.text }}>{s.tipo}</span>
                {dias!==null&&dias<0&&<Badge color="red">Vencido</Badge>}
                {dias!==null&&dias>=0&&dias<=30&&<Badge color="yellow">{dias}d</Badge>}
                {dias!==null&&dias>30&&<Badge color="green">Al día</Badge>}
              </div>
              <div style={{ color:COLORS.muted, fontSize:13, marginTop:4 }}>{c.nombre} • {v.patente} {v.marca} {v.modelo}</div>
              <div style={{ color:COLORS.muted, fontSize:12, marginTop:3 }}>📅 {s.fecha} • 🔢 {Number(s.km||0).toLocaleString()} km{s.detalle&&` • ${s.detalle}`}</div>
              {s.proximaFecha&&<div style={{ fontSize:12, color:dias<0?COLORS.red:dias<=30?COLORS.accent:COLORS.green, marginTop:3 }}>Próx: {fmtFecha(s.proximaFecha)}{s.proximoKm&&` (${fmtKm(s.proximoKm)})`}</div>}
              {s.costo&&<div style={{ fontSize:13, color:COLORS.green, fontWeight:700, marginTop:3 }}>💲 {fmt$(s.costo)}</div>}
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
              <Btn small color="blue" onClick={()=>setTarjetaModal({servicio:s,cliente:c,vehiculo:v})}>🎴 Tarjeta</Btn>
              <WaBtn tel={c.telefono} msg={msgServicio(s,c,v)} />
            </div>
          </div>
        </Card>;})}

      {/* Modal nuevo servicio */}
      {modal&&<Modal title="Registrar Servicio" onClose={()=>setModal(false)}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Sel label="Vehículo" value={form.vehiculoId} onChange={e=>setForm(f=>({...f,vehiculoId:e.target.value}))}>
            <option value="">— Seleccionar vehículo —</option>
            {vehiculos.map(v=>{ const c=clientes.find(c=>c.id===v.clienteId); return <option key={v.id} value={v.id}>{v.patente} — {v.marca} {v.modelo} ({c?.nombre})</option>;})}
          </Sel>
          <div>
            <div style={{ fontSize:13, color:COLORS.muted, marginBottom:8 }}>Servicios realizados (podés elegir varios)</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {TIPOS_SERVICIO.map(t=>{ const sel=(form.tipos||[]).includes(t); return(
                <button key={t} onClick={()=>toggleTipo(t)} style={{ background:sel?COLORS.accent:COLORS.inputBg, color:sel?"#111":COLORS.muted, border:`1px solid ${sel?COLORS.accent:COLORS.cardBorder}`, borderRadius:8, padding:"6px 12px", fontSize:13, fontWeight:sel?700:400, cursor:"pointer" }}>
                  {sel?"✓ ":""}{t}</button>);})}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Inp label="Fecha" type="date" value={form.fecha} onChange={e => {
              const f = e.target.value;
              const proxFecha = f ? new Date(new Date(f).getTime() + 365*24*60*60*1000).toISOString().slice(0,10) : "";
              setForm(prev => ({...prev, fecha: f, proximaFecha: proxFecha}));
            }} />
            <Inp label="KM actuales" type="number" value={form.km} onChange={e => {
              const km = e.target.value;
              setForm(prev => ({...prev, km, proximoKm: km ? String(Number(km) + 10000) : ""}));
            }} />
            <Inp label="Próximo (fecha)" type="date" value={form.proximaFecha} onChange={F("proximaFecha")} />
            <Inp label="Próximo (km)" type="number" value={form.proximoKm} onChange={F("proximoKm")} />
          </div>
          <Inp label="Detalle / producto usado" value={form.detalle} onChange={F("detalle")} />
          <Inp label="💲 Valor cobrado ($)" type="number" value={form.costo||""} onChange={F("costo")} />
          <Btn onClick={save} style={{ marginTop:4 }}>✅ Guardar — generar tarjeta y enviar WhatsApp</Btn>
        </div>
      </Modal>}

      {/* Modal tarjeta */}
      {tarjetaModal&&<Modal title="🎴 Tarjeta de Servicio" onClose={()=>setTarjetaModal(null)} wide>
        <TarjetaLubrand servicio={tarjetaModal.servicio} cliente={tarjetaModal.cliente} vehiculo={tarjetaModal.vehiculo} />
        <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"center", flexWrap:"wrap" }}>
          <WaBtn tel={tarjetaModal.cliente?.telefono} msg={msgServicio(tarjetaModal.servicio, tarjetaModal.cliente, tarjetaModal.vehiculo)} />
          <Btn color="blue" onClick={()=>setTarjetaModal(null)}>Cerrar</Btn>
        </div>
        <p style={{ color:COLORS.muted, fontSize:11, textAlign:"center", marginTop:10 }}>Sacá una captura de pantalla de la tarjeta para enviarla como imagen por WhatsApp</p>
      </Modal>}
    </div>
  );
}


// ── Turnos ────────────────────────────────────────────────────────────────────
function Turnos({ turnos, setTurnos, clientes, vehiculos }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({});
  const [filtroFecha, setFiltroFecha] = useState(today());
  const SERVICIOS = ["Cambio de aceite","Cambio de filtros","Revisión general","Lubricación","Otro"];
  const ESTADOS = { pendiente:{color:"yellow",label:"Pendiente"}, completado:{color:"green",label:"Completado"}, cancelado:{color:"red",label:"Cancelado"} };
  const F = (k) => e => setForm(f=>({...f,[k]:e.target.value}));
  const save = () => {
    if (!form.fecha||!form.clienteId) return;
    const nuevo = {...form, id:Date.now(), estado:"pendiente", clienteId:Number(form.clienteId), vehiculoId:Number(form.vehiculoId)};
    setTurnos(p=>[...p,nuevo]); setModal(false);
    const c=clientes.find(c=>c.id===Number(form.clienteId))||{};
    const v=vehiculos.find(v=>v.id===Number(form.vehiculoId))||{};
    if (c.telefono) abrirWa(c.telefono, msgTurno(nuevo,c,v));
  };
  const sorted = [...turnos].filter(t=>!filtroFecha||t.fecha===filtroFecha).sort((a,b)=>a.hora.localeCompare(b.hora));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
        <h2 style={{ margin:0, color:COLORS.text }}>📅 Turnos</h2>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input type="date" value={filtroFecha} onChange={e=>setFiltroFecha(e.target.value)} style={{ background:COLORS.inputBg, border:`1px solid ${COLORS.cardBorder}`, borderRadius:8, padding:"8px 12px", color:COLORS.text, fontSize:14, outline:"none" }} />
          <button onClick={()=>setFiltroFecha("")} style={{ background:"none", border:`1px solid ${COLORS.cardBorder}`, borderRadius:8, padding:"8px 10px", color:COLORS.muted, cursor:"pointer", fontSize:12 }}>Todos</button>
          <Btn onClick={()=>{setForm({fecha:filtroFecha||today(),hora:"09:00",clienteId:"",vehiculoId:"",servicio:"Cambio de aceite",notas:""});setModal(true);}}>+ Turno</Btn>
        </div>
      </div>
      {sorted.length===0&&<Card><div style={{ textAlign:"center", color:COLORS.muted, padding:30 }}>No hay turnos.</div></Card>}
      {sorted.map(t=>{ const c=clientes.find(c=>c.id===t.clienteId)||{}; const v=vehiculos.find(v=>v.id===t.vehiculoId)||{}; const est=ESTADOS[t.estado]||ESTADOS.pendiente;
        return <Card key={t.id}>
          <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:COLORS.accent }}>{t.hora}</div>
                <div style={{ fontSize:10, color:COLORS.muted }}>{t.fecha}</div>
              </div>
              <div>
                <div style={{ fontWeight:700, color:COLORS.text }}>{c.nombre}</div>
                <div style={{ color:COLORS.muted, fontSize:13 }}>{v.patente&&`${v.patente} • `}{v.marca} {v.modelo}</div>
                <div style={{ color:COLORS.muted, fontSize:13 }}>{t.servicio}{t.notas&&` — ${t.notas}`}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
              <Badge color={est.color}>{est.label}</Badge>
              <WaBtn tel={c.telefono} msg={msgTurno(t,c,v)} />
              {t.estado==="pendiente"&&<>
                <Btn small color="green" onClick={()=>setTurnos(p=>p.map(x=>x.id===t.id?{...x,estado:"completado"}:x))}>✓</Btn>
                <Btn small color="red" onClick={()=>setTurnos(p=>p.map(x=>x.id===t.id?{...x,estado:"cancelado"}:x))}>✕</Btn>
              </>}
              <Btn small color="red" onClick={()=>setTurnos(p=>p.filter(x=>x.id!==t.id))}>🗑</Btn>
            </div>
          </div>
        </Card>;})}
      {modal&&<Modal title="Nuevo Turno" onClose={()=>setModal(false)}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Inp label="Fecha" type="date" value={form.fecha} onChange={F("fecha")} />
            <Inp label="Hora" type="time" value={form.hora} onChange={F("hora")} />
          </div>
          <Sel label="Cliente" value={form.clienteId} onChange={e=>setForm(f=>({...f,clienteId:e.target.value,vehiculoId:""}))}>
            <option value="">— Seleccionar cliente —</option>
            {clientes.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
          </Sel>
          <Sel label="Vehículo" value={form.vehiculoId} onChange={F("vehiculoId")}>
            <option value="">— Seleccionar vehículo —</option>
            {vehiculos.filter(v=>v.clienteId===Number(form.clienteId)).map(v=><option key={v.id} value={v.id}>{v.patente} — {v.marca} {v.modelo}</option>)}
          </Sel>
          <Sel label="Servicio" value={form.servicio} onChange={F("servicio")}>{SERVICIOS.map(s=><option key={s}>{s}</option>)}</Sel>
          <Inp label="Notas (opcional)" value={form.notas} onChange={F("notas")} />
          <Btn onClick={save} style={{ marginTop:4 }}>Guardar y enviar WhatsApp</Btn>
        </div>
      </Modal>}
    </div>
  );
}

// ── Facturación ───────────────────────────────────────────────────────────────
function Facturacion({ servicios, clientes, vehiculos }) {
  const [filtroMes, setFiltroMes] = useState(today().slice(0,7));
  const filtered = servicios.filter(s=>!filtroMes||s.fecha.startsWith(filtroMes));
  const total = filtered.reduce((a,s)=>a+Number(s.costo||0),0);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 style={{ margin:0, color:COLORS.text }}>💰 Facturación</h2>
        <input type="month" value={filtroMes} onChange={e=>setFiltroMes(e.target.value)} style={{ background:COLORS.inputBg, border:`1px solid ${COLORS.cardBorder}`, borderRadius:8, padding:"8px 12px", color:COLORS.text, fontSize:14, outline:"none" }} />
      </div>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <Card style={{ flex:1 }}><div style={{ color:COLORS.muted, fontSize:13 }}>Total</div><div style={{ fontSize:30, fontWeight:800, color:COLORS.green }}>{fmt$(total)}</div></Card>
        <Card style={{ flex:1 }}><div style={{ color:COLORS.muted, fontSize:13 }}>Servicios</div><div style={{ fontSize:30, fontWeight:800, color:COLORS.accent }}>{filtered.length}</div></Card>
        <Card style={{ flex:1 }}><div style={{ color:COLORS.muted, fontSize:13 }}>Promedio</div><div style={{ fontSize:30, fontWeight:800, color:COLORS.blue }}>{fmt$(filtered.length?Math.round(total/filtered.length):0)}</div></Card>
      </div>
      <Card>
        <div style={{ fontWeight:700, color:COLORS.text, marginBottom:12 }}>Detalle</div>
        {filtered.length===0&&<div style={{ color:COLORS.muted, textAlign:"center", padding:20 }}>Sin registros</div>}
        {[...filtered].sort((a,b)=>b.fecha.localeCompare(a.fecha)).map(s=>{ const v=vehiculos.find(v=>v.id===s.vehiculoId)||{}; const c=clientes.find(c=>c.id===v.clienteId)||{};
          return <div key={s.id} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${COLORS.cardBorder}` }}>
            <div><div style={{ color:COLORS.text, fontSize:14, fontWeight:600 }}>{s.tipo}</div><div style={{ color:COLORS.muted, fontSize:12 }}>{s.fecha} • {c.nombre} • {v.patente}</div></div>
            <div style={{ color:COLORS.green, fontWeight:700 }}>{fmt$(s.costo)}</div>
          </div>;})}
      </Card>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [turnos, setTurnos] = useState([]);

  const TABS = [
    {id:"dashboard",icon:"🏠",label:"Panel"},{id:"clientes",icon:"👥",label:"Clientes"},
    {id:"servicios",icon:"🔧",label:"Servicios"},{id:"turnos",icon:"📅",label:"Turnos"},
    {id:"facturacion",icon:"💰",label:"Facturación"},
  ];
  const alertas = servicios.filter(s=>s.proximaFecha&&daysDiff(s.proximaFecha)<=30).length;

  return (
    <div style={{ minHeight:"100vh", background:COLORS.bg, fontFamily:"'Segoe UI',system-ui,sans-serif", color:COLORS.text }}>
      <div style={{ background:COLORS.card, borderBottom:`1px solid ${COLORS.cardBorder}`, padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width="30" height="34" viewBox="0 0 100 115">
            <path d="M28 5 L28 78 Q28 88 40 88 L78 88 L78 102 Q78 112 66 112 L28 112 Q12 112 12 96 L12 5 Z" fill="#c0392b"/>
            <path d="M28 72 L28 96 Q28 112 44 112 L82 112 Q98 112 98 96 L98 88 Q98 76 84 76 L42 76 Q28 76 28 72 Z" fill="#1ab6d4"/>
          </svg>
          <div>
            <div style={{ fontWeight:800, fontSize:17, color:COLORS.accent }}>LubrandService</div>
            <div style={{ fontSize:11, color:COLORS.muted }}>Lubrand Lubricentro</div>
          </div>
        </div>
        {alertas>0&&<div style={{ background:COLORS.red, color:"#fff", borderRadius:99, padding:"3px 10px", fontSize:12, fontWeight:700 }}>{alertas} alertas</div>}
      </div>
      <div style={{ background:COLORS.card, borderBottom:`1px solid ${COLORS.cardBorder}`, display:"flex", overflowX:"auto" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:"none", border:"none", borderBottom:tab===t.id?`2px solid ${COLORS.accent}`:"2px solid transparent", color:tab===t.id?COLORS.accent:COLORS.muted, padding:"12px 14px", cursor:"pointer", fontWeight:tab===t.id?700:400, fontSize:13, whiteSpace:"nowrap" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"20px 16px 60px" }}>
        {tab==="dashboard"&&<Dashboard clientes={clientes} vehiculos={vehiculos} servicios={servicios} turnos={turnos}/>}
        {tab==="clientes"&&<Clientes clientes={clientes} setClientes={setClientes} vehiculos={vehiculos} setVehiculos={setVehiculos} servicios={servicios}/>}
        {tab==="servicios"&&<Servicios servicios={servicios} setServicios={setServicios} vehiculos={vehiculos} setVehiculos={setVehiculos} clientes={clientes}/>}
        {tab==="turnos"&&<Turnos turnos={turnos} setTurnos={setTurnos} clientes={clientes} vehiculos={vehiculos}/>}

        {tab==="facturacion"&&<Facturacion servicios={servicios} clientes={clientes} vehiculos={vehiculos}/>}
      </div>
    </div>
  );
}
