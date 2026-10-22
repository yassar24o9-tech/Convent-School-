import { useEffect, useRef, useState } from 'react'
import './App.css'

const schoolPhotos = import.meta.glob('./assets/*.jpg', { eager: true, query: '?url', import: 'default' })
const schoolPhoto = (filename, alt, caption = 'Photograph supplied for this school website concept') => ({
  src: schoolPhotos[`./assets/${filename}`],
  alt,
  caption,
})
const schoolLogo = schoolPhotos['./assets/convent school logo.jpg']
const schoolAddress = "St. Joseph's Convent School, Ward No. 4, near Gujjar Hostel and Industrial Training Institute (ITI) Road, Rajouri, Jammu and Kashmir 185131, India"
const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolAddress)}`
const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(schoolAddress)}&output=embed`
const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(schoolAddress)}`

const images = {
  campus: schoolPhoto('campus_building_02.jpg', "The St. Joseph's Convent School building in Rajouri", "St. Joseph's Convent School · campus"),
  classroom: schoolPhoto('classroom_students.jpg', 'Students seated in a classroom'),
  reading: schoolPhoto('reading_class.jpg', 'Students reading at their desks in class'),
  learning: schoolPhoto('students_learning_01.jpg', 'Students learning together in a classroom'),
  guidance: schoolPhoto('teacher_guiding_students.jpg', 'A teacher guiding students during classroom work'),
  activity: schoolPhoto('classroom_activity_03.jpg', 'Young students taking part in a classroom activity'),
  play: schoolPhoto('class_activity_01.jpg', 'Children playing together in a classroom activity area'),
  assembly: schoolPhoto('assembly_speech.jpg', 'A speaker addressing students gathered outside the school'),
  community: schoolPhoto('morning_assembly_02.jpg', 'Students gathered outdoors at school'),
  science: schoolPhoto('science_activity_group.jpg', 'Students taking part in a science demonstration'),
  microscope: schoolPhoto('microscope_activity.jpg', 'A microscope being used during a practical activity'),
  teaching: schoolPhoto('teacher_teaching_01.jpg', 'A teacher explaining a lesson to students'),
  transport: schoolPhoto('school_bus.jpg', "A school bus marked for St. Joseph's Convent School"),
  outdoors: schoolPhoto('students_outdoors.jpg', 'Students gathered outdoors at the school'),
}

const links = [
  ['Home', '/'],
  ['About Us', '/about'],
  ['Academics', '/academics'],
  ['Admissions', '/admissions'],
  ['Facilities', '/facilities'],
  ['Gallery', '/gallery'],
  ['Contact Us', '/contact'],
]

const iconPaths = {
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M8 7h8M8 11h7" /></>,
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" /></>,
  people: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  leaf: <><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z" /><path d="M4 21c3-5 7-8 12-11" /></>,
  arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
}

function Icon({ name, size = 20, ...props }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" {...props}>{iconPaths[name]}</svg>
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])
  return [path, setPath]
}

function Link({ to, children, className = '', onNavigate, ...props }) {
  const handleClick = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (window.location.pathname !== to) window.history.pushState({}, '', to)
    onNavigate?.()
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return <a href={to} className={className} onClick={handleClick} {...props}>{children}</a>
}

function Header({ path }) {
  const [open, setOpen] = useState(false)
  const menuButton = useRef(null)
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="St. Joseph's Convent School home" onNavigate={() => setOpen(false)}>
          <img className="brand-logo" src={schoolLogo} alt="" />
          <span className="brand-copy"><strong>St. Joseph's</strong><small>CONVENT SCHOOL · RAJOURI</small></span>
        </Link>
        <button ref={menuButton} className="menu-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
          <Icon name={open ? 'close' : 'menu'} size={23} />
        </button>
        <nav id="primary-navigation" className={`primary-nav${open ? ' is-open' : ''}`} aria-label="Main navigation">
          {links.map(([label, to]) => (
            <Link key={to} to={to} className={`nav-link${path === to ? ' active' : ''}`} aria-current={path === to ? 'page' : undefined} onNavigate={() => setOpen(false)}>{label}</Link>
          ))}
          <Link to="/admissions" className="nav-cta" onNavigate={() => setOpen(false)}>Enquire <Icon name="arrow" size={16} /></Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand brand-light">
            <img className="brand-logo" src={schoolLogo} alt="" />
            <span className="brand-copy"><strong>St. Joseph's</strong><small>CONVENT SCHOOL · RAJOURI</small></span>
          </Link>
          <p>A thoughtful website concept celebrating learning, curiosity, and the promise of every young person.</p>
          <span className="concept-label">Unofficial website concept for review</span>
        </div>
        <div className="footer-links">
          <h2>Explore</h2>
          {links.slice(1, 5).map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}
        </div>
        <div className="footer-links">
          <h2>Connect</h2>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact Us</Link>
          <span className="footer-location"><Icon name="pin" size={16} /> {schoolAddress}</span>
        </div>
        <div className="footer-note">
          <span className="eyebrow eyebrow-gold">A note on this concept</span>
          <p>School-specific details, photographs, and branding are placeholders for review. Please confirm all information before publication.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} St. Joseph's Convent School · Concept design</span>
        <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Back to top ↑</a>
      </div>
    </footer>
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  return <div className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>{children}</div>
}

function Photo({ image, className = '', eager = false }) {
  return (
    <figure className={`photo ${className}`}>
      <img src={image.src} alt={image.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      <figcaption>{image.caption}</figcaption>
    </figure>
  )
}

function SectionHeading({ eyebrow, title, text, centered = false }) {
  return (
    <div className={`section-heading${centered ? ' centered' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

function TextLink({ to, children }) {
  return <Link to={to} className="text-link">{children}<Icon name="arrow" size={17} /></Link>
}

function PageHero({ eyebrow, title, text, image = images.campus }) {
  return (
    <section className="page-hero">
      <div className="page-hero-image"><img src={image.src} alt={image.alt} fetchPriority="high" /></div>
      <div className="page-hero-shade" />
      <div className="page-hero-content page-container">
        <span className="eyebrow eyebrow-gold">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  )
}

const themes = [
  { icon: 'book', title: 'A love of learning', text: 'Make space for questions, discovery, and the joy of understanding something new.' },
  { icon: 'spark', title: 'Room to imagine', text: 'Encourage original thinking, creativity, and the confidence to explore ideas.' },
  { icon: 'people', title: 'Growing together', text: 'Celebrate kindness, respect, and the value of learning alongside one another.' },
  { icon: 'leaf', title: 'Character for life', text: 'Nurture thoughtful choices, resilience, and care for the wider community.' },
]

const galleryItems = [
  { ...images.campus, title: 'The school campus', category: 'Campus' },
  { ...images.classroom, title: 'In the classroom', category: 'Learning' },
  { ...images.reading, title: 'Reading in class', category: 'Learning' },
  { ...images.learning, title: 'Learning together', category: 'Learning' },
  { ...images.guidance, title: 'Guided learning', category: 'Learning' },
  { ...images.teaching, title: 'A lesson in progress', category: 'Learning' },
  { ...images.activity, title: 'Classroom activities', category: 'Activities' },
  { ...images.play, title: 'Play and learning', category: 'Activities' },
  { ...images.science, title: 'Science activity', category: 'Activities' },
  { ...images.microscope, title: 'A closer look', category: 'Activities' },
  { ...images.assembly, title: 'A school gathering', category: 'Community' },
  { ...images.community, title: 'Together at school', category: 'Community' },
  { ...images.outdoors, title: 'Outdoors together', category: 'Community' },
  { ...images.transport, title: 'School transport', category: 'Campus' },
  { ...schoolPhoto('campus_building.jpg', 'Exterior view of the school building'), title: 'Another view of the campus', category: 'Campus' },
  { ...schoolPhoto('classroom_wide_01.jpg', 'Students working at their desks in a classroom'), title: 'A wide classroom view', category: 'Learning' },
  { ...schoolPhoto('classroom_learning.jpg', 'Young children playing with educational materials'), title: 'Playful classroom learning', category: 'Activities' },
  { ...schoolPhoto('classroom_windows.jpg', 'Students seated near classroom windows'), title: 'Light-filled classroom', category: 'Learning' },
  { ...schoolPhoto('students_classroom_02.jpg', 'Students seated together in class'), title: 'Classroom moments', category: 'Learning' },
  { ...schoolPhoto('students_in_class.jpg', 'Students studying in a classroom'), title: 'Focused study', category: 'Learning' },
  { ...schoolPhoto('students_writing_01.jpg', 'Students writing at their desks'), title: 'Learning by writing', category: 'Learning' },
  { ...schoolPhoto('students_seated_01.jpg', 'Students seated together during a lesson'), title: 'A lesson together', category: 'Learning' },
  { ...schoolPhoto('student_presentation.jpg', 'A teacher sharing a learning resource with students'), title: 'Sharing a lesson', category: 'Learning' },
  { ...schoolPhoto('students_classroom_03.jpg', 'Students listening in class'), title: 'Listening and learning', category: 'Learning' },
  { ...schoolPhoto('student_writing_02.jpg', 'Students writing in their notebooks'), title: 'Notes from class', category: 'Learning' },
  { ...schoolPhoto('student_writing_03.jpg', 'A student working in a notebook'), title: 'Independent work', category: 'Learning' },
  { ...schoolPhoto('assembly_crowd.jpg', 'Students gathered for a school assembly'), title: 'Gathered as a school', category: 'Community' },
  { ...schoolPhoto('class_activity_02.jpg', 'Children taking part in an activity in class'), title: 'A shared activity', category: 'Activities' },
  { ...schoolPhoto('students_group.jpg', 'Students assembled outdoors at school'), title: 'Students outside together', category: 'Community' },
  { ...schoolPhoto('students_entering.jpg', 'Students walking through a school entrance'), title: 'Arriving at school', category: 'Campus' },
  { ...schoolPhoto('students_in_line.jpg', 'Students standing together outdoors'), title: 'Students gathered in line', category: 'Community' },
  { ...schoolPhoto('microscope_closeup.jpg', 'Close view of a microscope during a practical activity'), title: 'Exploring with a microscope', category: 'Activities' },
  { ...schoolPhoto('principal_at_desk.jpg', 'A school staff member seated at a desk'), title: 'A school office', category: 'Community' },
  { ...schoolPhoto('science_demonstration_02.jpg', 'Students watching a science demonstration'), title: 'A science demonstration', category: 'Activities' },
  { ...schoolPhoto('principal_portrait.jpg', 'A school staff member seated for a portrait'), title: 'A school staff portrait', category: 'Community' },
  { ...schoolPhoto('school_staff_portrait.jpg', 'A school staff member at a desk'), title: 'At the school office', category: 'Community' },
  { ...schoolPhoto('student_group_with_teacher.jpg', 'Students gathered around a teacher during an activity'), title: 'Learning with a teacher', category: 'Learning' },
  { ...schoolPhoto('teacher_student_interview.jpg', 'A staff member speaking with a student'), title: 'A conversation at school', category: 'Community' },
  { ...schoolPhoto('school_bus_students.jpg', 'Students boarding a school bus'), title: 'Boarding the school bus', category: 'Campus' },
]

function HomePage() {
  return (
    <>
      <section className="home-hero" id="top">
        <div className="home-hero-image"><img src={images.campus.src} alt={images.campus.alt} fetchPriority="high" /></div>
        <div className="home-hero-overlay" />
        <div className="home-hero-content page-container">
          <Reveal>
            <span className="eyebrow eyebrow-gold">St. Joseph's Convent School · Rajouri</span>
            <h1>Learning today.<br /><em>Leading tomorrow.</em></h1>
            <p>A welcoming concept for a school community where curiosity is encouraged, character is nurtured, and every learner can find room to grow.</p>
            <div className="hero-actions">
              <Link to="/about" className="button button-gold">Explore our school <Icon name="arrow" size={17} /></Link>
              <Link to="/admissions" className="button button-outline">Admissions enquiry</Link>
            </div>
            <span className="hero-image-note">School campus · Rajouri</span>
          </Reveal>
        </div>
        <div className="hero-side-note" aria-hidden="true">A place for possibility <span>—</span> RAJOURI</div>
      </section>

      <section className="intro-section section-pad page-container">
        <Reveal className="intro-copy">
          <span className="eyebrow">A considered beginning</span>
          <h2>Welcome to <em>our school.</em></h2>
          <p className="lead">Every learner deserves the chance to be curious, build confidence, and discover what they can become.</p>
          <p>This concept introduces St. Joseph's Convent School through a warm, modern lens. It is designed to make verified school information easy to find while keeping the focus on learning and community.</p>
          <TextLink to="/about">Get to know us</TextLink>
        </Reveal>
        <Reveal className="intro-visual" delay={120}>
          <Photo image={images.learning} />
          <div className="image-note"><span className="note-star">✳</span><span>Curiosity<br />starts here</span></div>
        </Reveal>
      </section>

      <section className="themes-section section-pad">
        <div className="page-container">
          <Reveal><SectionHeading eyebrow="What matters" title="Learning is more than a lesson." text="A school experience is shaped by the questions we ask, the care we show, and the confidence we build along the way." centered /></Reveal>
          <div className="theme-grid">
            {themes.map((item, index) => <Reveal key={item.title} delay={index * 90}><article className="theme-card"><span className="icon-tile"><Icon name={item.icon} size={23} /></span><h3>{item.title}</h3><p>{item.text}</p><span className="card-number">0{index + 1}</span></article></Reveal>)}
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="quote-inner page-container">
          <Reveal><span className="quote-mark" aria-hidden="true">“</span><blockquote>Curiosity opens doors to endless possibilities.</blockquote><span className="quote-caption">An original line for this website concept</span></Reveal>
        </div>
        <span className="quote-decoration" aria-hidden="true">✳</span>
      </section>

      <section className="academics-preview section-pad page-container">
        <Reveal className="academics-photo"><Photo image={images.classroom} /></Reveal>
        <Reveal className="academics-copy" delay={100}>
          <span className="eyebrow">The learning journey</span>
          <h2>Built around the <em>joy of discovery.</em></h2>
          <p className="lead">A thoughtful academic experience makes room for strong foundations and the questions that take learning further.</p>
          <p>Curriculum, class levels, and learning programmes have not yet been confirmed. This section is ready to be completed with the school's approved information.</p>
          <TextLink to="/academics">Explore academics</TextLink>
        </Reveal>
      </section>

      <section className="environment-section section-pad">
        <div className="page-container">
          <Reveal><SectionHeading eyebrow="Spaces to grow" title="A school day, thoughtfully imagined." text="A glimpse of classroom learning and students together, in photographs supplied for this concept." /></Reveal>
          <div className="environment-grid">
            <Reveal className="environment-large"><Photo image={images.reading} /><div className="environment-caption"><span>01 / Learning</span><h3>Make room for stories.</h3></div></Reveal>
            <Reveal className="environment-small" delay={100}><Photo image={images.community} /><div className="environment-caption"><span>02 / Community</span><h3>Growing together.</h3></div></Reveal>
          </div>
          <TextLink to="/facilities">Explore the environment</TextLink>
        </div>
      </section>

      <GalleryPreview />

      <section className="admissions-band">
        <div className="page-container admissions-band-inner">
          <Reveal><span className="eyebrow eyebrow-gold">Start a conversation</span><h2>Take the next step in your <em>learning journey.</em></h2><p>For admission information or a general enquiry, get in touch through our demonstration form.</p><Link to="/admissions" className="button button-gold">Admissions enquiry <Icon name="arrow" size={17} /></Link></Reveal>
          <span className="band-decoration" aria-hidden="true">✳</span>
        </div>
      </section>

      <section className="contact-preview section-pad page-container">
        <Reveal><span className="eyebrow">Find us</span><h2>Rooted in <em>Rajouri.</em></h2><div className="home-contact-address"><Icon name="pin" size={20} /><p>{schoolAddress}</p></div><TextLink to="/contact">Contact &amp; directions</TextLink></Reveal>
        <Reveal className="contact-card" delay={100}><div className="contact-card-icon"><Icon name="pin" size={24} /></div><span className="eyebrow eyebrow-gold">Visit the school</span><h3>Find us in Rajouri.</h3><p>Get directions to St. Joseph's Convent School from the Contact page.</p><Link to="/contact" className="contact-card-link">View location <Icon name="arrow" size={16} /></Link></Reveal>
      </section>
    </>
  )
}

function GalleryPreview() {
  return (
    <section className="gallery-preview section-pad page-container">
      <Reveal><SectionHeading eyebrow="A glimpse" title="Little moments, lasting memories." text="A selection of school photographs supplied for this website concept." /></Reveal>
      <div className="gallery-preview-grid">
        {galleryItems.slice(0, 3).map((item, index) => <Reveal key={item.title} delay={index * 70}><Link to="/gallery" className="preview-image"><img src={item.src} alt={item.alt} loading="lazy" /><span>{item.title}<Icon name="arrow" size={16} /></span></Link></Reveal>)}
      </div>
      <TextLink to="/gallery">View the gallery</TextLink>
    </section>
  )
}

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our story" title={<>A place to learn<br /><em>and become.</em></>} text="An introduction to St. Joseph's Convent School, shaped with care and ready for the school's own story." />
      <section className="section-pad page-container about-intro">
        <Reveal><span className="eyebrow">Welcome</span><h2>A school community, <em>full of possibility.</em></h2></Reveal>
        <Reveal className="about-body" delay={100}><p className="lead">St. Joseph's Convent School is located in Rajouri, Jammu &amp; Kashmir, India.</p><p>This concept presents a welcoming starting point for sharing the people, learning, and community that make the school distinctive. Its history, values, affiliations, and official educational approach should be added here in the school's own approved words.</p></Reveal>
      </section>
      <section className="about-image-band"><Photo image={images.campus} /></section>
      <section className="section-pad themes-section"><div className="page-container"><Reveal><SectionHeading eyebrow="A foundation for growth" title="Values we can build on." text="These are proposed themes for review—not a statement of the school's official values or philosophy." centered /></Reveal><div className="theme-grid">{themes.map((item, index) => <Reveal key={item.title} delay={index * 75}><article className="theme-card"><span className="icon-tile"><Icon name={item.icon} size={23} /></span><h3>{item.title}</h3><p>{item.text}</p></article></Reveal>)}</div></div></section>
      <Callout title="Every school has a story worth sharing." text="Add school-approved history, leadership, and community details to make this page truly yours." />
    </>
  )
}

