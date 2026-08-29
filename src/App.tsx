import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CloudCog,
  Cpu,
  Globe2,
  Mail,
  Menu,
  Sparkles,
  UsersRound,
  Wrench,
  X,
} from 'lucide-react'
import './App.css'

const services = [
  { icon: Cpu, number: '01', title: 'AI & Custom Software', description: 'Intelligent software systems, automation platforms, and custom applications designed around your operations.' },
  { icon: CloudCog, number: '02', title: 'Cloud & Transformation', description: 'Cloud-native applications, IT consulting, and digital transformation that help your business scale with confidence.' },
  { icon: Wrench, number: '03', title: 'Application Support', description: 'Dependable application support and maintenance that keeps critical systems available, secure, and effective.' },
  { icon: UsersRound, number: '04', title: 'HR & Workforce Solutions', description: 'Recruitment, staffing, payroll, compliance, HR consulting, and training for modern organizations.' },
]

const strengths = [
  'Technology and software companies',
  'Manufacturing and engineering',
  'Healthcare and life sciences',
  'Retail, e-commerce, startups, and SMEs',
]

type View = 'home' | 'about' | 'services' | 'industries' | 'contact'
type SubmitStatus = 'idle' | 'sending' | 'success' | 'activation' | 'error'

const views: View[] = ['home', 'about', 'services', 'industries', 'contact']

