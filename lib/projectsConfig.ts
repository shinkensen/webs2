export const projectsConfig = [
  {
    name: "Personal Portfolio Website",
    description: "A modern, responsive portfolio website built with Next.js, React, and TypeScript. Features dynamic animations, scroll-based effects, and integration with GitHub and Hackatime APIs.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Hackatime API"],
    link: "https://i-am-a.dev",
    github: "https://github.com/shinkensen/my_website",
    status: "Active",
    preview: "https://i-am-a.dev" // Can be image URL or website URL for iframe
  },
  {
    name: "Worldle",
    description: "Geography Game with Nextjs + React + A few APIs .",
    technologies: ["React", "Next", "TypeScript","Vercel", "VS Code"],
    link: "https://worldle.i-am-a.dev/",
    github: "https://github.com/shinkensen/IntelliNotes",
    status: "Completed",
    preview: "https://worldle.i-am-a.dev/"// Set to image URL or null
  },
  {
    name: "Intellinotes",
    description: "IntelliNotes is a fully built web application designed for students, teachers, and lifelong learners. Users can upload and access notes, organize them in a searchable database, and rely on a chatbot to clarify concepts or answer questions. The system also supports summarization, making long notes easier to digest, and encourages knowledge exchange across the community.",
    technologies: ["Gemini 2.5 Flash Embedded", "Express", "CORS", "Node.js","VS Code","Hugging Face interference model","Render","AWS S3"],
    link: "https://shinkensen.github.io/IntelliNotes/",
    github: "https://github.com/shinkensen/my_website",
    status: "Completed",
    preview: "https://shinkensen.github.io/IntelliNotes/",// Set to image URL or null
    hackathonWinner: true // Indicates this was a hackathon winning project
  },
  {
    name: "HackaGoal",
    description: "Goal Tracking w/ Hackatime API + React + Next",
    technologies: ["React", "Next", "Typescript","Vercel", "VS Code"],
    link: "https://goal.i-am-a.dev/",
    github: "https://github.com/shinkensen/hackagoal",
    status: "Completed",
    preview: "https://goal.i-am-a.dev/"// Set to image URL or null
  },
  {
    name: "NanoDev",
    description: "Custom Raspberry Pi 2040 Microcontroller Based Development Board",
    technologies: ["EasyEDA", "OWSHLABS", "JLCPCB"],
    github: "https://github.com/shinkensen/nanodev",
    status: "Completed",
    preview: "https://private-user-images.githubusercontent.com/181016693/468928593-52ef4b3c-2bde-43ac-a6f0-6e9227822f87.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjU2ODc1ODksIm5iZiI6MTc2NTY4NzI4OSwicGF0aCI6Ii8xODEwMTY2OTMvNDY4OTI4NTkzLTUyZWY0YjNjLTJiZGUtNDNhYy1hNmYwLTZlOTIyNzgyMmY4Ny5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUxMjE0JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MTIxNFQwNDQxMjlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iNTUwYTE4ZGY0MDg3OTczYWUxOGQwODljNzhkNTZjNjQzYjExZWU2Mjc5NDY2NzNhZmQ0ZjQ5YzVmYjY1OWY5JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.UcbWD8sk7j2-wjCIxxXVbgDY2EVeVaUYTIfka99BNkU"// Set to image URL or null
  },
  {
    name: "Lumor",
    description: "Financial Tracking App For Teens",
    technologies: ["Chart.JS", "Javascript", "Node.JS","Html","CSS"],
    github: "https://github.com/shinkensen/lumor",
    status: "WIP",
    preview: "https://shinkensen.github.io/Lumor/"// Set to image URL or null
  },
   {
    name: "ReactChat",
    description: "Secure Chat App",
    technologies: ["React.JS", "Next.js", "Supabase","AWS S3"],
    link: "https://react-chat-eta-gilt.vercel.app/login",
    github: "https://github.com/shinkensen/ReactChat",
    status: "WIP",
    preview: "https://react-chat-eta-gilt.vercel.app/login"// Set to image URL or null
  },
];

export type ProjectConfig = typeof projectsConfig[0];
