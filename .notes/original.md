Objective:
This assignment will help you demonstrate your understanding of React fundamentals, Micro Frontend Architecture, authentication/authorization, and JavaScript functions like map, filter, and reduce.

🎯 Requirements
✅ Core Features
Music Library UI
Show a list of songs in a clean UI.
Add filter, sort, and group by features for: 
Album, Artist, Title
Use JavaScript built-in methods like map, filter, reduce.
Micro Frontend Architecture
Split the app into two parts: 
Main App: This will act as the container.
Music Library: A separate app loaded dynamically via Module Federation (Webpack) or any Vite-compatible method.
Integrate the music library into the main app using Module Federation.
Basic Authentication & Role Management
Use a simple in-memory JWT approach (you don’t need to actually validate with a backend).
Create two roles: 
admin: Can add and delete songs.
user: Can only view and filter songs.
Based on the role, show/hide UI controls for adding/removing songs.
Deployment
Deploy both: 
Main application
Micro frontend (Music Library)
Use free platforms like Netlify, Vercel, or GitHub Pages.
Make sure the deployed main app can successfully load the music library micro frontend from its own deployment.

⚙️ Technical Guidelines
React: Use functional components with hooks.
Routing: Optional.
Styling: Keep it simple. Use CSS, Tailwind, or any framework you prefer.
Authentication: Mock JWT in memory. Store it in localStorage or context.
State Management: Use useState, useReducer, or Context API. Avoid Redux.
Build Tools: Vite or Webpack (your choice). Use lazy loading for micro frontend.

✅ Deliverables
GitHub Repository with: 
README.md with: 
How to run locally
How you deployed it
Credentials for demo (admin and user)
Explanation of how micro frontend and role-based auth work
Live Demo Links: 
One for the Main App
One for the Micro Frontend

