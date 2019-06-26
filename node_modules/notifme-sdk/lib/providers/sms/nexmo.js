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

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _request = require('../../util/request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var SmsNexmoProvider = function () {
  function SmsNexmoProvider(config) {
    (0, _classCallCheck3.default)(this, SmsNexmoProvider);
    this.id = 'sms-nexmo-provider';

    this.credentials = { api_key: config.apiKey, api_secret: config.apiSecret };
  }

  /*
   * Note: 'nature' is not supported.
   */


  (0, _createClass3.default)(SmsNexmoProvider, [{
    key: 'send',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var from, to, text, type, ttl, messageClass, response, responseBody, message;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                from = request.from, to = request.to, text = request.text, type = request.type, ttl = request.ttl, messageClass = request.messageClass;
                _context.next = 3;
                return (0, _request2.default)('https://rest.nexmo.com/sms/json', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: (0, _stringify2.default)((0, _extends3.default)({}, this.credentials, {
                    from: from,
                    to: to,
                    text: text,
                    type: type,
                    ttl: ttl,
                    'message-class': messageClass
                  }))
                });

              case 3:
                response = _context.sent;

                if (!response.ok) {
                  _context.next = 16;
                  break;
                }

                _context.next = 7;
                return response.json();

              case 7:
                responseBody = _context.sent;
                message = responseBody.messages[0];

                // Nexmo always returns 200 even for error

                if (!(message.status !== '0')) {
                  _context.next = 13;
                  break;
                }

                throw new Error('status: ' + message.status + ', error: ' + message['error-text']);

              case 13:
                return _context.abrupt('return', message['message-id']);

              case 14:
                _context.next = 17;
                break;

              case 16:
                throw new Error(response.status);

              case 17:
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
  return SmsNexmoProvider;
}();

exports.default = SmsNexmoProvider;