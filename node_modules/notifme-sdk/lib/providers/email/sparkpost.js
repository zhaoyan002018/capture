'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

// types
var EmailSparkPostProvider = function () {
  function EmailSparkPostProvider(config) {
    (0, _classCallCheck3.default)(this, EmailSparkPostProvider);
    this.id = 'email-sparkpost-provider';

    this.apiKey = config.apiKey;
  }

  (0, _createClass3.default)(EmailSparkPostProvider, [{
    key: 'send',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(request) {
        var id, userId, from, replyTo, subject, html, text, headers, to, cc, bcc, attachments, response, responseBody, _responseBody$errors, firstError, message;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                id = request.id, userId = request.userId, from = request.from, replyTo = request.replyTo, subject = request.subject, html = request.html, text = request.text, headers = request.headers, to = request.to, cc = request.cc, bcc = request.bcc, attachments = request.attachments;
                _context.next = 3;
                return (0, _request2.default)('https://api.sparkpost.com/api/v1/transmissions', {
                  method: 'POST',
                  headers: {
                    Authorization: this.apiKey,
                    'Content-Type': 'application/json',
                    'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
                  },
                  body: (0, _stringify2.default)({
                    options: {
                      transactional: true
                    },
                    content: {
                      from: from,
                      reply_to: replyTo,
                      subject: subject,
                      html: html,
                      text: text,
                      headers: (0, _extends3.default)({}, headers, cc && cc.length > 0 ? { CC: cc.join(',') } : null),
                      attachments: (attachments || []).map(function (_ref2) {
                        var contentType = _ref2.contentType,
                            filename = _ref2.filename,
                            content = _ref2.content;
                        return {
                          type: contentType,
                          name: filename,
                          data: (typeof content === 'string' ? Buffer.from(content) : content).toString('base64')
                        };
                      })
                    },
                    recipients: [{ address: { email: to } }].concat((0, _toConsumableArray3.default)((cc || []).map(function (email) {
                      return { address: { email: email, header_to: to } };
                    })), (0, _toConsumableArray3.default)((bcc || []).map(function (email) {
                      return { address: { email: email, header_to: to } };
                    }))),
                    metadata: { id: id, userId: userId }
                  })
                });

              case 3:
                response = _context.sent;
                _context.next = 6;
                return response.json();

              case 6:
                responseBody = _context.sent;

                if (!response.ok) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt('return', responseBody.results.id);

              case 11:
                _responseBody$errors = (0, _slicedToArray3.default)(responseBody.errors, 1), firstError = _responseBody$errors[0];
                message = (0, _keys2.default)(firstError).map(function (key) {
                  return key + ': ' + firstError[key];
                }).join(', ');
                throw new Error(response.status + ' - ' + message);

              case 14:
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
  return EmailSparkPostProvider;
}();

exports.default = EmailSparkPostProvider;