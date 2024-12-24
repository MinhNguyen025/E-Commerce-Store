# Sử dụng Node.js làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các chứng chỉ CA cần thiết
RUN apk update && apk add --no-cache ca-certificates
RUN update-ca-certificates

# Copy package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install --production

# Copy toàn bộ mã nguồn backend vào /app
COPY . .

# Expose port mà backend sử dụng 
EXPOSE 5000

# Start server
CMD ["npm", "start"]
