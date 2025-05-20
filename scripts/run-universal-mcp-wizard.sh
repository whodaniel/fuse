#!/bin/bash
# Universal MCP Configuration Wizard Runner
# This script launches the AppleScript wizard with debug output

echo "Launching Universal MCP Configuration Wizard..."

# Run the wizard script and capture output for debugging
osascript "/Users/danielgoldberg/Desktop/A1-Inter-LLM-Com/The New Fuse/scripts/universal-mcp-wizard-fixed.applescript" 2>&1 | tee wizard_debug_log.txt

exit_code=$?
if [ $exit_code -ne 0 ]; then
  echo "Wizard exited with code $exit_code. See wizard_debug_log.txt for details."
else
  echo "Wizard completed successfully."
fi