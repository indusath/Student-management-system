# Student Management System (SMS) - Microservices Project

This project is a comprehensive Student Management System built with a modern **Microservices Architecture**. It is designed to be scalable, maintainable, and easy to deploy using Docker.

## 🚀 Quick Start

To get the project up and running immediately, please follow the detailed steps in our sharing guide:

👉 **[View the Sharing & Running Guide](./SHARE_GUIDE.md)**



## 🛠️ Tech Stack

- **Backend:** Java 17, Spring Boot, Spring Cloud (Eureka, Feign, API Gateway)
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Database:** MySQL (Separate instances for each microservice)
- **DevOps:** Docker, Docker Compose
- **Other:** AOP for Audit Logging, RESTful APIs, JWT Authentication

## Key Features

- **Decentralized Services:** Separate services for Students, Courses, Auth, and Auditing.
- **Automated Audit Trail:** Every sensitive action is automatically logged via AOP.
- **Service Discovery:** Eureka manages service addresses dynamically.
- **Portability:** Entire system runs in containers, ensuring "it works on my machine" everywhere.

