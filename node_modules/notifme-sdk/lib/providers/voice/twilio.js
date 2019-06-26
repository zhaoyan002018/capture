'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _request = require('../../util/request');

var _request2 = _interopRequireDefault(_request);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var VoiceTwilioProvider = function () {
  function VoiceTwilioProvider(_ref) {
    var accountSid = _ref.accountSid,
        authToken = _ref.authToken;
    (0, _classCallCheck3.default)(this, VoiceTwilioProvider);
    this.id = 'voice-twilio-provider';

    this.accountSid = accountSid;
    this.apiKey = Buffer.from(accountSid + ':' + authToken).toString('base64');
  }

  (0, _createClass3.default)(VoiceTwilioProvider, [{
    key: 'send',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var from, to, url, method, fallbackUrl, fallbackMethod, statusCallback, statusCallbackEvent, sendDigits, machineDetection, machineDetectionTimeout, timeout, form, response, responseBody;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                from = request.from, to = request.to, url = request.url, method = request.method, fallbackUrl = request.fallbackUrl, fallbackMethod = request.fallbackMethod, statusCallback = request.statusCallback, statusCallbackEvent = request.statusCallbackEvent, sendDigits = request.sendDigits, machineDetection = request.machineDetection, machineDetectionTimeout = request.machineDetectionTimeout, timeout = request.timeout;
                form = new _formData2.default();

                form.append('From', from);
                form.append('To', to);
                form.append('Url', url);
                if (method) form.append('Method', method);
                if (fallbackUrl) form.append('FallbackUrl', fallbackUrl);
                if (fallbackMethod) form.append('FallbackMethod', fallbackMethod);
                if (statusCallback) form.append('StatusCallback', statusCallback);
                if (statusCallbackEvent) {
                  statusCallbackEvent.forEach(function (event) {
                    return form.append('StatusCallbackEvent', event);
                  });
                }
                if (sendDigits) form.append('SendDigits', sendDigits);
                if (machineDetection) form.append('MachineDetection', machineDetection);
                if (machineDetectionTimeout) form.append('MachineDetectionTimeout', machineDetectionTimeout);
                if (timeout) form.append('Timeout', timeout);

                _context.next = 16;
                return (0, _request2.default)('https://api.twilio.com/2010-04-01/Accounts/' + this.accountSid + '/Calls.json', {
                  method: 'POST',
                  headers: {
                    Authorization: 'Basic ' + this.apiKey,
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: form
                });

              case 16:
                response = _context.sent;
                _context.next = 19;
                return response.json();

              case 19:
                responseBody = _context.sent;

                if (!response.ok) {
                  _context.next = 24;
                  break;
                }

                return _context.abrupt('return', responseBody.sid);

              case 24:
                throw new Error(response.status + ' - ' + responseBody.message);

              case 25:
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
  return VoiceTwilioProvider;
}();

exports.default = VoiceTwilioProvider;