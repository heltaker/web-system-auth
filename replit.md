# Web System Auth

## Overview

A full-stack web application providing user authentication and data management capabilities. The system features user registration/login with MD5 password hashing and a CRUD interface for managing data records. Built with Spring Boot on the backend and vanilla JavaScript on the frontend, with Supabase as the cloud database provider.

## Recent Changes (October 27, 2025)

Successfully refactored from Node.js/Express to Java/Spring Boot:
- Migrated backend from Express.js to Spring Boot 3.2.0
- Preserved all authentication and CRUD functionality
- Enhanced UI with modern CSS gradients and animations
- Added comprehensive input validation and error handling
- Fixed DOM loading issues in frontend
- Configured for deployment with Maven build system

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: Vanilla HTML, CSS, and JavaScript with no frontend framework dependencies.

**Design Pattern**: Multi-page application (MPA) with three main views:
- Landing page (index.html) - Welcome page with "Get Started" button
- Authentication page (login.html) - Handles both login and registration with toggle
- Data management page (data.html) - CRUD operations interface with search

**State Management**: Client-side uses simple DOM manipulation and fetch API for server communication. No session persistence or token storage is implemented - authentication state is not maintained across page refreshes.

**UI/UX Approach**: Modern gradient-based design with purple theme (#667eea to #764ba2), centered container layout with smooth animations, responsive form validation with color-coded user feedback messages (red for errors, green for success), and enhanced accessibility.

**Validation & Error Handling**:
- Client-side validation for empty fields
- Minimum password length requirement (4 characters)
- User-friendly error messages for all operations
- Network error handling with graceful fallbacks
- Auto-hiding messages after 5 seconds

### Backend Architecture

**Framework**: Spring Boot 3.2.0 with embedded Tomcat server.

**Server Configuration**: 
- Port 5000 (configured for Replit environment)
- Host 0.0.0.0 (required for Replit web preview)
- Static file serving from `src/main/resources/public/`
- CORS enabled for all origins

**API Design**: RESTful endpoints with comprehensive error handling:
- `POST /register` - User registration with validation and MD5 password hashing
- `POST /login` - User authentication with credential verification
- `GET /data` - Retrieve all data records
- `POST /data` - Create new data record with validation
- `PUT /data/{id}` - Update existing data record
- `DELETE /data/{id}` - Delete data record

**Project Structure**:
```
src/main/java/com/websystem/
├── Application.java              # Spring Boot main application class
├── config/
│   ├── SupabaseConfig.java      # Supabase connection configuration
│   └── WebConfig.java           # CORS and static resource configuration
├── controller/
│   ├── AuthController.java      # Authentication endpoints
│   └── DataController.java      # CRUD endpoints
├── model/
│   ├── User.java                # User entity model
│   └── DataRecord.java          # Data record entity model
└── service/
    └── SupabaseService.java     # Supabase REST API integration
```

**Security Considerations**: 
- Passwords are hashed using MD5 algorithm via Apache Commons Codec (NOTE: MD5 is cryptographically weak and should be replaced with bcrypt for production)
- Input validation on all endpoints
- No JWT or session tokens implemented
- No authorization checks on data endpoints
- Environment variables for sensitive configuration

### Data Storage

**Database**: Supabase (PostgreSQL-based cloud service)

**Connection Method**: Direct REST API calls using OkHttp client library with anonymous key authentication.

**Schema Structure**:
- `users` table: Stores user credentials
  - `id` (UUID, auto-generated)
  - `login` (username, unique)
  - `hashed_password` (MD5 hash)
  
- `data` table: Stores user data records
  - `id` (UUID, auto-generated)
  - `content` (text)
  - `user_id` (foreign key reference)

**Environment Configuration**: Database credentials stored in `.env` file:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Anonymous API key for authentication

## Dependencies

### Build System

**Maven** - Project and dependency management
- Spring Boot Maven Plugin for executable JAR packaging
- Compiler target: Java 17

### Java Dependencies

**Spring Boot Starters**:
- `spring-boot-starter-web` - Web application with embedded Tomcat

**HTTP & JSON**:
- `okhttp` v4.12.0 - HTTP client for Supabase REST API calls
- `gson` - JSON serialization/deserialization

**Utilities**:
- `commons-codec` - MD5 password hashing utilities
- `postgresql` - PostgreSQL driver (transitive dependency)

**Supabase** (attempted but using direct REST API instead):
- Direct REST API integration via OkHttp client

## Development & Deployment

**Local Development**:
```bash
# Build the application
mvn clean package -DskipTests

# Run the application
export $(cat .env | xargs) && java -jar target/web-system-auth-1.0.0.jar
```

**Deployment Configuration**:
- Build command: `mvn clean package -DskipTests`
- Run command: `java -jar target/web-system-auth-1.0.0.jar`
- Deployment target: Autoscale (stateless web application)
- Environment variables loaded automatically from .env

**Workflow**:
- Single workflow "Server" runs the Spring Boot application on port 5000
- Auto-restarts on file changes during development

## Future Enhancements

As suggested by code review:
1. Add automated integration tests for Supabase-backed endpoints
2. Replace placeholder user ID in data forms with authenticated user context
3. URL-encode query parameters in SupabaseService for special character handling
4. Upgrade from MD5 to bcrypt for password hashing
5. Implement JWT-based authentication for session management
6. Add user-specific data filtering (currently shows all records)
