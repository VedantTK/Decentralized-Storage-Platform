# Decentralized Storage Platform

A decentralized file storage platform leveraging **IPFS** and **NFT.Storage** to store and manage files securely. This platform utilizes a full-stack architecture with a backend API and a frontend interface, both deployed in Docker containers.

## Features

- **Decentralized File Storage**: Files are stored securely using IPFS (InterPlanetary File System) and NFT.Storage.
- **Easy Deployment**: Use Docker to quickly set up and run the entire platform locally or in a production environment.
- **RESTful API**: Backend API that handles file uploads and communicates with decentralized storage systems.
- **Frontend Interface**: A simple, user-friendly web interface to interact with the platform.

## Architecture

- **IPFS Node**: A local IPFS node to handle the decentralized file storage.
- **Backend API**: Node.js backend for handling file uploads, interacting with IPFS and NFT.Storage, and serving API endpoints.
- **Frontend Web Server**: A web interface for users to upload files, view uploaded data, and interact with the decentralized storage.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

### 1. Clone the repository:

    git clone https://github.com/VedantTK/Decentralized-Storage-Platform.git
    cd Decentralized-Storage-Platform

### 2. Configuration

Create a .env file in the backend directory (if not already present), and configure the following environment variables:

    NODE_ENV=production — Running in production mode.
    
    PORT=3000 — Port on which the backend API will run.
    
    IPFS_HOST=ipfs — The hostname of the IPFS container (from docker-compose.yml).
    
    IPFS_PORT=5001 — The port on which IPFS API is exposed.
    
    IPFS_PROTOCOL=http — Use HTTP protocol to communicate with IPFS.
    
    NFT_STORAGE_API_KEY — The API key for NFT.Storage (sign up at nft.storage
    ) to store files linked to NFTs.
    
    CORS_ORIGIN=* — This allows requests from any origin (modify this as per security requirements).

You can copy the environment variables from the .env.example file and update as necessary.

### 3. Build and Start with Docker Compose

Use Docker Compose to build and run the entire application stack.

    docker-compose up --build

This command will:

Build the IPFS node container from the ipfs/kubo image.

Build the backend container from the backend/Dockerfile.

Build the frontend container from the frontend/Dockerfile.

The containers will automatically start, and the services will be running on the following ports:

IPFS Node: 4001 (Swarm), 5001 (API), 8080 (Gateway)

Backend API: 3000 (Application)

Frontend: 8085 (Web Interface)

### 4. Access the Application

Frontend Web Interface: Visit http://localhost:8085 to interact with the platform through a web browser.

Backend API: Access the backend API at http://localhost:3000.

### 5. Storing Files

Upload a file: Use the frontend interface to upload files.

Backend handles the upload: The backend communicates with IPFS or NFT.Storage to store the file.

File Retrieval: Once uploaded, files are stored in IPFS, and metadata is saved in the backend for easy access.

## API Endpoints

POST /upload: Upload a file to IPFS or NFT.Storage.

Body: A file (multipart/form-data).

Response: Metadata (file hash, file URL).

GET /files/:id: Retrieve file metadata and its URL.

GET /files: List all uploaded files.

## Docker Compose Configuration

The docker-compose.yml file defines three services:

- IPFS Node: Runs an IPFS node to handle decentralized file storage.

Exposes ports:

4001: Swarm communication

5001: IPFS API

8080: Gateway for accessing files

- Backend API: Node.js backend for handling requests related to file uploads and interacting with IPFS and NFT.Storage.

Exposes port 3000 for API access.

Depends on the IPFS node.

- Frontend: Web frontend to allow users to interact with the platform.

Exposes port 8085 for accessing the web interface.

Depends on the backend API.

- Volumes

ipfs-data: This volume stores the data for the IPFS node, ensuring that uploaded files persist across container restarts.

- Networks

ipfs-network: A custom network to ensure communication between the IPFS, backend, and frontend services.

- Running in Production

To deploy the app in a production environment:

Set NODE_ENV=production in the .env file.

Ensure that the IPFS node is properly configured (or use a cloud-based IPFS provider).

Configure SSL certificates (if necessary) for secure connections.

- Contributing

Fork the repository.

Create a new branch (git checkout -b feature/feature-name).

Make your changes and commit (git commit -am 'Add new feature').

Push to your branch (git push origin feature/feature-name).

Open a pull request.
