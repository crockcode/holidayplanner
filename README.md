# Holiday Planner

can you see

A full-stack application for planning and managing holidays, built with Node.js, Express, and React.

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/crockcode/holidayplanner.git
   cd holidayplanner
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Backend (.env):
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5001
     ```
   - Frontend (.env):
     ```
     REACT_APP_API_URL=http://localhost:5001
     ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server (in a new terminal)
   cd frontend
   npm start
   ```

## Project Structure
```
holidayplanner/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

## CI/CD Pipeline

### Continuous Integration (CI)
We use GitHub Actions for CI. The pipeline runs on every push and pull request:

1. **Code Quality Checks**
   - ESLint for code style
   - Prettier for code formatting
   - TypeScript type checking

2. **Testing**
   - Unit tests with Jest
   - Integration tests with Supertest
   - Coverage reporting

3. **Build Verification**
   - Backend build check
   - Frontend build check
   - Dependency audit

### Continuous Deployment (CD)
The CD pipeline is triggered on successful CI and merges to main:

1. **Staging Deployment**
   - Automatic deployment to staging environment
   - Integration tests in staging
   - Performance testing

2. **Production Deployment**
   - Manual approval required
   - Blue-green deployment strategy
   - Automated rollback capability

### Pipeline Stages
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Install Dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      - name: Run Tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Frontend
        run: cd frontend && npm run build
      - name: Build Backend
        run: cd backend && npm run build

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to Staging
        run: |
          # Staging deployment steps
          echo "Deploying to staging..."

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production
        run: |
          # Production deployment steps
          echo "Deploying to production..."
```

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use Prettier for code formatting
- Follow TypeScript best practices

### Testing
- Write unit tests for new features
- Maintain minimum 80% code coverage
- Run tests before committing

### Documentation
- Update README for major changes
- Document API endpoints
- Include JSDoc comments for functions

## Deployment Environments

### Staging
- URL: http://13.236.135.130/
- Branch: develop
- Auto-deployment enabled

### Production
- URL: http://13.236.135.130/
- Branch: main
- Manual approval required

## Monitoring and Logging

### Application Monitoring
- Error tracking with Sentry
- Performance monitoring with New Relic
- Custom metrics dashboard

### Logging
- Structured logging with Winston
- Log aggregation with ELK Stack
- Alert system for critical errors

## Security Measures

1. **Authentication**
   - JWT-based authentication
   - Password hashing with bcrypt
   - Rate limiting on auth endpoints

2. **Data Protection**
   - HTTPS encryption
   - Input validation
   - XSS protection

3. **Access Control**
   - Role-based access control
   - API key management
   - IP whitelisting

## Support and Maintenance

### Getting Help
- Check documentation
- Contact development team
- Submit issues on GitHub

### Regular Maintenance
- Weekly dependency updates
- Monthly security audits
- Quarterly performance reviews

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Project Management with Jira

### Jira Integration
- Project Board: [Holiday Planner Jira Board](https://your-company.atlassian.net/jira/software/projects/HP)
- Issue Tracking: All development tasks are tracked in Jira
- Sprint Planning: Two-week sprint cycles

### Workflow
1. **Issue Creation**
   - Create issues in Jira for new features/bugs
   - Include detailed description and acceptance criteria
   - Assign appropriate priority and story points

2. **Sprint Planning**
   - Weekly sprint planning meetings
   - Story point estimation
   - Sprint backlog grooming

3. **Development Process**
   - Link Jira issues to GitHub branches
   - Update issue status as work progresses
   - Add comments for blockers or questions

4. **Issue Types**
   - Story: New feature or enhancement
   - Bug: Defect or issue
   - Task: General development work
   - Epic: Large feature or project

5. **Status Flow**
   ```
   Backlog → To Do → In Progress → Code Review → Done
   ```

6. **Branch Naming Convention**
   ```
   feature/HP-123-feature-name
   bugfix/HP-456-bug-description
   ```
   Where HP-123 is the Jira issue number

7. **Automation**
   - Automatic issue status updates from GitHub
   - Sprint burndown charts
   - Velocity tracking

8. **Reporting**
   - Sprint reports
   - Velocity metrics
   - Issue analytics

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
