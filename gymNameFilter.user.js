// ==UserScript==
// @name         PhxPogoMap - Gym Name Filter
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  try to take over the world!
// @author       You
// @match        https://phxpogomap.com/phx
// @grant        none
// ==/UserScript==

(function($) {
    'use strict';

    var GYM_NAME_FILTER = 'GYM_NAME_FILTER';

    function setupFilterPanel() {
        var filterPanel = $('[data-panel="filters"] .panel-body');
        if (filterPanel.length === 0) {
            console.error('could not find the filter panel');
            return;
        }

        var gymNameFilter = $('<div />'), input;
        gymNameFilter.append('<label for="GYM_NAME_FILTER">Gym Name Filter</label>');
        gymNameFilter.append(input = $('<input name="GYM_NAME_FILTER" class="form-control" placeholder="(GET YOUR LEVEL BADGE|Starbucks)" type="text" />'));
        input.val(localStorage.getItem(GYM_NAME_FILTER) || '');
        filterPanel.prepend(gymNameFilter);
        input.on('change', function () {
            localStorage.setItem(GYM_NAME_FILTER, $(this).val());
            if (!overlays.Raids.hidden) getRaids();
            if (!overlays.Gyms.hidden) getGyms();
        });
    }

    var filterGymName = function (data) {
        var gymNameFilter = localStorage.getItem(GYM_NAME_FILTER) || '';
        if (gymNameFilter && gymNameFilter.length > 0) {
            var filter = new RegExp(gymNameFilter, 'i');
            console.log('filtering gyms with filter', gymNameFilter);
            return data.filter(function (raid) {
                return filter.test(raid.name);
            });
        }
        return data;
    };

    var origAddRaidsToMap = window.addRaidsToMap;
    var addRaidsToMap = function (data, map) {
        return origAddRaidsToMap(filterGymName(data), map);
    };

    var origAddGymsToMap = window.addGymsToMap;
    var addGymsToMap = function (data, map) {
        return origAddGymsToMap(filterGymName(data), map);
    };

    // replace stuff in window
    window._defaultSettings.GYM_NAME_FILTER = window._defaultSettings.GYM_NAME_FILTER || '';
    if (window.addRaidsToMap !== addRaidsToMap) {
        window.addRaidsToMap = addRaidsToMap;
    }

    if (window.addGymsToMap !== addGymsToMap) {
        window.addGymsToMap = addGymsToMap;
    }

    // setup filter panel
    setupFilterPanel();
})(window.jQuery);
