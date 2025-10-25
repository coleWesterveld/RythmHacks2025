# Guardian Analytics - Privacy-Preserving Data Analytics Platform

A modern web application that allows organizations to safely distribute access to sensitive datasets using differential privacy.

## 🚀 Features

### Admin Dashboard (Data Holder View)
- **Dataset Management**: Monitor privacy budgets, researchers, and query activity
- **Researcher Management**: Invite and manage researcher access with epsilon budget allocation
- **Activity Log**: Complete audit trail of all queries and access changes
- **Privacy Budget Visualization**: Real-time tracking of epsilon consumption

### Analyst Workspace (Researcher View)
- **Project Dashboard**: View authorized projects and privacy budgets
- **Schema Explorer**: Browse available datasets and queryable columns
- **Query Composer**: Visual query builder with privacy/accuracy trade-off slider
- **Results Panel**: View differentially private results with privacy certificates

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **Vite 7** - Build tool
- **React Router** - Routing
- **Zustand** - State management
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **Axios** - API client
- **Recharts** - Data visualization

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── admin/           # Admin-specific components
│   │   │   ├── DatasetCard.jsx
│   │   │   ├── ResearcherTable.jsx
│   │   │   └── ActivityLog.jsx
│   │   ├── analyst/         # Analyst-specific components
│   │   │   ├── SchemaExplorer.jsx
│   │   │   ├── QueryComposer.jsx
│   │   │   └── ResultsPanel.jsx
│   │   ├── shared/          # Shared components
│   │   │   ├── Header.jsx
│   │   │   ├── PrivacyBudgetIndicator.jsx
│   │   │   └── EpsilonSlider.jsx
│   │   └── layout/
│   │       └── MainLayout.jsx
│   ├── pages/               # Page components
│   │   ├── AdminDashboard.jsx
│   │   ├── ResearcherManagement.jsx
│   │   ├── ActivityLog.jsx
│   │   ├── AnalystWorkspace.jsx
│   │   └── ProjectDashboard.jsx
│   ├── services/            # API and utility services
│   │   ├── api.js           # Backend API calls
│   │   └── dpEngine.js      # Differential privacy calculations
│   ├── store/
│   │   └── useStore.js      # Zustand global state
│   ├── utils/
│   │   └── helpers.js       # Helper functions
│   ├── data/
│   │   └── mockData.js      # Mock data for demo
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚦 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 🎨 Design System

### Colors
- **Primary**: `#1E40AF` (Deep Blue) - Trust, security
- **Secondary**: `#0D9488` (Teal) - Data, analytics
- **Success**: `#059669` (Green)
- **Warning**: `#D97706` (Amber)
- **Danger**: `#DC2626` (Red)

### Typography
- **Headers**: Bold, sans-serif (system fonts)
- **Body**: Regular sans-serif
- **Code/Numbers**: Monospace

## 🔐 Key Concepts

### Differential Privacy (DP)
Mathematical privacy guarantee that protects individual records while allowing accurate aggregate statistics.

### Epsilon (ε) Budget
- **Lower ε**: Stronger privacy, more noise
- **Higher ε**: Weaker privacy, more accuracy
- Each query consumes part of the researcher's epsilon budget
- When budget is exhausted, no more queries can be run

### Privacy Budget Visualization
- 🟢 Green (>60% remaining): Healthy budget
- 🟡 Yellow (30-60%): Caution
- 🔴 Red (<30%): Budget low

## 🔄 User Flows

### Admin Flow
1. View datasets and their privacy budgets
2. Invite researchers with specific dataset access
3. Allocate epsilon budgets per researcher
4. Monitor all query activity in real-time
5. Export compliance reports

### Analyst Flow
1. View authorized projects
2. Select a project to open workspace
3. Explore available data schema
4. Build queries with visual composer
5. Adjust privacy/accuracy trade-off
6. Execute query and view noisy results
7. Download privacy certificates

## 🔧 Configuration

### Environment Variables
Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
```

### Toggle User Role
In `src/App.jsx`, change the `userRole` variable:

```javascript
const userRole = 'analyst'; // or 'analyst'
```

## 📊 Features by Component

### Admin Components

#### DatasetCard
- Privacy budget circular indicator
- Researcher count and query stats
- Status badges
- Action buttons

#### ResearcherTable
- Sortable table with researcher info
- Privacy budget progress bars
- Access level badges
- Quick actions (edit, revoke)

#### ActivityLog
- Timeline of all activities
- Query details with epsilon cost
- Filter by date, researcher, dataset
- Export functionality

### Analyst Components

#### SchemaExplorer
- Tree view of datasets
- Column metadata with tooltips
- Queryable vs. non-queryable indicators
- Type information

#### QueryComposer
- Visual query builder
- SQL mode for advanced users
- Filter builder
- Epsilon slider with real-time cost preview

#### ResultsPanel
- Large metric display
- Privacy certificate
- Accuracy estimates
- Query history
- Download options

## 🧪 Testing

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The `dist/` directory contains the production-ready files.

## 📝 API Integration

The app is designed to work with a backend API. Update `src/services/api.js` to connect to your backend:

```javascript
const API_BASE_URL = 'https://your-api-url.com/api';
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for demonstration purposes.

## 🎯 Future Enhancements

- [ ] User authentication
- [ ] Real-time collaboration
- [ ] Query optimization suggestions
- [ ] Advanced visualization with Recharts
- [ ] Budget allocation recommendations
- [ ] Automated privacy analysis
- [ ] Mobile responsive improvements
- [ ] Dark mode support

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ for privacy-preserving data science
