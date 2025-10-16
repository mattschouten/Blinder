import { streamDeck, EventEmitter, Logger } from "@elgato/streamdeck";
import { readFileSync } from "node:fs";

export enum BlindCheckStatus {
    Blind = "blind",
    Unblind = "open",
    Error = "error"
}

export class BlindChecker extends EventEmitter<string> {
    checkInterval: NodeJS.Timeout | null;
    logger: Logger = streamDeck.logger.createScope("BlindChecker");

    constructor() {
        super();
        this.checkInterval = null;
    }

    // Check every five seconds for the blind status
    start() {
        this.logger.trace("start()");

        this.checkInterval = setInterval(() => {
            this.check();
        }, 5000);
    }

    stop() {
        this.logger.trace("stop()");

        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    // Check whether Blinder is blocking distractions.
    // Emits an event indicating its findings:
    //  - "blind" if blocking
    //  - "open" if not
    //  - "error" if something went wrong
    check() {
        let status = this.checkNow();
        this.emit(status);
    }

    checkNow(): BlindCheckStatus {
        const START_BLOCK = "# BLINDER_DISTRACTION_BLOCK_START"
        const END_BLOCK = "# BLINDER_DISTRACTION_BLOCK_END"

        try {
            const data = readFileSync('/etc/hosts', 'utf8');

            this.logger.info("DATA:  ", data);
            if (data.includes(START_BLOCK) && data.includes(END_BLOCK)) {
                return BlindCheckStatus.Blind;
            } else {
                return BlindCheckStatus.Unblind;
            }
        } catch (err) {
            this.logger.error("Error reading /etc/hosts", err);
            return BlindCheckStatus.Error;
        }
    }
}
