#!/usr/bin/env bash

#LOGFILE="/var/log/com.cybadger.blinder.log"
LOGFILE="./com.cybadger.blinder.log"
TRIGGERFILE="/tmp/com.cybadger.toggle-distractions.trigger"
#HOSTFILE="/etc/hosts"
HOSTFILE="./test-hosts.txt"

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

ACTION=$(cat "$TRIGGERFILE" 2>/dev/null)

case "$ACTION" in
    blind)
        log "Blocking distractions..."
        if grep -q "# BLINDER_DISTRACTION_BLOCK_START" "$HOSTFILE"; then
            log "Already blocked!  No action required."
        else
            # The distraction block is not present.  Add the block to the hosts file.
            cat >> "$HOSTFILE" << 'EOF'
# BLINDER_DISTRACTION_BLOCK_START
127.0.0.1 reddit.com
127.0.0.1 old.reddit.com
127.0.0.1 news.ycombinator.com
# BLINDER_DISTRACTION_BLOCK_END
EOF
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
