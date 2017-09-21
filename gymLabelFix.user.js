// ==UserScript==
// @name         PhxPogoMap - Gym Label Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://phxpogomap.com/*/map
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';

    window.gymLabel = function (gym) {
        var includeMembers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var lastPokemonId = 649;

        var raid = gym.raid;
        var raidStr = '';
        if (raid && raid.end > Date.now()) {
            if (raid.pokemon_id !== null) {
                var pMove1 = moves[raid['move_1']] !== undefined ? i8ln(moves[raid['move_1']]['name']) : 'unknown';
                var pMove2 = moves[raid['move_2']] !== undefined ? i8ln(moves[raid['move_2']]['name']) : 'unknown';

                raidStr += '\n                    <div class=\'move\'>\n                      <span class=\'name\'>' + pMove1 + '</span><span class=\'type ' + moves[raid['move_1']]['type'].toLowerCase() + '\'>' + i8ln(moves[raid['move_1']]['type']) + '</span>\n                    </div>\n                    <div class=\'move\'>\n                      <span class=\'name\'>' + pMove2 + '</span><span class=\'type ' + moves[raid['move_2']]['type'].toLowerCase() + '\'>' + i8ln(moves[raid['move_2']]['type']) + '</span>\n                    </div>';
            }
        }
        var lastScannedStr = getDateStr(gym.last_scanned);
        var lastModifiedStr = getDateStr(gym.last_modified);
        var slotsString = gym.slots_available ? gym.slots_available === 1 ? '1 Free Slot' : gym.slots_available + ' Free Slots' : 'No Free Slots';
        var teamColor = ['85,85,85,1', '0,134,255,1', '255,26,26,1', '255,159,25,1'];
        var teamName = gymTypes[gym.team_id];
        var isUpcomingRaid = raid != null && Date.now() < raid.start;
        var isRaidStarted = isOngoingRaid(raid);
        var isRaidFilterOn = Store.get('showRaids');

        var subtitle = '';
        var image = '';
        var imageLbl = '';
        var navInfo = '';
        var memberStr = '';

        var gymPoints = gym.total_cp;
        var titleText = gym.name ? gym.name : gym.team_id === 0 ? teamName : 'Team ' + teamName;
        var title = '\n      <div class=\'gym name\' style=\'color:rgba(' + teamColor[gym.team_id] + ')\'>\n        ' + titleText + '\n      </div>';

        if (gym.team_id !== 0) {
            subtitle = '\n        <div>\n            <img class=\'gym info strength\' src=\'static/images/gym/Strength.png\'>\n            <span class=\'gym info strength\'>\n              Strength: ' + gymPoints + ' (' + slotsString + ')\n            </span>\n        </div>';
        }

        if ((isUpcomingRaid || isRaidStarted) && isRaidFilterOn && isGymSatisfiesRaidMinMaxFilter(raid)) {
            var raidColor = ['252,112,176', '255,158,22', '184,165,221'];
            var levelStr = '★'.repeat(raid['level']);

            if (isRaidStarted) {
                // Set default image.
                image = '\n                <img class=\'gym sprite\' src=\'static/images/raid/' + gymTypes[gym.team_id] + '_' + raid.level + '_unknown.png\'>\n                <div class=\'raid\'>\n                <span style=\'color:rgb(' + raidColor[Math.floor((raid.level - 1) / 2)] + ')\'>\n                ' + levelStr + '\n                </span>\n                <span class=\'raid countdown label-countdown\' disappears-at=\'' + raid.end + '\'></span> left\n                </div>\n            ';
                // Use Pokémon-specific image if we have one.
                if (raid.pokemon_id !== null && raid.pokemon_id <= lastPokemonId) {
                    image = '\n                    <div class=\'raid container\'>\n                    <div class=\'raid container content-left\'>\n                        <div>\n                        <img class=\'gym sprite\' src=\'static/icons/' + raid.pokemon_id + '.png\'>\n                        </div>\n                    </div>\n                    <div class=\'raid container content-right\'>\n                        <div>\n                        <div class=\'raid pokemon\'>\n                            ' + raid['pokemon_name'] + ' <a href=\'http://pokemon.gameinfo.io/en/pokemon/' + raid['pokemon_id'] + '\' target=\'_blank\' title=\'View in Pok\xE9dex\'>#' + raid['pokemon_id'] + '</a> | CP: ' + raid['cp'] + '\n                    </div>\n                        ' + raidStr + '\n                    </div>\n                    </div>\n                </div>\n                    <div class=\'raid\'>\n                    <span style=\'color:rgb(' + raidColor[Math.floor((raid.level - 1) / 2)] + ')\'>\n                    ' + levelStr + '\n                    </span>\n                    <span class=\'raid countdown label-countdown\' disappears-at=\'' + raid.end + '\'></span> left\n                    </div>\n                ';
                }
            } else {
                image = '<img class=\'gym sprite\' src=\'static/images/gym/' + gymTypes[gym.team_id] + '_' + getGymLevel(gym) + '_' + raid.level + '.png\'>';
            }

            if (isUpcomingRaid) {
                imageLbl = '\n                <div class=\'raid\'>\n                  <span style=\'color:rgb(' + raidColor[Math.floor((raid.level - 1) / 2)] + ')\'>\n                  ' + levelStr + '\n                  </span>\n                  Raid in <span class=\'raid countdown label-countdown\' disappears-at=\'' + raid.start + '\'></span>\n                </div>';
            }
        } else {
            image = '<img class=\'gym sprite\' src=\'static/images/gym/' + teamName + '_' + getGymLevel(gym) + '.png\'>';
        }

        navInfo = '\n            <div class=\'gym container\'>\n                <div>\n                  <span class=\'gym info navigate\'>\n                    <a href=\'javascript:void(0);\' onclick=\'javascript:openMapDirections(' + gym.latitude + ',' + gym.longitude + ');\' title=\'Open in Google Maps\'>\n                      ' + gym.latitude.toFixed(6) + ', ' + gym.longitude.toFixed(7) + '\n                    </a>\n                  </span>\n                </div>\n                <div class=\'gym info last-scanned\'>\n                    Last Scanned: ' + lastScannedStr + '\n                </div>\n                <div class=\'gym info last-modified\'>\n                    Last Modified: ' + lastModifiedStr + '\n                </div>\n            </div>\n        </div>';

        if (includeMembers) {
            memberStr = '<div>';

            gym.pokemon.forEach(function (member) {
                memberStr += '\n            <span class=\'gym member\'>\n              <center>\n                <div>\n                  <div>\n                    <i class=\'pokemon-sprite n' + member.pokemon_id + '\'></i>\n                  </div>\n                  <div>\n                    <span class=\'gym pokemon\'>' + member.pokemon_name + '</span>\n                  </div>\n                  <div>\n                    <img class=\'gym pokemon motivation heart\' src=\'static/images/gym/Heart.png\'> <span class=\'gym pokemon motivation\'>' + member.cp_decayed + '</span>\n                  </div>\n                </div>\n              </center>\n            </span>';
            });

            memberStr += '</div>';
        }

        return '\n        <div>\n            <center>\n                ' + title + '\n                ' + subtitle + '\n                ' + image + '\n                ' + imageLbl + '\n            </center>\n            ' + navInfo + '\n            <center>\n                ' + memberStr + '\n            </center>\n        </div>';
    }
})(window.jQuery);
