// ==UserScript==
// @name         PhxPogoMap - Gym Name Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://phxpogomap.com/*/map
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';

    var $gymNameFilter = $('#gym-name-filter-wrapper');
    if ($gymNameFilter.length === 0) {
        // need to add the gym name filter
        StoreOptions.gymNameFilter = {default: '', type: {
            parse: function (str) {
                return !str || !str.length ? [] : str.split(',');
            },
            stringify: function (opt) {
                if (typeof opt === 'string') {
                    return opt;
                }
                return opt && opt.join && opt.join(',') || opt.toString();
            }
        }};
        $gymNameFilter = $('<div class="form-control switch-container" id="gym-name-filter-wrapper" />');
        $gymNameFilter.append('<h3>Gym Names (csv)</h3>');
        var $input = $('<input type="text" class="gym-name-filter-switch" placeholder="GET YOUR LEVEL BADGE,Starbucks" />');
        $input.val(Store.get('gymNameFilter'));
        $input.on('change', function(e) {
            Store.set('gymNameFilter', e.target.value.trim());
            lastgyms = false;
            updateMap();
        });
        $gymNameFilter.append($input);
        $gymNameFilter.insertAfter($('#gyms-filter-wrapper'));
    }

    if (!window.replacedProcessGym) {
        window.replacedProcessGym = true;
        var origProcessGym = window.processGym;
        window.processGym = function (i, item) {
            var removeGymFromMap = function removeGymFromMap(gymid) {
                if (mapData.gyms[gymid] && mapData.gyms[gymid].marker) {
                    if (mapData.gyms[gymid].marker.rangeCircle) {
                        mapData.gyms[gymid].marker.rangeCircle.setMap(null);
                    }
                    mapData.gyms[gymid].marker.setMap(null);
                    delete mapData.gyms[gymid];
                }
            };

            var names = Store.get('gymNameFilter');
            if (names && names.length) {
                var allowed = false;
                $.each(names, function (i, filterName) {
                    allowed = allowed || new RegExp(filterName, 'i').test(item.name);
                });
                if (!allowed) {
                    removeGymFromMap(item.gym_id);
                    return true;
                }
            }
            return origProcessGym(i, item);
        };
    }
})(window.jQuery);
