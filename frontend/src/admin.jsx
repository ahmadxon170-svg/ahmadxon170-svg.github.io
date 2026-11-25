 
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

 const API = 'https://ahmad-ml-meta-api.onrender.com/api';

const roles = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

const roleNames = {
  Tank: 'Tank',
  Fighter: 'Jangchi',
  Assassin: 'Qotil',
  Mage: 'Sehrgar',
  Marksman: 'Otuvchi',
  Support: 'Yordamchi'
};

function Admin() {
  const [token, setToken] = useState(
    sessionStorage.getItem('ml-admin') || ''
  );
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');
  const [heroes, setHeroes] = useState([]);

  const [meta, setMeta] = useState({
    patch_name: '',
    patch_date: '',
    notes: ''
  });

  const [form, setForm] = useState({
    name: '',
    role: 'Tank',
    tier: 'S',
    lane: '',
    win_rate: '',
    pick_rate: '',
    ban_rate: '',
    portrait_url: '',
    description: ''
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  async function load() {
    try {
      const [h, m] = await Promise.all([
        fetch(API + '/heroes'),
        fetch(API + '/meta')
      ]);

      if (h.ok) setHeroes(await h.json());

      if (m.ok) {
        const d = await m.json();
        setMeta({
          patch_name: d.patch_name || '',
          patch_date: d.patch_date || '',
          notes: d.notes || ''
        });
      }
    } catch {
      setMsg('Server bilan aloqa yo‘q. Qayta urinib ko‘ring.');
    }
  }

  useEffect(() => {
    if (token) load();
  }, [token]);

  async function login(e) {
    e.preventDefault();

    try {
      const r = await fetch(API + '/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass })
      });

      const d = await r.json();

      if (!r.ok) {
        return setMsg(d.error || 'Kirish amalga oshmadi. Parolni tekshiring.');
      }

      sessionStorage.setItem('ml-admin', d.token);
      setToken(d.token);
      setMsg('Xush kelibsiz! Boshqaruv paneliga kirdingiz.');
    } catch {
      setMsg('Server bilan aloqa yo‘q.');
    }
  }

  async function saveMeta(e) {
    e.preventDefault();

    try {
      const r = await fetch(API + '/admin/meta', {
        method: 'PUT',
        headers,
        body: JSON.stringify(meta)
      });

      const d = await r.json();

      setMsg(
        r.ok
          ? 'Yamoq ma’lumotlari muvaffaqiyatli saqlandi.'
          : d.error || 'Saqlashda xatolik yuz berdi.'
      );
    } catch {
      setMsg('Server bilan aloqa yo‘q.');
    }
  }

  async function addHero(e) {
    e.preventDefault();

    try {
      const r = await fetch(API + '/admin/heroes', {
        method: 'POST',
        headers,
        body: JSON.stringify(form)
      });

      const d = await r.json();

      setMsg(
        r.ok
          ? 'Yangi qahramon qo‘shildi.'
          : d.error || 'Qahramonni qo‘shishda xatolik yuz berdi.'
      );

      if (r.ok) {
        setForm({
          ...form,
          name: '',
          description: ''
        });
        load();
      }
    } catch {
      setMsg('Server bilan aloqa yo‘q.');
    }
  }

  async function del(id) {
    if (!confirm('Ushbu qahramonni o‘chirmoqchimisiz?')) return;

    try {
      const r = await fetch(API + '/admin/heroes/' + id, {
        method: 'DELETE',
        headers
      });

      setMsg(
        r.ok
          ? 'Qahramon o‘chirildi.'
          : 'Qahramonni o‘chirishda xatolik yuz berdi.'
      );

      load();
    } catch {
      setMsg('Server bilan aloqa yo‘q.');
    }
  }

  const field = (label, key, type = 'text') => (
    <label key={key}>
      {label}
      <input
        type={type}
        value={form[key]}
        onChange={e =>
          setForm({ ...form, [key]: e.target.value })
        }
      />
    </label>
  );

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-mark">⚔</span>
          <span>
            AHMAD <b>ML META</b>
            <small>BOSHQARUV PANELI</small>
          </span>
        </a>

        <a className="admin-link" href="/">
          Saytga qaytish
        </a>
      </header>

      <main className="content admin-main">
        <div className="eyebrow">SAYTNI BOSHQARISH</div>

        <h2>
          Admin <em>paneli</em>
        </h2>

        {msg && <div className="notice">{msg}</div>}

        {!token ? (
          <form className="builder login" onSubmit={login}>
            <h3>Admin hisobiga kirish</h3>

            <label>
              Admin paroli
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                required
              />
            </label>

            <button className="primary" type="submit">
              Kirish
            </button>
          </form>
        ) : (
          <>
            <form
              className="builder admin-form"
              onSubmit={saveMeta}
            >
              <h3>Yamoq va meta ma’lumotlari</h3>

              <label>
                Yamoq nomi
                <input
                  value={meta.patch_name}
                  onChange={e =>
                    setMeta({
                      ...meta,
                      patch_name: e.target.value
                    })
                  }
                  required
                />
              </label>

              <label>
                Yamoq sanasi
                <input
                  type="date"
                  value={meta.patch_date || ''}
                  onChange={e =>
                    setMeta({
                      ...meta,
                      patch_date: e.target.value
                    })
                  }
                />
              </label>

              <label>
                Qo‘shimcha izoh
                <textarea
                  value={meta.notes}
                  onChange={e =>
                    setMeta({
                      ...meta,
                      notes: e.target.value
                    })
                  }
                />
              </label>

              <button className="primary" type="submit">
                Yamoq ma’lumotlarini saqlash
              </button>
            </form>

            <form
              className="builder admin-form"
              onSubmit={addHero}
            >
              <h3>Yangi qahramon qo‘shish</h3>

              <div className="admin-fields">
                {field('Qahramon nomi', 'name')}

                <label>
                  Qahramon roli
                  <select
                    value={form.role}
                    onChange={e =>
                      setForm({
                        ...form,
                        role: e.target.value
                      })
                    }
                  >
                    {roles.map(x => (
                      <option key={x} value={x}>
                        {roleNames[x]}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Meta darajasi
                  <select
                    value={form.tier}
                    onChange={e =>
                      setForm({
                        ...form,
                        tier: e.target.value
                      })
                    }
                  >
                    {['S', 'A', 'B', 'C'].map(x => (
                      <option key={x} value={x}>
                        {x} daraja
                      </option>
                    ))}
                  </select>
                </label>

                {field('Yo‘lak (Lane)', 'lane')}
                {field('G‘alaba foizi (%)', 'win_rate', 'number')}
                {field('Tanlash foizi (%)', 'pick_rate', 'number')}
                {field('Taqiqlash foizi (%)', 'ban_rate', 'number')}
                {field('Qahramon rasmi havolasi', 'portrait_url')}
                {field('Qahramon haqida ma’lumot', 'description')}
              </div>

              <button className="primary" type="submit">
                Qahramonni qo‘shish
              </button>
            </form>

            <div className="builder">
              <h3>Mavjud qahramonlar ({heroes.length})</h3>

              {heroes.map(h => (
                <div className="admin-hero" key={h.id}>
                  <b>{h.name}</b>

                  <span>
                    {roleNames[h.role] || h.role} · {h.tier} daraja
                  </span>

                  <button
                    type="button"
                    onClick={() => del(h.id)}
                  >
                    O‘chirish
                  </button>
                </div>
              ))}
            </div>

            <button
              className="secondary logout"
              type="button"
              onClick={() => {
                sessionStorage.removeItem('ml-admin');
                setToken('');
                setMsg('');
              }}
            >
              Hisobdan chiqish
            </button>
          </>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Admin />);
