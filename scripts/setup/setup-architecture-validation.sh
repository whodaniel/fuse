#!/bin/bash

# Setup script for architecture validation and monitoring

# Create required directories
mkdir -p /var/lib/fuse/metrics/architecture
mkdir -p /var/log/fuse/architecture-monitoring
mkdir -p /etc/fuse/cron.d

# Install required npm packages
npm install --save js-yaml

# Set up cron job for validation
cat << EOF > /etc/fuse/cron.d/architecture-validation
# Run architecture validation every 6 hours
0 */6 * * * root node /Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/scripts/validation/validate-architecture.js >> /var/log/fuse/architecture-monitoring/validation.log 2>&1
EOF

# Set proper permissions
chmod 644 /etc/fuse/cron.d/architecture-validation
chmod -R 755 /var/lib/fuse/metrics/architecture
chmod -R 755 /var/log/fuse/architecture-monitoring

# Create log rotation configuration
cat << EOF > /etc/logrotate.d/fuse-architecture
/var/log/fuse/architecture-monitoring/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 root root
}
EOF

echo "Architecture validation setup complete"