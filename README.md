# Project: CDN for E-commerce

This project is a sophisticated and scalable **Content Delivery Network (CDN)** specifically designed to meet the high demands of modern e-commerce applications. It's a comprehensive, multi-component system engineered for high performance, reliability, and observability. The architecture includes a powerful origin server, an intelligent edge cache, a robust load balancer, and a complete monitoring stack.

## Core Components & Architecture

The system is composed of several key services, orchestrated together using Docker Compose.
<img width="1019" alt="image" src="https://github.com/user-attachments/assets/e1ff527e-4bde-4dc3-95db-68f456e2e6ce" />


### 1. Origin Server (`origin`)

The backend is a robust and scalable server-side application that forms the core of the CDN's logic.

* **Framework**: `NestJS` (a progressive Node.js framework)
* **Language**: `TypeScript`
* **Key Modules & Integrations**:
    * **Minio Module**: For interacting with a `Minio` object storage service, which acts as the primary source for assets.
    * **Redis Module**: For in-memory caching and messaging, enabling fast data retrieval and communication between services.
    * **File Service & Controller**: Exposes API endpoints for managing files, including uploads and retrievals.
    * **HTTP Metrics Middleware**: Gathers metrics for monitoring with Prometheus.

### 2. Edge Server (`edge-server`)

Positioned at the edge of the network, this component is responsible for caching content closer to users, reducing latency and offloading the origin server.

* **Web Server**: `NGINX`
* **Key Features**:
    * **Advanced Caching**: Configured to define and manage a local cache of assets.
    * **Lua Scripting**: Uses `Lua` scripts for dynamic request processing and intelligent cache management.
        * `process-cache.lua`: Handles cache logic.
        * `redis-subscribe.lua`: Subscribes to Redis channels for cache invalidation events.
    * **S3 Proxy**: Proxies requests to the S3-compatible Minio backend when content is not in the cache.

### 3. Load Balancer (`load-balancer`)

To ensure high availability and distribute incoming traffic efficiently, an NGINX-based load balancer sits in front of the edge servers.

* **Web Server**: `NGINX`
* **Features**:
    * **Custom Load Balancing**: Utilizes a `Lua` script (`loadbalancer.lua`) for implementing custom routing logic.
    * **VTS Module**: Includes the NGINX Virtual Host Traffic Status (VTS) module for real-time monitoring.

### 4. Monitoring & Observability (`monitoring`)

The project includes a comprehensive monitoring stack to provide deep insights into the CDN's performance and health.

* **Metrics Collection**: `Prometheus` is configured to scrape metrics from the origin, edge, and load balancer services.
* **Visualization**: `Grafana` is used to create dashboards for visualizing the collected metrics.
* **Log Aggregation**: The setup includes a Grafana Loki Explore plugin, suggesting integration with `Loki` for centralized log analysis.

### 5. Orchestration & Testing

The entire infrastructure is managed and run using modern DevOps practices.

* **Containerization**: `Docker Compose` (`docker-compose.yml`) is used to define, link, and run all the services (origin, edge, load balancer, Minio, Redis, Prometheus, Grafana).
* **Load Testing**: The repository includes `Lua` scripts and shell commands (`load_tests.lua`, `load_tests.sh`) to simulate high traffic and test the system's performance under stress.
