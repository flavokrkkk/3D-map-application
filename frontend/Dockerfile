# Build the frontend app using Node.js
FROM node:alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files and build the app
COPY . .
RUN npm run dev

# Serve the built files using Nginx
FROM nginx:alpine


# Copy the build output to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 5173 for frontend (you can choose another port if needed)
EXPOSE 5173

# Copy Nginx configuration for frontend
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
