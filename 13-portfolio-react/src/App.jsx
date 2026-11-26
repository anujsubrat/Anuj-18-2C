import { useState } from 'react';

// ---- EDIT THIS DATA WITH YOUR OWN DETAILS ----
const profile = {
  name: 'Your Name',
  title: 'Full Stack Developer',
  about: 'I am a computer science student who enjoys building web applications with HTML, CSS, JavaScript, Node.js, Express, MongoDB and React.',
  email: 'you@example.com',
  github: 'https://github.com/yourname'
};
const skills = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git'];
const projects = [
  { title: 'E-commerce App', text: 'Cart, payment flow, orders and seller panel using Express.' },
  { title: 'Snake & Ladder', text: 'Two-player browser game in vanilla JavaScript.' },
  { title: 'Product CRUD API', text: 'RESTful API with MongoDB and Mongoose.' }
];

function Navbar() {
  return (
    <nav>
      <b>{profile.name}</b>
      <div>{['about', 'skills', 'projects', 'contact'].map(s => <a key={s} href={'#' + s}>{s}</a>)}</div>
    </nav>
  );
}
function Hero() {
  return <header className="hero"><h1>Hi, I'm {profile.name}</h1><h2>{profile.title}</h2></header>;
}
function Section({ id, title, children }) {
  return <section id={id}><h2>{title}</h2>{children}</section>;
}
function Contact() {
  const [form, setForm] = useState({ name: '', message: '' });
  const [sent, setSent] = useState(false);
  const submit = e => { e.preventDefault(); setSent(true); setForm({ name: '', message: '' }); };
  return (
    <form onSubmit={submit}>
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Message" required />
      <button>Send</button>
      {sent && <p className="ok">Thanks! (Demo form - nothing is sent.)</p>}
    </form>
  );
}
export default function App() {
  return (
    <>
      <Navbar /><Hero />
      <Section id="about" title="About Me"><p>{profile.about}</p></Section>
      <Section id="skills" title="Skills"><div className="chips">{skills.map(s => <span key={s}>{s}</span>)}</div></Section>
      <Section id="projects" title="Projects">
        <div className="grid">{projects.map(p => <div className="card" key={p.title}><h3>{p.title}</h3><p>{p.text}</p></div>)}</div>
      </Section>
      <Section id="contact" title="Contact">
        <p>Email: <a href={'mailto:' + profile.email}>{profile.email}</a> | <a href={profile.github}>GitHub</a></p>
        <Contact />
      </Section>
      <footer>© {new Date().getFullYear()} {profile.name}</footer>
    </>
  );
}
