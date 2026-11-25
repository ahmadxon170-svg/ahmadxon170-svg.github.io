import React, { useEffect, useMemo, useState } from 'react';
import { Search, Sun, Moon, Swords, Shield, Sparkles, Users, RefreshCw, LockKeyhole, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const roles = ['Barchasi','Tank','Fighter','Assassin','Mage','Marksman','Support'];
const fallback = [
 {id:'demo1',name:'Tigreal',role:'Tank',tier:'S',win_rate:54.2,pick_rate:18.1,ban_rate:32.4,description:'Jamoaviy jangni boshlash va raqiblarni nazorat qilish uchun.',portrait_url:''},
 {id:'demo2',name:'Joy',role:'Assassin',tier:'S',win_rate:53.8,pick_rate:12.4,ban_rate:21.6,description:'Harakatchanligi yuqori, orqa chiziqqa kirib boradi.',portrait_url:''},
 {id:'demo3',name:'Valentina',role:'Mage',tier:'A',win_rate:51.7,pick_rate:9.2,ban_rate:7.1,description:'Raqib ultimatesini o‘g‘irlash orqali jangni o‘zgartiradi.',portrait_url:''},
 {id:'demo4',name:'Brody',role:'Marksman',tier:'A',win_rate:51.2,pick_rate:11.3,ban_rate:4.2,description:'Kuchli zarba va xavfsiz masofadan damage.',portrait_url:''},
 {id:'demo5',name:'Terizla',role:'Fighter',tier:'A',win_rate:52.1,pick_rate:8.5,ban_rate:6.8,description:'Jangda chidamli, hududiy nazorat beradi.',portrait_url:''},
 {id:'demo6',name:'Floryn',role:'Support',tier:'B',win_rate:50.4,pick_rate:6.4,ban_rate:2.1,description:'Jamoaga global yordam va tiklanish beradi.',portrait_url:''}
];
function App(){
 const [dark,setDark]=useState(()=>localStorage.getItem('ml-theme')!=='light');
 const [heroes,setHeroes]=useState(fallback),[meta,setMeta]=useState(null),[combos,setCombos]=useState([]);
 const [role,setRole]=useState('Barchasi'),[tier,setTier]=useState('Barchasi'),[q,setQ]=useState('');
 const [selected,setSelected]=useState([]),[tab,setTab]=useState('meta'),[notice,setNotice]=useState('');
 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';localStorage.setItem('ml-theme',dark?'dark':'light')},[dark]);
 useEffect(()=>{load()},[]);
 async function load(){
  try{
   const [h,m,c]=await Promise.all([fetch(`${API}/heroes`),fetch(`${API}/meta`),fetch(`${API}/combos`)]);
   if(h.ok){const d=await h.json();if(d.length)setHeroes(d)}
   if(m.ok)setMeta(await m.json());
   if(c.ok)setCombos(await c.json());
  }catch{setNotice('Demo ma’lumotlari ko‘rsatilmoqda. Backend sozlangach haqiqiy ma’lumotlar yuklanadi.')}
 }
 const visible=useMemo(()=>heroes.filter(h=>(role==='Barchasi'||h.role===role)&&(tier==='Barchasi'||h.tier===tier)&&h.name.toLowerCase().includes(q.toLowerCase())),[heroes,role,tier,q]);
 const chosen=heroes.filter(h=>selected.includes(h.id));
 function toggle(id){setSelected(old=>old.includes(id)?old.filter(x=>x!==id):old.length<5?[...old,id]:old)}
 const tierCount=t=>heroes.filter(h=>h.tier===t).length;
 return <div className="app">
  <header className="topbar"><a className="brand" href="#"><span className="brand-mark"><Swords size={22}/></span><span>AHMAD <b>ML META</b><small>META • COMBO • STRATEGY</small></span></a>
   <nav><button className={tab==='meta'?'nav active':'nav'} onClick={()=>setTab('meta')}>Meta qahramonlar</button><button className={tab==='combo'?'nav active':'nav'} onClick={()=>setTab('combo')}>Combo tuzuvchi</button></nav>
   <div className="top-actions"><button className="icon-btn" title="Rejimni almashtirish" onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button><a className="admin-link" href="/admin.html">Admin <LockKeyhole size={14}/></a></div>
  </header>
  <main>
   <section className="hero-banner"><div className="hero-copy"><div className="eyebrow"><span className="pulse"/> PATCH TRACKER <span>•</span> SEASON META</div><h1>G‘ALABA <em>STRATEGIYADAN</em><br/>BOSHLANADI.</h1><p>Eng dolzarb meta qahramonlarni toping, o‘z jamoangizni yig‘ing va mukammal combo yarating.</p><div className="hero-buttons"><button className="primary" onClick={()=>setTab('meta')}>Meta bilan tanishish <Swords size={17}/></button><button className="secondary" onClick={()=>setTab('combo')}>Combo yaratish <Sparkles size={17}/></button></div></div><div className="hero-art"><div className="orb orb1"/><div className="orb orb2"/><div className="crest"><Swords size={74}/><span>MLBB</span></div><div className="art-label">BUILD YOUR<br/>DREAM TEAM</div></div></section>
   <section className="stats-row"><div className="stat"><span>PATCH</span><strong>{meta?.patch_name||'Meta ma’lumoti'}</strong><small>{meta?.patch_date||'Admin tomonidan yangilanadi'}</small></div><div className="stat"><span>OXIRGI YANGILANISH</span><strong>{meta?.last_updated?new Date(meta.last_updated).toLocaleDateString('uz-UZ'):'Hali kiritilmagan'}</strong><small>Ma’lumotlar bazasi</small></div><div className="stat"><span>QAHRA MONLAR</span><strong>{heroes.length}</strong><small>Ro‘yxatdagi qahramonlar</small></div><div className="stat"><span>COMBO TAVSIYALARI</span><strong>{combos.length}</strong><small>Saqlangan jamoalar</small></div></section>
   {notice&&<div className="notice"><RefreshCw size={15}/>{notice}<button onClick={()=>setNotice('')}><X size={14}/></button></div>}
   {tab==='meta'?<section className="content"><div className="section-head"><div><div className="eyebrow">HERO DATABASE</div><h2>Meta <em>qahramonlar</em></h2><p>Rol va tier bo‘yicha o‘zingizga kerakli qahramonni toping.</p></div><div className="search"><Search size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Qahramon qidirish..."/></div></div>
    <div className="tier-row">{['Barchasi','S','A','B','C'].map(t=><button key={t} className={tier===t?'tier-filter selected':'tier-filter'} onClick={()=>setTier(t)}>{t==='Barchasi'?'Barcha tier':`${t} TIER`} {t!=='Barchasi'&&<small>{tierCount(t)}</small>}</button>)}</div>
    <div className="role-row">{roles.map(r=><button key={r} className={role===r?'role-chip chosen':'role-chip'} onClick={()=>setRole(r)}>{r}</button>)}</div>
    <div className="hero-grid">{visible.map(h=><article className="hero-card" key={h.id}><div className="portrait" style={h.portrait_url?{backgroundImage:`linear-gradient(0deg,rgba(10,15,28,.82),transparent 70%),url("${h.portrait_url}")`}:{}}><span className={`tier-badge tier-${h.tier}`}>{h.tier} TIER</span><span className="role-label">{h.role}</span>{!h.portrait_url&&<div className="portrait-placeholder"><Shield size={38}/><small>HERO</small></div>}</div><div className="hero-info"><div className="hero-name">{h.name}</div><p>{h.description||'Meta ma’lumoti admin tomonidan kiritiladi.'}</p><div className="rates"><div><small>WIN RATE</small><b>{h.win_rate==null?'—':`${h.win_rate}%`}</b></div><div><small>PICK RATE</small><b>{h.pick_rate==null?'—':`${h.pick_rate}%`}</b></div><div><small>BAN RATE</small><b>{h.ban_rate==null?'—':`${h.ban_rate}%`}</b></div></div><button className={selected.includes(h.id)?'select-hero picked':'select-hero'} onClick={()=>toggle(h.id)}>{selected.includes(h.id)?'✓ Tanlandi':'+ Combo ga qo‘shish'}</button></div></article>)}</div>
    {!visible.length&&<div className="empty">Bu filtr bo‘yicha qahramon topilmadi.</div>}
   </section>:<section className="content"><div className="section-head"><div><div className="eyebrow">TEAM BUILDER</div><h2>O‘z <em>combo</em> jamoangizni yarating</h2><p>2 tadan 5 tagacha qahramon tanlang.</p></div><div className="chosen-count"><Users size={18}/><b>{selected.length}/5</b> tanlandi</div></div>
    <div className="builder"><div className="builder-picks">{[0,1,2,3,4].map((n)=><div className="pick-slot" key={n}>{chosen[n]?<><button className="remove" onClick={()=>toggle(chosen[n].id)}>×</button><div className="slot-avatar">{chosen[n].portrait_url?<img src={chosen[n].portrait_url}/>:<Shield/>}</div><b>{chosen[n].name}</b><small>{chosen[n].role}</small></>:<><span className="plus">+</span><small>HERO {n+1}</small></>}</div>)}</div><div className="builder-hint">Qahramonlar ro‘yxatidan “Combo ga qo‘shish” tugmasini bosing. Tanlovingiz shu yerda ko‘rinadi.</div><button className="primary" disabled={selected.length<2} onClick={()=>setNotice('Jamoa tanlandi! Endi strategiya va qarshi tanlovlarni admin kiritgan combo tavsiyalaridan tekshiring.')}>Combo ni tahlil qilish <Sparkles size={16}/></button></div>
    <h3 className="subheading">Admin tavsiya qilgan combo lar</h3><div className="combo-list">{combos.map(c=><article className="combo-card" key={c.id}><div><b>{c.title}</b><p>{c.description}</p><small>{c.difficulty} • {c.strategy}</small></div><span className="combo-icon"><Swords/></span></article>)}{!combos.length&&<div className="empty">Hozircha combo tavsiyalari yo‘q. Admin paneldan qo‘shish mumkin.</div>}</div>
   </section>}
  </main>
  <footer><div className="brand"><span className="brand-mark"><Swords size={18}/></span><span>AHMAD <b>ML META</b><small>COMMUNITY META COMPANION</small></span></div><p>Fanlar tomonidan yaratilgan yordamchi loyiha. Mobile Legends: Bang Bang bilan rasmiy aloqasi yo‘q.</p><span>© {new Date().getFullYear()} AHMAD ML META</span></footer>
 </div>
}
export default App;
