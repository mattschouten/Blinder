import { action, DidReceiveSettingsEvent, JsonObject, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { BlinderSettings, onDomainList, setBlinding } from "../blind-interface";

@action({ UUID: "com.cybadger.blinders-plugin.toggleblind" })
export class Blinder extends SingletonAction<BlinderSettings> {
	/**
	 * Performs actions needed when the key becomes visible
	 */
	override onWillAppear(ev: WillAppearEvent<BlinderSettings>): void | Promise<void> {
		// Shouldn't do anything:  the Blind Interface should handle it.
	}

	/**
	 * When the key is pressed, toggles blinder and sets icons and titles accordingly.
	 */
	override async onKeyDown(ev: KeyDownEvent<BlinderSettings>): Promise<void> {
		const { settings } = ev.payload;

		settings.shouldBlind = !settings.isBlind;
		setBlinding(settings.shouldBlind);

		// We will assume the Blinding was set correctly.
		settings.isBlind = settings.shouldBlind;
		// TODO:  Untangle who manages this state.
		await ev.action.setSettings(settings);
	}
}

