#!/bin/bash

PREFIX="libs/vendor/custom-module"
REMOTE_NAME="upstream-custom-module"
REMOTE_URL="https://github.com/ExLibrisGroup/customModule.git"
BRANCH="main"

echo "--- Checking Remote Configuration ---"

# Check if the remote exists
if ! git remote | grep -q "^$REMOTE_NAME$"; then
    echo "Remote '$REMOTE_NAME' not found. Adding it now..."
    git remote add "$REMOTE_NAME" "$REMOTE_URL"
else
    echo "Remote '$REMOTE_NAME' already configured."
fi

echo "--- Fetching updates from $REMOTE_NAME ---"
git fetch "$REMOTE_NAME" "$BRANCH"

echo "--- Summary of changes in $PREFIX ---"
# Compare the remote branch to the current state of that subdirectory
git diff --stat "$REMOTE_NAME/$BRANCH" HEAD:"$PREFIX"

echo ""
read -p "Do you want to pull these changes into $PREFIX? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "--- Pulling and Squashing ---"
    git subtree pull --prefix="$PREFIX" "$REMOTE_NAME" "$BRANCH" --squash
    echo "------------------------------------------------"
    echo "Done!"
else
    echo "Aborted. No changes applied."
fi
