// ==UserScript==
// @name         PhxPogoMap - East Valley
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://phxpogomap.com/*/map
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    var intervals = {};
    var realSetInterval = window.setInterval;
    window.setInterval = function (func, delay) {
        intervals[realSetInterval(func, delay)] = func;
    };
    window.getIntervalId = function (func) {
        for (var key in intervals) {
            if (intervals.hasOwnProperty(key) && intervals[key] === func) {
                return key;
            }
        }
        return null;
    };
})();

document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

function DOM_ContentReady () {
    (function($) {
        $(EastValleyMonkey);
    })(window.jQuery);
}

function EastValleyMonkey () {
    (function($) {
        'use strict';

        if (!window.replacedLoadRawData) {
            window.replacedLoadRawData = true;
            var updateMapInterval = window.getIntervalId(updateMap);
            console.log('updating the updateMap interval to 30s');
            if (updateMapInterval !== null) {
                window.clearInterval(updateMapInterval);
                // setting update to every 30s instead of 5s, so we don't hammer the site
                window.setInterval(updateMap, 5000 * 6);
            }
            var loadRawData = window.loadRawData;
            window.loadRawData = function () {
                var loadPokemon = Store.get('showPokemon');
                var loadGyms = Store.get('showGyms') || Store.get('showRaids');
                var loadPokestops = Store.get('showPokestops');
                var loadScanned = Store.get('showScanned');
                var loadSpawnpoints = Store.get('showSpawnpoints');
                var loadLuredOnly = Boolean(Store.get('showLuredPokestopsOnly'));

                var bounds = map.getBounds();
                var swPoint = bounds.getSouthWest();
                var nePoint = bounds.getNorthEast();
                var swLat = swPoint.lat();
                var swLng = swPoint.lng();
                var neLat = nePoint.lat();
                var neLng = nePoint.lng();

                var areas = ['gilbert', 'mesa', 'east_mesa', 'chandler', 'chandler_heights', 'tempe'];
                var m = window.location.pathname.match(/^\/([a-z_]+)\//);
                if (m.length > 1) {
                    areas.push(m[1]);
                }
                areas = $.unique(areas);
                var jqXhrs = [];

                $.each(areas, function (i, area) {
                    var url = '../'+area+'/raw_data';
                    jqXhrs.push(
                        $.ajax({
                            url: url,
                            type: 'GET',
                            data: {
                                'timestamp': timestamp,
                                'pokemon': loadPokemon,
                                'lastpokemon': lastpokemon,
                                'pokestops': loadPokestops,
                                'lastpokestops': lastpokestops,
                                'luredonly': loadLuredOnly,
                                'gyms': loadGyms,
                                'lastgyms': lastgyms,
                                'scanned': loadScanned,
                                'lastslocs': lastslocs,
                                'spawnpoints': loadSpawnpoints,
                                'lastspawns': lastspawns,
                                'swLat': swLat,
                                'swLng': swLng,
                                'neLat': neLat,
                                'neLng': neLng,
                                'oSwLat': oSwLat,
                                'oSwLng': oSwLng,
                                'oNeLat': oNeLat,
                                'oNeLng': oNeLng,
                                'reids': String(reincludedPokemon),
                                'eids': String(excludedPokemon)
                            },
                            dataType: 'json',
                            cache: false,
                            beforeSend: function beforeSend() {
                                if (rawDataIsLoading && rawDataIsLoading[area]) {
                                    return false;
                                } else {
                                    rawDataIsLoading = rawDataIsLoading || {};
                                    rawDataIsLoading[area] = true;
                                }
                            },
                            statusCode: {
                                401: function _(xhr) {
                                    // Display error toast
                                    toastr.error('Your session has ended because you logged in from a different location.', 'No longer logged in.');
                                    toastr.options = {
                                        'closeButton': true,
                                        'debug': false,
                                        'newestOnTop': true,
                                        'progressBar': false,
                                        'positionClass': 'toast-top-right',
                                        'preventDuplicates': true,
                                        'onclick': null,
                                        'showDuration': '300',
                                        'hideDuration': '1000',
                                        'timeOut': '25000',
                                        'extendedTimeOut': '1000',
                                        'showEasing': 'swing',
                                        'hideEasing': 'linear',
                                        'showMethod': 'fadeIn',
                                        'hideMethod': 'fadeOut'
                                    };
                                },
                                502: function _() {
                                    // Display error toast
                                    toastr.error('The backend scanner could be down or you might need to reduce how many pokemon you are showing.', 'Error getting data');
                                    toastr.options = {
                                        'closeButton': true,
                                        'debug': false,
                                        'newestOnTop': true,
                                        'progressBar': false,
                                        'positionClass': 'toast-top-right',
                                        'preventDuplicates': true,
                                        'onclick': null,
                                        'showDuration': '300',
                                        'hideDuration': '1000',
                                        'timeOut': '25000',
                                        'extendedTimeOut': '1000',
                                        'showEasing': 'swing',
                                        'hideEasing': 'linear',
                                        'showMethod': 'fadeIn',
                                        'hideMethod': 'fadeOut'
                                    };
                                }
                            },
                            complete: function complete() {
                                rawDataIsLoading[area] = false;
                            }
                        })
                    );
                });

                var deferred = $.Deferred();
                $.when.apply($, jqXhrs).done(function(){
                    var results = {};
                    for (var i = 0; i < jqXhrs.length; i++) {
                        var result = arguments[i][0];
                        var pokemons = results.pokemon ? {pokemons: results.pokemons.concat(arguments[i][0].pokemons)} : {};
                        $.extend(true, results, result, pokemons);
                    }
                    deferred.resolve(results);
                });
                return deferred;
            };
        }
    })(window.jQuery);
}
