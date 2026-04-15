import Image from "next/image";

const partnerTypes = [
  {
    title: "Summer camps",
    description:
      "Add a standout STEM experience that feels creative, social, and easy for beginners to jump into.",
  },
  {
    title: "Schools and districts",
    description:
      "Bring in a workshop that supports problem solving, hands-on learning, and student confidence.",
  },
  {
    title: "After-school and enrichment programs",
    description:
      "Offer a memorable tech activity that mixes art, circuits, and interactive design in one session.",
  },
];

const workshopSteps = [
  {
    number: "01",
    title: "Draw an idea",
    description:
      "Students sketch a character, controller, or scene they want to bring to life.",
  },
  {
    number: "02",
    title: "Connect the materials",
    description:
      "They use simple components like alligator clips and touch points to build the interaction.",
  },
  {
    number: "03",
    title: "Bring it to life",
    description:
      "Using beginner-friendly apps, their drawings respond with sound, animation, or gameplay.",
  },
];

const studentActivities = [
  "Draw their own original idea",
  "Turn art into touch buttons and playable controls",
  "Build a project they can test, share, and improve",
  "Explore invention through creativity instead of coding pressure",
];

const studentLearning = [
  "How technology responds to touch and input",
  "Creative problem solving through iteration",
  "Confidence using beginner-friendly digital tools",
  "Core ideas behind circuits, cause and effect, and interactive design",
];

const programOptions = [
  {
    title: "1-day spotlight workshop",
    description:
      "A high-energy hands-on session that gives students a complete build experience in one day.",
  },
  {
    title: "Summer series",
    description:
      "A multi-session format for camps or programs that want to go deeper into invention and prototyping.",
  },
  {
    title: "Custom partner format",
    description:
      "Flexible scheduling for schools, enrichment groups, and community organizations.",
  },
];

const reasonsToBook = [
  "Beginner-friendly for students with little or no prior tech experience",
  "Creative enough to attract students who may not see themselves in traditional STEM",
  "Hands-on and visual, which makes the learning memorable for families and program leaders",
];

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero-section">
        <div className="topbar">
          <a className="brand" href="#top">
            <span className="brand-kicker">Reimagined Ideas</span>
            <span className="brand-subtitle">Interactive Tech Workshops</span>
          </a>
          <nav className="topnav" aria-label="Primary">
            <a href="#programs">Programs</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">
              For elementary and middle school students | Built for summer opportunities
            </p>
            <h1 className="hero-title">
              <span className="headline-orange">Draw It.</span>{" "}
              <span className="headline-green">Connect It.</span>
              <br />
              <span className="headline-blue">Bring It to Life.</span>
            </h1>
            <p className="hero-text">
              Reimagined Ideas helps students turn drawings into interactive projects
              using simple materials and beginner-friendly apps. It is a hands-on STEM
              experience designed for camps, schools, and enrichment partners looking
              for something creative, memorable, and easy to say yes to.
            </p>

            <div className="hero-badges" aria-label="Workshop highlights">
              <span>Grades 3-8</span>
              <span>No coding required</span>
              <span>Hands-on STEM</span>
              <span>Summer-ready</span>
            </div>

            <div className="hero-actions">
              <a
                className="button button-primary"
                href="mailto:contact@reimaginedideas.com?subject=Reimagined%20Ideas%20Workshop%20Inquiry"
              >
                Book a Workshop
              </a>
              <a
                className="button button-secondary"
                href="/techflyer.png"
                target="_blank"
                rel="noreferrer"
              >
                View Flyer
              </a>
            </div>
          </div>

          <div className="flyer-card">
            <div className="flyer-card-top">
              <p className="card-label">Workshop snapshot</p>
              <p className="card-text">
                A visual overview you can share with schools, camp leaders, and program
                coordinators.
              </p>
            </div>
            <div className="flyer-frame">
              <Image
                src="/techflyer.png"
                alt="Reimagined Ideas workshop flyer"
                width={1024}
                height={1536}
                priority
              />
            </div>
          </div>
        </div>

        <div className="partner-strip">
          {partnerTypes.map((partner) => (
            <article className="partner-card" key={partner.title}>
              <p className="card-label">{partner.title}</p>
              <p>{partner.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="experience">
        <div className="section-intro">
          <p className="section-kicker">How the workshop works</p>
          <h2>Students move from imagination to interaction in a single experience.</h2>
          <p>
            The workshop keeps the entry point simple while still feeling exciting and
            inventive. Students do not just learn about technology. They build something
            that responds to them.
          </p>
        </div>

        <div className="steps-grid">
          {workshopSteps.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section">
        <div className="section-intro">
          <p className="section-kicker">Student outcomes</p>
          <h2>Creative, approachable, and rooted in real STEM learning.</h2>
          <p>
            The flyer leads with student excitement. The website also shows partners
            what students actually gain from the experience.
          </p>
        </div>

        <div className="outcomes-grid">
          <article className="list-card">
            <p className="card-label">What students do</p>
            <ul>
              {studentActivities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="list-card">
            <p className="card-label">What students learn</p>
            <ul>
              {studentLearning.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section" id="programs">
        <div className="section-intro">
          <p className="section-kicker">Program formats</p>
          <h2>Flexible ways to bring Reimagined Ideas into your summer lineup.</h2>
          <p>
            Whether you need a one-day highlight or a recurring experience, the program
            can fit the rhythm of your organization.
          </p>
        </div>

        <div className="program-grid">
          {programOptions.map((program) => (
            <article className="program-card" key={program.title}>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
            </article>
          ))}
        </div>

        <div className="reasons-panel">
          <div className="section-intro compact-intro">
            <p className="section-kicker">Why partners book it</p>
            <h2>A workshop that feels fresh, visual, and genuinely hands-on.</h2>
          </div>
          <ul className="reasons-list">
            {reasonsToBook.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section cta-section" id="contact">
        <div className="cta-panel">
          <div>
            <p className="section-kicker">Let&apos;s create the right fit</p>
            <h2>Bring a hands-on tech workshop to your students this summer.</h2>
            <p>
              Reimagined Ideas is built for organizations that want STEM programming
              students will actually remember. Reach out to talk through dates, age
              groups, and the format that makes sense for your program.
            </p>
          </div>

          <div className="cta-actions">
            <a
              className="button button-primary"
              href="mailto:contact@reimaginedideas.com?subject=Summer%20Workshop%20Inquiry"
            >
              contact@reimaginedideas.com
            </a>
            <a className="button button-secondary" href="https://www.reimaginedideas.com">
              reimaginedideas.com
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <p>Reimagined Ideas, LLC</p>
        <p>Hands-on STEM education for curious young creators.</p>
      </footer>
    </main>
  );
}
