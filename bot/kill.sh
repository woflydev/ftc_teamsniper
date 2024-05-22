#!/bin/bash

# Pull the latest changes from the GitHub repository
echo "Pulling the latest changes from the GitHub repository..."
git pull origin main

# List all running node processes
echo "Listing all running node processes:"
ps -a | grep node

# Get the process IDs of all running node processes
PIDS=$(ps -a | grep node | awk '{print $1}')

# Check if there are any node processes to kill
if [ -z "$PIDS" ]; then
  echo "No node processes found."
else
  # Kill each node process
  echo "Killing node processes with the following PIDs: $PIDS"
  for PID in $PIDS; do
    kill -9 $PID
    echo "Killed process $PID"
  done
fi

echo "All node processes have been terminated."
