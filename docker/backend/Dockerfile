FROM php:8.3-cli

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2.11 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first (layer caching)
COPY composer.json composer.lock ./

RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copy rest of the app
COPY . .

RUN composer dump-autoload --optimize

# Ensure storage permissions
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000
