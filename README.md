# phxpogo-userscripts

User scripts that can be used with [Tampermonkey (for Chrome)](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en), and assumingly can be used with [Greasemonkey (for Firefox)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).

Just install the browser plugin and click the install links below.

These scripts enhance the pogo map

### gymNameFilter ([install](https://github.com/ammmze/phxpogo-userscripts/raw/master/gymNameFilter.user.js))

Adds another filter option that allows filtering based on the gym name. The filter uses regular expressions to match names, so you can match multiple names, for example you could use something like `^(get your level badge|starbucks)$` to match all starbucks and sprint gyms.

### The following scripts are no longer necessary now that we have the pro map

#### eastValley ([install](https://github.com/ammmze/phxpogo-userscripts/raw/master/eastValley.user.js))

Updates the method that pulls data to pull several locations instead of just tempe, or mesa, etc. Also make it update data every 30s instead of 5s, so we don't hammer the server with the extra requests.

#### gymLabelFix ([install](https://github.com/ammmze/phxpogo-userscripts/raw/master/gymLabelFix.user.js))

Completely replaces the gym label method to fix the check for pogo logos. This allows the current legendary dog to actually display in the gym tooltip.
