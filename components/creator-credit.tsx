import { creator, conceptProject, creatorContactLinks } from "@/config/creator";
import { ArrowUpRight, Github, Linkedin, Mail, MessageCircle } from "@/components/icons";

export function CreatorCredit() {
  const contacts = creatorContactLinks();

  return (
    <section className="creator-layer" aria-labelledby="creator-name" data-project={conceptProject.name}>
      <div className="creator-profile">
        <span className="eyebrow creator-concept">{conceptProject.status}</span>
        <p className="creator-byline">Designed &amp; developed by</p>
        <h2 id="creator-name">{creator.name}</h2>
        <p className="creator-title">{creator.title}</p>
        <p className="creator-location">{creator.location}</p>
        <p className="creator-availability"><span aria-hidden="true" />{creator.availability}</p>
      </div>

      <div className="creator-inquiry">
        <h3>Have a similar project in mind?</h3>
        <p className="creator-invitation"><em>Let&apos;s build something together.</em></p>
        <p className="creator-scope">Websites, applications, and digital products.</p>

        <div className="creator-actions">
          <details className="creator-contact">
            <summary className="button creator-start" data-analytics-event="creator_start_project" aria-controls="creator-contact-options">
              Start a Project <ArrowUpRight size={17} strokeWidth={1.5} />
            </summary>
            <div className="creator-contact-options" id="creator-contact-options">
              <p>Choose how you&apos;d like to get in touch.</p>
              <a href={contacts.whatsapp} target="_blank" rel="noopener noreferrer" data-analytics-event="creator_whatsapp">
                <MessageCircle size={18} strokeWidth={1.5} />
                <span><strong>WhatsApp</strong><small>{creator.whatsappDisplay}</small></span>
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </a>
              <a href={contacts.email} data-analytics-event="creator_email">
                <Mail size={18} strokeWidth={1.5} />
                <span><strong>Email</strong><small>{creator.email}</small></span>
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </a>
            </div>
          </details>

          {creator.portfolioUrl && (
            <a className="creator-portfolio" href={creator.portfolioUrl} target="_blank" rel="noopener noreferrer" data-analytics-event="creator_portfolio">
              View Portfolio <ArrowUpRight size={16} strokeWidth={1.5} />
            </a>
          )}
        </div>

        <nav className="creator-socials" aria-label="Creator professional profiles">
          <a href={creator.linkedinUrl} target="_blank" rel="noopener noreferrer" data-analytics-event="creator_linkedin"><Linkedin size={15} strokeWidth={1.5} />LinkedIn</a>
          <a href={creator.githubUrl} target="_blank" rel="noopener noreferrer" data-analytics-event="creator_github"><Github size={15} strokeWidth={1.5} />GitHub</a>
        </nav>
      </div>
    </section>
  );
}
