# WePlay - Sport Venue Reservation System

WePlay is a  web application designed for managing and reserving sports venues (terrains). It provides a seamless experience for clients to book pitches, owners to manage their complexes, and administrators to oversee the entire platform.


### Backend
- **Framework**: Spring Boot 3.5.7
- **Language**: Java 21
- **Database**: PostgreSQL
- **Security**: Spring Security & Keycloak (OAuth2/OIDC)
- **Data Access**: Spring Data JPA
- **Validation**: Bean Validation (Hibernate Validator)
- **Utilities**: Lombok

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **UI Library**: Ant Design (antd)
- **Styling**: Tailwind CSS & PostCSS
- **Routing**: React Router Dom 7
- **Authentication**: Keycloak-js & JWT Decode
- **API Client**: Axios



## ⚙️ Setup & Installation

### Prerequisites
- **Java 21**
- **Node.js** (LTS version)
- **PostgreSQL**
- **Keycloak** server instance
- You need to configure keycloack to work with the project

### Backend Setup
1. Navigate to the `Backend` directory.
2. Configure your database and Keycloak settings in `src/main/resources/application.properties`.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the `Frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```



