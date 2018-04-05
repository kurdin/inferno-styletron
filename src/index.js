import { Component } from 'inferno-component';
import { createElement } from 'inferno-create-element';
import { injectStylePrefixed } from './styletron-utils';

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

class StyletronProvider extends Component {
  getChildContext() {
    return {
      styletron: this.styletron
    };
  }

  constructor(props, context) {
    super(props, context);
    this.styletron = props.styletron;
  }

  render() {
    return this.props.children;
  }

}

function isType(value, type) {
  return typeof value === type;
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
  for (const key in source) {
    target[key] = source[key];
  }

  return target;
}

const STYLETRON_KEY = '__STYLETRON';
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
    const component = name[STYLETRON_KEY];
    const stylesArray = component.stylesArray.concat(styles);
    return createStyledComponent(component.name, stylesArray); // Tag name or non-styled component
  } else if (isString(name) || isFunction(name)) {
    return createStyledComponent(name, [styles]);
  }

  throw new Error('`styled` takes either a DOM element name or a component');
}

function createStyledComponent(name, stylesArray) {
  function StyledComponent(props, context) {
    const newProps = assign({}, props);
    const styles = resolveStyles(stylesArray, props, context);
    const className = injectStylePrefixed(context.styletron, styles);
    newProps.className = props.className ? `${props.className} ${className}` : props.class ? `${props.class} ${className}` : className;
    if (props.addClass && newProps.className) newProps.className = `${newProps.className.replace('  ', ' ')} ${props.addClass}`;

    if (styles && styles.addClass) {
        newProps.className = `${newProps.className.trim()} ${styles.addClass}`;
    }

    if (isFunction(props.innerRef)) {
      newProps.ref = props.innerRef;
      delete newProps.innerRef;
    }

    return createElement(name, newProps);
  }

  StyledComponent[STYLETRON_KEY] = {
    name,
    stylesArray
  };
  return StyledComponent;
}

function resolveStyles(stylesArray, props, context) {
  const resolvedStyles = {};

  for (let i = 0, l = stylesArray.length, styles; i < l; i++) {
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

export { StyletronProvider as Provider, styled$1 as styled };
//# sourceMappingURL=index.es.js.map
