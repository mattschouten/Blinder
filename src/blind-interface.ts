import { streamDeck, Logger } from "@elgato/streamdeck";
import { BlindChecker, BlindCheckStatus } from "./blind-checker";
import { writeFile } from "node:fs";

export type BlinderSettings = {
	shouldBlind: boolean;
    isBlind: boolean;
};

const logger: Logger = streamDeck.logger.createScope("BlindInterface");
const blindChecker: BlindChecker = new BlindChecker();
const settings: BlinderSettings = { shouldBlind: true, isBlind: true };
let domainList: string[] = [];

addEventListeners();

function addEventListeners() {
    blindChecker.on("blind", () => {
        logger.info("Status:  BLIND");
        settings.isBlind = true;

        setKeyStatus(true);
    });

    blindChecker.on("open", () => {
        logger.info("Status:  UNBLIND");
        settings.isBlind = false;

        setKeyStatus(false);
    });

    blindChecker.on("error", () => {
        logger.error("Received error from BlindChecker");
    });
}

export function startBlindInterface() {
    // Check the status immediately to set up keys.
    // Then start the periodic checker.
    let status = blindChecker.checkNow();
    settings.isBlind = (status == BlindCheckStatus.Blind);
    settings.shouldBlind = settings.isBlind;  // Initialize by matching.
    setKeyStatus(settings.isBlind);

    addEventListeners();
    blindChecker.start();
}

function setKeyStatus(isBlind: boolean) {
    streamDeck.actions.forEach((action) => {
        if (action.manifestId.startsWith('com.cybadger.blinders-plugin.toggleblind')) {

            // Icon color indicates current status.  Red for blinded, Green for distractible.
            let iconColor = (isBlind) ? 'red' : 'green';
            let text = (isBlind) ? 'Remove\nBlinders' : 'Blinders\nOn!';

            action.setImage(`imgs/actions/blind/${iconColor}-square.svg`);
            action.setTitle(text);
        }
    });
}

export function setBlinding(shouldBlind: boolean) {
    let text = ((shouldBlind) ? 'blind' : 'unblind') +
               "\n" + domainListToTriggerText() + "\n";

    logger.info(`Request to ${text}`);
    writeFile('/tmp/com.cybadger.toggle-distractions.trigger', text, (err)  => {
        if (err) {
            logger.error(`Error writing ${text} to trigger file`, err)
        } else {
            logger.trace(`Wrote ${text} to trigger file`)
        }
    });
}

export function onDomainList(newDomainList: string) {
    // Split on whitespace, commas, or semicolons
    let domains = newDomainList.split(/[\s,;]+/);
    domainList = domains;
}

function domainListToTriggerText(): string {
    return domainList.join("\n");
}

// TODO:  If settings don't exist, or are blank, set a default.
// TODO:  Get the settings when starting up
