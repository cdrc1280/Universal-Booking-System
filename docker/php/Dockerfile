FROM php:8.3-fpm-alpine

ARG UID=1000
ARG GID=1000

# Install system dependencies & PostgreSQL dev libraries
RUN apk add --no-cache \
    curl \
    git \
    shadow \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    postgresql-dev \
    zip \
    unzip \
    nodejs \
    npm

# Configure and install PHP extensions
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/include/postgresql/ \
    && docker-php-ext-install pdo_pgsql pgsql mbstring bcmath gd zip intl opcache

# Install Redis extension via PECL
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Install Composer binary from official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Align www-data user and group IDs with host user
RUN usermod -u ${UID} www-data && groupmod -g ${GID} www-data

WORKDIR /var/www

COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER www-data

EXPOSE 9000 5173

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]