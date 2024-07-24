# Menggunakan node:22 sebagai base image
FROM node:22

# Menyetel working directory ke /app
WORKDIR /app

# Mengcopy package*.json ke /app
COPY package*.json ./

# Melakukan instalasi dependency dengan mengecualikan devDependencies
RUN npm install --production --no-optional

# Mengcopy kode aplikasi ke /app
COPY . .

# Menjalankan perintah copy-env
RUN npm run copy-env

# Membuat file .env.production
RUN echo HOST=0.0.0.0 > .env.production

# Menggunakan bun untuk menjalankan migrate up
RUN bun run migrate up

# Menjalankan perintah start:prod
CMD ["npm", "run", "start:prod"]