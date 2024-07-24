# Menggunakan node:alpine sebagai base image
FROM node:alpine

# Menyetel working directory ke /app
WORKDIR /app

# Mengcopy package*.json ke /app
COPY package*.json ./

# Melakukan instalasi dependency
RUN npm install

# Mengcopy kode aplikasi ke /app
COPY . .

# Menjalankan perintah copy-env
RUN bun run copy-env

# Membuat file .env.production
RUN echo HOST=0.0.0.0 > .env.production

# Menjalankan perintah start:prod
CMD ["bun", "run", "start:prod"]