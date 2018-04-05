'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styled = exports.Provider = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _infernoComponent = require('inferno-component');

var _infernoCreateElement = require('inferno-create-element');

var _styletronUtils = require('./styletron-utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class Provider
 * @packagename styletron-inferno
 * @description Provides a Styletron instance to descendant styled components via context
 *
 * @example
 * // Server
 * import StyletronServer from 'styletron-server';
 * import { renderToString } from 'inferno-server';
 * import { Provider } from 'styletron-inferno';
 * import App from '../shared/components/app';
 *
 * function render() {
 *   const styletron = new StyletronServer();
 *   const root = renderToString(
 *     <Provider styletron={styletron}>
 *       <App/>
 *     </Provider>
 *   );
 *   const stylesheets = styletron.getStylesheetsHtml('my-custom-class');
 *   return `
 *     <!DOCTYPE html>
 *     <html>
 *       <head>
 *         ${stylesheets}
 *       </head>
 *       <body>
 *         <div id="root">${root}</div>
 *       </body>
 *     </html>
 *   `;
 * }
 *
 * @example
 * // Client
 * import { render } from 'inferno';
 * import StyletronClient from 'styletron-client';
 * import { Provider } from 'styletron-inferno';
 * import App from '../shared/components/app';
 *
 * function render() {
 *   const stylesheets = document.getElementsByClassName('my-custom-class');
 *   const styletron = new StyletronClient(stylesheets);
      render((
 *     <Provider styletron={styletron}>
 *       <App/>
 *     </Provider>
 *   ), document.getElementsById('root'));
 * }
 *
 * @property {object} styletron Styletron instance
 * @property {InfernoElement} children Child nodes
 * @extends InfernoComponent
 */

var StyletronProvider = function (_Component) {
  _inherits(StyletronProvider, _Component);

  _createClass(StyletronProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        styletron: this.styletron
      };
    }
  }]);

  function StyletronProvider(props, context) {
    _classCallCheck(this, StyletronProvider);

    var _this = _possibleConstructorReturn(this, (StyletronProvider.__proto__ || Object.getPrototypeOf(StyletronProvider)).call(this, props, context));

    _this.styletron = props.styletron;
    return _this;
  }

  _createClass(StyletronProvider, [{
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return StyletronProvider;
}(_infernoComponent.Component);

function isType(value, type) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === type;
}
function isFunction(value) {
  return isType(value, 'function');
}
function isObject(value) {
  return isType(value, 'object');
}
function isString(value) {
  return isType(value, 'string');
}
function isNil(value) {
  return value === null || value === undefined; // eslint-disable-line no-undefined
}
function assign(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }

  return target;
}

var STYLETRON_KEY = '__STYLETRON';
/**
 * Helper function to create styled components
 * @packagename styletron-inferno
 * @param  {string|function} name   Tag name or component function/class
 * @param  {function|object} styles Style object or function that returns a style object
 * @return {function}               Styled component
 *
 * @example
 * import { styled } from 'styletron-inferno';
 *
 * const Panel = styled('div', {
 *   backgroundColor: 'lightblue',
 *   fontSize: '12px'
 * });
 *
 * <Panel>Hello World</Panel>
 *
 * @example
 * import { styled } from 'styletron-inferno';
 *
 * const Panel = styled('div', props => ({
 *   backgroundColor: props.alert ? 'orange' : 'lightblue',
 *   fontSize: '12px'
 * }));
 *
 * <Panel alert>Danger!</Panel>
 *
 * @example
 * import { styled } from 'styletron-inferno';
 *
 * const DeluxePanel = styled(Panel, props => ({
 *   backgroundColor: props.alert ? 'red' : 'lime',
 *   boxShadow: '3px 3px 3px darkgray',
 *   color: 'white'
 * }));
 *
 * <DeluxePanel>Bonjour Monde</DeluxePanel>
 *
 *
 * @example with addClass
 * import { styled } from 'styletron-inferno';
 *
 *
 * const Test = styled('span', props => ({
 *   addClass: props.isActive ? 'active' : null,
 *   color: props.alert ? 'red' : 'lime',
 *   boxShadow: '3px 3px 3px darkgray',
 *   color: 'white'
 * }));
 *
 * <Test isActive={true}>Bonjour Monde</Test>
 * // or addClass use as attibute
 * <Test isActive={true} addClass={props.isActive? 'active' : null'}>Bonjour Monde</Test>
 */

function styled$1(name, styles) {
  // Styled component
  if (name && name.hasOwnProperty(STYLETRON_KEY)) {
    var component = name[STYLETRON_KEY];
    var stylesArray = component.stylesArray.concat(styles);
    return createStyledComponent(component.name, stylesArray); // Tag name or non-styled component
  } else if (isString(name) || isFunction(name)) {
    return createStyledComponent(name, [styles]);
  }

  throw new Error('`styled` takes either a DOM element name or a component');
}

function createStyledComponent(name, stylesArray) {
  function StyledComponent(props, context) {
    var newProps = assign({}, props);
    var styles = resolveStyles(stylesArray, props, context);
    var className = (0, _styletronUtils.injectStylePrefixed)(context.styletron, styles);
    newProps.className = props.className ? props.className + ' ' + className : props.class ? props.class + ' ' + className : className;
    if (props.addClass && newProps.className) newProps.className = newProps.className.replace('  ', ' ') + ' ' + props.addClass;

    if (styles && styles.addClass) {
      newProps.className = newProps.className.trim() + ' ' + styles.addClass;
    }

    if (isFunction(props.innerRef)) {
      newProps.ref = props.innerRef;
      delete newProps.innerRef;
    }

    return (0, _infernoCreateElement.createElement)(name, newProps);
  }

  StyledComponent[STYLETRON_KEY] = {
    name: name,
    stylesArray: stylesArray
  };
  return StyledComponent;
}

function resolveStyles(stylesArray, props, context) {
  var resolvedStyles = {};

  for (var i = 0, l = stylesArray.length, styles; i < l; i++) {
    styles = stylesArray[i];

    if (!isNil(styles)) {
      if (isFunction(styles)) {
        assign(resolvedStyles, styles(props, context));
      } else if (isObject(styles)) {
        assign(resolvedStyles, styles);
      }
    }
  }

  return resolvedStyles;
}

exports.Provider = StyletronProvider;
exports.styled = styled$1;
//# sourceMappingURL=index.es.js.map