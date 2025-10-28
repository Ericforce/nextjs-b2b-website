# Contributing Guide

Thank you for your interest in contributing to this project! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js v18.17.0 or higher
- npm v9.0.0 or higher
- Git

### Setup

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/project-name.git
   cd project-name
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/project-name.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Fill in your values
   ```
6. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Creating a New Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### Keeping Your Branch Updated

Regularly sync with the main repository:

```bash
git fetch upstream
git rebase upstream/main
```

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types, avoid `any` when possible
- Use interfaces for object shapes
- Export types that might be reused

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}

// Avoid
export function Button(props: any) {
  // ...
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use meaningful component and prop names

```typescript
// Good - Small, focused component
export function UserAvatar({ user }: { user: User }) {
  return (
    <img 
      src={user.avatarUrl} 
      alt={`${user.name}'s avatar`}
      className="rounded-full"
    />
  );
}

// Avoid - Too many responsibilities
export function UserProfile() {
  // Fetching, state management, rendering all in one component
}
```

### File Naming

- Components: PascalCase (e.g., `Button.tsx`, `UserCard.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`, `apiClient.ts`)
- Constants: UPPER_SNAKE_CASE in files (e.g., `API_URL` in `constants.ts`)

### CSS/Tailwind

- Use Tailwind utility classes primarily
- Create custom components for repeated patterns
- Follow mobile-first approach
- Group related utilities

```tsx
// Good - Organized classes
<button className="
  px-4 py-2 
  rounded-lg 
  bg-blue-600 hover:bg-blue-700 
  text-white font-medium
  transition-colors
">
  Click me
</button>
```

### Code Formatting

- We use Prettier for consistent formatting
- Run `npm run format` before committing
- Configure your editor to format on save

### ESLint

- Follow ESLint rules configured in the project
- Run `npm run lint` to check for issues
- Fix issues with `npm run lint:fix`

## 🧪 Testing Guidelines

### Writing Tests

All new features should include tests:

```typescript
// components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (useful during development)
npm run test:watch

# With coverage
npm run test:coverage
```

### Test Coverage

- Aim for at least 80% coverage
- Focus on critical paths and edge cases
- Don't test implementation details

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(blog): add pagination to blog listing

Add pagination component to handle large number of blog posts.
Uses URL query params to maintain state.

Closes #123

---

fix(contact): validate email format before submission

Prevent form submission with invalid email addresses.

---

docs(readme): update installation instructions

Add troubleshooting section for common setup issues.
```

### Commit Best Practices

- Use present tense ("add feature" not "added feature")
- Keep subject line under 72 characters
- Reference issues and pull requests
- Explain the "why" not just the "what"

## 🔀 Pull Request Process

### Before Submitting

1. **Update your branch**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run checks locally**:
   ```bash
   npm run lint
   npm run format
   npm test
   npm run build
   ```

3. **Test your changes**:
   - Test in development mode
   - Test in production build
   - Test on different screen sizes
   - Test in different browsers

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Tested locally

## Screenshots (if applicable)
Add screenshots or GIFs

## Related Issues
Closes #[issue number]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex logic
- [ ] Updated documentation
- [ ] No new warnings or errors
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by at least one maintainer
3. **Address feedback** and push updates
4. **Approval** and merge by maintainer

### After Merge

- Delete your branch:
  ```bash
  git branch -d feature/your-feature-name
  git push origin --delete feature/your-feature-name
  ```
- Update your local main:
  ```bash
  git checkout main
  git pull upstream main
  ```

## 📁 Project Structure

### Where to Add Code

- **New component**: `/components/ui/` or `/components/sections/`
- **New page**: `/app/(site)/your-page/page.tsx`
- **New API route**: `/app/api/your-route/route.ts`
- **Utilities**: `/lib/utils.ts` or new file in `/lib/`
- **Sanity schema**: `/sanity/schemas/documents/` or `/sanity/schemas/objects/`
- **Tests**: Mirror the structure in `/tests/`

### Import Aliases

Use the configured path aliases:

```typescript
// Good
import { Button } from '@/components/ui/Button';
import { client } from '@/lib/sanity/client';

// Avoid
import { Button } from '../../../components/ui/Button';
```

## 🐛 Reporting Bugs

### Before Reporting

- Search existing issues
- Try the latest version
- Gather reproduction steps

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. macOS]
- Browser: [e.g. Chrome 120]
- Node version: [e.g. 18.17.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other relevant information
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Testing Library Documentation](https://testing-library.com/docs)

## ❓ Questions?

- Check the [README.md](./README.md)
- Search existing issues
- Ask in discussions
- Contact maintainers

Thank you for contributing! 🎉
