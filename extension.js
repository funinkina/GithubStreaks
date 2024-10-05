import St from 'gi://St';
import { Extension } from 'resource:///org/gnome/Shell/Extensions/js/extensions/extension.js';
import * as Main from 'resource:///org/gnome/Shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/Shell/ui/panelmenu.js';

export class GithubStreaks extends Extension {
    enable(){
        //create a panel button
        this._indicator = new PanelMenu.Button(
            0.0, this.metadata.name, false
        );

        //add an icon loaded from svg
        this._indicator.icon = new St.Icon({
            icon_name: 'github-streaks',
            style_class: 'system-status-icon',
        });
        this._indicator.add_child(icon);

        Main.panel.addToStatusArea(this.uuid, this._indicator);

        console.log(`Enabled ${this.metadata.name}`);
    }

    disable(){
        this._indicator?.destroy();
        this._indicator = null;

        console.log(`Disabled ${this.metadata.name}`);
        console.trace;
    }
}