function AcademicsPage() {
  const areas = [
    ['Foundations', 'A place for the essential skills and knowledge that support every next step.'],
    ['Questions & ideas', 'Invite learners to think deeply, explore possibilities, and make connections.'],
    ['Learning together', 'Make collaboration, thoughtful discussion, and shared discovery part of the story.'],
  ]
  return (
    <>
      <PageHero eyebrow="Academics" title={<>Learning with<br /><em>purpose.</em></>} text="An open, adaptable framework for the school's academic story—ready for verified details." image={images.classroom} />
      <section className="section-pad page-container">
        <Reveal><SectionHeading eyebrow="The learning experience" title="Curiosity is a powerful beginning." text="Every detail about the curriculum, class levels, and subjects should be supplied and approved by the school before this page is published." /></Reveal>
        <div className="academic-cards">{areas.map(([title, text], index) => <Reveal key={title} delay={index * 90}><article className="academic-card"><span className="eyebrow">0{index + 1} / Learning</span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div>
      </section>
      <section className="academics-preview section-pad page-container"><Reveal className="academics-photo"><Photo image={images.science} /></Reveal><Reveal className="academics-copy" delay={100}><span className="eyebrow">Designed to be completed</span><h2>Show the learning <em>that happens here.</em></h2><p className="lead">Add confirmed class levels, curriculum, subjects, and academic resources in language that feels clear to families.</p><p>Specific academic information has intentionally not been assumed in this concept.</p><TextLink to="/contact">Ask a question</TextLink></Reveal></section>
      <Callout title="The next chapter starts with a question." text="Talk with the school about admissions or the information families need to know." />
    </>
  )
}

function Callout({ title, text }) {
  return <section className="simple-callout"><div className="page-container simple-callout-inner"><Reveal><span className="eyebrow eyebrow-gold">Continue the journey</span><h2>{title}</h2><p>{text}</p><Link to="/admissions" className="button button-gold">Make an enquiry <Icon name="arrow" size={17} /></Link></Reveal></div></section>
}

function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) {
      setFormError('Please review the required fields.')
      return
    }
    const contact = String(new FormData(event.currentTarget).get('contact') || '').trim()
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
    const isPhone = /^[0-9()+\-\s]{7,}$/.test(contact)
    if (!isEmail && !isPhone) {
      setFormError('Please enter a valid email address or phone number.')
      return
    }
    setSubmitted(true)
    setFormError('')
  }
  return (
    <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading"><span className="eyebrow">Write to us</span><h2>How can we help?</h2><p>Fields marked with <span aria-hidden="true">*</span> are required.</p></div>
      <div className="form-grid">
        <label>Parent or guardian name <span aria-hidden="true">*</span><input name="guardian" autoComplete="name" required minLength="2" /></label>
        <label>Email or phone number <span aria-hidden="true">*</span><input name="contact" autoComplete="email" required type="text" /></label>
        <label>Student's name <span className="optional-label">(optional)</span><input name="student" autoComplete="off" /></label>
        <label>Class of interest <span className="optional-label">(optional)</span><input name="classInterest" autoComplete="off" /></label>
        <label className="form-wide">Message <span aria-hidden="true">*</span><textarea name="message" rows="4" required minLength="10" /></label>
      </div>
      {formError && <p className="form-error" role="alert">{formError}</p>}
      {submitted && <div className="form-demo-note" role="status"><strong>Demo form only — no information was sent.</strong><br />A secure school-approved submission service must be connected before this form can collect enquiries.</div>}
      <p className="privacy-note">Please do not include sensitive personal information. This demonstration form does not store or transmit your responses.</p>
      <button className="button button-navy" type="submit">Review enquiry <Icon name="arrow" size={17} /></button>
    </form>
  )
}

