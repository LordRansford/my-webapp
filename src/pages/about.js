import Layout from "@/components/Layout";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";

export default function AboutPage() {
  return (
    <Layout title="About - Ransford's Notes" description="Who I am, why I build tools, and how this stays practitioner-first.">
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}>
        <header className="page-header">
          <p className="eyebrow">About</p>
          <h1>Hi, I’m Ransford Chung Amponsah</h1>
          <p className="lead">
            Chartered Engineer (CEng) and TOGAF® Certified Practitioner. I build calm, practical technical learning for people who want depth,
            clarity, and receipts (not vibes).
          </p>
          <div className="actions">
            <a
              className="button primary"
              href="https://www.linkedin.com/in/ransford-amponsah-ceng-mimeche-togaf%C2%AE-79489a105/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn (the tidy version)
            </a>
            <a className="button ghost" href="#credentials">
              Credentials & verification
            </a>
          </div>
        </header>

        <section className="section" aria-label="Quick summary">
          <div className="card-grid">
            <div className="card">
              <h2 className="card-title">The short version</h2>
              <p className="meta">This site is here to make hard things understandable, without dumbing them down.</p>
              <ul className="list">
                <li>Built for people who want depth, clarity, and honesty.</li>
                <li>Written so a missed step does not collapse the entire explanation.</li>
                <li>Designed to be helpful to neurodivergent and neurotypical learners alike.</li>
              </ul>
            </div>
            <div className="card">
              <h2 className="card-title">My working style</h2>
              <p className="meta">Engineering brain, but with friendlier writing.</p>
              <ul className="list">
                <li>Explain assumptions. Define terms. Show the moving parts.</li>
                <li>Prefer practical experiments you can actually run.</li>
                <li>Quizzes test understanding, not memorisation.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section" aria-label="Why this site exists">
          <h2>Why this site exists</h2>
          <p>
            I built this website for people who love technical things and want to become genuinely good at them, but do not always know where to
            start. That includes people like me and my wife who are neurodivergent, and plenty of neurotypical people too.
          </p>
          <p>
            A lot of technical content fails not because it is hard, but because it is badly explained. Concepts are wrapped in unexplained
            jargon, assumptions are left unstated, and if you miss one step, the whole explanation collapses. That makes deep understanding
            almost impossible, especially if you need clarity rather than vibes.
          </p>
          <p>
            So many of us end up teaching ourselves because the alternatives are frustrating, vague, or frankly unhelpful. This site exists to
            fix that.
          </p>
          <p>
            Everything here is designed to take you from absolute beginner to real expertise, step by step, with explanations that do not skip
            logic, practical experiments you can actually try, and quizzes that test understanding rather than memorisation.
          </p>
          <p>
            The aim is not to impress you with complexity, but to remove it where it is unnecessary and explain it properly where it is not.
            If something cannot be explained clearly, it probably is not understood properly. That principle underpins the entire site.
          </p>
        </section>

        <section className="section">
          <h2>Who I am</h2>
          <p>
            I grew up in Ghana and moved to the UK at 16 to continue my education and be closer to family. I have always loved learning technical
            subjects and, just as importantly, teaching them in a way people can actually digest. I learn best by understanding how things really
            work, and I enjoy exchanging ideas with people who care about getting things right rather than sounding clever.
          </p>
          <p>
            By background, I am a Chartered Engineer and a TOGAF® Certified Practitioner, with formal training in AI including Azure AI
            Fundamentals (AI-900) and Azure AI Engineer Associate (AI-102). For my day job, I work as a senior manager in digitalisation for the
            GB energy sector as a regulator, leading sector-wide data and digital strategy and shaping how complex systems evolve in practice, not
            just on paper.
          </p>
          <p>
            Alongside that, I volunteer with the Institution of Mechanical Engineers as a Council Member and Professional Reviewer, including
            chartership applications. I have also worked as a Mechanical Engineering Lecturer, teaching mathematics, statistics, and engineering
            principles to HNC, HND, and A-level students. Teaching reinforced something I already suspected: clarity beats cleverness every time.
          </p>
          <p>I will spare you the rest of the qualifications. This is not a CV and that is very much intentional.</p>
        </section>

        <section className="section">
          <h2>Outside of work</h2>
          <p>
            When I am not thinking about systems, architecture, or teaching, I am usually training. I enjoy powerlifting and bodybuilding and am
            currently chasing a 300 kg squat and a 100 kg incline dumbbell press. Progress is slow, measurable, and humbling, which I find oddly
            comforting.
          </p>
          <p>
            I also love table tennis and used to play in local leagues, picking up a few borough-level championship trophies along the way. At
            home, I enjoy DIY projects and am currently building a garden to grow flowers for my wife, along with some fruit and vegetables.
            Engineering habits die hard.
          </p>
          <p>
            I am very into motorbikes and prefer to maintain, modify, and occasionally dismantle them myself. Past and present bikes include a UM
            Commando, a Triumph Rocket 3 GT (2022), a Honda NC750X (2025), and a Honda CB125R (2025). I also tinker with robotics as a hobbyist,
            mostly because it combines logic, hardware, and patience in equal measure.
          </p>
          <p>
            For balance, I enjoy anime, with One Piece currently holding the crown, and I am always happy to watch K-dramas, shows like Love Is
            Blind, or detective films such as the Knives Out series with my dear wife. I enjoy cooking, catching up with friends, and spending
            time with our cat, Sesame, who runs the house.
          </p>
          <p>
            Most importantly, I am deeply grateful for my church family, for my wider family, and above all to God for my wife and the people
            around me. Their wisdom, patience, and guidance matter more to me than any professional achievement.
          </p>
        </section>

        <section className="section" id="credentials">
          <h2>Credentials and verification</h2>
          <p className="lead">This is the part where we avoid “trust me, mate” and use links you can verify yourself.</p>
          <div className="card-grid">
            <div className="card">
              <h3 className="card-title">TOGAF® Certified Practitioner</h3>
              <p className="meta">Issued by The Open Group. Verification via Credly.</p>
              <img
                src="/about/togaf-credly-og.png"
                alt="TOGAF® Enterprise Architecture Practitioner badge (preview image from Credly)"
                loading="lazy"
              />
              <p className="muted">
                <a
                  className="text-link"
                  href="https://www.credly.com/badges/d36678f6-a316-46d9-8242-6b673d3b853e/public_url"
                  target="_blank"
                  rel="noreferrer"
                >
                  View the public badge on Credly
                </a>
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">IMechE volunteering</h3>
              <p className="meta">
                Council Member and Professional Reviewer (including chartership applications). Public listings can change over time.
              </p>
              <p className="muted">
                <a className="text-link" href="https://www.imeche.org/about-us/governance/council" target="_blank" rel="noreferrer">
                  IMechE Council page
                </a>
              </p>
              <p className="muted">
                If you are ever unsure what I do or do not claim, check the link above, or ask me directly. I’d rather be corrected than be
                “confidently wrong”.
              </p>
            </div>
          </div>
          <div className="callout callout--info">
            <div className="callout__header">
              <p className="callout__title">Important notes (the sensible bit)</p>
            </div>
            <div className="callout__body">
              <p className="muted">
                TOGAF® is a registered trademark of The Open Group. “Institution of Mechanical Engineers” and “IMechE” are trademarks of their
                respective owners. This site is independent and is not endorsed by, sponsored by, or affiliated with The Open Group or IMechE
                unless explicitly stated.
              </p>
            </div>
          </div>
        </section>
      </StaticInfoTemplate>
    </Layout>
  );
}
