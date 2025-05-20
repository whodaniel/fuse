#!/bin/bash

# This script skips the database migration step in the build process
# by modifying the turbo.json file to remove database:db:migrate dependency

echo "🔧 Creating a modified turbo.json file to bypass database migration..."

# Path to the turbo.json file
TURBO_JSON_FILE="/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/turbo.json"

# Create a backup of the original file
cp "$TURBO_JSON_FILE" "$TURBO_JSON_FILE.backup"

# Find and modify the database:build dependencies
jq '.pipeline.build.dependsOn = (.pipeline.build.dependsOn | map(select(. != "database:db:migrate")))' "$TURBO_JSON_FILE" > "$TURBO_JSON_FILE.temp"
mv "$TURBO_JSON_FILE.temp" "$TURBO_JSON_FILE"

echo "✅ Modified turbo.json file to bypass database migration during build"
echo "The original file has been backed up to turbo.json.backup"
echo "You can now run 'yarn build' again to complete the build process."