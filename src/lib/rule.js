"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
// const KIE_SERVER_URL = 'http://cefiro.comp.ae.keio.ac.jp:8888';
var KIE_SERVER_URL = 'http://localhost:8888';
function checkAccommodation(data) {
    if (data.stayClass === '日帰り' || data.stayClass === '宿泊(帰着日)') {
        return Promise.resolve(__assign(__assign({}, data), { accommodationAmount: 0, accommodationDescription: '宿泊がないため宿泊料は支給されません' }));
    }
    return fetch(KIE_SERVER_URL + "/accommodations", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data)
    })
        .then(function (res) { return res.json(); })
        .then(function (json) { return json; });
}
exports.checkAccommodation = checkAccommodation;
function checkDailyAllowance(data) {
    return fetch(KIE_SERVER_URL + "/dailyallowances", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data)
    })
        .then(function (res) { return res.json(); })
        .then(function (json) { return json; });
}
exports.checkDailyAllowance = checkDailyAllowance;
function checkTrain(data) {
    return fetch(KIE_SERVER_URL + "/trains", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data)
    })
        .then(function (res) { return res.json(); })
        .then(function (json) { return json; });
}
exports.checkTrain = checkTrain;
function exportExcel(data) {
    return fetch(KIE_SERVER_URL + "/excel", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data)
    })
        .then(function (res) { return res.json(); })
        .then(function (json) { return json; });
}
exports.exportExcel = exportExcel;
function safeDelete(data) {
    return fetch(KIE_SERVER_URL + "/delete", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data)
    })
        .then(function (res) { return res.json(); })
        .then(function (json) { return json; });
}
exports.safeDelete = safeDelete;
