# notes-app-back-end

---

## Install Requirements

#### 1. Install on Ubuntu

```bash
wget https://storage.googleapis.com/farismnrr-gclouds.appspot.com/requirements-install/notes-ubuntu.sh
chmod +x notes-ubuntu.sh
./notes-ubuntu.sh
```

#### 2. Install on Debian

```bash
wget https://storage.googleapis.com/farismnrr-gclouds.appspot.com/requirements-install/notes-debian.sh
chmod +x notes-debian.sh
./notes-debian.sh
```

## How to Run Program

#### 1. Check `.env.example` for required environment variables.

#### 2. Run on Development

```bash
npm run build:local
```

#### 3. Run on Production (Linux Server Only)

```bash
npm run build:server
```

#### 4. Run on Docker

-   Build Docker Image

```bash
npm run build:docker
```

-   Run Docker Container

```bash
npm run start:docker
```
