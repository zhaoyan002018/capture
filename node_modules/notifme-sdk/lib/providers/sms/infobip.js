'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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
var SmsInfobipProvider = function () {
  function SmsInfobipProvider(_ref) {
    var username = _ref.username,
        password = _ref.password;
    (0, _classCallCheck3.default)(this, SmsInfobipProvider);
    this.id = 'sms-infobip-provider';

    this.apiKey = Buffer.from(username + ':' + password).toString('base64');
  }

  /*
   * Note: 'nature', 'messageClass', 'type', 'ttl' are not supported.
   */


  (0, _createClass3.default)(SmsInfobipProvider, [{
    key: 'send',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var from, to, text, response, responseBody, message, error, _error, _message;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                from = request.from, to = request.to, text = request.text;
                _context.next = 3;
                return (0, _request2.default)('https://api.infobip.com/sms/1/text/single', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + this.apiKey,
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: (0, _stringify2.default)({
                    from: from,
                    to: to,
                    text: text
                  })
                });

              case 3:
                response = _context.sent;
                _context.next = 6;
                return response.json();

              case 6:
                responseBody = _context.sent;

                if (!response.ok) {
                  _context.next = 17;
                  break;
                }

                message = responseBody.messages[0];

                if (!(message.status.groupId === 1)) {
                  _context.next = 13;
                  break;
                }

                return _context.abrupt('return', message.messageId);

              case 13:
                error = message.status;
                throw new Error((0, _keys2.default)(error).map(function (key) {
                  return key + ': ' + error[key];
                }).join(', '));

              case 15:
                _context.next = 24;
                break;

              case 17:
                if (!(responseBody.requestError && responseBody.requestError.serviceException)) {
                  _context.next = 23;
                  break;
                }

                _error = responseBody.requestError.serviceException;
                _message = (0, _keys2.default)(_error).map(function (key) {
                  return key + ': ' + _error[key];
                }).join(', ');
                throw new Error(_message);

              case 23:
                throw new Error((0, _stringify2.default)(responseBody));

              case 24:
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
  return SmsInfobipProvider;
}();

exports.default = SmsInfobipProvider;