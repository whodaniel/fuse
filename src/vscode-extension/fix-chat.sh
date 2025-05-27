#!/bin/bash
cd '/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/src/vscode-extension'
echo 'Building extension with AI chat fixes...'
npm install
npx esbuild src/extension.ts --bundle --outfile=dist/extension.js --format=cjs --platform=node --external:vscode --sourcemap
echo 'Launching VS Code...'
code --extensionDevelopmentPath="$(pwd)" --new-window
