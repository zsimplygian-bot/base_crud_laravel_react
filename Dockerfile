FROM php:8.3-fpm-alpine

# Instala dependencias del sistema
RUN apk add --no-cache \
    git curl libpng-dev oniguruma-dev libxml2-dev zip unzip libzip-dev

# Instala extensiones PHP necesarias para Laravel
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

# Instala dependencias PHP
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Permisos
RUN chown -R www-data:www-data /var/www
RUN chmod -R 755 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]