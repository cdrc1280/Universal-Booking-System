#!/bin/sh
set -e

# Ensure storage subdirectories exist
mkdir -p /var/www/storage/framework/cache/data \
         /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/logs \
         /var/www/bootstrap/cache 2>/dev/null || true

exec "$@"