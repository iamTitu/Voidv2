"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Plus, Users, Trash2, LogOut, Settings, ChevronRight, ArrowLeft, Clock, Zap, LayoutGrid, UserCheck, Copy, Check, Terminal, X, Save, Send, Unlock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function VoidPanelMaster() {
    const [mounted, setMounted] = useState(false);
    const [settings, setSettings] = useState({ logo_url: '', favicon_url: '', promo_msg: '' });
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
            const r = await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ action: 'get_settings' }), headers: {'Content-Type': 'application/json'}});
            const d = await r.json(); if(d) setSettings(d);
        };
        fetchS();
    }, []);

    const api = async (d) => {
        const r = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
        return await r.json();
    };

    const loadData = async (user) => {
        const target = user || auth.u;
        const data = await api({ action: 'list', username: target });
        setList(Array.isArray(data) ? data : []);
    };

    if (!mounted) return null;

    const isAdm = auth?.r === 'admin';
    const isExpired = (date) => new Date(date) < new Date();
    const themeColor = isAdm ? '#007aff' : '#32d74b';

    const hardCode = `import requests as _r,sys as _s,base64 as _b,subprocess;from colorama import Fore as _f,init;init(autoreset=True)
def _v_():
 u,p=input("User: "),input("Pass: ")
 h=str(subprocess.check_output('wmic csproduct get uuid',shell=True))
 d=_b.b64decode("aHR0cHM6Ly9wcml2YXRlLXBhbmVsLW5pbmUudmVyY2VsLmFwcC9hcGkvYXV0aA==").decode()
 try:
  r=_r.post(d,json={"action":"verify","username":u,"password":p,"hwid":h},timeout=10).json()
  if r.get("success"):print(f"\\n{r.get('promo')}\\n"+_f.GREEN+"✅ GRANTED\\n"+_f.CYAN+f"👤 SELLER: {r.get('seller')}")
  else:_s.exit(_f.RED+f"\\n[-] {r.get('message','EXPIRED')}")
 except:_s.exit("OFFLINE")
_v_()`;

    // Inline Safe Styles
    const inputStyle = { background:'#000', border:'1.5px solid #222', borderRadius:'50px', padding:'14px 25px', color:'#fff', width:'100%', marginBottom:'15px', outline:'none', fontSize:'13px', boxSizing:'border-box' };

    if (!auth.ok) return (
        <div style={{ height:'100vh', background:'#050505', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <Toaster />
            <div style={{ background:'#0a0a0a', border:'1px solid #222', borderRadius:'40px', width:'340px', padding:'50px 35px', textAlign:'center' }}>
                <h1 style={{ fontSize:'24px', fontWeight:900, letterSpacing:'4px', marginBottom:'40px' }}>VOID<span style={{color:'#007aff'}}>PANEL</span></h1>
                <input style={inputStyle} placeholder="IDENTITY ID" onChange={e=>setForm({...form, u: e.target.value})} />
                <input style={inputStyle} type="password" placeholder="ACCESS KEY" onChange={e=>setForm({...form, p: e.target.value})} />
                <button style={{ background:'#007aff', color:'#fff', border:'none', borderRadius:'50px', padding:'15px', width:'100%', fontWeight:800, cursor:'pointer' }} onClick={async ()=>{
                    const res = await api({ action: 'login', username: form.u, password: form.p });
                    if(res?.success){ setAuth({ok:true, u:res.user, r:res.role}); loadData(res.user); }
                    else toast.error("Access Denied");
                }}>INITIALIZE</button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight:'100vh', background:'#0a0a0b', color:'#fff' }}>
            <Head><link rel="icon" href={settings.favicon_url} /></Head>
            <Toaster />
            <nav style={{ height:'65px', background:'#111', borderBottom:'1px solid #222', display:'flex', alignItems:'center', position:'sticky', top:0, zIndex:100 }}>
                <div style={{ width:'100%', maxWidth:'1100px', margin:'0 auto', padding:'0 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontWeight:800, fontSize:'18px' }}>VOID | <span style={{ color: themeColor }}>{auth.r.toUpperCase()}</span></div>
                    <div style={{ display:'flex', alignItems:'center', gap:'15px' }}>
                        <div style={{ background:'#1a1a1a', padding:'6px 16px', borderRadius:'50px', fontSize:'11px', color:'#666' }}>{auth.u}</div>
                        {isAdm && <Settings onClick={()=>setShowSettings(!showSettings)} size={18} style={{cursor:'pointer'}} />}
                        <LogOut onClick={()=>window.location.reload()} size={18} style={{color:'#ff3b30', cursor:'pointer'}} />
                    </div>
                </div>
            </nav>

            <main style={{ padding:'30px 20px', maxWidth:'1100px', margin:'0 auto' }}>
                <AnimatePresence>
                    {showSettings && isAdm && (
                        <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} style={{overflow:'hidden', marginBottom:'25px'}}>
                            <div style={{background:'#111', border:'1px solid #222', borderRadius:'30px', padding:'25px'}}>
                                <input style={inputStyle} placeholder="PROMO MSG" value={settings.promo_msg} onChange={e=>setSettings({...settings, promo_msg: e.target.value})} />
                                <button style={{ background:themeColor, color:'#000', border:'none', borderRadius:'50px', padding:'10px 30px', fontWeight:800, cursor:'pointer'}} onClick={async ()=>{await api({action:'update_settings',...settings}); toast.success('Saved'); setShowSettings(false);}}>SAVE CHANGES</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{display:'flex', background:'#111', padding:'6px', borderRadius:'50px', width:'fit-content', margin:'0 auto 40px', border:'1px solid #222'}}>
                    <button onClick={()=>setView('home')} style={{background:view==='home'?'#fff':'none', color:view==='home'?'#000':'#555', border:'none', padding:'10px 25px', borderRadius:'50px', fontWeight:700, cursor:'pointer'}}>TERMINAL</button>
                    {isAdm && <button onClick={()=>setView('resellers')} style={{background:view==='resellers'?'#fff':'none', color:view==='resellers'?'#000':'#555', border:'none', padding:'10px 25px', borderRadius:'50px', fontWeight:700, cursor:'pointer'}}>RESELLERS</button>}
                    <button onClick={()=>setView('users')} style={{background:view==='users'?'#fff':'none', color:view==='users'?'#000':'#555', border:'none', padding:'10px 25px', borderRadius:'50px', fontWeight:700, cursor:'pointer'}}>ACTIVE</button>
                    <button onClick={()=>setView('expired')} style={{background:view==='expired'?'#ff3b30':'none', color:view==='expired'?'#fff':'#555', border:'none', padding:'10px 25px', borderRadius:'50px', fontWeight:700, cursor:'pointer'}}>EXPIRED</button>
                </div>

                <div style={{display:'flex', flexWrap:'wrap-reverse', gap:'30px'}}>
                    <section style={{flex:2, minWidth:'320px'}}>
                        <div style={{background:'#111', border:'1px solid #222', borderRadius:'40px', padding:'35px'}}>
                            {view === 'home' ? (
                                <div>
                                    <div style={{fontSize:'10px', fontWeight:900, color:'#333', marginBottom:'20px', letterSpacing:'3px'}}>ENCRYPTED HOOK</div>
                                    <div style={{background:'#000', padding:'20px', borderRadius:'30px', border:'1px solid #1a1a1a', position:'relative'}}>
                                        <pre style={{fontSize:'10px', color:'#444', overflowX:'auto', margin:0, lineHeight:1.7}}>{hardCode}</pre>
                                        <button onClick={()=>{navigator.clipboard.writeText(hardCode); toast.success("Copied!"); setCopied(true); setTimeout(()=>setCopied(false),2000)}} style={{position:'absolute', top:'10px', right:'10px', background:'#1a1a1a', border:'1px solid #333', color:'#fff', padding:'6px 12px', borderRadius:'10px', cursor:'pointer'}}>{copied ? <Check size={14}/> : <Copy size={14}/>}</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{fontSize:'10px', fontWeight:900, color:'#333', marginBottom:'20px', letterSpacing:'3px'}}>{view.toUpperCase()} LIST</div>
                                    {list.filter(u => {
                                        if(view==='resellers') return u.role==='reseller';
                                        if(view==='users') return u.role==='user' && !isExpired(u.expiry_date);
                                        if(view==='expired') return isExpired(u.expiry_date);
                                        return true;
                                    }).map((u, i) => (
                                        <div key={i} style={{background:'rgba(255,255,255,0.02)', padding:'15px 25px', borderRadius:'60px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                                            <div onClick={() => u.role === 'reseller' && (setSelectedReseller(u.username), api({action:'list', username:u.username}).then(d=>{setSubList(d); setView('detail');}))} style={{cursor:u.role==='reseller'?'pointer':'default'}}>
                                                <span style={{fontWeight:800}}>{u.username}</span>
                                                <span style={{fontSize:'9px', padding:'2px 8px', border:'1px solid #333', borderRadius:'50px', marginLeft:'10px'}}>{u.role}</span>
                                            </div>
                                            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                                                <Unlock onClick={()=>{if(confirm('Reset HWID?')) api({action:'reset_hwid', username:u.username}).then(()=>toast.success("Unlocked"))}} size={16} color="#32d74b" style={{cursor:'pointer'}} />
                                                <Clock onClick={()=>{const d=prompt("Add Days?"); if(d) api({action:'change_expiry', username:u.username, new_days:d}).then(()=>loadData())}} size={16} color="#ff9f0a" style={{cursor:'pointer'}} />
                                                <Trash2 onClick={()=>{if(confirm('Delete?')) api({action:'delete', username:u.username}).then(()=>loadData())}} size={16} color="#ff3b30" style={{cursor:'pointer'}} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {view === 'detail' && (
                                <div>
                                    <button onClick={()=>setView('resellers')} style={{background:'#1a1a1a', border:'1px solid #333', color:'#fff', width:'45px', height:'45px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', marginBottom:'20px'}}><ArrowLeft size={18}/></button>
                                    <div style={{fontSize:'10px', fontWeight:900, color:'#32d74b', marginBottom:'20px'}}>USERS OF: {selectedReseller}</div>
                                    {subList.map((su, i) => (
                                        <div key={i} style={{background:'rgba(255,255,255,0.02)', padding:'18px 25px', borderRadius:'60px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                                            <span style={{fontWeight:800}}>{su.username}</span>
                                            <Trash2 onClick={()=>api({action:'delete', username:su.username}).then(()=>api({action:'list', username:selectedReseller}).then(setSubList))} size={16} color="#ff3b30" style={{cursor:'pointer'}} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside style={{flex:1, minWidth:'300px', maxWidth:'350px'}}>
                        <div style={{background:'#111', border:'1px solid #222', borderRadius:'40px', padding:'30px'}}>
                            <div style={{fontSize:'10px', fontWeight:900, color:'#333', marginBottom:'20px', letterSpacing:'3px'}}>SPAWN ENTITY</div>
                            <input style={inputStyle} value={form.nu} placeholder="Identity ID" onChange={e=>setForm({...form, nu: e.target.value})} />
                            <input style={inputStyle} value={form.np} placeholder="Secure Pass" onChange={e=>setForm({...form, np: e.target.value})} />
                            <div style={{display:'flex', gap:'10px'}}>
                                <select style={{...inputStyle, padding:'10px 15px'}} value={form.nr} onChange={e=>setForm({...form, nr: e.target.value})}>
                                    <option value="user">USER</option>
                                    {isAdm && <option value="reseller">RESELLER</option>}
                                </select>
                                <input style={inputStyle} value={form.nd} type="number" placeholder="Days" onChange={e=>setForm({...form, nd: e.target.value})} />
                            </div>
                            <button style={{...st.btn(themeColor), background:`linear-gradient(135deg, ${themeColor}, #0f172a)`, color:'#fff'}} onClick={async ()=>{
                                if(!form.nu || !form.np || !form.nd) return toast.error("Intel Missing");
                                const res = await api({action:'add', ...form, created_by: auth.u, username: form.nu, password: form.np, role: form.nr, expiry_days: form.nd});
                                if(res.success){ toast.success('Spawned'); loadData(); setForm({...form, nu:'', np:'', nd:''}); }
                            }}>SPAWN NOW</button>
                        </div>
                        <div style={{background:'rgba(0,136,204,0.02)', border:'1px solid rgba(0,136,204,0.1)', borderRadius:'35px', padding:'25px', marginTop:'25px', textAlign:'center'}}>
                            <p style={{fontSize:'11px', color:'#555', marginBottom:'15px'}}>Official Void Update Hub</p>
                            <a href="https://t.me/TheVoidBase" target="_blank" style={{background:'#0088cc', color:'#fff', textDecoration:'none', padding:'12px', borderRadius:'50px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', fontWeight:800, fontSize:'11px'}}>JOIN CHANNEL <Send size={14}/></a>
                        </div>
                    </aside>
                </div>
                <footer style={{textAlign:'center', marginTop:'80px', color:'#1a1a1b', fontSize:'10px', fontWeight:900, letterSpacing:'6px'}}>VOID PANEL V2 • BY @SARVESH</footer>
            </main>
        </div>
    );
                                     }
