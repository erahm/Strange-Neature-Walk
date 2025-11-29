FROM node:24

WORKDIR /app

COPY package*.json ./
# Install dependencies (include dev for prisma cli), generate prisma client, then prune dev dependencies
RUN npm install

# Copy all application files
COPY . .

# generate prisma client
RUN npx prisma generate

# remove dev dependencies to keep image small
RUN npm prune --production

EXPOSE 4000

# copy entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENV RUNNING_IN_DOCKER=true

CMD ["./docker-entrypoint.sh"]
