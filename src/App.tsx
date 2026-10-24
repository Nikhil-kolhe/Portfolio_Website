import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion, useMotionValue, useMotionValueEvent, useInView, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Github, Linkedin, Menu, X } from 'lucide-react'
import { profile, experience, education, skills, certifications } from './data/profile'
import { projects, type Project } from './data/projects'

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1]
const soft: [number, number, number, number] = [0.22, 1, 0.36, 1]
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const TBA = <span className="tba">To be added</span>
const sections = [['skills', 'Skills'], ['experience', 'Experience'], ['projects', 'Projects'], ['education', 'Education'], ['credentials', 'Credentials'], ['contact', 'Contact']]

/* ---------- hooks ---------- */
function useTyping(words: string[]) {
  const [text, setText] = useState(reduced() ? words[0] : '')
  useEffect(() => {
    if (reduced()) return
    let w = 0, c = 0, del = false, t = 0
    const tick = () => {
      const word = words[w]; c += del ? -1 : 1; setText(word.slice(0, c))
      let d = del ? 35 : 70
      if (!del && c === word.length) { del = true; d = 1600 } else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 300 }
      t = window.setTimeout(tick, d)
    }
    t = window.setTimeout(tick, 2200)
    return () => clearTimeout(t)
  }, [])
  return text
}
function useSpy() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const f = () => { let cur = ''; for (const [id] of sections) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 160) cur = id } setActive(cur) }
    f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f)
  }, [])
  return active
}

