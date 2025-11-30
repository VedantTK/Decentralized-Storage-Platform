# Decentralized Storage Platform

A full-stack decentralized file storage platform leveraging **IPFS** and **NFT.Storage** for secure, permanent file storage. Built with Docker for easy deployment and scalability.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)

---

## 🌟 Features

- **🌐 Decentralized Storage**: Files stored on IPFS with automatic pinning to NFT.Storage
- **📦 Containerized Deployment**: Full Docker setup with IPFS node, backend API, and frontend
- **🔒 Secure & Permanent**: NFT.Storage provides permanent, immutable storage
- **🚀 Easy to Deploy**: One-command setup with Docker Compose
- **📱 Responsive UI**: Modern web interface for file upload and retrieval
- **🔗 Multiple Gateways**: Access files through various IPFS gateways
- **📊 Recent Uploads**: Track your upload history locally

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Frontend      │────▶│   Backend API   │────▶│   IPFS Node     │
│   (Port 8085)   │     │   (Port 3000)   │     │   (Port 5001)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               │
                               ▼
                        ┌─────────────────┐
                        │                 │
                        │  NFT.Storage    │
                        │  (Cloud Pinning)│
                        │                 │
                        └─────────────────┘
```

### Components

1. **IPFS Node** (`ipfs`): Local IPFS daemon for decentralized file storage
2. **Backend API** (`backend`): Node.js + Express server handling file operations
3. **Frontend** (`frontend`): Static web interface served by Nginx
4. **NFT.Storage**: Cloud pinning service for permanent file storage

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- [Git](https://git-scm.com/)

### Get Your NFT.Storage API Key

1. Visit [nft.storage](https://nft.storage/)
2. Sign up for a free account
3. Navigate to **API Keys** section
4. Click **New Key** to generate
5. Copy and save your API key securely

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/VedantTK/Decentralized-Storage-Platform.git
cd Decentralized-Storage-Platform
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your NFT.Storage API key:

```env
# IPFS Configuration
IPFS_HOST=ipfs
IPFS_PORT=5001
IPFS_PROTOCOL=http

# NFT.Storage API Key (Required)
NFT_STORAGE_API_KEY=your_actual_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=*
```

**⚠️ IMPORTANT**: Replace `your_actual_api_key_here` with your actual NFT.Storage API key!

### 3. Build and Start Services

From the project root directory:

```bash
# Build and start all containers
docker-compose up --build -d

# Or without build cache (clean build)
docker-compose build --no-cache
docker-compose up -d
```

### 4. Wait for IPFS Initialization

IPFS takes 30-60 seconds to initialize on first run. Monitor the startup:

```bash
docker-compose logs -f ipfs
```

Wait until you see: `Daemon is ready`

### 5. Access the Application

- **Frontend**: [http://localhost:8085](http://localhost:8085)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **IPFS Gateway**: [http://localhost:8080](http://localhost:8080)
- **IPFS API**: [http://localhost:5001](http://localhost:5001)

### 6. Test the Platform

1. Open [http://localhost:8085](http://localhost:8085) in your browser
2. Click or drag a file to the upload area
3. Click **Upload to IPFS**
4. Wait for confirmation with CID (Content Identifier)
5. Use the provided gateways to access your file

---

## 📁 Project Structure

```
Decentralized-Storage-Platform/
├── backend/                    # Node.js Backend API
│   ├── src/
│   │   ├── index.js           # Main Express server
│   │   ├── routes/
│   │   │   └── storage.js     # API endpoints
│   │   ├── services/
│   │   │   ├── ipfs.js        # IPFS client service
│   │   │   └── nftStorage.js  # NFT.Storage service
│   │   └── middleware/
│   │       └── upload.js      # File upload handler
│   ├── Dockerfile             # Backend container config
│   ├── package.json           # Dependencies
│   └── .env                   # Environment variables
│
├── frontend/                   # Frontend Web Interface
│   ├── index.html             # Main HTML page
│   ├── styles.css             # Styling
│   ├── app.js                 # JavaScript logic
│   ├── config.js              # Frontend configuration
│   ├── nginx.conf             # Nginx server config
│   └── Dockerfile             # Frontend container config
│
├── docker-compose.yml         # Docker orchestration
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## 🔧 Configuration

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `production` | Yes |
| `PORT` | Backend server port | `3000` | Yes |
| `IPFS_HOST` | IPFS container hostname | `ipfs` | Yes |
| `IPFS_PORT` | IPFS API port | `5001` | Yes |
| `IPFS_PROTOCOL` | IPFS connection protocol | `http` | Yes |
| `NFT_STORAGE_API_KEY` | NFT.Storage API key | - | **Yes** |
| `CORS_ORIGIN` | Allowed CORS origins | `*` | Yes |