function AdmissionsPage() {
  return (
    <>
      <PageHero eyebrow="Admissions" title={<>Begin a new<br /><em>journey.</em></>} text="We would be glad to hear from families exploring St. Joseph's Convent School." image={images.learning} />
      <section className="section-pad admissions-content page-container">
        <Reveal className="admissions-copy"><span className="eyebrow">A warm welcome</span><h2>Let's start a <em>conversation.</em></h2><p className="lead">Use the enquiry form to share a question or request more information.</p><p>Admission dates, eligibility, fees, and availability have not been verified for this concept. Please contact the school directly for current official information.</p><div className="admissions-fact"><span className="icon-tile"><Icon name="people" size={22} /></span><p><strong>Information to confirm</strong><br />The school can add its current admission process and guidance here.</p></div></Reveal>
        <Reveal className="form-panel" delay={100}><EnquiryForm /></Reveal>
      </section>
    </>
  )
}

const facilityPlaceholders = [
  { image: images.classroom, title: 'Classroom learning', text: 'The supplied photographs show students learning in classroom settings.' },
  { image: images.science, title: 'Science activities', text: 'The supplied photographs show students taking part in practical science activities.' },
  { image: images.transport, title: 'School transport', text: 'A school bus bearing the school name is shown in the supplied photographs.' },
]

