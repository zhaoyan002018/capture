'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _notificationCatcherProvider = require('../notificationCatcherProvider');

var _notificationCatcherProvider2 = _interopRequireDefault(_notificationCatcherProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var WebpushNotificationCatcherProvider = function (_NotificationCatcherP) {
  (0, _inherits3.default)(WebpushNotificationCatcherProvider, _NotificationCatcherP);

  function WebpushNotificationCatcherProvider() {
    (0, _classCallCheck3.default)(this, WebpushNotificationCatcherProvider);
    return (0, _possibleConstructorReturn3.default)(this, (WebpushNotificationCatcherProvider.__proto__ || (0, _getPrototypeOf2.default)(WebpushNotificationCatcherProvider)).apply(this, arguments));
  }

  (0, _createClass3.default)(WebpushNotificationCatcherProvider, [{
    key: 'send',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
        var subscription = _ref2.subscription,
            title = _ref2.title,
            request = (0, _objectWithoutProperties3.default)(_ref2, ['subscription', 'title']);
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', this.sendToCatcher({
                  to: (request.userId ? request.userId : 'user') + '@webpush',
                  from: '-',
                  subject: title,
                  headers: {
                    'X-type': 'webpush',
                    'X-to': '[webpush] ' + (request.userId ? request.userId : ''),
                    'X-payload': (0, _stringify2.default)((0, _extends3.default)({ title: title }, request))
                  }
                }));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x) {
        return _ref.apply(this, arguments);
      }

      return send;
    }()
  }]);
  return WebpushNotificationCatcherProvider;
}(_notificationCatcherProvider2.default);

exports.default = WebpushNotificationCatcherProvider;