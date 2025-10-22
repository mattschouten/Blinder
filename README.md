# Blinders - Focus Plugin for Stream Deck

Blinders is a Stream Deck plugin to block distracting websites, like blinders for horses.

It works by modifying /etc/hosts to block a hardcoded list of distracting sites.

## Installation and Use

I haven't built a nice distribution package for this. The way it's implemented, I'm not sure it's worth doing.

To install it, you'll have to set up to do Stream Deck development and run the plugin that way.

You'll also have to install the LaunchDaemon script.  There's a handy [installation script](./daemon/install_daemon.sh) to make it easier.  The steps:

1. Copy `distraction-blocker.sh` to `/usr/local/bin/distraction-blocker` (the location identified in the [plist](./daemon/com.cybadger.blinder.plist))
2. Make `/usr/local/bin/distraction-blocker` executable
3. Copy `com.cybadger.blinder.plist` to `/Library/LaunchDaemons/` so it can run as root
4. Start the daemon as root using `launchctl` (`sudo launchctl bootstrap system /Library/LaunchDaemons/com.cybadger.blinder.plist`)

Note:  The daemon runs as root, so it can mess things up on your system.

On your Stream Deck, it'll give you a "Toggle Blinding" key.

- The background color shows if you're currently "open to distractions".  Green means distractions are not blocked.  Red means they are.
- The text on the button shows what pressing the button will do.

| Key Color | Text            | Currently Blocking? | Effect of Pressing Key |
|-----------|-----------------|---------------------|------------------------|
| Green     | Blinders On!    | No                  | Begin blocking         |
| Red       | Remove Blinders | Yes                 | Stop blocking          |

## How it Works

The plugin works by signaling a LaunchDaemon [script](./daemon/distraction-blocker.sh) that is [configured](./daemon/com.cybadger.blinder.plist) to watch `/tmp/com.cybadger.toggle-distractions.trigger`

## Limitations

The plugin adds lines to `/etc/hosts`.  This blocking method can be bypassed in a couple of ways:

- Many browsers cache DNS, so if you've already been on a distracting site, the site may continue to be accessible until the browser cache expires.
- Your operating system may also cache DNS.
- You can get around this with a proxy or similar tools.

The whole point was to add a little friction to becoming distracted and remind myself I want to focus.  So these aren't a big deal to me right now.

Right now, there is no way to configure the list of sites from the Stream Deck user interface.  Modify `distraction-blocker.sh` if you don't want to be stuck with the list of sites I happen to find distracting lately.
