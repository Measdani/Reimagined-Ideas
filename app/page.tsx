import { WorkshopInquiryForm } from "../components/WorkshopInquiryForm";

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

const workshopExperiences = [
  {
    label: "Option 1",
    title: "Hands-On Tech Creation",
    items: [
      "Design and build a personal interactive project",
      "Learn how touch, input, and simple circuits work together",
      "Create something functional they can take home",
      "Explore creativity through guided, beginner-friendly tools",
    ],
  },
  {
    label: "Option 2",
    title: "Bring Ideas to Life with Technology",
    items: [
      "Turn drawings into interactive controls and playable inputs",
      "Discover how everyday materials can power digital interaction",
      "Experiment with cause and effect through real-time feedback",
      "Collaborate and test ideas in a fun, low-pressure environment",
    ],
  },
  {
    label: "Option 3",
    title: "Powering the Future Lab",
    items: [
      "Build smart city, water system, and human body circuit projects",
      "Work in small teams through a 4-day future systems builder camp",
      "Explore real careers like systems engineer, inventor, designer, and environmental engineer",
      "Finish with an innovation challenge and junior systems engineer take-home kit",
    ],
  },
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
    title: "4-day Future Systems Builders Camp",
    description:
      "A kid-focused camp option where students design smart cities, water systems, body circuits, and team inventions.",
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

const flyerHighlights = [
  "Quick snapshot of the workshop, grade range, and learning value",
  "Easy to share with camp leadership, school teams, or program directors",
  "Helpful for internal review before booking dates and finalizing a quote",
];

const flyerDownloads = [
  {
    title: "Reimagined Ideas flyer",
    description: "A general overview for hands-on tech workshops and partner conversations.",
    href: "/techflyer.png",
    fileName: "Reimagined-Ideas-Flyer.png",
  },
  {
    title: "Powering the Future Lab flyer",
    description: "A 4-day kids camp overview for grades 3-8 with daily engineering labs.",
    href: "/powering-future-lab-flyer.png",
    fileName: "Powering-the-Future-Lab-Flyer.png",
  },
];

const quoteHighlights = [
  "Share your dates, location, and group size for a tailored quote",
  "Get guidance on the best workshop format for your students",
  "All tools and materials are provided (excluding computers)",
  "Students will need access to computers for interactive portions",
];

const includedItems = [
  "All materials provided",
  "Setup + breakdown handled",
  "Instructor-led session",
];

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero-section">
        <div className="topbar">
          <a className="brand" href="#top">
            <img
              className="brand-logo"
              src="/reimagined-ideas-logo.png"
              alt="Reimagined Ideas"
            />
            <span className="brand-copy">
              <span className="brand-kicker">Reimagined Ideas</span>
              <span className="brand-subtitle">Interactive Tech Workshops</span>
            </span>
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
            <p className="hero-proof">
              I help camps and schools deliver a premium STEM experience without
              needing tech staff.
            </p>

            <div className="hero-badges" aria-label="Workshop highlights">
              <span>Grades 3-8</span>
              <span>No coding required</span>
              <span>Hands-on STEM</span>
              <span>Summer-ready</span>
            </div>

            <div className="hero-actions">
              <a className="button button-primary" href="#contact">
                Check Availability
              </a>
              <a className="button button-secondary" href="#quote-form">
                Get a Custom Quote in 48 Hours
              </a>
            </div>
          </div>

          <div className="resource-card">
            <p className="card-label">Downloadable flyer</p>
            <h2>Download a one-page overview you can share with your team or program director.</h2>
            <p className="card-text">
              A clear handout helps decision-makers quickly understand the workshop and
              what it would look like in your camp or school setting.
            </p>

            <div className="resource-files" aria-label="Flyer download options">
              {flyerDownloads.map((flyer) => (
                <a
                  className="resource-file"
                  href={flyer.href}
                  download={flyer.fileName}
                  key={flyer.title}
                >
                  <span className="resource-file-type">PNG download</span>
                  <strong>{flyer.title}</strong>
                  <span>{flyer.description}</span>
                </a>
              ))}
            </div>

            <ul className="resource-list">
              {flyerHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="resource-included">
              <p className="resource-subheading">What&apos;s Included</p>
              <ul className="resource-list">
                {includedItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="resource-actions">
              <a
                className="button button-primary"
                href="/powering-future-lab-flyer.png"
                download="Powering-the-Future-Lab-Flyer.png"
              >
                Download Future Lab Flyer
              </a>
              <a className="button button-secondary" href="#contact">
                Check Availability
              </a>
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
            Pilot-ready and designed for real classrooms. Built by a developer with
            experience in interactive systems and hands-on learning design.
          </p>
        </div>
        <p className="outcomes-note">
          Depending on the selected workshop, students can either build a take-home
          project or explore how technology responds to their ideas in real time.
        </p>

        <div className="outcomes-grid outcomes-grid-three">
          {workshopExperiences.map((experience) => (
            <article className="list-card" key={experience.title}>
              <p className="card-label">{experience.label}</p>
              <h3 className="list-card-title">{experience.title}</h3>
              <ul>
                {experience.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="outcomes-cta">
          <a className="button button-primary" href="#quote-form">
            Get a Custom Quote in 48 Hours
          </a>
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
          <p className="pricing-note">
            Workshops typically range from $500-$2,000+ per session depending on group
            size and format.
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
        <div className="contact-grid">
          <div className="cta-panel">
            <div>
              <p className="section-kicker">Let&apos;s create the right fit</p>
              <h2>Bring a hands-on tech workshop to your students.</h2>
              <p>
                Reimagined Ideas is built for organizations that want STEM programming
                students will actually remember. Use the form to request a quote and
                share the details that matter most for your program.
              </p>
            </div>

            <ul className="contact-points">
              {quoteHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="contact-card">
              <p className="card-label">Prefer direct contact?</p>
              <p>
                Email{" "}
                <a href="mailto:contact@reimaginedideas.com">
                  contact@reimaginedideas.com
                </a>{" "}
                or visit{" "}
                <a href="https://www.reimaginedideas.com">reimaginedideas.com</a>.
              </p>
              <p>
                After you submit the form, the goal is to follow up with next steps,
                availability, and pricing guidance.
              </p>
            </div>
          </div>

          <div id="quote-form">
            <WorkshopInquiryForm />
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
