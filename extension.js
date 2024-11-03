// extension.js
const { St, Clutter } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let commitIndicator;

const CommitIndicator = class CommitIndicator extends PanelMenu.Button {
    constructor() {
        super(0.0, 'Commit Indicator');

        this.boxLayout = new St.BoxLayout({
            style_class: 'commit-boxes'
        });

        // Create 7 boxes for the last week's commits
        this.boxes = [];
        for (let i = 0; i < 7; i++) {
            const box = new St.Widget({
                style_class: 'commit-box',
                style: 'width: 10px; height: 10px; margin: 2px; background-color: #2da44e; border-radius: 2px;'
            });
            this.boxes.push(box);
            this.boxLayout.add_child(box);
        }

        this.add_child(this.boxLayout);
        this.updateCommits();
    }

    async updateCommits() {
        try {
            // Replace with your GitHub username and Personal Access Token
            const username = keys.env.USERNAME;
            const token = keys.env.TOKEN;

            const today = new Date();
            const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

            const query = `
            query {
                user(login: "${username}") {
                    contributionsCollection(from: "${oneWeekAgo.toISOString()}", to: "${today.toISOString()}") {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    contributionCount
                                }
                            }
                        }
                    }
                }
            }`;

            const response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            const days = data.data.user.contributionsCollection.contributionCalendar.weeks[0].contributionDays;

            days.forEach((day, index) => {
                const opacity = day.contributionCount > 0 ? 1 : 0.2;
                this.boxes[index].style = `width: 10px; height: 10px; margin: 2px; background-color: #2da44e; opacity: ${opacity}; border-radius: 2px;`;
            });
        } catch (error) {
            log('Error fetching GitHub commits: ' + error);
        }
    }

    destroy() {
        super.destroy();
    }
};

function init() {
}

function enable() {
    commitIndicator = new CommitIndicator();
    Main.panel.addToStatusArea('commit-indicator', commitIndicator);
}

function disable() {
    commitIndicator.destroy();
    commitIndicator = null;
}