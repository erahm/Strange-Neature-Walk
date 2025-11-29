#!/bin/sh
set -e

# Wait for DB to be available before running migrations
# Simple retry loop
TRIES=0
MAX_TRIES=30
until (nc -z $(echo $DATABASE_URL | sed -E 's#^.*@([^:]+):([0-9]+).*#\1 \2#' | awk '{print $1}') $(echo $DATABASE_URL | sed -E 's#^.*@([^:]+):([0-9]+).*#\1 \2#' | awk '{print $2}') > /dev/null 2>&1) || [ $TRIES -ge $MAX_TRIES ]; do
  echo "Waiting for database... ($TRIES)"
  TRIES=$((TRIES + 1))
  sleep 2
done

# Run migrations
# If no migrations are present (e.g., dev setup), `prisma migrate deploy` may not create the schema; fall back to `db push`.
npx prisma migrate deploy || npx prisma db push

# Seed database
node prisma/seed.js || true

# Start server
node server.js
