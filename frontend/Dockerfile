FROM node:20-slim

WORKDIR /app

# Install pnpm to respect pnpm-lock.yaml (this repo uses pnpm)
RUN npm install -g pnpm

# copy lockfile and package.json first for caching
COPY package.json pnpm-lock.yaml ./

# install dependencies using the frozen lockfile
RUN pnpm install --frozen-lockfile --prefer-offline --shamefully-hoist

# copy rest of the source
COPY . .

# build the app
RUN pnpm build

EXPOSE 4173

# run the preview server using pnpm so vite (a devDependency) is available
CMD ["pnpm", "preview", "--host", "--port", "4173"]