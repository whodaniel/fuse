#!/bin/bash
# Build script to verify TypeScript fixes

echo "Starting consolidated build..."
cd /Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The\ New\ Fuse

# Build the api-client package specifically
echo "Building api-client package..."
cd packages/api-client
yarn tsc
BUILD_RESULT=$?

if [ $BUILD_RESULT -eq 0 ]; then
  echo "✅ Build successful! TypeScript errors have been fixed."
else
  echo "❌ Build failed. Some TypeScript errors remain."
fi

# Return to project root
cd ../../