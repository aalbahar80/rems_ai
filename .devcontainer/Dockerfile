FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies INCLUDING wget first
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    sudo \
    postgresql-client \
    build-essential \
    python3 \
    python3-pip \
    ca-certificates \
    gnupg \
    lsb-release

# Install specific Node.js version (18.18.0 LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Lock npm version
RUN npm install -g npm@9.8.1

# Install PostgreSQL 15 (using modern keyring approach)
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/postgresql-keyring.gpg] http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && apt-get update \
    && apt-get install -y postgresql-client-15

# Install specific development tools
RUN npm install -g \
    nodemon@3.0.1

# Create development user FIRST
RUN useradd -m -s /bin/bash developer \
    && usermod -aG sudo developer \
    && echo 'developer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Add after creating developer user:
# Remove package manager cache to reduce image size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
# Set secure file permissions
RUN chmod 750 /home/developer


# Set working directory and fix ownership
WORKDIR /workspace
RUN chown -R developer:developer /workspace

# Switch to developer user
USER developer

# Create node_modules directory with correct ownership
RUN mkdir -p /workspace/node_modules && \
    sudo chown -R developer:developer /workspace