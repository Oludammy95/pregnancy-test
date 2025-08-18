FROM node:18

# Install Python
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    ln -s /usr/bin/python3 /usr/bin/python

# Install Yarn Classic globally
RUN npm install -g yarn

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install Node dependencies with Yarn
RUN yarn install --frozen-lockfile --production=false

# Copy Python requirements if exists
COPY requirements.txt* ./
RUN if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

# Copy project files
COPY . .

# Build Next.js with Yarn
RUN yarn build

# Expose port
EXPOSE 3000

# Start the application with Yarn
CMD ["yarn", "start"]