function viewFromHash(): View {
  const hash = window.location.hash.slice(1)
  return views.includes(hash as View) ? hash as View : 'home'
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [activeView, setActiveView] = useState<View>(viewFromHash)

  useEffect(() => {
    const handleHashChange = () => setActiveView(viewFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (view: View) => {
    setActiveView(view)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '')
    const email = String(formData.get('email') ?? '')
    const message = String(formData.get('message') ?? '')
    const whatsappMessage = encodeURIComponent(
      `Hello C&K Global,\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
    )

    setSubmitStatus('sending')
    setWhatsappUrl(`https://wa.me/919985727179?text=${whatsappMessage}`)

    try {
      const response = await fetch('https://formsubmit.co/ajax/support@ckglobals.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `New website enquiry from ${name}`,
          _template: 'table',
        }),
      })

      const result = await response.json() as { success?: boolean | string, message?: string }

      if (!response.ok) {
        throw new Error('Unable to submit enquiry')
      }

      if (result.success !== true && result.success !== 'true') {
        if (result.message?.toLowerCase().includes('activation')) {
          setSubmitStatus('activation')
          return
        }
        throw new Error(result.message || 'Unable to submit enquiry')
      }

      setSubmitStatus('success')
      form.reset()
    } catch {
      setSubmitStatus('error')
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="C and K Global home" onClick={() => navigate('home')}>
          <img className="brand-mark" src="/logo.png" alt="" />
          <span className="brand-copy"><strong>C&K Global</strong><small>Solutions OPC Pvt Ltd</small></span>
        </a>
        <button className="menu-button" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
          <a href="#home" onClick={() => navigate('home')}>Home</a>
          <a href="#about" onClick={() => navigate('about')}>About</a>
          <a href="#services" onClick={() => navigate('services')}>Services</a>
          <a href="#industries" onClick={() => navigate('industries')}>Industries</a>
          <a className="nav-cta" href="#contact" onClick={() => navigate('contact')}>Let&apos;s talk <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main id="top">
        <section className={activeView === 'home' ? 'hero-section' : 'hero-section is-hidden'}>
          <img className="hero-image" src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=88" alt="Modern collaborative office prepared for a strategic workshop" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow"><Sparkles size={15} /> Intelligent systems. Human expertise.</p>
            <h1>AI-enabled software & enterprise solutions.</h1>
            <p className="hero-lead">We build intelligent software systems, automation platforms, cloud-native applications, and scalable digital solutions for modern businesses.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact" onClick={() => navigate('contact')}>Book a consultation <ArrowRight size={18} /></a>
              <a className="text-link" href="#services" onClick={() => navigate('services')}>Explore services <ChevronRight size={18} /></a>
            </div>
          </div>
          <div className="hero-proof" aria-label="Company highlights">
            <div><strong>AI-enabled</strong><span>Technology</span></div>
            <div><strong>IT + HR</strong><span>Expertise</span></div>
            <div><strong>Scalable</strong><span>Delivery</span></div>
          </div>
        </section>

        <section className={activeView === 'about' ? 'intro-section section section-view' : 'intro-section section is-hidden'} id="about">
          <div className="section-label">Who we are</div>
          <div className="intro-copy">
            <h2>Technology and people.<br />One reliable partner.</h2>
            <p>C&K Global Solutions (OPC) Private Limited delivers reliable, innovative IT and HR solutions tailored to modern business needs. Our mission is to provide cost-effective, scalable services that enable long-term success.</p>
          </div>
        </section>

        <section className={activeView === 'services' ? 'services-section section section-view' : 'services-section section is-hidden'} id="services">
          <div className="section-heading">
            <div><p className="section-kicker">What we do</p><h2>Solutions across<br />technology and talent.</h2></div>
            <p>From strategy and software delivery to workforce support, our services are built to solve practical business needs.</p>
          </div>
          <div className="service-grid">
            {services.map(({ icon: Icon, number, title, description }) => (
              <article className="service-card" key={title}>
                <div className="service-top"><span>{number}</span><Icon aria-hidden="true" /></div>
                <h3>{title}</h3><p>{description}</p>
                <a href="#contact" aria-label={`Discuss ${title}`} onClick={() => navigate('contact')}>Discuss your needs <ArrowRight size={17} /></a>
              </article>
            ))}
          </div>
        </section>

        <section className={activeView === 'industries' ? 'approach-section section-view' : 'approach-section is-hidden'} id="industries">
          <div className="approach-image-wrap">
            <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=88" alt="Business leaders collaborating around a table" />
            <div className="image-note"><Globe2 size={21} /><span>Built for diverse<br />industries.</span></div>
          </div>
          <div className="approach-copy">
            <p className="section-kicker">Who we support</p><h2>Cross-industry experience, focused delivery.</h2>
            <p>We support organizations across diverse industries with dependable IT and HR solutions shaped around each client&apos;s operating environment.</p>
            <ul>{strengths.map((strength) => <li key={strength}><CheckCircle2 size={20} /> {strength}</li>)}</ul>
          </div>
        </section>

        <section className={activeView === 'contact' ? 'contact-section section section-view' : 'contact-section section is-hidden'} id="contact">
          <div className="contact-copy">
            <p className="section-kicker">Start a conversation</p><h2>Build your next solution with us.</h2>
            <p>Tell us about your technology or workforce challenge. We&apos;ll help you find a practical way forward.</p>
            <div className="contact-links">
              <a href="mailto:support@ckglobals.com"><Mail size={18} /> support@ckglobals.com</a>
              <a href="https://wa.me/919985727179" target="_blank" rel="noreferrer"><UsersRound size={18} /> WhatsApp: +91 99857 27179</a>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="field-row">
              <label>Name<input type="text" name="name" placeholder="Your name" required /></label>
              <label>Email<input type="email" name="email" placeholder="you@example.com" required /></label>
            </div>
            <label>How can we help?<textarea name="message" rows={4} placeholder="Tell us a little about your challenge" required /></label>
            <button className="button button-dark" type="submit" disabled={submitStatus === 'sending'}>
              {submitStatus === 'sending' ? 'Sending...' : 'Send enquiry'}
              {submitStatus !== 'sending' && <ArrowRight size={18} />}
            </button>
            {submitStatus === 'success' && (
              <div className="form-success" role="status">
                <p>Your enquiry was sent successfully by email.</p>
                <a className="whatsapp-button" href={whatsappUrl} target="_blank" rel="noreferrer">
                  Send on WhatsApp <ArrowRight size={17} />
                </a>
              </div>
            )}
            {submitStatus === 'error' && (
              <p className="form-error" role="alert">We could not send your enquiry. Please email support@ckglobals.com or use WhatsApp.</p>
            )}
            {submitStatus === 'activation' && (
              <div className="form-error" role="alert">
                <p>Email delivery is being activated. Please continue on WhatsApp for immediate assistance.</p>
                <a className="whatsapp-button" href={whatsappUrl} target="_blank" rel="noreferrer">
                  Continue on WhatsApp <ArrowRight size={17} />
                </a>
              </div>
            )}
          </form>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#home" onClick={() => navigate('home')}><img className="brand-mark" src="/logo.png" alt="" /><span className="brand-copy"><strong>C&K Global</strong><small>Solutions OPC Pvt Ltd</small></span></a>
        <p>AI-enabled IT and HR solutions for modern business.</p>
        <span>© {new Date().getFullYear()} C&K Global Solutions OPC Pvt Ltd</span>
      </footer>
    </div>
  )
}

export default App
