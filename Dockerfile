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

# Mengganti nilai PGHOST di file .env.example
RUN sed -i 's/^PGHOST=.*/PGHOST=172.17.0.1/' .env.example

# Menjalankan perintah copy-env
RUN npm run copy-env

# Menjalankan perintah generate-token
RUN npm run generate-token

# Membuat file .env.production
RUN echo HOST=0.0.0.0 > .env.production

# Menggunakan bun untuk menjalankan migrate up
RUN npm run migrate up

# Menjalankan perintah start:prod
CMD ["npm", "run", "start:prod"]