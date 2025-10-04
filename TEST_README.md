# Authentication System Test Suite

This directory contains comprehensive unit and integration tests for the NestJS authentication system in the fitness app.

## Test Structure

### Unit Tests
- **`src/auth/auth.service.spec.ts`** - Tests for AuthService including registration, login, password validation, and error handling
- **`src/auth/auth.controller.spec.ts`** - Integration tests for AuthController REST API endpoints  
- **`src/auth/jwt.strategy.spec.ts`** - Tests for JWT Strategy validation logic

### End-to-End Tests
- **`test/auth.e2e-spec.ts`** - Full end-to-end authentication flow tests with real database

### Test Utilities
- **`src/test-utils/test-database.ts`** - Database setup, teardown, and helper utilities
- **`src/test-utils/jest.setup.ts`** - Global Jest configuration for tests

## Test Coverage

### AuthService Unit Tests
✅ User registration (USER and TRAINER roles)  
✅ Password hashing with bcrypt and salt  
✅ Login validation  
✅ JWT token generation  
✅ Duplicate email/username validation  
✅ Error handling for database failures  
✅ Edge cases and input validation  

### AuthController Integration Tests
✅ POST /auth/register endpoint validation  
✅ POST /auth/login endpoint validation  
✅ GET /auth/profile endpoint with JWT authentication  
✅ Request validation with ValidationPipe  
✅ Role-based access for USER and TRAINER  
✅ Error response handling  

### JWT Strategy Tests
✅ JWT token validation  
✅ User lookup from database  
✅ Security - sensitive data exclusion  
✅ Error handling for invalid tokens  

### End-to-End Tests
✅ Complete authentication flows  
✅ Real database operations  
✅ Password hashing verification  
✅ Token generation and validation  
✅ Concurrent request handling  
✅ Special character support  
✅ Security edge cases  

## Running Tests

### All Unit Tests
```bash
npm run test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:cov
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
# Auth Service tests
npm test -- auth.service.spec.ts

# Auth Controller tests  
npm test -- auth.controller.spec.ts

# JWT Strategy tests
npm test -- jwt.strategy.spec.ts

# E2E tests
npm run test:e2e -- auth.e2e-spec.ts
```

## Test Database Setup

The tests use a separate SQLite test database to avoid affecting development data:

- **Unit Tests**: Use mocked PrismaService for isolated testing
- **E2E Tests**: Use real SQLite database (`test.db`) with automatic setup/teardown
- **Database Utilities**: Automatic schema creation, data seeding, and cleanup

## Key Testing Patterns

### 1. Mocking External Dependencies
```typescript
// Mock bcrypt for consistent hashing tests
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
```

### 2. Database Test Isolation
```typescript
beforeEach(async () => {
  await cleanupTestDatabase(); // Clean state for each test
});
```

### 3. Comprehensive Error Testing
```typescript
it('should throw ConflictException when email already exists', async () => {
  // Setup existing user
  // Attempt duplicate registration  
  // Verify correct exception
});
```

### 4. Role-Based Testing
```typescript
it('should register USER vs TRAINER with different roles', async () => {
  // Test both UserRole.USER and UserRole.TRAINER
  // Verify role-specific behavior
});
```

## Test Data

### Sample Users
- **USER**: `test@example.com` / `testuser` / `password123`
- **TRAINER**: `trainer@example.com` / `trainer` / `password123`

### JWT Tokens
- Valid tokens are generated during registration/login
- Invalid tokens are tested for security
- Expired token scenarios are covered

## Security Testing

### Password Security
✅ Passwords are properly hashed with bcrypt  
✅ Salt generation and usage  
✅ Password validation with salt  
✅ No plaintext passwords in responses  

### JWT Security  
✅ Token generation with correct payload  
✅ Token validation and user lookup  
✅ Malformed token rejection  
✅ Expired token handling  

### Input Validation
✅ Email format validation  
✅ Password length requirements  
✅ Username length requirements  
✅ Role validation (USER/TRAINER only)  
✅ SQL injection prevention  
✅ XSS prevention  

## Debugging Tests

### Enable Debug Output
```bash
DEBUG=* npm test
```

### Test Database Inspection
The test database (`test.db`) persists after e2e tests for inspection:
```bash
sqlite3 test.db
.tables
SELECT * FROM User;
```

### Common Issues

1. **Database Connection Errors**
   - Ensure test database is properly cleaned up
   - Check file permissions for `test.db`

2. **JWT Secret Mismatch**  
   - Tests use `test-jwt-secret-key-for-testing-only`
   - Verify environment variable setup

3. **Port Conflicts**
   - E2E tests start a test server
   - Ensure no other services on test ports

## Continuous Integration

These tests are designed to run in CI/CD environments:

- No external dependencies (uses SQLite)
- Deterministic test data and results  
- Proper cleanup and isolation
- Comprehensive error scenarios
- Performance considerations

## Performance Testing

Current test performance benchmarks:
- Unit tests: ~2-5 seconds
- Integration tests: ~5-10 seconds  
- E2E tests: ~15-30 seconds
- Full suite: ~30-45 seconds

## Contributing

When adding new authentication features:

1. Add unit tests to appropriate `.spec.ts` files
2. Add integration tests for new endpoints  
3. Update E2E tests for new user flows
4. Maintain test coverage above 90%
5. Follow existing testing patterns and naming