/* ---------- effects ---------- */
/** Slow-drifting star dust. Purely ambient: it does not react to the pointer. */
function Dust() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext('2d')!
    let w = 0, h = 0, raf = 0
    let pts: { x: number; y: number; r: number; s: number; p: number }[] = []
    const size = () => {
      const r = cv.parentElement!.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0)
      pts = Array.from({ length: Math.min(70, Math.floor((w * h) / 16000)) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.3 + 0.3, s: Math.random() * 0.25 + 0.05, p: Math.random() * 6.28 }))
    }
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of pts) {
        p.y -= p.s; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w }
        ctx.fillStyle = `rgba(140,190,255,${0.2 + 0.55 * Math.abs(Math.sin(t / 1400 + p.p))})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill()
      }
      if (!reduced()) raf = requestAnimationFrame(draw)
    }
    size(); raf = requestAnimationFrame(draw)
    window.addEventListener('resize', size)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size) }
  }, [])
  return <canvas ref={ref} className="dust" aria-hidden="true" />
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14 }), sy = useSpring(y, { stiffness: 220, damping: 14 })
  const move = (e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(); x.set((e.clientX - (r.left + r.width / 2)) * 0.22); y.set((e.clientY - (r.top + r.height / 2)) * 0.22) }
  return <motion.span ref={ref} className="mag" style={{ x: sx, y: sy }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0) }}>{children}</motion.span>
}

function Tilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 180, damping: 18 }), sy = useSpring(ry, { stiffness: 180, damping: 18 })
  const move = (e: React.MouseEvent) => {
    if (reduced()) return
    const r = ref.current!.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 7); rx.set(-(py - 0.5) * 7)
  }
  return <motion.div ref={ref} className="tilt" style={{ rotateX: sx, rotateY: sy, transformPerspective: 900 }} onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0) }}>{children}</motion.div>
}

const Rv = ({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: '-70px' }} transition={{ duration: 0.8, delay, ease: soft }}>{children}</motion.div>
)

/* ---------- sections ---------- */
function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false), [hide, setHide] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => { const p = scrollY.getPrevious() ?? 0; setHide(v > p && v > 240) })
  const cta = profile.resumeAvailable
    ? <a className="btn solid sm" href={profile.resumePath} target="_blank" rel="noopener noreferrer">Resume</a>
    : <a className="btn solid sm" href="#contact" onClick={() => setOpen(false)}>Get in touch</a>
  return (
    <motion.header className="nav" animate={{ y: hide && !open ? '-100%' : 0 }} transition={{ duration: 0.4, ease: soft }}>
      <div className="wrap row">
        <a href="#top" className="mark"><svg className="logo" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7cc0ff" /><stop offset="1" stopColor="#2a64f0" /></linearGradient></defs><path d="M12 1.5 21.5 7v10L12 22.5 2.5 17V7z" fill="url(#lg)" /><path d="M8.5 16V8l7 8V8" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>Nikhil Kolhe</a>
        <nav className={open ? 'open' : ''} aria-label="Primary">
          {sections.map(([id, l]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} aria-current={active === id ? 'true' : undefined}>{l}{active === id && <motion.i layoutId="navdot" className="navdot" />}</a>)}
          <span className="navcta-m">{cta}</span>
        </nav>
        <span className="navcta">{cta}</span>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </motion.header>
  )
}

function Hero({ go }: { go: boolean }) {
  const typed = useTyping(['AI & Data Science Engineer', 'LLM application builder', 'Power BI & analytics developer'])
  const words = ['Building', 'AI', 'and', 'data', 'systems', 'that', 'solve', 'problems.']
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.25 })
  const show = go && inView // false again once the hero scrolls away, so the entrance plays every time it returns
  const tr = (t: object) => (show ? t : { duration: 0 })
  return (
    <section id="top" className="hero" ref={ref}>
      <div className="hero-glow" aria-hidden="true" />
      <Dust />
      <div className="wrap heroin">
        <motion.p className="pill" initial={{ opacity: 0, y: 10 }} animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={tr({ delay: 0.1 })}><i />{profile.location} · Open to opportunities</motion.p>
        <h1 aria-label={words.join(' ')}>{words.map((w, i) => (
          <span key={i} className="hw">
            <span className="wmask" aria-hidden="true"><motion.span className={i >= 5 ? 'acc' : ''} initial={{ y: '115%', rotate: 4 }} animate={show ? { y: 0, rotate: 0 } : { y: '115%', rotate: 4 }} transition={tr({ delay: 0.12 + i * 0.07, duration: 0.9, ease: soft })}>{w}&nbsp;</motion.span></span>
            {i === 4 && <br className="brk" />}
          </span>))}</h1>
        <motion.p className="type" initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }} transition={tr({ delay: 0.9 })}><b>&gt;</b><span>{typed}</span><i className="caret" /></motion.p>
        <motion.p className="lead" initial={{ opacity: 0, y: 20 }} animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={tr({ delay: 1, duration: 0.8, ease: soft })}>I’m {profile.name}, {profile.role.toLowerCase()}. {profile.intro}</motion.p>
        <motion.div className="actions" initial={{ opacity: 0, y: 20 }} animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={tr({ delay: 1.15, duration: 0.8, ease: soft })}>
          <Magnetic><a className="btn solid" href="#projects">Explore my work</a></Magnetic>
          {profile.resumeAvailable ? <Magnetic><a className="btn" href={profile.resumePath} target="_blank" rel="noopener noreferrer">View resume</a></Magnetic> : <span className="btn off">Resume (not added)</span>}
          <Magnetic><a className="ico" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={18} /></a></Magnetic>
          {profile.linkedin && <Magnetic><a className="ico" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a></Magnetic>}
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- how I build: glass slabs joined by light ---------- */
const spiral = Array.from({ length: 70 }, (_, i) => { const a = i * 0.46, r = 1.5 + i * 0.36; return [30 + Math.cos(a) * r, 30 + Math.sin(a) * r] })
function Glyph({ k }: { k: number }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 0.9 }
  return (
    <svg className="glyph" viewBox="0 0 60 60" aria-hidden="true">
      {k === 0 && <g {...common}><polygon points="30,5 53,18 53,42 30,55 7,42 7,18" /><path d="M30 5V55M7 18L53 42M53 18L7 42" opacity=".5" />{[[30, 5], [53, 18], [53, 42], [30, 55], [7, 42], [7, 18], [30, 30]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" fill="currentColor" stroke="none" />)}</g>}
      {k === 1 && <g fill="currentColor">{spiral.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={0.5 + (i / 70) * 0.9} opacity={0.35 + (i / 70) * 0.65} />)}</g>}
      {k === 2 && <g {...common}>{[26, 18, 10].map((r) => <polygon key={r} points={[0, 1, 2, 3, 4, 5].map((i) => `${30 + r * Math.cos(Math.PI / 3 * i - Math.PI / 2)},${30 + r * Math.sin(Math.PI / 3 * i - Math.PI / 2)}`).join(' ')} opacity={r === 26 ? 1 : 0.55} />)}<path d="M30 4V56M7.5 17L52.5 43M52.5 17L7.5 43" opacity=".35" /></g>}
      {k === 3 && <g {...common}><path d="M30 6 52 18v24L30 54 8 42V18z" /><path d="M8 18l22 12 22-12M30 30v24" opacity=".6" />{[0, 1, 2, 3].flatMap((a) => [0, 1, 2, 3].map((b) => <circle key={`${a}${b}`} cx={14 + a * 10.5} cy={24 + b * 7 + (a % 2) * 3} r=".9" fill="currentColor" stroke="none" opacity=".7" />))}</g>}
      {k === 4 && <g {...common}>{[0, 1, 2].map((i) => <path key={i} d={`M30 ${10 + i * 12} 52 ${21 + i * 12} 30 ${32 + i * 12} 8 ${21 + i * 12}z`} opacity={1 - i * 0.28} />)}</g>}
    </svg>
  )
}

type Step = { n: string; t: string; d: string[]; note: string; box: [number, number, number, number]; at: [number, number, number] }
const steps: Step[] = [
  { n: '01', t: 'Ingest', d: ['Collect.', 'Clean.', 'Structure.'], note: 'Source data', box: [250, 0, 200, 190], at: [470, 70, 130] },
  { n: '02', t: 'Model', d: ['Prompt.', 'Retrieve.', 'Reason.'], note: 'Augment with LLMs', box: [210, 250, 300, 250], at: [20, 350, 170] },
  { n: '03', t: 'Review', d: ['Score.', 'Verify.', 'Approve.'], note: 'Human in the loop', box: [20, 560, 220, 190], at: [20, 772, 190] },
  { n: '04', t: 'Ship', d: ['Package.', 'Serve.', 'Deliver.'], note: 'Deliver value', box: [330, 600, 220, 190], at: [340, 555, 200] },
  { n: '05', t: 'Learn', d: ['Document.', 'Reuse.', 'Improve.'], note: 'Compound learning', box: [40, 830, 230, 170], at: [310, 905, 220] },
]
const plinks = ['M350 190 V220 H380 V250', 'M300 500 V530 H130 V560', 'M240 655 H285 V695 H330', 'M440 790 V810 H155 V830']
const pct = (v: number, of: number) => `${(v / of) * 100}%`

const Sec = ({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) => (
  <section className="wrap sec"><div id={id} className="sec-anchor" /><Rv><p className="eyebrow">{n}</p><h2>{title}</h2></Rv>{children}</section>
)

function Experience({ onOpen }: { onOpen: (p: Project) => void }) {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  return (
    <ol className="tl" ref={ref}>
      <motion.span className="tlline" style={{ scaleY: scrollYProgress }} />
      {experience.map((e, i) => {
        const worked = e.projects.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is Project => !!p)
        return (
          <motion.li key={e.title} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: '-60px' }} transition={{ duration: 0.7, delay: i * 0.1, ease: soft }}>
            <span className="dotm" /><small>{e.dates}</small><h3>{e.title}</h3><p className="muted">{e.employer}</p>
            <ul>{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            <div className="xp">
              <div className="xpbox">
                <h4>Experience gained</h4>
                {e.gained.length ? <ul>{e.gained.map((g) => <li key={g}>{g}</li>)}</ul> : <p>{TBA}</p>}
              </div>
              <div className="xpbox">
                <h4>Projects worked on</h4>
                {worked.length ? <div className="xpp">{worked.map((p) => (
                  <button key={p.slug} className="xpl" onClick={() => onOpen(p)}><span><b>{p.name}</b><small>{p.kind}</small></span><ArrowUpRight size={15} /></button>))}</div> : <p>{TBA}</p>}
              </div>
            </div>
            {e.tools.length > 0 && <div className="tags">{e.tools.map((t) => <span key={t}>{t}</span>)}</div>}
          </motion.li>)
      })}
    </ol>
  )
}

/* Contact: posts to profile.formEndpoint when set, otherwise opens the visitor's email app. */
function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'mail' | 'error'>('idle')
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget, data = new FormData(form)
    if (data.get('_gotcha')) return
    if (profile.formEndpoint) {
      setState('sending')
      try {
        const r = await fetch(profile.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        if (!r.ok) throw 0
        form.reset(); setState('sent')
      } catch { setState('error') }
    } else if (profile.email) {
      const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio message from ${data.get('name')}`)}&body=${encodeURIComponent(body)}`
      setState('mail')
    } else setState('error')
  }
  return (
    <form className="cform" onSubmit={submit} noValidate={false}>
      <input className="fld" name="name" type="text" placeholder="Your Name" aria-label="Your name" autoComplete="name" required />
      <input className="fld" name="email" type="email" placeholder="Your Email" aria-label="Your email" autoComplete="email" required />
      <textarea className="fld" name="message" placeholder="Your Message" aria-label="Your message" rows={6} required />
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button className="send" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send message'}</button>
      <p className="fstatus" role="status" aria-live="polite">
        {state === 'sent' && 'Thanks, your message was sent.'}
        {state === 'mail' && 'Opening your email app with the message ready to send.'}
        {state === 'error' && (profile.formEndpoint || profile.email ? 'Something went wrong. Please try again or email me directly.' : 'The form is not connected yet: add your email in profile.ts.')}
      </p>
      <p className="direct">Prefer direct email? {profile.email ? <a href={`mailto:${profile.email}`}>{profile.email}</a> : TBA}</p>
    </form>
  )
}

function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const kinds = ['All', ...Array.from(new Set(projects.map((p) => p.kind)))]
  const [f, setF] = useState('All')
  const list = projects.filter((p) => f === 'All' || p.kind === f)
  return (<>
    <Rv className="chips"><div role="group" aria-label="Filter projects" className="chips">{kinds.map((k) => (
      <button key={k} className={f === k ? 'on' : ''} aria-pressed={f === k} onClick={() => setF(k)}>{f === k && <motion.i layoutId="chipbg" className="chipbg" />}<span>{k}</span></button>))}</div></Rv>
    <motion.div className="grid pg" layout>
      <AnimatePresence mode="popLayout">{list.map((p, i) => (
        <motion.article key={p.slug} layout initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.5, delay: i * 0.04, ease: soft }}>
          <Tilt>
            <div className="card proj">
              <div className="prev" aria-hidden="true"><b>{String(i + 1).padStart(2, '0')}</b><span>{p.stack.slice(0, 3).join(' · ')}</span></div>
              <small>{p.kind}</small><h3>{p.name}</h3>
              <p>{p.problem || TBA}</p><p className="muted">{p.built || TBA}</p>
              <div className="tags">{p.stack.map((t) => <span key={t}>{t}</span>)}</div>
              <div className="pl"><button className="lnk" onClick={() => onOpen(p)}>Project story <ArrowUpRight size={14} /></button>
                {p.github && <a className="lnk" href={p.github} target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} /></a>}
                {p.demo && <a className="lnk" href={p.demo} target="_blank" rel="noopener noreferrer">Live demo <ArrowUpRight size={14} /></a>}</div>
            </div>
          </Tilt>
        </motion.article>))}</AnimatePresence>
    </motion.div>
  </>)
}

function Story({ p, onClose }: { p: Project; onClose: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    ref.current?.focus()
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k); document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [])
  const rows: [string, string][] = [['Overview', p.overview], ['The problem', p.problem], ['The objective', p.objective], ['My contribution', p.contribution], ['Technical decisions', p.decisions], ['Challenges and trade-offs', p.challenges], ['Results', p.results], ['Limitations and future work', p.limitations]]
  return (
    <motion.div className="modal" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="sheet" role="dialog" aria-modal="true" aria-label={p.name} onClick={(e) => e.stopPropagation()} initial={{ y: 60, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.45, ease: soft }}>
        <button ref={ref} className="x" aria-label="Close" onClick={onClose}><X size={18} /></button>
        <small>{p.kind}</small><h2>{p.name}</h2>
        {p.confidential && <p className="notice">Employer work: only non-confidential context is shown.</p>}
        {rows.map(([h, t]) => <section key={h}><h3>{h}</h3><p>{t || TBA}</p></section>)}
        <section><h3>Workflow</h3>{p.workflow.length ? <ol>{p.workflow.map((w) => <li key={w}>{w}</li>)}</ol> : <p>{TBA}</p>}</section>
        <section><h3>Technology stack</h3><div className="tags">{p.stack.map((t) => <span key={t}>{t}</span>)}</div></section>
        <div className="pl">{p.github ? <a className="lnk" href={p.github} target="_blank" rel="noopener noreferrer">GitHub repository <ArrowUpRight size={14} /></a> : <span className="muted">No public repository linked.</span>}</div>
      </motion.div>
    </motion.div>
  )
}

function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1900); return () => clearTimeout(t) }, [])
  return (
    <motion.div className="pre" exit={{ y: '-100%' }} transition={{ duration: 0.9, ease }}>
      <div className="pn">{'Hello World!'.split('').map((c, i) => <span key={i} className="pm"><motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: soft }}>{c === ' ' ? ' ' : c}</motion.span></span>)}</div>
      <motion.i className="pbar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease }} />
    </motion.div>
  )
}

export default function App() {
  const rm = useReducedMotion()
  const [loaded, setLoaded] = useState(!!rm)
  const [open, setOpen] = useState<Project | null>(null)
  const [top, setTop] = useState(false)
  const active = useSpy()
  useEffect(() => {
    const h = (e: PageTransitionEvent) => { if (e.persisted) window.location.reload() }
    window.addEventListener('pageshow', h); return () => window.removeEventListener('pageshow', h)
  }, [])
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  useMotionValueEvent(scrollYProgress, 'change', () => setTop(window.scrollY > 700))
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!loaded && <Intro onDone={() => setLoaded(true)} />}</AnimatePresence>
      <motion.div className="progress" style={{ scaleX: bar }} />
      <a className="skip" href="#main">Skip to content</a>
      <Nav active={active} />
      <main id="main">
        <Hero go={loaded} />
        <Sec id="skills" n="01 — What I work with" title="Skills">
          <div className="grid skills-grid">{skills.map((s, i) => (
            <Rv key={s.group} delay={i * 0.06}><div className="card skills-card"><h3>{s.group}</h3><div className="tags">{s.items.map((t) => <motion.span key={t} className={s.exploring ? 'dim' : ''} whileHover={{ y: -3, scale: 1.06 }}>{t}</motion.span>)}</div></div></Rv>))}</div>
        </Sec>
        <Sec id="experience" n="02 — Building with data and AI" title="Professional experience"><Experience onOpen={setOpen} /></Sec>
        <Sec id="projects" n="03 — From ideas to intelligent systems" title="Selected work"><Projects onOpen={setOpen} /></Sec>
        <Sec id="education" n="04 — Where it started" title="Education">
          <div className="grid">{education.map((d, i) => (
            <Rv key={d.degree} delay={i * 0.08}><div className="card"><small>Degree</small><h3>{d.degree}</h3>
              <p className="muted">{d.institution || TBA} · {d.years}</p><p>{d.score}</p>{d.note && <p className="muted">{d.note}</p>}</div></Rv>))}</div>
        </Sec>
        <Sec id="credentials" n="05 — Credentials" title="Certifications & publications">
          {[['Certifications', (c: { type: string }) => !c.type.startsWith('Research')], ['Publications', (c: { type: string }) => c.type.startsWith('Research')]].map(([label, test]) => {
            const list = certifications.filter(test as (c: { type: string }) => boolean)
            return list.length ? (<div key={label as string} className="cgroup"><h3 className="subh">{label as string}</h3>
              <div className="grid">{list.map((c, i) => (
                <Rv key={c.title} delay={i * 0.08}><div className="card"><small>{c.type}</small><h3>{c.title}</h3><p className="muted">{c.issuer}{c.date && ` · ${c.date}`}</p>
                  {c.url ? <a className="lnk" href={c.url} target="_blank" rel="noopener noreferrer">View <ArrowUpRight size={14} /></a> : <p className="muted">Link: {TBA}</p>}</div></Rv>))}</div></div>) : null
          })}
        </Sec>
        <section className="wrap sec">
          <div id="contact" className="sec-anchor" />
          <Rv><h2 className="ctitle">Contact Me</h2></Rv>
          <Rv delay={0.1} className="cwrap"><ContactForm /></Rv>
        </section>
      </main>
      <footer className="wrap foot"><span>© {new Date().getFullYear()} {profile.name}</span><span className="coord">{profile.location}</span></footer>
      <AnimatePresence>{top && <motion.a key="t" className="totop" href="#top" aria-label="Back to top" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><ArrowUp size={18} /></motion.a>}</AnimatePresence>
      <AnimatePresence>{open && <Story key={open.slug} p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </MotionConfig>
  )
}
