# Projects Configuration

## How to Add New Projects

To add a new project to your portfolio, edit the `lib/projectsConfig.ts` file and add a new object to the `projectsConfig` array.

### Project Structure

```typescript
{
  name: "Project Name",
  description: "Brief description of your project (2-3 sentences)",
  technologies: ["Tech1", "Tech2", "Tech3"],  // Array of technologies used
  link: "https://your-live-site.com",  // Set to null if no live site
  github: "https://github.com/username/repo",  // Set to null if no GitHub repo
  status: "Active" | "Completed"  // Current status of the project
}
```

### Example

```typescript
export const projectsConfig = [
  {
    name: "My Awesome App",
    description: "A full-stack web application built with modern technologies. Features real-time updates and responsive design.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
    link: "https://my-awesome-app.com",
    github: "https://github.com/shinkensen/my-awesome-app",
    status: "Active"
  },
  // Add more projects here...
];
```

## Status Options

- **Active**: Currently being developed or maintained
- **Completed**: Finished project, no longer in active development

## Tips

- Keep descriptions concise (2-3 sentences)
- List the most important technologies first
- Use `null` for `link` or `github` if they don't exist
- Projects are displayed in the order they appear in the array
