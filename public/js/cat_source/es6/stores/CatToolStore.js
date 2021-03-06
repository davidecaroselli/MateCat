/*
 * Analyze Store
 */

import AppDispatcher  from './AppDispatcher';
import {EventEmitter} from 'events';
import CatToolConstants  from '../constants/CatToolConstants';
import assign  from 'object-assign';
import SegmentConstants from "../constants/SegmentConstants";

EventEmitter.prototype.setMaxListeners(0);


let CatToolStore = assign({}, EventEmitter.prototype, {
    files: null,
    storeFilesInfo: function(files) {
        this.files = files
    },
    getJobFilesInfo: function() {
        return this.files;
    },
    setProgress: function (stats) {
        stats.translationCompleted = stats.TODO === 0;
        stats.revisionCompleted = stats.TRANSLATED === 0;
        stats.revision1Completed = stats.revises && stats.revises.length > 0 && _.round(stats.revises[0].advancement_wc) === stats.TOTAL;
        stats.revision2Completed = stats.revises && stats.revises.length > 1 && _.round(stats.revises[1].advancement_wc) === stats.TOTAL;

        this._projectProgess = stats;
    },
    emitChange: function(event, args) {
        this.emit.apply(this, arguments);
    }

});


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case CatToolConstants.SHOW_CONTAINER:
            CatToolStore.emitChange(CatToolConstants.SHOW_CONTAINER, action.container);
            break;
        case CatToolConstants.CLOSE_SUBHEADER:
            CatToolStore.emitChange(CatToolConstants.CLOSE_SUBHEADER);
            break;
        case CatToolConstants.CLOSE_SEARCH:
            CatToolStore.emitChange(CatToolConstants.CLOSE_SEARCH);
            break;
        case CatToolConstants.TOGGLE_CONTAINER:
            CatToolStore.emitChange(CatToolConstants.TOGGLE_CONTAINER, action.container);
            break;
        case CatToolConstants.SET_SEGMENT_FILTER:
            CatToolStore.emitChange(CatToolConstants.SET_SEGMENT_FILTER, action.data, action.state);
            break;
        case CatToolConstants.SET_SEARCH_RESULTS:
            CatToolStore.emitChange(CatToolConstants.SET_SEARCH_RESULTS, action.total, action.segments);
            break;
        case CatToolConstants.RELOAD_SEGMENT_FILTER:
            CatToolStore.emitChange(CatToolConstants.RELOAD_SEGMENT_FILTER);
            break;
        case CatToolConstants.SHOW_PROFILE_MESSAGE_TOOLTIP:
            CatToolStore.emitChange(CatToolConstants.SHOW_PROFILE_MESSAGE_TOOLTIP);
            break;
        case CatToolConstants.STORE_FILES_INFO:
            CatToolStore.storeFilesInfo(action.files);
            CatToolStore.emitChange(CatToolConstants.STORE_FILES_INFO, action.files);
            break;
        case CatToolConstants.SET_PROGRESS:
            CatToolStore.setProgress(action.stats);
            CatToolStore.emitChange(CatToolConstants.SET_PROGRESS, CatToolStore._projectProgess);
            break;
    }
});
module.exports = CatToolStore;


