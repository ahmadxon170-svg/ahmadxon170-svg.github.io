import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const required = ['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','ADMIN_PASSWORD','JWT_SECRET'];
for (const key of required) if (!process.env[key]) console.warn(`Missing environment variable: ${key}`);

 const app = express();
app.set('trust proxy', 1);
console.log('SUPABASE HOST:', new URL(process.env.SUPABASE_URL).host);
const db = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');
app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(',') || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120 }));

const asyncRoute = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
const adminOnly = (req,res,next) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (data.role !== 'admin') throw new Error('role');
    next();
  } catch { res.status(401).json({ error: 'Admin ruxsati talab qilinadi.' }); }
};

app.get('/api/health', (_req,res) => res.json({ ok: true, name: 'AHMAD ML META API' }));

app.get('/api/meta', asyncRoute(async (_req,res) => {
  const { data, error } = await db.from('meta_info').select('*').eq('id',1).single();
  if (error) throw error;
  res.json(data);
}));

app.get('/api/heroes', asyncRoute(async (req,res) => {
  let query = db.from('heroes').select('*').order('tier').order('name');
  if (req.query.role) query = query.eq('role', req.query.role);
  if (req.query.tier) query = query.eq('tier', req.query.tier);
  if (req.query.q) query = query.ilike('name', `%${String(req.query.q).slice(0,60)}%`);
  const { data, error } = await query;
  if (error) throw error;
  res.json(data);
}));

app.get('/api/combos', asyncRoute(async (_req,res) => {
  const { data, error } = await db.from('combos').select('*').order('created_at', { ascending:false });
  if (error) throw error;
  res.json(data);
}));

app.post('/api/admin/login', rateLimit({ windowMs: 15*60_000, limit: 8 }), (req,res) => {
  if (!req.body?.password || req.body.password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Parol noto‘g‘ri.' });
  const token = jwt.sign({ role:'admin' }, process.env.JWT_SECRET, { expiresIn:'8h' });
  res.json({ token });
});

app.put('/api/admin/meta', adminOnly, asyncRoute(async (req,res) => {
  const { patch_name, patch_date, notes } = req.body || {};
  if (!patch_name) return res.status(400).json({ error:'Patch nomi kerak.' });
  const { data, error } = await db.from('meta_info')
    .upsert({ id:1, patch_name, patch_date:patch_date || null, notes:notes || '', last_updated:new Date().toISOString() })
    .select().single();
  if (error) throw error;
  res.json(data);
}));

app.post('/api/admin/heroes', adminOnly, asyncRoute(async (req,res) => {
  const h = req.body || {};
  if (!h.name || !h.role || !h.tier) return res.status(400).json({ error:'Qahramon nomi, roli va tieri majburiy.' });
  const payload = cleanHero(h);
  const { data, error } = await db.from('heroes').insert(payload).select().single();
  if (error) throw error;
  res.status(201).json(data);
}));

app.put('/api/admin/heroes/:id', adminOnly, asyncRoute(async (req,res) => {
  const { data, error } = await db.from('heroes').update({ ...cleanHero(req.body), updated_at:new Date().toISOString() }).eq('id',req.params.id).select().single();
  if (error) throw error;
  res.json(data);
}));

app.delete('/api/admin/heroes/:id', adminOnly, asyncRoute(async (req,res) => {
  const { error } = await db.from('heroes').delete().eq('id',req.params.id);
  if (error) throw error;
  res.json({ ok:true });
}));

app.post('/api/admin/combos', adminOnly, asyncRoute(async (req,res) => {
  const c = req.body || {};
  if (!c.title || !Array.isArray(c.hero_ids) || c.hero_ids.length < 2 || c.hero_ids.length > 5)
    return res.status(400).json({ error:'Combo nomi va 2–5 ta qahramon tanlang.' });
  const { data, error } = await db.from('combos').insert({
    title:c.title, description:c.description || '', strategy:c.strategy || '',
    hero_ids:c.hero_ids, difficulty:c.difficulty || 'O‘rta'
  }).select().single();
  if (error) throw error;
  res.status(201).json(data);
}));

function cleanHero(h) {
  const allowedRoles = ['Tank','Fighter','Assassin','Mage','Marksman','Support'];
  const allowedTiers = ['S','A','B','C'];
  if (!allowedRoles.includes(h.role) || !allowedTiers.includes(h.tier)) throw new Error('Role yoki tier noto‘g‘ri.');
  const rate = v => v === '' || v == null ? null : Math.max(0,Math.min(100,Number(v)));
  return {
    name:String(h.name).trim().slice(0,60), role:h.role, lane:String(h.lane || '').slice(0,40),
    tier:h.tier, win_rate:rate(h.win_rate), pick_rate:rate(h.pick_rate), ban_rate:rate(h.ban_rate),
    portrait_url:String(h.portrait_url || '').slice(0,500), description:String(h.description || '').slice(0,1000),
    strengths:Array.isArray(h.strengths)?h.strengths:[], weaknesses:Array.isArray(h.weaknesses)?h.weaknesses:[]
  };
}

app.use((err,_req,res,_next) => {
  console.error(err);
  res.status(500).json({ error:'Server xatosi. Backend loglarini tekshiring.' });
});
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`AHMAD ML META API: http://localhost:${port}`));
