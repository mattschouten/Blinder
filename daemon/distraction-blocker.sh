#!/usr/bin/env sh

# This runs as a LaunchDaemon script, which runs under sh

LOGFILE="/var/log/com.cybadger.blinder.log"
# LOGFILE="./com.cybadger.blinder.log"
TRIGGERFILE="/tmp/com.cybadger.toggle-distractions.trigger"
HOSTFILE="/etc/hosts"
# HOSTFILE="./test-hosts.txt"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOGFILE"
}

# Shut down cleanly on SIGTERM and SIGINT
trap 'log "Received SIGTERM, exiting cleanly"; exit 0' SIGTERM
trap 'log "Received SIGINT, exiting cleanly"; exit 0' SIGINT

log "Daemon started"

# Expected to be triggered by launchd on presence of trigger file.
if [ ! -f "$TRIGGERFILE" ]; then
    log "Error:  Trigger file not found ("$TRIGGERFILE")"
    exit 1

    # Nonzero exit code leads to launchd continuing to watch the trigger file
fi

# Read the trigger file into ACTION and DOMAINS variables
DOMAINS=
i=0
while IFS= read -r line || [ -n "$line" ]; do
    if [ $i -eq 0 ]; then
        ACTION=$line
    else
        DOMAINS="$DOMAINS $line"
    fi
    i=$((i + 1))
done < "$TRIGGERFILE"


case "$ACTION" in
    blind)
        log "Blocking distractions..."
        if grep -q "# BLINDER_DISTRACTION_BLOCK_START" "$HOSTFILE"; then
            log "Already blocked!  No action required."
        else
            # The distraction block is not present.  Add the block to the hosts file.

            echo "# BLINDER_DISTRACTION_BLOCK_START" >> "$HOSTFILE"
            for item in $DOMAINS; do
                echo "127.0.0.1 ${item}" >> "$HOSTFILE"
            done
            echo "# BLINDER_DISTRACTION_BLOCK_END" >> "$HOSTFILE"

            log "Blocking enabled"
        fi
        ;;
    unblind)
        log "Unblocking distractions..."
        sed -i '' '/# BLINDER_DISTRACTION_BLOCK_START/,/# BLINDER_DISTRACTION_BLOCK_END/d' "$HOSTFILE"
        log "Blocking disabled"
        ;;
    *)
        log "Error:  Invalid action '$ACTION'"
        exit 1
        ;;
esac

# Clean up
rm -f "$TRIGGER"
log "Daemon run completed successfully"
exit 0
