"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Plus, Users, Trash2, LogOut, Settings, ChevronRight, ArrowLeft, Clock, Zap, LayoutGrid, UserCheck, Copy, Check, Terminal, X, Save, Send, Unlock, ShieldCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function VoidV2Final() {
    const [mounted, setMounted] = useState(false);
    const [settings, setSettings] = useState({ logo_url: '', favicon_url: '', promo_msg: '', dash_bg: '' });
    const [auth, setAuth] = useState({ ok: false, u: '', r: '' });
    const [view, setView] = useState('home'); 
    const [list, setList] = useState([]); 
    const [subList, setSubList] = useState([]);
    const [selectedReseller, setSelectedReseller] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState({ nu: '', np: '', nr: 'user', nd: '' });

    useEffect(() => { 
        setMounted(true); 
        const fetchS = async () => {
            try {
                const r = await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ action: 'get_settings' }), headers: {'Content-Type': 'application/json'}})
                const d = await r.json(); if(d) setSettings(d);
            } catch (e) {}
        };
        fetchS();
    }, []);

    const api = async (d) => {
        try {
            const r = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
            return await r.json();
        } catch (e) { return { success: false }; }
    };

    const loadData = async (user) => {
        const target = user || auth.u;
        if (!target) return;
        const data = await api({ action: 'list', username: target });
        setList(Array.isArray(data) ? data : []);
    };

    if (!mounted) return null;

    // --- VARIABLES & THEME ---
    const isAdm = auth?.r === 'admin';
    const isExpired = (date) => new Date(date) < new Date();
    const themeColor = isAdm ? '#007aff' : '#32d74b';

    // --- FORCE INLINE STYLES (Fixes st is not defined) ---
    const inputStyle = { background: '#000', border: '1.5px solid #222', borderRadius: '50px', padding: '14px 25px', color: '#fff', width: '100%', marginBottom: '15px', outline: 'none', fontSize: '13px', boxSizing: 'border-box', WebkitAppearance: 'none' };
    const btnBaseStyle = { border: 'none', borderRadius: '50px', padding: '15px 30px', fontWeight: '900', fontSize: '11px', letterSpacing: '1px', cursor: 'pointer', transition: '0.3s', display: 'block', width: '100%' };

    const hardCode = `import requests,sys,base64,subprocess;from colorama import init,Fore;init(autoreset=True)
def _get_h_():
 try: return str(subprocess.check_output('wmic csproduct get uuid', shell=True))
 except: return "N/A"
def _void_():
 u,p=input("User: "),input("Pass: ")
 h=_get_h_()
 d=base64.b64decode("aHR0cHM6Ly9wcml2YXRlLXBhbmVsLW5pbmUudmVyY2VsLmFwcC9hcGkvYXV0aA==").decode()
 try:
  r=requests.post(d,json={"action":"verify","username":u,"password":p,"hwid":h},timeout=10).json()
  if r.get("success"):
   print(Fore.CYAN+f"\\n{r.get('promo')}\\n"+Fore.GREEN+"✅ GRANTED\\n"+Fore.WHITE+f"👤 SELLER: {r.get('seller')}")
  else:sys.exit(Fore.RED+f"\\n[-] {r.get('message','EXPIRED')}")
 except:sys.exit("OFFLINE")
_void_()`;

    // --- LOGIN UI ---
    if (!auth.ok) return (
        <div className="gate">
            <Toaster />
            <div style={{ background: 'rgba(15,15,15,0.7)', border: '1px solid #1f2937', borderRadius: '45px', width: '340px', padding: '50px 35px', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '3px', marginBottom: '10px' }}>VOID<span style={{ color: '#007aff' }}>PANEL</span></h1>
                <p style={{ fontSize: '9px', color: '#4b5563', marginBottom: '35px', textTransform: 'uppercase' }}>Identity Verification</p>
                <input style={inputStyle} placeholder="IDENTITY ID" onChange={e => setForm({ ...form, u: e.target.value })} />
                <input style={inputStyle} type="password" placeholder="ACCESS KEY" onChange={e => setForm({ ...form, p: e.target.value })} />
                <button style={{ ...btnBaseStyle, background: '#007aff', color: '#fff' }} onClick={async () => {
                    const res = await api({ action: 'login', username: form.u, password: form.p });
                    if (res?.success) { setAuth({ ok: true, u: res.user, r: res.role }); loadData(res.user); }
                    else toast.error("Access Denied");
                }}>INITIALIZE</button>
            </div>
            <style jsx global>{`
                body { margin:0; background:#0a0a0b; font-family:'Inter', sans-serif; }
                .gate { height:100vh; display:flex; align-items:center; justify-content:center; background:radial-gradient(circle at 0% 0%, #1a1a1a, #0a0a0b); }
                input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px #000 inset !important; -webkit-text-fill-color: white !important; }
            `}</style>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0b', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
            <Head><link rel="icon" href={settings.favicon_url} /></Head>
            <Toaster />
            
            {/* HEADER */}
            <nav style={{ height: '65px', background: 'rgba(15,15,15,0.7)', backdropFilter: 'blur(30px)', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '18px' }}>VOID | <span style={{ color: themeColor }}>{auth.r.toUpperCase()}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ background: '#111', padding: '6px 16px', borderRadius: '50px', fontSize: '11px', color: '#6b7280', border: '1px solid #1f2937' }}>{auth.u}</div>
                        {isAdm && <Settings onClick={() => setShowSettings(!showSettings)} size={18} style={{ cursor: 'pointer' }} />}
                        <LogOut onClick={() => window.location.reload()} size={18} style={{ color: '#ff453a', cursor: 'pointer' }} />
                    </div>
                </div>
            </nav>

            <main style={{ padding: '30px 20px', maxWidth: '1100px', margin: '0 auto' }}>
                <AnimatePresence>
                    {showSettings && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden', marginBottom: '25px' }}>
                            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '30px', padding: '25px' }}>
                                <input style={inputStyle} placeholder="PROMO MESSAGE" value={settings.promo_msg} onChange={e => setSettings({ ...settings, promo_msg: e.target.value })} />
                                <button style={{ ...btnBaseStyle, background: themeColor, color: '#000', width: 'auto', padding: '10px 30px' }} onClick={async () => { await api({ action: 'update_settings', ...settings }); toast.success('Synced'); setShowSettings(false); }}>SAVE CHANGES</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* TABS */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '50px', width: 'fit-content', margin: '0 auto 40px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => setView('home')} style={{ background: view === 'home' ? '#fff' : 'none', color: view === 'home' ? '#000' : '#6b7280', border: 'none', padding: '10px 24px', borderRadius: '50px', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>TERMINAL</button>
                    {isAdm && <button onClick={() => setView('resellers')} style={{ background: view === 'resellers' ? '#fff' : 'none', color: view === 'resellers' ? '#000' : '#6b7280', border: 'none', padding: '10px 24px', borderRadius: '50px', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>RESELLERS</button>}
                    <button onClick={() => setView('users')} style={{ background: view === 'users' ? '#fff' : 'none', color: view === 'users' ? '#000' : '#6b7280', border: 'none', padding: '10px 24px', borderRadius: '50px', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>ACTIVE</button>
                    <button onClick={() => setView('expired')} style={{ background: view === 'expired' ? '#ff453a' : 'none', color: view === 'expired' ? '#fff' : '#6b7280', border: 'none', padding: '10px 24px', borderRadius: '50px', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>EXPIRED</button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap-reverse', gap: '30px' }}>
                    {/* LIST AREA */}
                    <section style={{ flex: 2, minWidth: '320px' }}>
                        <div style={{ background: 'rgba(15,15,15,0.7)', border: '1px solid #1f2937', borderRadius: '40px', padding: '35px', minHeight: '400px' }}>
                            <AnimatePresence mode="wait">
                                {view === 'home' ? (
                                    <motion.div key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <div style={{ fontSize: '11px', fontWeight: 900, color: '#374151', marginBottom: '25px', letterSpacing: '3px', textTransform: 'uppercase' }}>ENCRYPTED HOOK</div>
                                        <div style={{ background: '#000', padding: '25px', borderRadius: '30px', border: '1px solid #111', position: 'relative' }}>
                                            <pre style={{ fontSize: '10px', color: '#4b5563', overflowX: 'auto', margin: 0, lineHeight: 1.7, fontFamily: 'monospace' }}>{hardCode}</pre>
                                            <button onClick={() => { navigator.clipboard.writeText(hardCode); toast.success("Copied"); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ position: 'absolute', top: '15px', right: '15px', background: '#111', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}>
                                                {copied ? <Check size={14} color="#32d74b" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <div style={{ fontSize: '11px', fontWeight: 900, color: '#374151', marginBottom: '25px', letterSpacing: '3px' }}>{view.toUpperCase()} RECORDS</div>
                                        {(list || []).filter(u => {
                                            if (view === 'resellers') return u.role === 'reseller';
                                            if (view === 'users') return u.role === 'user' && !isExpired(u.expiry_date);
                                            if (view === 'expired') return isExpired(u.expiry_date);
                                            return true;
                                        }).map((u, i) => (
                                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '18px 28px', borderRadius: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', border: '1px solid transparent' }}>
                                                <div onClick={() => u.role === 'reseller' && (setSelectedReseller(u.username), api({ action: 'list', username: u.username }).then(d => { setSubList(d); setView('detail'); }))} style={{ cursor: u.role === 'reseller' ? 'pointer' : 'default' }}>
                                                    <span style={{ fontWeight: 800, fontSize: '15px' }}>{u.username}</span>
                                                    <span style={{ fontSize: '9px', fontWeight: 900, padding: '3px 12px', border: '1px solid #1f2937', color: themeColor, borderRadius: '50px', marginLeft: '12px', textTransform: 'uppercase' }}>{u.role}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                    <span style={{ fontSize: '12px', color: isExpired(u.expiry_date) ? '#ff453a' : '#4b5563', fontWeight: 800 }}>{new Date(u.expiry_date).toLocaleDateString()}</span>
                                                    <Unlock onClick={(e) => { e.stopPropagation(); if (confirm('Reset HWID?')) api({ action: 'reset_hwid', username: u.username }).then(() => toast.success("Unlocked")) }} size={16} color="#32d74b" style={{ cursor: 'pointer' }} />
                                                    <Clock onClick={(e) => { e.stopPropagation(); const d = prompt("Days?"); if (d) api({ action: 'change_expiry', username: u.username, new_days: d }).then(() => loadData()) }} size={16} color="#ff9f0a" style={{ cursor: 'pointer' }} />
                                                    <Trash2 onClick={(e) => { e.stopPropagation(); if (confirm('Delete?')) api({ action: 'delete', username: u.username }).then(()=>loadData()) }} size={16} color="#ff453a" style={{ cursor: 'pointer' }} />
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                                {view === 'detail' && (
                                    <motion.div key="d" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                                        <button onClick={() => setView('resellers')} style={{ background: '#111', border: '1px solid #333', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '20px' }}><ArrowLeft size={20}/></button>
                                        <div style={{ fontSize: '11px', fontWeight: 900, color: '#374151', marginBottom: '25px', letterSpacing: '3px' }}>SUB-ENTITIES: {selectedReseller}</div>
                                        {(subList || []).map((su, i) => (
                                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '18px 28px', borderRadius: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                                <div><span style={{ fontWeight: 800 }}>{su.username}</span><span style={{ fontSize: '10px', color: '#444', marginLeft: '10px' }}>{su.password}</span></div>
                                                <Trash2 onClick={() => api({ action: 'delete', username: su.username }).then(() => api({ action: 'list', username: selectedReseller }).then(setSubList))} size={16} color="#ff453a" style={{ cursor: 'pointer' }} />
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* SPAWN AREA (RIGHT SIDE) */}
                    <aside style={{ flex: 1, minWidth: '300px', maxWidth: '350px' }}>
                        <div style={{ background: 'rgba(15,15,15,0.7)', border: '1px solid #1f2937', borderRadius: '45px', padding: '35px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 900, color: '#374151', marginBottom: '25px', letterSpacing: '3px', textTransform: 'uppercase' }}>SPAWN ENTITY</div>
                            <input style={inputStyle} value={form.nu} placeholder="Identity Name" onChange={e => setForm({ ...form, nu: e.target.value })} />
                            <input style={inputStyle} value={form.np} placeholder="Secure Pass" onChange={e => setForm({ ...form, np: e.target.value })} />
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                                <select style={{ ...inputStyle, padding: '10px 20px', marginBottom: 0 }} value={form.nr} onChange={e => setForm({ ...form, nr: e.target.value })}>
                                    <option value="user">USER</option>
                                    {isAdm && <option value="reseller">RESELLER</option>}
                                </select>
                                <input style={{ ...inputStyle, marginBottom: 0 }} value={form.nd} type="number" placeholder="Days" onChange={e => setForm({ ...form, nd: e.target.value })} />
                            </div>
                            <button className="rainbow-ghost-btn" onClick={async () => {
                                if (!form.nu || !form.np || !form.nd) return toast.error("Intel Missing");
                                const res = await api({ action: 'add', ...form, created_by: auth.u, username: form.nu, password: form.np, role: form.nr, expiry_days: form.nd });
                                if (res.success) { toast.success('Spawned'); loadData(); setForm({ ...form, nu: '', np: '', nd: '' }); }
                            }}>SPAWN NOW</button>
                        </div>
                        <div style={{background:'rgba(0,136,204,0.05)', border:'1px solid rgba(0,136,204,0.1)', borderRadius:'35px', padding:'25px', marginTop:'20px', textAlign:'center'}}>
                            <p style={{fontSize:'10px', color:'#555', marginBottom:'12px', fontWeight:800}}>THE VOID UPDATE HUB</p>
                            <a href="https://t.me/TheVoidBase" target="_blank" style={{background:'#0088cc', color:'#fff', textDecoration:'none', padding:'10px', borderRadius:'50px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', fontWeight:800, fontSize:'11px'}}>JOIN CHANNEL <Send size={14}/></a>
                        </div>
                    </aside>
                </div>
                <footer style={{ textAlign: 'center', marginTop: '80px', color: '#1a1a1b', fontSize: '10px', fontWeight: 900, letterSpacing: '6px' }}>VOID PANEL V2 • BY @SARVESH</footer>
            </main>
            <style jsx global>{`
                .rainbow-ghost-btn {
                    background: transparent !important;
                    border: 2.5px solid #007aff !important;
                    color: #fff !important;
                    padding: 15px !important;
                    border-radius: 50px !important;
                    width: 100% !important;
                    font-weight: 900 !important;
                    font-size: 11px !important;
                    letter-spacing: 1px !important;
                    cursor: pointer !important;
                    animation: rainbow-anim 4s linear infinite !important;
                }
                @keyframes rainbow-anim {
                    0% { border-color: #007aff; color: #007aff; }
                    33% { border-color: #a855f7; color: #a855f7; }
                    66% { border-color: #32d74b; color: #32d74b; }
                    100% { border-color: #007aff; color: #007aff; }
                }
                input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px #0a0a0b inset !important; -webkit-text-fill-color: white !important; transition: background-color 5000s ease-in-out 0s; }
            `}</style>
        </div>
    );
        }
