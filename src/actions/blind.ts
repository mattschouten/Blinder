import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { BlinderSettings, setBlinding } from "../blind-interface";

@action({ UUID: "com.cybadger.blinders-plugin.toggleblind" })
export class Blinder extends SingletonAction<BlinderSettings> {
	/**
	 * Performs actions needed when the key becomes visible:
	 *  - Checks whether "blinders are on" and sites are hosts-blocked
	 *  - Sets icons and titles accordingly
	 */
	override onWillAppear(ev: WillAppearEvent<BlinderSettings>): void | Promise<void> {
		// Shouldn't do anything:  the Blind Interface should handle it.
		//return ev.action.setTitle("BLINDYBLIND");
		// return ev.action.setTitle(`${ev.payload.settings.count ?? 0}`);
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

