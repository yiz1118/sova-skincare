export type CreatorConfig = {
  name: string;
  title: string;
  email: string;
  location: string;
  availability: string;
  linkedinUrl: string;
  githubUrl: string;
  whatsappDisplay: string;
  whatsappUrl: string;
  portfolioUrl: string | null;
};

export const creator: CreatorConfig = {
  name: "Alson Chua",
  title: "Independent Web & App Developer",
  email: "alsonchua18@gmail.com",
  location: "Malaysia · Working with clients worldwide",
  availability: "Available for freelance projects worldwide",
  linkedinUrl: "https://www.linkedin.com/in/chua-yiz-063ba9272",
  githubUrl: "https://github.com/yiz1118",
  whatsappDisplay: "+60 11-5857 6386",
  whatsappUrl: "https://wa.me/601158576386",
  portfolioUrl: null,
};

export const conceptProject = {
  name: "SOVA",
  status: "Independent Concept Project",
};

export function creatorContactLinks(profile = creator, projectName = conceptProject.name) {
  const firstName = profile.name.split(" ")[0];
  const message = `Hi ${firstName}, I came across your ${projectName} concept project and I'm interested in discussing a website/app project with you.`;
  const whatsapp = new URL(profile.whatsappUrl);
  whatsapp.searchParams.set("text", message);
  const subject = `Project Inquiry — ${projectName}`;
  const body = `Hi ${firstName},\n\nI came across your ${projectName} concept project and would like to discuss a potential website, app, or digital product.\n\n`;
  return {
    whatsapp: whatsapp.toString(),
    email: `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
