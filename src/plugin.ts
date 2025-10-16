import streamDeck, { LogLevel } from "@elgato/streamdeck";

import { Blinder } from "./actions/blind";
import { startBlindInterface } from "./blind-interface";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);

streamDeck.actions.registerAction(new Blinder());
startBlindInterface();

// Finally, connect to the Stream Deck.
streamDeck.connect();
