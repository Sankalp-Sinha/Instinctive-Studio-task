# SecureSight Dashboard

SecureSight Dashboard is a CCTV monitoring software that allows users to monitor live feeds, detect incidents through computer vision models, and manage incidents. This project focuses on building the frontend dashboard and a basic backend API.

## Live URL

[https://securesight-dashboard.vercel.app/](https://securesight-dashboard.vercel.app/)

## Public GitHub Repo

[https://github.com/Sankalp-Sinha/Instinctive-Studio-task](https://github.com/Sankalp-Sinha/Instinctive-Studio-task)

## Deployment Instructions

To deploy and run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Sankalp-Sinha/Instinctive-Studio-task](https://github.com/Sankalp-Sinha/Instinctive-Studio-task)
    cd SecureSight-Dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up the database:**
    This project uses PostgreSQL. Ensure you have PostgreSQL installed and running, or use a service like Neon, Supabase, or PlanetScale.

    Create a `.env` file in the root directory and add your database URL:
    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    ```

4.  **Run Prisma migrations and seed the database:**
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```
    This will set up your database schema and populate it with initial camera and incident data.

5.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

6.  **Open in your browser:**
    The application will be accessible at `http://localhost:3000`.

## Tech Decisions

* **Next.js 15 App Router:** Chosen for its powerful routing capabilities, server components, and overall performance benefits, providing a modern and efficient development experience.
* **React (with Hooks):** Utilized for building interactive UI components, leveraging `useState` and `useEffect` for managing component state and side effects.
* **Tailwind CSS:** Employed for rapid UI development with a utility-first CSS framework, allowing for highly customizable designs directly in the JSX.
* **Prisma:** Selected as the ORM (Object-Relational Mapper) for seamless database interaction. Its type-safe client and easy migrations simplify data management and queries.
* **PostgreSQL:** A robust and scalable relational database chosen for its reliability and suitability for structured data.
* **Vercel:** Used for deployment due to its excellent integration with Next.js and ease of use for continuous deployment.
* **Lucide React:** A library for consistent and high-quality SVG icons, enhancing the visual appeal of the dashboard.

## If I had more time...

* **Real-time Incident Updates:** Implement WebSockets (e.g., Socket.IO) for real-time updates of new incidents and resolution status without requiring manual page refreshes.
* **User Authentication and Authorization:** Add a proper authentication system (e.g., NextAuth.js) to secure API routes and manage user roles and permissions.
* **Video Streaming Integration:** Replace static image placeholders in the Incident Player with actual video streams (even simulated ones) to provide a more dynamic experience.
* **Configurable Timeline:** Allow users to adjust the timeline's time window (e.g., last 12 hours, custom range) and zoom levels for more detailed analysis.
* **Notifications:** Implement desktop notifications or in-app alerts for new critical incidents.
* **Testing:** Add unit, integration, and end-to-end tests (e.g., using Jest, React Testing Library, Cypress) to ensure application stability and prevent regressions.
* **Pagination/Infinite Scrolling:** For the incident list, implement pagination or infinite scrolling to efficiently handle a large number of incidents.