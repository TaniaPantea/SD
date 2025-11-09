# ----- STAGE 1: Build (Construiește aplicația React) -----
# Folosim o imagine oficială Node.js ca bază
FROM node:18-alpine AS builder

# Setăm directorul de lucru în container
WORKDIR /app

# Copiem package.json și package-lock.json
COPY package.json package-lock.json ./

# Instalăm dependențele
RUN npm install

# Copiem restul codului sursă
COPY . .

# Construim aplicația pentru producție
RUN npm run build

# ----- STAGE 2: Serve (Servește fișierele cu Nginx) -----
# Folosim o imagine oficială și ușoară Nginx
FROM nginx:1.25-alpine

# Copiem DOAR fișierele statice construite din stagiul 'builder'
# în folderul web default al Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Ștergem configurația default a Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Adăugăm propria noastră configurație (o creăm la Pasul 2)
COPY nginx.conf /etc/nginx/conf.d/default.conf