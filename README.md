# phxpogo-userscripts

User scripts that can be used with [Tampermonkey (for Chrome)](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en), and assumingly can be used with [Greasemonkey (for Firefox)](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).

Just install the browser plugin and click the install links below.

These scripts enhance the pogo map

### gymNameFilter ([install](https://github.com/ammmze/phxpogo-userscripts/raw/master/gymNameFilter.user.js))

Adds another filter option that allows filtering based on the gym name. For example, a value of "starbucks,get your level badge" would show any gym with the word "starbucks" or the phrase "get your level badge". The logic here is farily simplistic. We're just splitting the phrases on the comma and then each phrase becomes a regular expression to match against gym names. You'll probably notice this will pick other starbucks gyms that probably don't count as sponsors (they don't have the sponsor badge). If you want exact matching, you could use something like "^(get your level badge|starbucks)$"

### The following scripts are no longer necessary now that we have the pro map

#### eastValley ([install](https://github.com/ammmze/phxpogo-userscripts/raw/master/eastValley.user.js))

Updates the method that pulls data to pull several locations instead of just tempe, or mesa, etc. Also make it update data every 30s instead of 5s, so we don't hammer the server with the extra requests.

#### gymLabelFix ([install](https://github.com/ammmze/phxpogo-userscripts/raw/master/gymLabelFix.user.js))

Completely replaces the gym label method to fix the check for pogo logos. This allows the current legendary dog to actually display in the gym tooltip.
