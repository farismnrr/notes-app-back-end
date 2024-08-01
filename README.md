# notes-app-back-end

---

## Install Requirements

#### 1. Install on Ubuntu

```bash
chmod +x install-ubuntu.sh
./install-ubuntu.sh
```

Update `.bashrc`

```bash
source ~/.bashrc
```

#### 2. Install on Debian

```bash
chmod +x install-debian.sh
./install-debian.sh
```

Update `.bashrc`

```bash
source ~/.bashrc
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

```bash
npm run build:docker
```
