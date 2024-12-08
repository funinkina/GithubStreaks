import Gtk from 'gi://Gtk?version=4.0';
import Adw from 'gi://Adw';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export default class GithubStreakPreferences extends ExtensionPreferences {
    /**
     * This class is constructed once when your extension preferences are
     * about to be opened. This is a good time to setup translations or anything
     * else you only do once.
     *
     * @param {ExtensionMeta} metadata - An extension meta object
     */
    constructor(metadata) {
        super(metadata);

        console.debug(`constructing ${this.metadata.name}`);
    }

    /**
     * This function is called when the preferences window is first created to
     * build and return a GTK4 widget.
     *
     * The preferences window will be a `Adw.PreferencesWindow`, and the widget
     * returned by this function will be added to an `Adw.PreferencesPage` or
     * `Adw.PreferencesGroup` if necessary.
     *
     * @returns {Gtk.Widget} the preferences widget
     */
    getPreferencesWidget() {
        return new Gtk.Label({
            label: this.metadata.name,
        });
    }

    /**
     * Fill the preferences window with preferences.
     *
     * If this method is overridden, `getPreferencesWidget()` will NOT be called.
     *
     * @param {Adw.PreferencesWindow} window - the preferences window
     */
    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage({
            title: _('Settings'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('GitHub Configuration'),
            description: _('Configure your GitHub credentials'),
        });
        page.add(group);

        // Create an entry for GitHub username
        const usernameRow = new Adw.EntryRow({
            title: _('GitHub Username'),
            text: this.settings.get_string('github-username') || ''
        });
        usernameRow.connect('changed', entry => {
            this.settings.set_string('github-username', entry.get_text());
        });
        group.add(usernameRow);

        // Create an entry for GitHub token
        const tokenRow = new Adw.PasswordEntryRow({
            title: _('GitHub Token'),
            text: this.settings.get_string('github-token') || ''
        });
        tokenRow.connect('changed', entry => {
            this.settings.set_string('github-token', entry.get_text());
        });
        group.add(tokenRow);
    }
}