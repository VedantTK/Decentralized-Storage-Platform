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

```bash
git clone https://github.com/VedantTK/Decentralized-Storage-Platform.git
cd Decentralized-Storage-Platform
