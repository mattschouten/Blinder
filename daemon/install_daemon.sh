#!/usr/bin/env bash

SCRIPT_LOCATION="/usr/local/bin/distraction-blocker"
PLIST_LOCATION="/Library/LaunchDaemons/com.cybadger.blinder.plist"

echo "Copying distraction-blocker.sh to $SCRIPT_LOCATION"
cp distraction-blocker.sh "$SCRIPT_LOCATION"

echo "Ensuring $SCRIPT_LOCATION is executable"
chmod +x "$SCRIPT_LOCATION"

echo "Copying the plist file to $PLIST_LOCATION"
sudo cp com.cybadger.blinder.plist "$PLIST_LOCATION"

echo "Loading the daemon using launchctl:  launchctl load $PLIST_LOCATION"
sudo launchctl bootstrap system "$PLIST_LOCATION"

# To uninstall, use 'bootout' instead of bootstrap
