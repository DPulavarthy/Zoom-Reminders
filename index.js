/**
 * @file Zoom reminders program.
 * 
 * @name Zoom
 */

let [cron, links] = [require(`cron`), require(`./links.js`)]

/**
 * Open link from notification button.
 * 
 * @name open
 * @param {string} link The URL to open.
 * @return {null}
 */

this.open = link => {

    // Get user platform.
    let platform = (url, platform = new String()) => {
        switch (process.platform) {

            // Platform linux.
            case `linux`: {
                platform = `xdg-open ${url}`
                break
            }

            // Platform macos.
            case `darwin`: {
                platform = `open ${url}`
                break
            }

            // Platform windows.
            case `win32`: {
                platform = `cmd /c start ${url}`
                break
            }
        }
        return platform
    }

    // Open link.
    require(`child_process`).exec(platform(link))
}

/**
 * Send notification and get response.
 * 
 * @name notify
 * @param {array} links An array of objects with link data.
 * @return {null}
 */

this.notify = links => {

    // If no links, stop running.
    if (links.length < 1) return

    // Send notification.
    require(`node-notifier`).notify(

        // Notification data.
        {
            title: `Your 5 Minute Zoom Reminder!`,
            message: `This is your ${links.map(set => set.case).join(`/`)} Reminder!`,
            icon: `./assets/jonin.png`,
            actions: links.map(set => `Open link for ${set.case}`),
            sound: true,
            wait: true
        },

        /**
         * Button response event.
         * 
         * @name button
         * @param {string} res Case to open.
         * @return {null}
         */

        (_, res) => {
            let other

            // Filter links.
            links.forEach(set => `open link for ${set.case.toLowerCase()}` === res ? this.open(set.data) : other = set)

            // If only 1 link available, stop running.
            if (!other) return

            // Send notification for other link.
            require(`node-notifier`).notify(

                // Notification data.
                {
                    title: `Open other link?`,
                    message: `Accidently clicked the wrong link? Click here to open other link.`,
                    icon: `./assets/jonin.png`,
                    actions: [`Open link for ${other.case}`],
                    sound: false,
                    wait: false
                },

                /**
                 * Open other link.
                 * 
                 * @name other
                 * @return {null}
                 */

                _ => this.open(other.data)
            )

        }
    )
}

/**
 * Links parser.
 * 
 * @name linkify
 * @param {string} input A string with the link params.
 * @param {array} array A preset param.
 * @return {array} An array of objects with link data.
 */

this.linkify = (input, array = new Array()) => {

    // Parser logic.
    input.split(``).forEach(num => links[`period${num}`] ? array.push({ case: `Period ${num}`, data: links[`period${num}`] }) : null)
    return array
}

/**
 * First/Fifth period notification.
 * 
 * @name first
 * @return {null}
 */

this.first = _ => this.notify(this.linkify(`15`))

/**
 * Second/Sixth period notification.
 * 
 * @name second
 * @return {null}
 */

this.second = _ => this.notify(this.linkify(`26`))

/**
 * Third/Seventh period notification.
 * 
 * @name third
 * @return {null}
 */

this.third = _ => this.notify(this.linkify(`37`))

/**
 * Fourth/Eighth period notification.
 * 
 * @name fourth
 * @return {null}
 */

this.fourth = _ => this.notify(this.linkify(`48`))

// Cron Job setup.
let [first, second, third, fourth] = [
    new cron.CronJob(`0 45 8 * * 1,2,3,4,5`, this.first, null, true, `America/Chicago`),
    new cron.CronJob(`0 25 10 * * 1,2,3,4,5`, this.second, null, true, `America/Chicago`),
    new cron.CronJob(`0 5 12 * * 1,2,3,4,5`, this.third, null, true, `America/Chicago`),
    new cron.CronJob(`0 35 14 * * 1,2,3,4,5`, this.fourth, null, true, `America/Chicago`)
]

// Init cron job.
first.start()
second.start()
third.start()
fourth.start()

// 🔒 This is protected code, see https://kura.gq?to=share for more information.

this.first()