function FacilitiesPage() {
  return (
    <>
      <PageHero eyebrow="The school environment" title={<>Spaces for every<br /><em>next step.</em></>} text="A look at classroom learning, practical activities, and school transport shown in the supplied photographs." image={images.reading} />
      <section className="section-pad page-container">
        <Reveal><SectionHeading eyebrow="Facilities & spaces" title="A closer look at school life." text="These descriptions are limited to what is visible in the photographs supplied for this concept." /></Reveal>
        <div className="facility-grid">{facilityPlaceholders.map((item, index) => <Reveal key={item.title} delay={index * 85}><article className="facility-card"><Photo image={item.image} /><div className="facility-card-copy"><span className="eyebrow">School life / {String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.text}</p></div></article></Reveal>)}</div>
      </section>
      <Callout title="A closer look at school life." text="Share your questions with the school while this concept is being reviewed." />
    </>
  )
}

function GalleryPage() {
  const [selected, setSelected] = useState(-1)
  const [category, setCategory] = useState('All')
  const visibleItems = category === 'All' ? galleryItems : galleryItems.filter((item) => item.category === category)
  const categories = ['All', ...new Set(galleryItems.map((item) => item.category))]
  useEffect(() => {
    if (selected < 0) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelected(-1)
      if (event.key === 'ArrowRight') setSelected((current) => (current + 1) % visibleItems.length)
      if (event.key === 'ArrowLeft') setSelected((current) => (current - 1 + visibleItems.length) % visibleItems.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, visibleItems.length])
  return (
    <>
      <PageHero eyebrow="Gallery" title={<>A few frames of<br /><em>possibility.</em></>} text="Classroom moments, activities, and community life from photographs supplied for this school website concept." image={images.activity} />
      <section className="section-pad page-container gallery-page">
        <Reveal><SectionHeading eyebrow="School gallery" title="A school story in pictures." text="Photographs supplied for this concept. Please confirm permission to publish identifiable students before the website goes live." /></Reveal>
        <div className="gallery-filters" role="group" aria-label="Filter gallery by category">{categories.map((item) => <button key={item} type="button" className={`gallery-filter${category === item ? ' active' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="gallery-grid">{visibleItems.map((item, index) => <Reveal key={item.title} delay={(index % 3) * 60}><button type="button" className="gallery-item" onClick={() => setSelected(index)} aria-label={`Open image: ${item.title}`}><img src={item.src} alt={item.alt} loading="lazy" /><span className="gallery-item-info"><small>{item.category} · St. Joseph's Convent School</small><strong>{item.title}</strong></span><span className="gallery-open" aria-hidden="true">↗</span></button></Reveal>)}</div>
      </section>
      {selected >= 0 && <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Gallery image: ${visibleItems[selected].title}`} onClick={(event) => { if (event.target === event.currentTarget) setSelected(-1) }}><button type="button" className="lightbox-close" onClick={() => setSelected(-1)} aria-label="Close image viewer"><Icon name="close" size={24} /></button><button type="button" className="lightbox-arrow lightbox-prev" onClick={() => setSelected((selected - 1 + visibleItems.length) % visibleItems.length)} aria-label="Previous image"><Icon name="chevronLeft" size={26} /></button><figure className="lightbox-content"><img src={visibleItems[selected].src} alt={visibleItems[selected].alt} /><figcaption>{visibleItems[selected].title} <span>— supplied school photograph</span></figcaption></figure><button type="button" className="lightbox-arrow lightbox-next" onClick={() => setSelected((selected + 1) % visibleItems.length)} aria-label="Next image"><Icon name="chevronRight" size={26} /></button><span className="lightbox-count">{selected + 1} / {visibleItems.length}</span></div>}
    </>
  )
}

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Let's make a<br /><em>connection.</em></>} text="Find St. Joseph's Convent School in Rajouri or send an enquiry using the form below." image={images.community} />
      <section className="section-pad page-container contact-location-section">
        <Reveal className="contact-details">
          <span className="eyebrow">Visit the school</span>
          <h2>Find us in <em>Rajouri.</em></h2>
          <p className="lead">St. Joseph's Convent School</p>
          <div className="address-line">
            <Icon name="pin" size={21} />
            <p>{schoolAddress}</p>
          </div>
          <a className="button button-navy directions-button" href={googleMapsDirectionsUrl} target="_blank" rel="noopener noreferrer">
            Get Directions <Icon name="arrow" size={17} />
          </a>
        </Reveal>
        <Reveal className="map-card" delay={100}>
          <GoogleMapEmbed />
        </Reveal>
      </section>
      <section className="contact-enquiry">
        <div className="page-container contact-enquiry-layout">
          <Reveal className="contact-details">
            <span className="eyebrow">Contact &amp; enquiries</span>
            <h2>How can we <em>help?</em></h2>
            <p className="lead">Use the demonstration form to share a question with the school.</p>
            <p className="small-note">The form does not transmit or store information. No phone number or email address has been added because verified details were not provided.</p>
          </Reveal>
          <Reveal className="form-panel" delay={100}><EnquiryForm /></Reveal>
        </div>
      </section>
    </>
  )
}

