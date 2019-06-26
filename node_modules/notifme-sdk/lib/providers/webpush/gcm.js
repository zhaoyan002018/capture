'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _webPush = require('web-push');

var _webPush2 = _interopRequireDefault(_webPush);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var WebpushGcmProvider = function () {
  function WebpushGcmProvider(_ref) {
    var gcmAPIKey = _ref.gcmAPIKey,
        vapidDetails = _ref.vapidDetails,
        ttl = _ref.ttl,
        headers = _ref.headers;
    (0, _classCallCheck3.default)(this, WebpushGcmProvider);
    this.id = 'webpush-gcm-provider';

    this.options = { TTL: ttl, headers: headers };
    if (gcmAPIKey) {
      _webPush2.default.setGCMAPIKey(gcmAPIKey);
    }
    if (vapidDetails) {
      var subject = vapidDetails.subject,
          publicKey = vapidDetails.publicKey,
          privateKey = vapidDetails.privateKey;

      _webPush2.default.setVapidDetails(subject, publicKey, privateKey);
    }
  }

  (0, _createClass3.default)(WebpushGcmProvider, [{
    key: 'send',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref3) {
        var subscription = _ref3.subscription,
            request = (0, _objectWithoutProperties3.default)(_ref3, ['subscription']);
        var result;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _webPush2.default.sendNotification(subscription, (0, _stringify2.default)(request), this.options);

              case 2:
                result = _context.sent;
                return _context.abrupt('return', result.headers.location);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x) {
        return _ref2.apply(this, arguments);
      }

      return send;
    }()
  }]);
  return WebpushGcmProvider;
}();

exports.default = WebpushGcmProvider;