### Frontend Configuration

Edit `frontend/config.js` to customize settings:

```javascript
const CONFIG = {
  // Backend API URL
  API_BASE_URL: 'http://localhost:3000/api',
  
  // Maximum file size (bytes)
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  
  // IPFS Gateway URLs
  IPFS_GATEWAYS: [
    'https://ipfs.io/ipfs/',
    'https://nftstorage.link/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/'
  ]
};
```

### Docker Compose Services

#### IPFS Node (`ipfs`)
- **Image**: `ipfs/kubo:latest`
- **Ports**: 
  - `4001`: Swarm (P2P networking)
  - `5001`: API (HTTP API)
  - `8080`: Gateway (HTTP Gateway)
- **Volume**: `ipfs-data` (persistent storage)

#### Backend API (`backend`)
- **Build**: `./backend/Dockerfile`
- **Port**: `3000` (API endpoints)
- **Depends on**: `ipfs`

#### Frontend (`frontend`)
- **Build**: `./frontend/Dockerfile`
- **Port**: `8085` → `80` (Web interface)
- **Depends on**: `backend`

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 2. Upload File
```http
POST /api/storage/upload
Content-Type: multipart/form-data
```

**Request:**
- Body: `file` (form-data)

**Response:**
```json
{
  "success": true,
  "cid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  "ipfsCid": "QmXxx...",
  "filename": "example.jpg",
  "size": 123456,
  "mimetype": "image/jpeg",
  "gateways": [
    "https://ipfs.io/ipfs/bafybeig...",
    "https://nftstorage.link/ipfs/bafybeig...",
    "https://cloudflare-ipfs.com/ipfs/bafybeig..."
  ]
}
```

#### 3. Retrieve File
```http
GET /api/storage/retrieve/:cid
```

**Response:**
- Binary file data

#### 4. Check Pin Status
```http
GET /api/storage/status/:cid
```

**Response:**
```json
{
  "cid": "bafybeig...",
  "status": {
    "ok": true,
    "value": { ... }
  }
}
```

### Supported File Types

- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF, TXT, JSON
- **Media**: MP4, MP3

Configurable in `backend/src/middleware/upload.js`

### File Size Limits

- **Maximum**: 100MB per file
- Configurable in `backend/src/middleware/upload.js`

---

## 🐳 Docker Commands

### Start Services
```bash
# Start in detached mode
docker-compose up -d

# Start with build
docker-compose up --build -d

# Start and view logs
docker-compose up
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f ipfs
docker-compose logs -f frontend
```

### Stop Services
```bash
# Stop containers (keeps data)
docker-compose stop

# Stop and remove containers (keeps data)
docker-compose down

# Stop, remove containers and volumes (deletes data)
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild specific service
docker-compose up --build backend -d

# Rebuild all services
docker-compose build --no-cache
docker-compose up -d
```

### Service Management
```bash
# Restart specific service
docker-compose restart backend

# View running containers
docker ps

# Access container shell
docker exec -it ipfs-node sh
docker exec -it storage-backend sh

# Check IPFS status
docker exec ipfs-node ipfs id
```

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. Backend Can't Connect to IPFS

**Symptoms**: 
```
Failed to upload to IPFS: connect ECONNREFUSED
```

