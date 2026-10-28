import { HERO, ROOM_CARDS, COURSES, TEACHER, CONTACT } from './data'

export default function Overlay({ sections }) {
  const set = (key) => (el) => {
    sections.current[key] = el
  }
  const tel = CONTACT.phone.replace(/\s/g, '')

  return (
    <div className="overlay" data-overlay>
      {/* 0. Kirish */}
      <div className="sec sec-hero" ref={set('hero')}>
        <div className="badge">{HERO.badge}</div>
        <h1>{HERO.title}</h1>
        <p>{HERO.text}</p>
        <small>↓ {HERO.hint}</small>
      </div>

      {/* 1-3. Yangi xonalar: Soft, Market, Logistika */}
      {Object.entries(ROOM_CARDS).map(([key, c]) => (
        <div className={`sec sec-${c.side}`} ref={set(key)} key={key}>
          <div className="card">
            <div className="badge">
              {c.icon} {c.tag}
            </div>
            <div className="card-title big">{c.title}</div>
            <p>{c.text}</p>
            <ul className="list">
              {c.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="stats">
              {c.stats.map((s) => (
                <div key={s.label}>
                  <b>{s.value}</b>
                  <small>{s.label}</small>
                </div>
              ))}
            </div>
            <a className="btn small" href={c.link.href} target="_blank" rel="noreferrer">
              {c.link.label} →
            </a>
          </div>
        </div>
      ))}

      {/* 4. UDS Academy: nimalar bo'ladi */}
      <div className="sec sec-left" ref={set('courses')}>
        <h2>UDS Academy — nimalar bo'ladi?</h2>
        {COURSES.map((c) => (
          <div className="card" key={c.title}>
            <div className="card-title">
              <span>{c.icon}</span> {c.title}
            </div>
            <p>{c.text}</p>
          </div>
        ))}
      </div>

      {/* Ustoz haqida */}
      <div className="sec sec-right" ref={set('teacher')}>
        <div className="card">
          <div className="avatar">{TEACHER.avatar}</div>
          <div className="card-title big">{TEACHER.name}</div>
          <div className="role">{TEACHER.role}</div>
          <p>{TEACHER.bio}</p>
          <div className="tags">
            {TEACHER.skills.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <div className="stats">
            {TEACHER.stats.map((s) => (
              <div key={s.label}>
                <b>{s.value}</b>
                <small>{s.label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aloqa */}
      <div className="sec sec-bottom" ref={set('contact')}>
        <div className="card contact">
          <h2>UDS Group bilan bog'laning</h2>
          <p>📍 {CONTACT.address}</p>
          <p>✉️ {CONTACT.email}</p>
          <div className="btns">
            <a className="btn" href={CONTACT.site} target="_blank" rel="noreferrer">
              🌐 udsgroup.uz
            </a>
            <a className="btn" href={`https://instagram.com/${CONTACT.instagram}`} target="_blank" rel="noreferrer">
              📷 Instagram
            </a>
            <a className="btn" href={`https://t.me/${CONTACT.telegram}`} target="_blank" rel="noreferrer">
              ✈️ Telegram
            </a>
            <a className="btn" href={`tel:${tel}`}>
              📞 {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
