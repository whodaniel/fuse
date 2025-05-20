#!/bin/bash

# Script to rename .tsx files that don't contain JSX to .ts files
# This script specifically targets the packages/core/src/types directory

TYPES_DIR="/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/packages/core/src/types"

# Find all .tsx files and check if they contain JSX
echo "Scanning for .tsx files without JSX in: $TYPES_DIR"
echo "==============================================="

# Function to check if a file contains JSX syntax
contains_jsx() {
    grep -E '(<[a-zA-Z][a-zA-Z0-9]*|<>|</>)' "$1" > /dev/null
}

# Counter for renamed files
renamed_count=0

# Process regular .tsx files
for file in $(find "$TYPES_DIR" -name "*.tsx" -not -name "*.d.tsx"); do
    if ! contains_jsx "$file"; then
        new_file="${file%.tsx}.ts"
        echo "Renaming: $file -> $new_file"
        mv "$file" "$new_file"
        ((renamed_count++))
    else
        echo "Skipping file with JSX content: $file"
    fi
done

# Process declaration .d.tsx files
for file in $(find "$TYPES_DIR" -name "*.d.tsx"); do
    if ! contains_jsx "$file"; then
        new_file="${file%.d.tsx}.d.ts"
        echo "Renaming: $file -> $new_file"
        mv "$file" "$new_file"
        ((renamed_count++))
    else
        echo "Skipping declaration file with JSX content: $file"
    fi
done

echo "==============================================="
echo "Renamed $renamed_count files."
echo "Please rebuild your project to verify the changes."