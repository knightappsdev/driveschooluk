# 🚗 DriveConnect UK - SAAS Driving School Platform

A comprehensive Software-as-a-Service platform for driving schools, built with modern web technologies. This platform enables driving schools to manage learners, instructors, and business operations through an intuitive admin dashboard.

## 🌟 Features

### 🎯 Core Business Features
- **Learner Management**: Student registration, profile management, and progress tracking
- **Instructor Management**: Professional instructor profiles and application system
- **Form Management**: Comprehensive visitor inquiry and registration handling
- **Content Management**: Easy frontend content editing through admin dashboard
- **Analytics Dashboard**: Real-time metrics and business intelligence
- **Responsive Design**: Mobile-first approach with modern UI/UX

### 🛠️ Technical Features
- **TypeScript**: Full type safety with strict mode enabled
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tooling and development server
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint**: Code quality and consistency enforcement
- **Production Ready**: Optimized builds with code splitting

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/driveconnect-uk.git
   cd driveconnect-uk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Main Website: `http://localhost:5173/`
   - Admin Dashboard: `http://localhost:5173/dashboard`

## 📱 Available Routes

| Route | Description | Features |
|-------|-------------|----------|
| `/` | Main landing page | Hero section, courses, testimonials |
| `/dashboard` | Admin dashboard | Management interface, analytics |
| `/learner-signup` | Student registration | Multi-step form with validation |
| `/instructor-signup` | Instructor application | Professional signup form |
| `/signin` | User authentication | Login interface |

## 🛠️ Development

### Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Code linting
npm run lint

# Type checking
npm run typecheck

# Preview production build
npm run preview
```

### Code Quality

The project maintains high code quality standards:

- **TypeScript Strict Mode**: Full type safety enabled
- **ESLint Configuration**: Comprehensive linting rules
- **Zero Build Errors**: Clean production builds
- **VS Code Integration**: Optimized development experience

### VS Code Setup

The project includes VS Code configuration files:
- `.vscode/settings.json`: Editor settings and formatting
- `.vscode/extensions.json`: Recommended extensions
- `.vscode/launch.json`: Debug configuration

**Recommended Extensions:**
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- JSON Language Support

## 📊 Project Structure

```
driveconnect-uk/
├── 📁 src/
│   ├── 📁 components/          # Reusable UI components
│   │   ├── 📁 dashboard/       # Dashboard-specific components
│   │   ├── Button.tsx          # UI components
│   │   └── ...
│   ├── 📁 pages/              # Route components
│   │   ├── DashboardPage.tsx   # Admin dashboard
│   │   ├── LearnerSignupPage.tsx
│   │   └── ...
│   ├── 📁 services/           # Business logic
│   │   └── formSubmissionService.ts
│   ├── App.tsx                # Main application component
│   └── main.tsx              # Application entry point
├── 📁 database/              # Database schemas
│   └── schema_optimized.sql  # Optimized database design
├── 📁 .vscode/              # VS Code configuration
├── 📄 package.json          # Dependencies and scripts
├── 📄 tsconfig.json         # TypeScript configuration
├── 📄 vite.config.ts        # Vite configuration
└── 📄 tailwind.config.js    # Tailwind CSS configuration
```

## 🗄️ Database Architecture

The platform includes a comprehensive database schema optimized for SAAS operations:

- **Users Table**: Authentication and role management
- **Learner Profiles**: Student information and progress
- **Instructor Profiles**: Professional instructor data
- **Form Submissions**: Visitor inquiries and registrations
- **Content Management**: Dynamic frontend content
- **System Settings**: Platform configuration

See `database/schema_optimized.sql` for the complete schema.

## 🎨 Dashboard Features

### Overview Section
- Real-time metrics and KPIs
- Interactive charts and analytics
- Recent activity feeds
- Quick action buttons

### User Management
- Learner profile management
- Instructor application processing
- User role and permissions
- Activity tracking

### Form Management
- Visitor inquiry handling
- Registration processing
- Status tracking (new → contacted → converted)
- Email template management

### Content Management
- Frontend content editing
- Hero section customization
- Course package management
- Testimonials and features

### Settings Management
- System configuration
- Email settings
- Business policies
- User preferences

## 🚀 Deployment

### Production Build

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Preview build locally**
   ```bash
   npm run preview
   ```

### Deployment Options

- **Vercel**: Zero-config deployment for Vite apps
- **Netlify**: Continuous deployment from Git
- **AWS S3 + CloudFront**: Scalable static hosting
- **Docker**: Containerized deployment

## 🔧 Configuration

### Environment Variables

Create a `.env` file for environment-specific settings:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=DriveConnect UK
VITE_CONTACT_EMAIL=info@driveconnectuk.com
```

### Vite Configuration

The project is configured for optimal development and production:

- **Development**: Fast HMR and debugging
- **Production**: Optimized builds with code splitting
- **TypeScript**: Full type checking and IntelliSense

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

- Follow TypeScript strict mode guidelines
- Use ESLint configuration for code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- 📧 Email: info@driveconnectuk.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/driveconnect-uk/issues)
- 📚 Docs: [Documentation](https://docs.driveconnectuk.com)

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core SAAS platform
- ✅ Admin dashboard
- ✅ User management
- ✅ Form management

### Phase 2 (Next)
- 🔐 Authentication system
- 📧 Email notifications
- 💳 Payment integration
- 📱 Mobile app

### Phase 3 (Future)
- 🤖 AI-powered matching
- 📊 Advanced analytics
- 🌍 Multi-tenant support
- 📺 Video lessons

---

**Built with ❤️ for the driving education industry**

Transform your driving school with modern technology and streamlined operations.