function GoogleMapEmbed() {
  const [mapUnavailable, setMapUnavailable] = useState(false)

  return (
    <div className="map-frame">
      <iframe
        src={googleMapsEmbedUrl}
        title="Map showing St. Joseph's Convent School, Ward No. 4, Rajouri"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        onError={() => setMapUnavailable(true)}
      />
      <div className="map-fallback">
        {mapUnavailable && <span role="status">The embedded map could not be loaded.</span>}
        <a href={googleMapsSearchUrl} target="_blank" rel="noopener noreferrer">Open this location in Google Maps <Icon name="arrow" size={15} /></a>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return <section className="not-found page-container"><span className="eyebrow">Page not found</span><h1>Let's find our way <em>back.</em></h1><p>This page isn't part of the concept.</p><Link to="/" className="button button-navy">Return home <Icon name="arrow" size={17} /></Link></section>
}

const routes = {
  '/': HomePage,
  '/about': AboutPage,
  '/academics': AcademicsPage,
  '/admissions': AdmissionsPage,
  '/facilities': FacilitiesPage,
  '/gallery': GalleryPage,
  '/contact': ContactPage,
}

function App() {
  const [path] = usePath()
  const Page = routes[path] || NotFoundPage

  useEffect(() => {
    document.title = `${path === '/' ? 'Home' : links.find(([, to]) => to === path)?.[0] || 'Page'} | St. Joseph's Convent School — Concept`
    const items = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [path])

  return <><div id="top" /><Header path={path} /><main><Page key={path} /></main><Footer /></>
}

export default App
