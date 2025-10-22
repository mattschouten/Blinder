import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { Blinder } from "./actions/blind";
import { onDomainList, startBlindInterface } from "./blind-interface";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

streamDeck.settings.onDidReceiveSettings(ev => {
    if (ev?.payload?.settings?.domainsToBlock) {
        if (typeof ev.payload.settings.domainsToBlock === 'string') {
            onDomainList(ev.payload.settings.domainsToBlock);
        }
    } else {
        streamDeck.logger.warn("Invalid settings event");
        streamDeck.logger.warn(ev);
    }
});

streamDeck.actions.registerAction(new Blinder());
startBlindInterface();


// Finally, connect to the Stream Deck.
streamDeck.connect();
