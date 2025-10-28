# Web System Auth

## Обзор

Полнофункциональное веб-приложение, обеспечивающее аутентификацию пользователей и управление данными. Система поддерживает регистрацию/вход пользователей с хешированием паролей по алгоритму MD5 и интерфейс CRUD для управления записями данных. Построено на Spring Boot на бэкенде и vanilla JavaScript на фронтенде, с Supabase в качестве поставщика облачной базы данных.

## Последние изменения (27 октября 2025 г.)

Успешно переработано с Node.js/Express на Java/Spring Boot:
- Миграция бэкэнда с Express.js на Spring Boot 3.2.0
- Сохранение всех функций аутентификации и CRUD
- Улучшенный интерфейс с современными CSS-градиентами и анимацией
- Добавлена комплексная проверка вводимых данных и обработка ошибок
- Исправлены проблемы с загрузкой DOM в фронтенде
- Настроено для развертывания с помощью системы сборки Maven

## Пользовательские настройки

Предпочтительный стиль общения: простой, повседневный язык.

## Архитектура системы

### Архитектура фронтенда

**Технологический стек**: Vanilla HTML, CSS и JavaScript без зависимостей от фронтенд-фреймворков.

**Шаблон проектирования**: многостраничное приложение (MPA) с тремя основными видами:
- Начальная страница (index.html) - страница приветствия с кнопкой "Get Started"
- Страница аутентификации (login.html) - обрабатывает как вход, так и регистрацию с помощью переключателя
- Страница управления данными (data.html) - интерфейс операций CRUD с поиском

**Управление состоянием**: На стороне клиента используется простая манипуляция DOM и API fetch для связи с сервером. Не реализовано сохранение сеанса или хранение токенов — состояние аутентификации не сохраняется при обновлении страницы.

**Подход к UI/UX**: современный дизайн на основе градиента с фиолетовой темой (#667eea до #764ba2), центрированная компоновка контейнера с плавными анимациями, адаптивная проверка форм с цветными сообщениями обратной связи для пользователей (красный для ошибок, зеленый для успешного выполнения) и улучшенная доступность.

**Проверка и обработка ошибок**:
- Клиентская проверка пустых полей
- Минимальное требование к длине пароля (4 символа)
- Удобные для пользователя сообщения об ошибках для всех операций
- Обработка сетевых ошибок с плавными резервными вариантами
- Автоматическое скрытие сообщений через 5 секунд

### Архитектура бэкэнда

**Фреймворк**: Spring Boot 3.2.0 со встроенным сервером Tomcat.
**Конфигурация сервера**: 
- Порт 5000 (настроен для среды Replit)
- Хост 0.0.0.0 (требуется для веб-превью Replit)
- Обслуживание статических файлов из `src/main/resources/public/`
- CORS включен для всех источников

**API Design**: RESTful endpoints с комплексной обработкой ошибок:
- `POST /register` - Регистрация пользователя с проверкой и хешированием пароля MD5
- `POST /login` - Аутентификация пользователя с проверкой учетных данных
- `GET /data` - извлечение всех записей данных
- `POST /data` - создание новой записи данных с проверкой
- `PUT /data/{id}` - обновление существующей записи данных
- `DELETE /data/{id}` - удаление записи данных

**Структура проекта**:
```
src/main/java/com/websystem/
├── Application.java              # Основной класс приложения Spring Boot
├── config/
│   ├── SupabaseConfig.java      # Конфигурация подключения Supabase
│   └── WebConfig.java           # Конфигурация CORS и статических ресурсов
├── controller/
│   ├── AuthController.java      # Конечные точки аутентификации
│   └── DataController.java      # CRUD endpoints
├── model/
│   ├── User.java                # Модель сущности пользователя
│   └── DataRecord.java          # Модель сущности записи данных
└── service/
    └── SupabaseService.java     # Интеграция REST API Supabase
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
