FROM nginx:alpine

# Copy custom Nginx configuration
# -----------------------------------------------------------
# Replace the default Nginx configuration with our custom one
# that is optimized for serving a Laravel application.
# -----------------------------------------------------------
COPY ./docker/production/nginx/nginx.conf /etc/nginx/nginx.conf

# Set the working directory to the public folder
WORKDIR /var/www/html

# Expose port 80 and start Nginx
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]