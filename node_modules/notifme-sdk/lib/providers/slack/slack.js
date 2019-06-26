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

var _request = require('../../util/request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Types
var SlackProvider = function () {
  function SlackProvider(config) {
    (0, _classCallCheck3.default)(this, SlackProvider);
    this.id = 'slack-provider';

    this.webhookUrl = config.webhookUrl;
  }

  (0, _createClass3.default)(SlackProvider, [{
    key: 'send',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
        var webhookUrl = _ref2.webhookUrl,
            request = (0, _objectWithoutProperties3.default)(_ref2, ['webhookUrl']);
        var apiRequest, response, responseText;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                apiRequest = {
                  method: 'POST',
                  body: (0, _stringify2.default)(request)
                };
                _context.next = 3;
                return (0, _request2.default)(webhookUrl || this.webhookUrl, apiRequest);

              case 3:
                response = _context.sent;

                if (!response.ok) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt('return', '');

              case 8:
                _context.next = 10;
                return response.text();

              case 10:
                responseText = _context.sent;
                throw new Error(response.status + ' - ' + responseText);

              case 12:
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
  return SlackProvider;
}();

exports.default = SlackProvider;