# LifeHub

A comprehensive full-stack life management application that helps you organize your tasks, track your finances, capture your thoughts, and monitor your mood. Built with modern web technologies for a seamless user experience.

## 🌟 Features

### 📊 Dashboard
- Real-time overview of all your data
- Financial summary with income, expenses, and net balance
- Task completion statistics
- Note count tracking
- Average mood monitoring

### ✅ Task Management
- Create, edit, and delete tasks
- Set due dates and priorities
- Mark tasks as completed
- Filter by status (To Do, In Progress, Done)
- Search functionality

### 📝 Notes
- Create and organize personal notes
- Rich text content support
- Timestamp tracking
- Easy search and management

### 💰 Finance Tracking
- Track income and expenses
- Categorize transactions
- Visual charts and analytics
- Financial goal setting
- Transaction history with filtering

### 😊 Mood Tracking
- Daily mood logging
- Mood level visualization
- Trends and patterns
- Personal insights

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes and data

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **Heroicons** - Beautiful icon set

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Auto-restart for development
- **Vite** - Frontend build tooling

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/RafaelMota02/lifehub.git
   cd lifehub
   ```

2. **Set up the database**
   ```bash
   # Create a PostgreSQL database
   createdb lifehub_db

   # Run the database schema
   psql -d lifehub_db -f server/db/schema.sql
   ```

3. **Configure environment variables**
   ```bash
   cd server
   cp .env.example .env  # Create from example if it exists
   ```

   Edit `.env` with your configuration:
   ```
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/lifehub_db
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Install backend dependencies and start**
   ```bash
   npm install
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
lifehub/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # Global styles
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── routes/           # API route definitions
│   ├── db/               # Database files and migrations
│   ├── middleware/       # Express middleware
│   └── package.json
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Tasks
- `GET /api/tasks` - Get all tasks for user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Notes
- `GET /api/notes` - Get all notes for user
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Finances
- `GET /api/finances` - Get all financial transactions
- `POST /api/finances` - Create new transaction
- `PUT /api/finances/:id` - Update transaction
- `DELETE /api/finances/:id` - Delete transaction

### Moods
- `GET /api/moods` - Get all mood entries
- `POST /api/moods` - Create new mood entry

## 💡 Usage

1. **Register/Login** - Create an account or log in to access your dashboard
2. **Dashboard** - View your personalized overview with real-time statistics
3. **Tasks** - Add, organize, and track your tasks with due dates and priorities
4. **Notes** - Capture and organize your thoughts and ideas
5. **Finances** - Track income and expenses with visual charts
6. **Mood** - Log daily moods to track your emotional well-being

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
npm run dev      # Start with nodemon (auto-restart)
```

### Code Style
- Follow React best practices
- Use ESLint configuration for consistent code style
- Write meaningful commit messages
- Keep components small and focused

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React, Express, and PostgreSQL
- Styled with Tailwind CSS
- Icons from Heroicons
- Charts powered by Chart.js

---

**Happy organizing! 🎯**