**Solution**:
```bash
# Check if IPFS is running
docker ps | grep ipfs

# Wait 60 seconds after starting IPFS
sleep 60

# Restart backend
docker-compose restart backend

# Check IPFS logs
docker-compose logs ipfs
```

#### 2. NFT.Storage Upload Fails

**Symptoms**: 
```
Failed to pin to NFT.Storage: Unauthorized
```

**Solution**:
1. Verify API key in `backend/.env`
2. Check NFT.Storage account status at [nft.storage](https://nft.storage/)
3. Ensure you haven't exceeded free tier (32GB total)
4. Test API key:
```bash
curl -X GET https://api.nft.storage/ \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 3. CORS Errors in Browser

**Symptoms**: 
```
Access to fetch blocked by CORS policy
```

**Solution**:
1. Check `CORS_ORIGIN` in `backend/.env`
2. Set to `*` for development: `CORS_ORIGIN=*`
3. For production, set specific domain: `CORS_ORIGIN=https://yourdomain.com`

#### 4. File Upload Fails

**Symptoms**: 
```
File too large or Invalid file type
```

**Solution**:
1. Check file size is under 100MB
2. Verify file type is allowed in `backend/src/middleware/upload.js`
3. Check browser console (F12) for errors
4. View backend logs: `docker-compose logs backend`

#### 5. Port Already in Use

**Symptoms**: 
```
Bind for 0.0.0.0:3000 failed: port is already allocated
```

**Solution**:
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in docker-compose.yml
# Example: "3001:3000" instead of "3000:3000"
```

#### 6. Container Won't Start

**Solution**:
```bash
# Remove all containers and volumes
docker-compose down -v

# Clean Docker system
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

---

## 🧪 Testing

### Manual Testing

#### 1. Health Check
```bash
curl http://localhost:3000/health
```

**Expected Response**:
```json
{"status":"ok","timestamp":"..."}
```

#### 2. Upload File
```bash
curl -X POST http://localhost:3000/api/storage/upload \
  -F "file=@/path/to/your/file.jpg"
```

#### 3. Retrieve File
```bash
# Use CID from upload response
curl http://localhost:8080/ipfs/YOUR_CID > downloaded_file.jpg
```

### Integration Testing

Test the complete workflow:
1. Open frontend: http://localhost:8085
2. Upload a file
3. Verify CID is returned
4. Click gateway link to view file
5. Use retrieve function to fetch file

---

## 🚀 Deployment

### Production Deployment

For production deployment, follow these best practices:

#### 1. Environment Variables
```env
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
# Use secrets management for API key
```

#### 2. HTTPS Configuration
- Use reverse proxy (Nginx, Traefik, Caddy)
- Configure SSL certificates (Let's Encrypt)
- Update `CORS_ORIGIN` to your domain

#### 3. Resource Limits
Add to `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

#### 4. Monitoring
- Implement health checks
- Set up logging aggregation
- Monitor IPFS node status
- Track NFT.Storage usage

### Cloud Deployment Options

#### Backend Options:
- **Railway.app** (Recommended) - Free tier available
- **Render.com** - Free tier available
- **Fly.io** - Free tier available
- **DigitalOcean App Platform**
- **AWS ECS/Fargate**
- **Google Cloud Run**

#### Frontend Options:
- **Netlify** - Free tier with CDN
- **Vercel** - Free tier with edge network
- **GitHub Pages** - Free static hosting
- **Cloudflare Pages** - Free with CDN

#### IPFS Options:
- **Self-hosted**: Use your Docker setup
- **Infura IPFS**: Hosted IPFS node
- **Pinata**: IPFS pinning service
- **NFT.Storage only**: Remove local IPFS dependency

---

## 📊 Resource Usage

### Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| NFT.Storage | 32GB total | Permanent storage |
| Docker (Local) | No limit | Based on disk space |
| Railway.app | 500 hours/month | Backend hosting |
| Netlify | 100GB bandwidth | Frontend hosting |

### System Requirements

**Minimum**:
- 2 CPU cores
- 4GB RAM
- 20GB disk space
- Docker v20.10+

**Recommended**:
- 4 CPU cores
- 8GB RAM
- 100GB disk space
- Docker v24.0+

---

## 🔒 Security Best Practices

### Development
- ✅ Use `.env` file for secrets
- ✅ Never commit `.env` to git
- ✅ Use `CORS_ORIGIN=*` for testing only

### Production
- ✅ Set specific `CORS_ORIGIN` domain
- ✅ Use environment secrets (GitHub Secrets, Railway Secrets)
- ✅ Enable HTTPS/SSL
- ✅ Implement rate limiting
- ✅ Add authentication if needed
- ✅ Validate all file uploads
- ✅ Monitor API usage
- ✅ Regular security audits
- ✅ Keep dependencies updated

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Steps to Contribute

1. **Fork the repository**
```bash
git clone https://github.com/VedantTK/Decentralized-Storage-Platform.git
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
- Follow existing code style
- Add tests if applicable
- Update documentation

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add amazing feature"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request**
- Describe your changes
- Reference any related issues
- Wait for review

### Development Guidelines

- Use meaningful commit messages
- Follow JavaScript ES6+ standards
- Add comments for complex logic
- Test locally before pushing
- Update README if needed

---

## 📝 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 VedantTK

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📚 Resources & Documentation

### Official Documentation
- **IPFS**: [docs.ipfs.tech](https://docs.ipfs.tech/)
- **NFT.Storage**: [nft.storage/docs](https://nft.storage/docs/)
- **Express.js**: [expressjs.com](https://expressjs.com/)
- **Docker**: [docs.docker.com](https://docs.docker.com/)

### Tutorials & Guides
- [IPFS Basics](https://docs.ipfs.tech/concepts/)
- [NFT.Storage Getting Started](https://nft.storage/docs/)
- [Docker Compose Guide](https://docs.docker.com/compose/)

### Community & Support
- **Issues**: [GitHub Issues](https://github.com/VedantTK/Decentralized-Storage-Platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/VedantTK/Decentralized-Storage-Platform/discussions)
- **IPFS Community**: [discuss.ipfs.tech](https://discuss.ipfs.tech/)

---

## 🎯 Roadmap

### Planned Features
- [ ] User authentication (JWT)
- [ ] File encryption before upload
- [ ] Batch file uploads
- [ ] File sharing with expiry links
- [ ] Search and filter functionality
- [ ] User dashboard with analytics
- [ ] Mobile app (React Native)
- [ ] File versioning
- [ ] Folder/directory support
- [ ] Advanced file preview
- [ ] Integration with Web3 wallets

### Version History
- **v1.0.0** - Initial release with IPFS and NFT.Storage integration

---

## 💡 Use Cases

- **NFT Metadata Storage**: Store NFT metadata and images
- **Document Archive**: Permanent document storage
- **Media Hosting**: Decentralized media hosting
- **Backup Solution**: Immutable backup storage
- **Portfolio Hosting**: Host portfolio files
- **Academic Archives**: Research paper storage
- **Legal Documents**: Tamper-proof document storage

---

## 🙏 Acknowledgments

- **IPFS Team**: For the amazing decentralized storage protocol
- **NFT.Storage**: For providing free permanent storage
- **Protocol Labs**: For leading the Web3 infrastructure
- **Docker Community**: For containerization tools
- **Open Source Community**: For inspiration and support

---

## 📞 Contact & Support

- **Author**: VedantTK
- **GitHub**: [github.com/VedantTK](https://github.com/VedantTK)
- **Repository**: [Decentralized-Storage-Platform](https://github.com/VedantTK/Decentralized-Storage-Platform)
- **Issues**: [Report a Bug](https://github.com/VedantTK/Decentralized-Storage-Platform/issues)

---

## ⭐ Show Your Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🍴 Forking for your own use
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📖 Improving documentation
- 🤝 Contributing code

---

**Built with ❤️ using IPFS, NFT.Storage, Docker, and Web3 Technologies**

---

*Last Updated: December 2024*
