import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

@action({ UUID: "com.cybadger.blinders-plugin.toggleblind" })
export class Blinder extends SingletonAction<BlinderSettings> {
	/**
	 * Performs actions needed when the key becomes visible:
	 *  - Checks whether "blinders are on" and sites are hosts-blocked
	 *  - Sets icons and titles accordingly
	 */
	override onWillAppear(ev: WillAppearEvent<BlinderSettings>): void | Promise<void> {
		// Checks
		return ev.action.setTitle("BLINDYBLIND");
		// return ev.action.setTitle(`${ev.payload.settings.count ?? 0}`);
	}

	/**
	 * When the key is pressed, toggles blinder and sets icons and titles accordingly.
	 */
	override async onKeyDown(ev: KeyDownEvent<BlinderSettings>): Promise<void> {
		const { settings } = ev.payload;

		settings.blind = !settings.blind;
		await ev.action.setSettings(settings);

		await this.showBlindStatusOnKey(settings.blind, ev);
	}

	async showBlindStatusOnKey(blind: boolean, ev: KeyDownEvent<BlinderSettings>) {
		let iconColor = (blind) ? 'red' : 'green';
		let text = (blind) ? 'Remove\nBlinders' : 'Blinders\nOn!';

		await ev.action.setImage(`imgs/actions/blind/${iconColor}-square.svg`);
		await ev.action.setTitle(text);
	}
}

/**
 * Settings for {@link IncrementCounter}.
 */
type BlinderSettings = {
	blind: boolean;
};
