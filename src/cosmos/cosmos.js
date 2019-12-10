(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types'), require('moment'), require('react-dom'), require('react-popper')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types', 'moment', 'react-dom', 'react-popper'], factory) :
  (global = global || self, factory(global.Cosmos = {}, global.React, global.PropTypes, global.moment, global.ReactDOM, global.Popper));
}(this, (function (exports, React$1, PropTypes, moment, ReactDOM, reactPopper) { 'use strict';

  var React$1__default = 'default' in React$1 ? React$1['default'] : React$1;
  PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;
  moment = moment && moment.hasOwnProperty('default') ? moment['default'] : moment;
  ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;

  // Check for an existence of prop

  const getScrollbarWidth = () => {
    const scrollDiv = document.createElement('div');
    const divSize = '50px';
    let size = 0;
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = `-${divSize}`;
    scrollDiv.style.width = divSize;
    scrollDiv.style.height = divSize;
    scrollDiv.style.overflow = 'scroll';
    document.body.appendChild(scrollDiv);
    size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return size;
  }; // Test element for overflow

  const testElForOverflow = el => {
    return el === document.body ? el.clientWidth < window.innerWidth : el.scrollHeight > el.clientHeight;
  }; // Working our way to Lodash...:-|

  const isFunction = obj => typeof obj === 'function'; // Used mostly to trigger css transition after DOM append

  const reflow = node => {
    node = node || document.body;
    const foo = node.offsetWidth;
    return foo;
  }; // Capitalize

  const cap = s => s.charAt(0).toUpperCase() + s.slice(1); // Add some context...closer to Lodash

  const bindAll = (obj, names) => {
    if (!Array.isArray(names)) {
      throw new Error('Second argument to bindAll must be an array of function names');
    }

    names.forEach(fn => {
      obj[fn] = obj[fn].bind(obj);
    });
  }; // Generate unique id for elements

  const generateUniqueId = () => {
    return `_${Math.random().toString(36).substr(2, 9)}`;
  };

  const getComponentByType = (children, type) => {
    return children.find(component => component.type === type);
  };
  /* Basically extracts child components to an array in given order.
     children - React.Children object (this.props.children)
     order - Array with component types
  */


  const extractChildren = (children, order) => {
    const childrenArr = React.Children.toArray(children);
    return order.map(slot => getComponentByType(childrenArr, slot));
  };

  const propTypes = {
    /* Content for either a container or item */
    children: PropTypes.node,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),

    /* HTML tag, React Component or React Element to use for the Flex component */
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType, PropTypes.element]),

    /* Use to enclose items */
    container: PropTypes.bool,

    /* Use when inside a container. Items can be containers as well. */
    item: PropTypes.bool,

    /* container prop: Equal space between container and items and items themselves. */
    gutter: PropTypes.oneOf(['1x', '2x', '3x', '4x']),

    /* container prop: Defines item flow direction. */
    direction: PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),

    /* container prop: Defines wrapping for items. */
    wrap: PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),

    /* container prop: Defines the alignment along the main axis. */
    justify: PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'evenly']),

    /* container prop: Defines the alignment along the cross axis. */
    'align-items': PropTypes.oneOf(['stretch', 'start', 'end', 'center', 'baseline']),

    /* container prop: Aligns container lines when there is extra space in the cross-axis. */
    'align-content': PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'stretch']),

    /* item prop: Allow item to grow to available space */
    grow: PropTypes.bool,

    /* item prop: Allow item to grow to available space */
    shrink: PropTypes.bool,

    /* item prop: Specify individual item alignment */
    'align-self': PropTypes.oneOf(['auto', 'start', 'end', 'baseline', 'center', 'stretch']),

    /* item prop: Specify item width and or offset for xs breakpoint and above */
    xs: PropTypes.shape({
      width: PropTypes.string,
      offset: PropTypes.string
    }),

    /* item prop: Specify item width and or offset for sm breakpoint and above */
    sm: PropTypes.shape({
      width: PropTypes.string,
      offset: PropTypes.string
    }),

    /* item prop: Specify item width and or offset for md breakpoint and above */
    md: PropTypes.shape({
      width: PropTypes.string,
      offset: PropTypes.string
    }),

    /* item prop: Specify item width and or offset for lg breakpoint and above */
    lg: PropTypes.shape({
      width: PropTypes.string,
      offset: PropTypes.string
    }),

    /* item prop: Specify item width and or offset for xl breakpoint and above */
    xl: PropTypes.shape({
      width: PropTypes.string,
      offset: PropTypes.string
    })
  };
  const defaultProps = {
    children: null,
    classes: [],
    as: 'div',
    container: null,
    item: null,
    gutter: null,
    direction: null,
    wrap: null,
    justify: null,
    'align-items': null,
    'align-content': null,
    'align-self': null,
    grow: false,
    shrink: true,
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null
  }; // Maps props to classNames

  const classMap = {
    gutter: val => `gutter-${val}`,
    direction: val => val,
    wrap: val => val,
    justify: val => `justify-${val}`,
    'align-items': val => `align-items-${val}`,
    'align-content': val => `align-content-${val}`,
    width: val => `width-${val}`,
    offset: val => `offset-${val}`,
    'align-self': val => `align-self-${val}`,
    grow: val => val,
    shrink: val => val
  };

  function getMappedClasses(props) {
    return Object.keys(classMap).reduce((classes, classMapKey) => {
      // If given a truthy prop that maps to a class add that class
      if (props[classMapKey]) {
        const val = props[classMapKey];
        const fn = classMap[classMapKey]; // For props with string values use the string, otherwise, for bools, use the key

        const cls = fn(typeof val === 'string' ? val : classMapKey);
        classes.push(cls);
      }

      return classes;
    }, []);
  }

  function getPrefixedClasses(props) {
    // Loop each breakpoint
    return ['xs', 'sm', 'md', 'lg', 'xl'].reduce((classes, bp) => {
      // Does the component have breakpoint specific props object?
      if (props[bp]) {
        // Get the classes then prepend breakpoint prefix
        const bpClasses = getMappedClasses(props[bp]).map(cls => `${bp}-${cls}`);
        classes = classes.concat(bpClasses);
      }

      return classes;
    }, []);
  }

  function getClasses(props) {
    const classes = getMappedClasses(props);
    const prefixedClasses = getPrefixedClasses(props);

    if (props.container) {
      classes.unshift('flex-container');
    }

    if (props.item) {
      classes.unshift('flex-item');
    }

    return classes.concat(prefixedClasses, props.classes);
  }

  function Flex(props) {
    let {
      as: Component,
      ...restProps
    } = props;
    const flexClasses = getClasses(props); // Delete internal "config" props from restProps to avoid passing to DOM element

    Object.keys(Flex.defaultProps).filter(configProp => configProp !== 'children').forEach(configProp => {
      delete restProps[configProp];
    });
    /**
     * If "as" is a component Type[fn|class] we need to
     * concat passed classes with Flex generated classes
     * and pass back as an array for "as" to consume.
     */

    if (isFunction(Component)) {
      restProps.classes = flexClasses;
      /**
       * If "as" is an instance of a React element
       * Use its Type to construct a new element with its given props
       */
    } else if (React$1.isValidElement(Component)) {
      // Order matters, grab props off of instance before resetting Component
      restProps = { ...Component.props,
        ...restProps,
        classes: flexClasses
      }; // Reset component to Element constructor

      Component = Component.type;
    } else {
      restProps.className = flexClasses.join(' ');
    }

    return React$1__default.createElement(Component, restProps);
  }

  Flex.propTypes = propTypes;
  Flex.defaultProps = defaultProps;

  const propTypes$1 = {
    href: PropTypes.any.isRequired,
    title: PropTypes.string,
    target: PropTypes.string,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),
    onClick: PropTypes.func
  };
  const defaultProps$1 = {
    title: '',
    target: '',
    classes: [],
    onClick: null
  };

  function Link(props) {
    const {
      href,
      children,
      title,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement("a", {
      href,
      title: title || href,
      className: ['link', ...classes].join(' '),
      ...restProps
    }, children);
  }

  Link.propTypes = propTypes$1;
  Link.defaultProps = defaultProps$1;

  function Icon(props) {
    return React$1__default.createElement("i", {
      className: `pi pi-${props.name}`
    });
  }

  Icon.propTypes = {
    name: PropTypes.string.isRequired
  };

  const propTypes$2 = {
    /* Text/Content for the button */
    children: PropTypes.node.isRequired,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),
    variant: PropTypes.oneOf(['primary', 'secondary', 'simple', 'urgent', 'bare']),
    type: PropTypes.oneOf(['button', 'reset', 'submit', null]),
    disabled: PropTypes.bool,

    /* Passing an href will render a Link styled as a Button */
    href: PropTypes.string,

    /* For Icon buttons: Provides a textual button label */
    'aria-label': PropTypes.string
  };
  const defaultProps$2 = {
    classes: [],
    variant: 'secondary',
    type: 'button',
    disabled: false,
    href: null,
    'aria-label': ''
  };
  const Button = React$1.forwardRef(function Button(props, ref) {
    const {
      variant,
      type,
      disabled,
      children,
      classes: propClasses,
      href,
      'aria-label': ariaLabel,
      ...restProps
    } = props;
    const childArr = React$1.Children.toArray(children);
    const classes = ['button', variant];
    if (href) return React$1__default.createElement(Link, { ...props,
      classes: [...classes, ...propClasses]
    });

    if (childArr.length === 1 && childArr[0].type === Icon) {
      classes.push('icon');
    }

    return React$1__default.createElement("button", {
      ref,
      disabled,
      type,
      className: classes.concat(propClasses).join(' '),
      'aria-disabled': disabled,
      'aria-label': ariaLabel,
      ...restProps
    }, children);
  });
  Button.propTypes = propTypes$2;
  Button.defaultProps = defaultProps$2;

  const propTypes$3 = {
    /* Use to associate with a form-element's id */
    htmlFor: PropTypes.string.isRequired,

    /* Content/text for the label */
    children: PropTypes.node.isRequired,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$3 = {
    classes: []
  };

  function Label(props) {
    const {
      htmlFor,
      classes,
      children,
      ...restProps
    } = props;
    return React$1__default.createElement("label", {
      htmlFor,
      className: ['label', ...classes].join(' '),
      ...restProps
    }, children);
  }

  Label.propTypes = propTypes$3;
  Label.defaultProps = defaultProps$3;

  /**
   * Generally, avatars are used to distinguish between different operators and
   * objects when they are shown in a list or in a small space. Users of applications
   * can upload a custom avatar of their choice.
   */

  function Avatar(props) {
    const {
      label,
      image,
      size,
      variant,
      classes
    } = props;
    let content;

    if (variant) {
      classes.push(variant.toLowerCase());
    }

    if (image) {
      content = React$1__default.createElement("img", {
        src: image,
        alt: label || ''
      });
    } else {
      const words = label.toLowerCase().split(' ');
      words.length = Math.min(words.length, 2); // TODO: Not sure what to do if given nothing

      content = words.map(name => name.charAt(0)).join('');
      classes.push(`label-${content.charAt(0)}`);
    }

    return React$1__default.createElement("div", {
      title: label,
      className: ['avatar', size, ...classes].join(' ')
    }, content);
  }

  Avatar.propTypes = {
    /**
     *  Label to use to show initials for
     */
    label: PropTypes.string,

    /**
     * Image url to use instead of text
     */
    image: PropTypes.string,

    /**
     * Size of icon (small|medium(default)|large) *
     */
    size: PropTypes.string,

    /**
     * Variant of the avatar to disply (default|group|object)
     */
    variant: PropTypes.string,

    /**
     * Additional classes
     */
    classes: PropTypes.array
  };
  Avatar.defaultProps = {
    label: '',
    image: null,
    size: 'medium',
    variant: 'default',
    classes: []
  };

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  const propTypes$4 = {
    /* HTML tag to use for the collapsible container */
    as: PropTypes.string,

    /* Content to expand/collapse */
    children: PropTypes.node.isRequired,

    /* Initial visual state */
    collapsed: PropTypes.bool,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),
    dimension: PropTypes.oneOf(['height', 'width']),
    animate: PropTypes.bool,
    speed: PropTypes.oneOf(['fast', 'medium', 'slow']),
    unmountWhenCollapsed: PropTypes.bool,
    onBeforeCollapse: PropTypes.func,
    onBeforeExpand: PropTypes.func,
    onAfterCollapse: PropTypes.func,
    onAfterExpand: PropTypes.func
  };
  const defaultProps$4 = {
    as: 'div',
    classes: [],
    dimension: 'height',
    collapsed: false,
    animate: true,
    speed: 'medium',
    unmountWhenCollapsed: false,
    onBeforeCollapse: null,
    onBeforeExpand: null,
    onAfterCollapse: null,
    onAfterExpand: null
  };

  class ExpandCollapse extends React$1.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        status: props.collapsed ? 'collapsed' : 'expanded'
      };
      bindAll(this, ['onTransitionend']);
      this.ref = React$1__default.createRef();
    }

    componentDidUpdate(prevProps) {
      if (prevProps.collapsed === this.props.collapsed) return;
      const wantsToCollapse = this.props.collapsed;
      const wantsToExpand = !this.props.collapsed;
      const canCollapse = ['expanded', 'expanding'].includes(this.state.status);
      const canExpand = ['collapsed', 'collapsing'].includes(this.state.status);

      if (wantsToCollapse && canCollapse) {
        this.collapse();
      } else if (wantsToExpand && canExpand) {
        this.expand();
      }
    }

    onTransitionend(e) {
      if (e.propertyName !== this.props.dimension) return;

      if (this.state.status === 'collapsing') {
        this.onAfterCollapse();
      } else {
        this.onAfterExpand();
      }
    }

    onBeforeExpand() {
      const cb = this.props.onBeforeExpand;
      if (isFunction(cb)) cb();
    }

    expand() {
      this.onBeforeExpand();

      if (this.props.animate) {
        this.animateExpand();
      } else {
        this.onAfterExpand();
      }
    }

    animateExpand() {
      this.setState({
        status: 'expanding'
      }, () => {
        this.setExpandedStyle();
      });
    }

    onAfterExpand() {
      this.setState({
        status: 'expanded'
      }, () => {
        const cb = this.props.onAfterExpand;
        if (this.props.animate) this.removeInlineStyle();
        if (isFunction(cb)) cb();
      });
    }

    onBeforeCollapse() {
      const cb = this.props.onBeforeCollapse;
      if (isFunction(cb)) cb();
    }

    collapse() {
      this.onBeforeCollapse();

      if (this.props.animate) {
        this.setExpandedStyle();
        this.animateCollapse();
      } else {
        this.onAfterCollapse();
      }
    }

    animateCollapse() {
      this.setState({
        status: 'collapsing'
      }, () => {
        // Needs reflow to avoid jump to 0
        reflow();
        this.ref.current.style[this.props.dimension] = `0`;
      });
    }

    onAfterCollapse() {
      this.setState({
        status: 'collapsed'
      }, () => {
        const cb = this.props.onAfterCollapse;

        if (this.props.unmountWhenCollapsed !== true && this.props.animate) {
          this.removeInlineStyle();
        }

        if (isFunction(cb)) cb();
      });
    }

    setExpandedStyle() {
      const el = this.ref.current; // Set width|height to the scroll[Width|Height]

      el.style[this.props.dimension] = `${el[`scroll${cap(this.props.dimension)}`]}px`;
    }

    removeInlineStyle() {
      this.ref.current.style[this.props.dimension] = '';
    }

    render() {
      const {
        as: Tag,
        children,
        animate,
        speed,
        unmountWhenCollapsed,
        dimension,
        classes: propClasses,
        ...restProps
      } = this.props;
      const {
        status
      } = this.state;
      const classes = ['expand-collapse', dimension, status];
      Object.keys(ExpandCollapse.defaultProps).forEach(configProp => {
        delete restProps[configProp];
      });
      if (animate) classes.push('animated', speed);

      if (unmountWhenCollapsed && status === 'collapsed') {
        return null;
      }

      return React$1__default.createElement(Tag, _extends({
        className: classes.concat(propClasses).join(' '),
        ref: this.ref,
        onTransitionEnd: this.onTransitionend
      }, restProps), children);
    }

  }

  ExpandCollapse.propTypes = propTypes$4;
  ExpandCollapse.defaultProps = defaultProps$4;

  function NavList(props) {
    const {
      classes: propClasses = [],
      items = [],
      isNestedList,
      collapsed
    } = props;
    const classes = ['nav-list'];
    let Component = 'ul';
    let fwdProps = {
      className: classes.concat(propClasses).join(' ')
    };

    if (isNestedList) {
      fwdProps = {
        as: Component,
        classes: [...classes, 'nested-list', ...propClasses],
        unmountWhenCollapsed: true,
        collapsed
      };
      Component = ExpandCollapse;
    }

    return React$1__default.createElement(Component, fwdProps, items.map(NavListItem));
  }

  function NavListItem(props) {
    let Comp = Button;
    const {
      visual,
      name,
      href,
      onClick,
      items,
      collapseItems,
      classes: propClasses = []
    } = props;
    const hasItems = Array.isArray(items) && items.length;
    const itemClasses = ['nav-item', ...propClasses];
    const compProps = {
      onClick
    };

    if (href) {
      Comp = Link;
      compProps.href = href;
    } else {
      compProps.variant = 'bare';
    }

    if (hasItems) {
      itemClasses.push('has-nested-list');
      itemClasses.push(collapseItems ? 'nested-list-collapsed' : 'nested-list-expanded');
    }

    return React$1__default.createElement("li", {
      key: name,
      className: itemClasses.join(' ')
    }, React$1__default.createElement(Comp, compProps, visual && React$1__default.createElement("span", {
      className: "visual"
    }, visual), React$1__default.createElement("span", {
      className: "text"
    }, name), hasItems && React$1__default.createElement(Icon, {
      name: "caret-right"
    })), hasItems && React$1__default.createElement(NavList, {
      isNestedList: true,
      items: items,
      collapsed: collapseItems
    }));
  }

  class AppShell extends React$1.PureComponent {
    static get defaultProps() {
      return {
        navInteractDebounce: 0
      };
    }

    constructor(props) {
      super(props);
      this.state = {
        navOpen: false,
        createListExpanded: false
      };
      bindAll(this, ['openNav', 'closeNav', 'toggleNav', 'handleMouseEnterNav', 'handleMouseLeaveNav', 'toggleCreateList']);
    }

    openNav() {
      this.setState({
        navOpen: true
      });
    }

    closeNav() {
      this.setState({
        navOpen: false
      });
    }

    collapseCreateList() {
      this.setState({
        createListExpanded: false
      });
    }

    toggleNav() {
      this.setState(state => {
        return {
          navOpen: !state.navOpen
        };
      });
    }

    handleMouseEnterNav() {
      this.clearTimers();
      this.navEnterTimer = setTimeout(this.openNav, this.props.navInteractDebounce);
    }

    handleMouseLeaveNav() {
      this.clearTimers();
      this.navLeaveTimer = setTimeout(this.closeNav, this.props.navInteractDebounce);
      this.collapseCreateList();
    }

    clearTimers() {
      clearTimeout(this.navEnterTimer);
      clearTimeout(this.navLeaveTimer);
    }

    toggleCreateList() {
      this.setState(state => {
        return {
          createListExpanded: !state.createListExpanded
        };
      });
    }

    renderCaseTypes() {
      const {
        createListExpanded
      } = this.state;
      return React$1__default.createElement("div", {
        className: `casetypes ${createListExpanded ? 'expanded' : ''}`
      }, React$1__default.createElement(NavList, {
        classes: ['casetype-list'],
        items: [{
          name: 'Create',
          visual: React$1__default.createElement(Icon, {
            name: "plus"
          }),
          onClick: this.toggleCreateList,
          items: this.props.caseTypes,
          collapseItems: !createListExpanded
        }]
      }));
    }

    renderLinks() {
      const setupItems = links => {
        return links.map(link => {
          return { ...link,
            visual: React$1__default.createElement(Icon, {
              name: link.icon
            }),
            items: link.links ? setupItems(link.links) : null
          };
        });
      };

      return React$1__default.createElement("div", {
        className: "links"
      }, React$1__default.createElement(NavList, {
        classes: ['link-list'],
        items: setupItems(this.props.links)
      }));
    } // eslint-disable-next-line class-methods-use-this


    renderInteractions() {
      return null;
    } // eslint-disable-next-line class-methods-use-this


    renderUtils() {
      const utils = [{
        name: 'Notifications',
        icon: 'bell-solid'
      }, {
        name: 'Recents',
        icon: 'history'
      }, {
        name: 'My Applications',
        icon: 'dot-9-solid'
      }, {
        name: 'Cosmos Operator'
      }];
      const items = utils.map((util, i) => {
        return {
          visual: i === utils.length - 1 ? React$1__default.createElement(Avatar, {
            label: "C"
          }) : React$1__default.createElement(Icon, {
            name: util.icon
          }),
          name: util.name,

          onClick() {
            console.log(`Show: ${util.name} panel`);
          }

        };
      });
      return React$1__default.createElement("div", {
        className: "utils"
      }, React$1__default.createElement(NavList, {
        classes: ['link-list'],
        items: items
      }));
    }

    render() {
      const classes = ['app-shell'];
      const {
        logo,
        appName,
        main,
        classes: propClasses
      } = this.props;

      if (this.state.navOpen) {
        classes.push('nav-open');
      }

      const className = classes.concat(propClasses).join(' ');
      return React$1__default.createElement("div", {
        className: className
      }, React$1__default.createElement("nav", {
        className: "app-nav",
        onMouseEnter: this.handleMouseEnterNav,
        onMouseLeave: this.handleMouseLeaveNav
      }, React$1__default.createElement("div", {
        className: "branding"
      }, React$1__default.createElement(Link, {
        href: "/"
      }, React$1__default.createElement("img", {
        src: logo,
        alt: "Logo"
      }), React$1__default.createElement("span", {
        className: "app-name"
      }, appName))), React$1__default.createElement("div", {
        className: "search"
      }, React$1__default.createElement(Icon, {
        name: "search"
      }), React$1__default.createElement("input", {
        type: "search",
        placeholder: "Search",
        id: "navSearch",
        "aria-label": "Serach",
        onInput: this.props.onSearchInput
      }), React$1__default.createElement(Label, {
        htmlFor: "navSearch"
      }, "Search")), React$1__default.createElement("div", {
        className: "scroll-wrap"
      }, this.props.caseTypes && this.renderCaseTypes(), this.props.links && this.renderLinks(), this.props.interactions && this.renderInteractions()), this.renderUtils()), React$1__default.createElement("main", {
        className: "app-main"
      }, main));
    }

  }

  const propTypes$5 = {
    /* Text content */
    children: PropTypes.node.isRequired,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$5 = {
    classes: []
  };

  function Text(props) {
    const {
      classes,
      ...rest
    } = props;
    return React$1__default.createElement("span", _extends({
      className: ['text', ...classes].join(' ')
    }, rest));
  }

  Text.propTypes = propTypes$5;
  Text.defaultProps = defaultProps$5;

  const propTypes$6 = {
    /* Actions area - icons */
    children: PropTypes.oneOfType([// eslint-disable-next-line react/forbid-foreign-prop-types
    PropTypes.arrayOf(PropTypes.shape(Button.propTypes)), // eslint-disable-next-line react/forbid-foreign-prop-types
    PropTypes.shape(Button.propTypes)]),

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$6 = {
    children: [],
    classes: []
  };

  function CardHeaderActions(props) {
    const {
      children,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement(Flex, _extends({
      container: true,
      item: true,
      "align-items": "center",
      classes: ['icon-buttons', ...classes]
    }, restProps), React$1__default.Children.toArray(children).slice(0, 3));
  }

  CardHeaderActions.propTypes = propTypes$6;
  CardHeaderActions.defaultProps = defaultProps$6;

  const propTypes$7 = {
    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node
  };
  const defaultProps$7 = {
    classes: [],
    children: null
  };

  function CardHeaderMetadata(props) {
    const {
      children,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement(Flex, _extends({
      container: true,
      classes: ['card-metadata', ...classes]
    }, restProps), children);
  }

  CardHeaderMetadata.propTypes = propTypes$7;
  CardHeaderMetadata.defaultProps = defaultProps$7;

  const propTypes$8 = {
    /* Card heading: optional action and UI marker */
    // eslint-disable-next-line react/forbid-foreign-prop-types
    icon: PropTypes.shape(Icon.propTypes),

    /* Click callback function */
    onClick: PropTypes.func,

    /* Children components */
    children: PropTypes.node
  };
  const defaultProps$8 = {
    icon: null,
    onClick: null,
    children: null
  };

  function CardHeader(props) {
    const {
      children,
      icon,
      onClick,
      ...restProps
    } = props; // eslint-disable-next-line prefer-const

    let [actions, metadata, title, avatar, iconComp] = extractChildren(children, [CardHeaderActions, CardHeaderMetadata, Text, Avatar, Icon]);
    return React$1__default.createElement(Flex, _extends({
      as: "header",
      container: true,
      "align-items": "center",
      classes: ['card-header']
    }, restProps), React$1__default.createElement(Flex, {
      item: true,
      grow: true,
      container: true,
      "align-items": "center",
      classes: ['header-container'],
      onClick: onClick
    }, icon, iconComp && React$1__default.createElement(Flex, {
      container: true,
      classes: ['header-image']
    }, iconComp), avatar && React$1__default.createElement(Flex, {
      container: true,
      classes: ['header-image']
    }, avatar), title && React$1__default.createElement(Flex, {
      container: true,
      direction: "column",
      classes: ['header-content']
    }, React$1__default.createElement("h3", {
      className: "card-header-title"
    }, title), metadata && React$1__default.createElement("span", null, metadata))), actions);
  }

  CardHeader.propTypes = propTypes$8;
  CardHeader.defaultProps = defaultProps$8;
  CardHeader.Actions = CardHeaderActions;
  CardHeader.Metadata = CardHeaderMetadata;

  const propTypes$9 = {
    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node
  };
  const defaultProps$9 = {
    classes: [],
    children: null
  };

  function CardContent(props) {
    const {
      children,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement(Flex, _extends({
      container: true,
      direction: "column",
      classes: ['card-content', ...classes]
    }, restProps), children);
  }

  CardContent.propTypes = propTypes$9;
  CardContent.defaultProps = defaultProps$9;

  const propTypes$a = {
    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node
  };
  const defaultProps$a = {
    classes: [],
    children: null
  };

  function CardMedia(props) {
    const {
      children,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement(Flex, _extends({
      container: true,
      classes: ['card-media', ...classes]
    }, restProps), children);
  }

  CardMedia.propTypes = propTypes$a;
  CardMedia.defaultProps = defaultProps$a;

  const propTypes$b = {
    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.node
  };
  const defaultProps$b = {
    classes: [],
    children: null
  };

  function CardFooter(props) {
    const {
      children,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement(Flex, _extends({
      container: true,
      wrap: "wrap",
      classes: ['card-footer', ...classes]
    }, restProps), children);
  }

  CardFooter.propTypes = propTypes$b;
  CardFooter.defaultProps = defaultProps$b;

  const propTypes$c = {
    /* Card variant */
    variant: PropTypes.oneOf(['cover', 'summary', 'selectable']),

    /* Is card collapsible? */
    collapsible: PropTypes.bool,

    /* Initially "expanded/collapsed" flag */
    collapsed: PropTypes.bool,

    /* Callback for clicking */
    onClick: PropTypes.func,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),

    /* Content for the card */
    children: PropTypes.node,

    /* set selected state for the card */
    selected: PropTypes.bool,

    /* set disabled state for the card */
    disabled: PropTypes.bool,

    /* set the role type for accessibility */
    role: PropTypes.string,

    /* To enabled the focus,hover,active styles */
    interactive: PropTypes.bool
  };

  class Card extends React$1.PureComponent {
    static get defaultProps() {
      return {
        variant: 'cover',
        collapsible: false,
        collapsed: false,
        onClick: null,
        classes: [],
        children: null,
        selected: false,
        disabled: false,
        role: 'region',
        interactive: false
      };
    }

    constructor(props) {
      super(props);
      const {
        collapsible,
        collapsed
      } = props;
      this.state = {
        // set initial 'collapsed' state only if card is collapsible
        collapsed: collapsible && collapsed
      };
      bindAll(this, ['toggleExpand']);
    }

    toggleExpand() {
      this.setState(({
        collapsed
      }) => ({
        collapsed: !collapsed
      }));
    }

    render() {
      const {
        variant,
        collapsible,
        children,
        classes: propClasses,
        onClick,
        selected,
        disabled,
        interactive,
        role,
        ...restProps
      } = this.props;
      const {
        collapsed
      } = this.state;
      const classes = ['card', `card-${variant}`]; // eslint-disable-next-line prefer-const

      let [media, header, content, footer] = extractChildren(children, [CardMedia, CardHeader, CardContent, CardFooter]);

      if (collapsible) {
        header = this.collapsibleHeader(header);
        classes.push('collapsible', collapsed ? 'collapsed' : 'expanded');
      }

      if (selected) classes.push('selected');
      if (disabled) classes.push('disabled');
      const interactiveProps = Object.assign({}, onClick && {
        onClick,
        tabIndex: 0,
        role: 'button'
      }, interactive && {
        tabIndex: 0
      }, role && {
        role
      }); // Remove leftover config prop after destructuring

      delete restProps.collapsed;
      return React$1__default.createElement("article", _extends({
        className: (onClick || interactive ? 'card-action ' : '').concat([...classes, ...propClasses].join(' '))
      }, interactiveProps, restProps), media, header, collapsible ? React$1__default.createElement(ExpandCollapse, {
        collapsed: collapsed
      }, content, footer) : React$1__default.createElement(Flex, {
        direction: "column"
      }, content, footer));
    }

    collapsibleHeader(header = React$1__default.createElement(CardHeader, null)) {
      const collapsibleHeaderProps = {
        icon: React$1__default.createElement(Button, {
          variant: "simple",
          key: "caret-down"
        }, React$1__default.createElement(Icon, {
          name: "caret-down"
        })),
        onClick: this.toggleExpand
      };
      return React$1__default.cloneElement(header, collapsibleHeaderProps);
    }

  }

  Card.propTypes = propTypes$c;
  Card.Content = CardContent;
  Card.Header = CardHeader;
  Card.Media = CardMedia;
  Card.Footer = CardFooter;

  const propTypes$d = {
    headerText: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
      dismissible: PropTypes.bool,
      openable: PropTypes.bool,
      onOpen: PropTypes.func,
      onDismiss: PropTypes.func,
      meta: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({
        name: 'parent',
        value: PropTypes.string,
        url: PropTypes.string
      }), PropTypes.shape({
        name: 'sla',
        value: PropTypes.string
      }), PropTypes.shape({
        name: 'priority',
        value: PropTypes.string
      })]))
    }))
  };
  const defaultProps$c = {
    data: []
  };

  function MetaNode({
    field,
    value,
    url
  }) {
    const classes = ['meta-node'];
    const restProps = {};
    let node;

    if (field === 'parent') {
      node = React$1__default.createElement(React$1__default.Fragment, null, "Task in", '\u00A0', React$1__default.createElement(Link, {
        href: url
      }, value));
    } else if (field === 'sla') {
      node = React$1__default.createElement(React$1__default.Fragment, null, "Due in", '\u00A0', value);
    } else if (field === 'priority') {
      restProps[`data-${field}`] = value;
      node = React$1__default.createElement(React$1__default.Fragment, null, value, '\u00A0', "priority");
    }

    return React$1__default.createElement("li", _extends({
      key: field,
      className: classes.join(' '),
      "data-field": field
    }, restProps), node);
  }

  function AssignmentMeta({
    meta
  }) {
    return Array.isArray(meta) && meta.length ? React$1__default.createElement("ul", {
      className: "assignment-meta"
    }, meta.map(MetaNode)) : null;
  }

  function ListItem({
    id,
    avatar,
    name,
    url,
    meta,
    dismissible,
    openable,
    onOpen,
    onDismiss
  }) {
    return React$1__default.createElement(Flex, {
      container: true,
      as: "li",
      key: id,
      classes: ['assignment-list-item']
    }, React$1__default.createElement(Flex, {
      container: true,
      item: true,
      "align-items": "center",
      classes: ['avatar-wrap']
    }, React$1__default.createElement(Avatar, {
      image: avatar
    })), React$1__default.createElement(Flex, {
      container: true,
      item: true,
      grow: true,
      "align-items": "center",
      "align-content": "center",
      wrap: "wrap",
      classes: ['info-wrap']
    }, React$1__default.createElement("h4", {
      className: "assignment-name"
    }, name), React$1__default.createElement(AssignmentMeta, {
      meta: meta
    })), React$1__default.createElement(Flex, {
      container: true,
      item: true,
      "align-items": "center",
      classes: ['actions-wrap']
    }, dismissible && React$1__default.createElement(Button, {
      variant: "simple",
      classes: ['dismiss-btn'],
      onClick: onDismiss
    }, "Dismiss"), openable && React$1__default.createElement(Button, {
      variant: "primary",
      href: url,
      classes: ['assignment-link'],
      onClick: onOpen
    }, "Go")));
  }

  function Assignments(props) {
    const {
      listData,
      headerText,
      ...restProps
    } = props;
    return React$1__default.createElement(Card, _extends({
      collapsible: true,
      classes: ['assignments']
    }, restProps), React$1__default.createElement(Card.Header, null, React$1__default.createElement(Text, null, headerText)), React$1__default.createElement(Card.Content, null, React$1__default.createElement("ul", {
      className: "assignment-list"
    }, listData.map(ListItem))));
  }

  Assignments.propTypes = propTypes$d;
  Assignments.defaultProps = defaultProps$c;

  const propTypes$e = {
    // isEditable: PropTypes.bool,
    // actions: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     name: PropTypes.string.isRequired,
    //     onClick: PropTypes.func.isRequired
    //   }).isRequired
    // ).isRequired,
    tabs: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      current: PropTypes.bool.isRequired,
      onClick: PropTypes.func.isRequired
    }).isRequired).isRequired
  };
  const defaultProps$d = {};

  function CaseTabs({
    tabs
  }) {
    return React$1__default.createElement("div", {
      className: "case-tabs"
    }, tabs.map(tab => {
      const classes = ['case-tab', tab.current ? 'current' : ''];
      return React$1__default.createElement(Link, {
        href: tab.href,
        classes: classes
      }, React$1__default.createElement("span", null, tab.name), tab.count && React$1__default.createElement("span", {
        className: "count"
      }, tab.count));
    }));
  }

  function CaseView(props) {
    const {
      icon,
      id,
      heading,
      info,
      tabs,
      main,
      utilities
    } = props;
    return React$1__default.createElement(Flex, {
      container: true,
      classes: ['case-view']
    }, React$1__default.createElement(Flex, {
      container: true,
      item: true,
      direction: "column"
    }, React$1__default.createElement(Flex, {
      container: true,
      as: "header",
      classes: ['case-view-header']
    }, React$1__default.createElement(Flex, {
      item: true
    }, React$1__default.createElement(Icon, {
      name: icon
    })), React$1__default.createElement(Flex, {
      item: true,
      xs: {
        width: 'auto'
      }
    }, React$1__default.createElement("div", {
      className: "case-id"
    }, id), React$1__default.createElement("h1", {
      className: "case-name"
    }, heading))), React$1__default.createElement("div", {
      className: "case-actions"
    }, React$1__default.createElement(Button, null, "Edit"), React$1__default.createElement(Button, null, "More...")), React$1__default.createElement(Flex, {
      container: true,
      item: true,
      direction: "column",
      "align-items": "start",
      classes: "case-info"
    }, info), tabs && React$1__default.createElement(CaseTabs, {
      tabs: tabs
    })), React$1__default.createElement(Flex, {
      container: true,
      item: true,
      grow: true,
      direction: "column"
    }, main), React$1__default.createElement(Flex, {
      container: true,
      item: true,
      direction: "column"
    }, utilities));
  }

  CaseView.propTypes = propTypes$e;
  CaseView.defaultProps = defaultProps$d;

  const propTypes$f = {
    /** boolean where checkbox is disabled or not */
    disabled: PropTypes.bool,

    /** className of the checkbox Eg. standard,solid etc. */
    className: PropTypes.string,

    /** Text that need to be displayed for checkbox */
    text: PropTypes.string,

    /** bool value which says if checkbox is checked or not */
    checked: PropTypes.bool,

    /** name attribute for the component */
    name: PropTypes.string,

    /** Provide title for browser tooltips */
    title: PropTypes.string,

    /** Unique id, gets auto generated when not specified */
    id: PropTypes.string,

    /** bool value - requires user input */
    required: PropTypes.bool,

    /** id of associated label/text which holds description of this component */
    describedby: PropTypes.string,

    /** id of associated label/text which holds label of this component */
    labelledby: PropTypes.string,
    ref: PropTypes.oneOf([PropTypes.string, PropTypes.func, PropTypes.object])
  };
  const defaultProps$e = {
    className: 'default-checkbox',
    checked: false,
    disabled: false,
    text: null,
    name: null,
    id: null,
    title: null,
    required: false,
    describedby: null,
    labelledby: null,
    ref: null
  };
  /**
   * Checkboxes allow the user to select one or more items from a set.
   */

  const Checkbox = React$1.forwardRef((props, ref) => {
    const {
      className,
      checked,
      disabled,
      describedby,
      labelledby,
      text,
      required,
      onClick,
      onChange,
      name,
      title
    } = props;
    let classname = className ? className : '';
    let {
      id
    } = props;
    id = id ? id : generateUniqueId();
    classname = classname !== 'default-checkbox' ? 'checkbox-wrapper ' + classname : classname;
    return React$1__default.createElement("label", {
      ref: true,
      className: classname,
      htmlFor: id,
      ref: ref
    }, React$1__default.createElement("input", {
      type: "checkbox",
      defaultChecked: checked,
      id: id,
      required: required,
      "aria-required": required,
      "aria-describedby": describedby,
      "aria-labelledby": labelledby,
      "aria-disabled": disabled,
      disabled: disabled,
      tabIndex: "0",
      title: title,
      onClick: onClick,
      onChange: onChange,
      name: name
    }), React$1__default.createElement("span", {
      className: "checkbox-label"
    }, text));
  });
  Checkbox.propTypes = propTypes$f;
  Checkbox.defaultProps = defaultProps$e;

  const propTypes$g = {
    id: PropTypes.string,
    name: PropTypes.string,
    align: PropTypes.string,
    className: PropTypes.string,
    labelledby: PropTypes.string,
    describedby: PropTypes.string,
    onChange: PropTypes.func,
    onClick: PropTypes.func
  };
  const defaultProps$f = {
    name: null,
    id: null,
    align: 'vertical',
    className: null,
    onChange: null,
    onClick: null,
    labelledby: null,
    describedby: null
  };

  function CheckboxGroup(props) {
    const {
      name,
      children,
      align,
      className,
      onChange,
      onClick,
      labelledby,
      describedby
    } = props;
    let {
      id
    } = props;
    id = id ? id : generateUniqueId();
    /* Passing below parent props to each Checkbox control
     * onChange
     * onClick
     * className
     */

    const childrenWithProps = React$1__default.Children.map(children, child => React$1__default.cloneElement(child, {
      onChange,
      onClick,
      className
    }));
    return React$1__default.createElement("div", {
      className: `checkboxgroup ${align}`,
      name: name,
      id: id,
      "aria-labelledby": labelledby,
      "aria-describedby": describedby,
      align: align
    }, childrenWithProps);
  }

  CheckboxGroup.propTypes = propTypes$g;
  CheckboxGroup.defaultProps = defaultProps$f;

  const getFormattedCurrency = value => {
    if (!value) {
      return '';
    }

    if (value.indexOf('.') === -1) {
      value += '.00';
    }

    return `$${value.replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  function Currency(props) {
    const {
      value,
      label,
      onChange,
      onBlur,
      onClick
    } = props;
    const formattedValue = getFormattedCurrency(value);
    const [displayValue, setDisplayValue] = React$1__default.useState(formattedValue || '');
    return React$1__default.createElement(React$1.Fragment, null, React$1__default.createElement(Label, {
      label: label
    }), React$1__default.createElement("input", {
      type: "text",
      value: displayValue,
      onChange: e => {
        setDisplayValue(e.target.value);
        if (onChange) onChange(e);
      },
      onBlur: e => {
        setDisplayValue(formattedValue);
        if (onBlur) onBlur(e);
      },
      onClick: e => {
        setDisplayValue(value);
        if (onClick) onClick(e);
      }
    }));
  }

  function getRawValue(formattedValue) {
    // Will need to add more currency unicode symbols: https://www.fileformat.info/info/unicode/category/Sc/list.htm
    return formattedValue.replace(/[$£¥€,]/g, '');
  }

  function formatCurrency(value, locale, currencycode) {
    let formattedValue = value;
    if (formattedValue === '') return formattedValue;
    formattedValue = formattedValue.replace(/[^0-9.]/g, '');
    const [, leftSide, rightSide] = /([0-9]*)(\.[0-9]*)?/g.exec(formattedValue);

    if (leftSide.length > 0) {
      formattedValue = parseFloat(leftSide).toLocaleString(locale, {
        style: 'currency',
        currency: currencycode,
        currencyDisplay: 'symbol',
        useGrouping: true,
        minimumFractionDigits: 0
      });

      if (rightSide !== undefined) {
        const decimalPlaces = rightSide.substring(0, 3);
        formattedValue += decimalPlaces;
      }
    } else {
      formattedValue = leftSide;
    }

    return formattedValue;
  }

  class CurrencyInput extends React$1.PureComponent {
    constructor(props) {
      super(props);
      this.locale = `${props.locale ? `${props.locale}` : 'en-US'}`;
      this.currencycode = `${props.currencycode ? `${props.currencycode}` : 'USD'}`;
      this.state = {
        formattedValue: props.value !== undefined ? formatCurrency(props.value, this.locale, this.currencycode) : props.value
      };
      this.currencyInput = React$1.createRef();
      this.handleChange = this.handleChange.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      this.getDerivedStateFromProps = this.getDerivedStateFromProps.bind(this);
    }

    getDerivedStateFromProps(props) {
      return {
        value: props.value !== undefined ? formatCurrency(props.value, this.locale, this.currencycode) : props.value
      };
    }

    handleChange({
      nativeEvent: event
    }) {
      this.selectionIndex = this.currencyInput.current.selectionEnd;

      if (getRawValue(event.target.value) <= Number.MAX_SAFE_INTEGER) {
        const formattedValue = formatCurrency(event.target.value, this.locale, this.currencycode);
        this.setState({
          formattedValue
        });
      }
    }

    handleBlur(event) {
      this.setState({
        formattedValue: event.target.value
      });

      if (this.props.onChange) {
        this.props.onChange({
          value: this.state.formattedValue
        });
      }
    }

    render() {
      const props = {
        type: 'text',
        className: `${this.props.className ? `${this.props.className} ` : ''}currency-input`,
        placeholder: `${this.props.placeholder ? `${this.props.placeholder}` : '$0.00'}`,
        disabled: this.props.disabled,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        ref: this.currencyInput
      };
      return React$1__default.createElement("input", _extends({}, props, {
        value: this.state.formattedValue,
        "data-type": "currency"
      }));
    }

  }

  class Calendar extends React$1.PureComponent {
    constructor(props) {
      super(props);
      this.weekdays = Calendar.getWeekDays().map(item => React$1__default.createElement("span", {
        className: "cell",
        key: item.label
      }, item.label));
      const now = this.props.date ? this.props.date : this.props.fromDate || moment();
      this.state = {
        month: now.month(),
        year: now.year(),
        hoverDate: undefined
      };
      this.enableHover = this.props.fromDate || this.props.toDate;
      this.cellClick = this.cellClick.bind(this);
      this.onMonthsChange = this.onMonthsChange.bind(this);
      this.onYearsChange = this.onYearsChange.bind(this);
      this.onLeftArrow = this.onLeftArrow.bind(this);
      this.onRightArrow = this.onRightArrow.bind(this);
      if (this.enableHover) this.cellHover = this.cellHover.bind(this);
    }

    onMonthsChange(e) {
      this.setState({
        month: parseInt(e.target.value, 10)
      });
    }

    onYearsChange(e) {
      this.setState({
        year: parseInt(e.target.value, 10)
      });
    }

    onLeftArrow() {
      this.setState(prevState => ({
        year: prevState.year - 1
      }));
    }

    onRightArrow() {
      this.setState(prevState => ({
        year: prevState.year + 1
      }));
    }

    getDays() {
      const {
        fromDate,
        toDate,
        maxDate,
        minDate,
        date
      } = this.props;
      const now = date ? date.clone() : moment();
      now.month(this.state.month);
      now.year(this.state.year);
      const start = now.clone().startOf('month').weekday(0);
      const end = now.clone().endOf('month').weekday(6);
      const month = now.month();
      const today = moment();
      const year = now.year();
      const days = [];

      for (let day = start; day.isSameOrBefore(end); day.add(1, 'day')) {
        const isDisabled = minDate && day.isBefore(minDate, 'day') || maxDate && day.isAfter(maxDate, 'day');
        const isSelected = fromDate && day.isAfter(fromDate, 'day') && toDate && day.isBefore(toDate, 'day');
        const isFromOrTo = fromDate && day.isSame(fromDate, 'day') || toDate && day.isSame(toDate, 'day');
        const isHoverDate = minDate && this.state.hoverDate && day.isSameOrBefore(this.state.hoverDate, 'day') || maxDate && this.state.hoverDate && day.isSameOrAfter(this.state.hoverDate, 'day');
        days.push({
          label: day.format('DD'),
          prev: day.month() < month && !(day.year() > year) || day.year() < year,
          next: day.month() > month || day.year() > year,
          disabled: isDisabled,
          selected: isSelected,
          curr: isFromOrTo || !fromDate && !toDate && day.isSame(today, 'day'),
          currSel: !isDisabled && !isSelected && !isFromOrTo && isHoverDate,
          today: day.date() === today.date() && day.month() === today.month() && day.year() === today.year()
        });
      }

      return days;
    }

    static getWeekDays() {
      return [0, 1, 2, 3, 4, 5, 6].map(i => ({
        label: moment().weekday(i).format('ddd')
      }));
    }

    static getMonths() {
      return moment.months().map(item => {
        return {
          label: item
        };
      });
    }

    static getClassString(item) {
      let classString = '';
      if (item.next) classString += 'next ';
      if (item.prev) classString += 'prev ';
      if (item.disabled) classString += 'disabled ';
      if (item.curr) classString += 'current ';
      if (item.selected) classString += 'selected ';
      if (item.currSel) classString += 'hoverSelection ';
      if (item.today) classString += 'today ';
      return classString;
    }

    getDate(date, className) {
      const newDate = this.props.date ? this.props.date.clone() : moment();
      newDate.month(this.state.month);
      newDate.year(this.state.year);

      if (className.indexOf('prev') > -1) {
        newDate.subtract(1, 'months');
      } else if (className.indexOf('next') > -1) {
        newDate.add(1, 'months');
      }

      newDate.date(date);
      return newDate;
    }

    cellClick(e) {
      const cell = e.target;

      if (cell.className.indexOf('disabled') > -1) {
        e.stopPropagation();
        return;
      }

      const date = parseInt(cell.innerHTML, 10);
      if (Number.isNaN(date)) return;
      const newDate = this.getDate(date, cell.className);

      if (this.props.setInputDate) {
        this.props.setInputDate(newDate);
      }

      e.stopPropagation();
    }

    cellHover(e) {
      const cell = e.target;

      if (cell.className.indexOf('disabled') > -1 || cell.className.indexOf('selected') > -1) {
        e.stopPropagation();
        return;
      }

      const date = parseInt(cell.innerHTML, 10);
      if (Number.isNaN(date)) return;
      const newDate = this.getDate(date, cell.className);
      this.setState({
        hoverDate: newDate
      });
    }

    renderMonths() {
      const options = Calendar.getMonths().map((item, i) => React$1__default.createElement("option", {
        key: item.label,
        value: i
      }, item.label));
      return React$1__default.createElement("select", {
        className: "months",
        value: this.state.month,
        onChange: this.onMonthsChange
      }, options);
    }

    renderYears() {
      const currYear = this.state.year;
      const options = [];

      for (let i = -20; i <= 20; i += 1) {
        const year = currYear + i;
        options.push(React$1__default.createElement("option", {
          key: year,
          value: year
        }, year));
      }

      return React$1__default.createElement("select", {
        className: "years",
        value: this.state.year,
        onChange: this.onYearsChange
      }, options);
    }

    render() {
      const days = this.getDays().map(item => React$1__default.createElement("span", {
        className: `day cell ${Calendar.getClassString(item)}`
      }, item.label));
      return React$1__default.createElement("div", {
        className: "calendar"
      }, React$1__default.createElement("div", {
        className: "header"
      }, React$1__default.createElement("i", {
        className: "left-arrow",
        role: "link",
        tabIndex: "0",
        onKeyPress: e => e.keyCode === 13 && this.onLeftArrow(e),
        onClick: this.onLeftArrow
      }), this.renderMonths(), this.renderYears(), React$1__default.createElement("i", {
        className: "right-arrow",
        role: "link",
        tabIndex: "0",
        onKeyPress: e => e.keyCode === 13 && this.onRightArrow(e),
        onClick: this.onRightArrow
      })), React$1__default.createElement("div", {
        className: "weekdays"
      }, this.weekdays), React$1__default.createElement("div", {
        className: "days",
        role: "presentation",
        onClick: this.cellClick,
        onFocus: this.enableHover ? this.cellHover : undefined,
        onMouseOver: this.enableHover ? this.cellHover : undefined
      }, days));
    }

  }

  class DateRange extends React$1.PureComponent {
    constructor(props) {
      super(props);
      const fromDate = this.props.value && this.props.value.fromDateValue;
      const toDate = this.props.value && this.props.value.toDateValue;
      this.state = {
        showFromCalendar: false,
        showToCalendar: false,
        fromDate: fromDate || '',
        toDate: toDate || ''
      };
      this.hideCalendars = this.hideCalendars.bind(this);
      this.setFromInputDate = this.setFromInputDate.bind(this);
      this.setToInputDate = this.setToInputDate.bind(this);
      this.handleFromChange = this.handleFromChange.bind(this);
      this.handleToChange = this.handleToChange.bind(this);
    }

    componentDidMount() {
      document.body.addEventListener('click', this.hideCalendars);
    }

    componentWillUnmount() {
      document.body.removeEventListener('click', this.hideCalendars);
    }

    setFromInputDate(value) {
      const fromDate = moment(value).format('l');
      let showToCalendar = false;
      if (!this.state.toDate) showToCalendar = true;
      this.setState({
        fromDate,
        showFromCalendar: false,
        showToCalendar
      });
      if (this.state.toDate) this.setDateRangeValue(fromDate, this.state.toDate);
    }

    setToInputDate(value) {
      const toDate = moment(value).format('l');
      let showFromCalendar = false;
      if (!this.state.fromDate) showFromCalendar = true;
      this.setState({
        toDate,
        showToCalendar: false,
        showFromCalendar
      });
      if (this.state.fromDate) this.setDateRangeValue(this.state.fromDate, toDate);
    }

    setDateRangeValue(fromDateValue, toDateValue) {
      if (this.props.onChange) this.props.onChange({
        fromDateValue,
        toDateValue
      });
    }

    showToCalendar(e) {
      this.setState({
        showFromCalendar: false,
        showToCalendar: true
      });
      e.stopPropagation();
    }

    showFromCalendar(e) {
      this.setState({
        showFromCalendar: true,
        showToCalendar: false
      });
      e.stopPropagation();
    }

    hideCalendars(e) {
      if (this.node.contains(e.target)) return;
      this.setState({
        showFromCalendar: false,
        showToCalendar: false
      });
    }

    handleFromChange(e) {
      const value = e.target.value;
      if (moment(value).isValid()) this.setFromInputDate(value);
    }

    handleToChange(e) {
      const value = e.target.value;
      if (moment(value).isValid()) this.setToInputDate(value);
    }

    renderFromCalendar() {
      const fromDate = this.state.fromDate ? moment(this.state.fromDate) : undefined;
      const toDate = this.state.toDate ? moment(this.state.toDate) : undefined;
      const props = {
        date: fromDate,
        fromDate,
        toDate,
        maxDate: toDate,
        setInputDate: this.setFromInputDate
      };
      return React$1__default.createElement(Calendar, props);
    }

    static renderLabel(label) {
      return React$1__default.createElement(Label, {
        className: "standard",
        label: label
      });
    }

    renderToCalendar() {
      const fromDate = this.state.fromDate ? moment(this.state.fromDate) : undefined;
      const toDate = this.state.toDate ? moment(this.state.toDate) : undefined;
      const props = {
        date: toDate,
        setInputDate: this.setToInputDate,
        toDate,
        fromDate,
        minDate: fromDate
      };
      return React$1__default.createElement(Calendar, props);
    }

    render() {
      return React$1__default.createElement("span", {
        className: "daterange",
        ref: node => {
          this.node = node;
        }
      }, React$1__default.createElement("span", {
        className: "daterange-from"
      }, this.props.fromLabel && DateRange.renderLabel(this.props.fromLabel), React$1__default.createElement("input", _extends({
        type: "text"
      }, this.props, {
        value: this.state.fromDate,
        onChange: this.handleFromChange
      })), React$1__default.createElement("i", {
        className: "pi pi-calendar",
        role: "link",
        tabIndex: "0",
        onKeyPress: e => e.keyCode === 13 && this.showFromCalendar(e),
        onClick: e => this.showFromCalendar(e)
      }), this.state.showFromCalendar && this.renderFromCalendar()), React$1__default.createElement("span", {
        className: "daterange-to"
      }, this.props.toLabel && DateRange.renderLabel(this.props.toLabel), React$1__default.createElement("input", _extends({
        type: "text"
      }, this.props, {
        value: this.state.toDate,
        onChange: this.handleToChange
      })), React$1__default.createElement("i", {
        className: "pi pi-calendar",
        role: "link",
        tabIndex: "0",
        onKeyPress: e => e.keyCode === 13 && this.showToCalendar(e),
        onClick: e => this.showToCalendar(e)
      }), this.state.showToCalendar && this.renderToCalendar()));
    }

  }

  class Time extends React$1.PureComponent {
    constructor(props) {
      super(props);
      this.minInc = this.props.minutesIncrement;
      const {
        hour,
        minutes,
        ampm
      } = props;
      this.state = {
        hour,
        minutes: minutes - minutes % this.minInc,
        ampm
      };
      this.onHourChange = this.onHourChange.bind(this);
      this.onMinuteChange = this.onMinuteChange.bind(this);
      this.onAMPMChange = this.onAMPMChange.bind(this);
    }

    onHourChange(e) {
      const {
        minutes,
        ampm
      } = this.state;
      const hour = Number.parseInt(e.target.value, 10);
      this.setState({
        hour
      });
      if (this.props.onChange) this.props.onChange({
        hour,
        minutes,
        ampm
      });
    }

    onMinuteChange(e) {
      const {
        hour,
        ampm
      } = this.state;
      const minutes = Number.parseInt(e.target.value, 10);
      this.setState({
        minutes
      });
      if (this.props.onChange) this.props.onChange({
        hour,
        minutes,
        ampm
      });
    }

    onAMPMChange(e) {
      const {
        hour,
        minutes
      } = this.state;
      const ampm = e.target.value;
      this.setState({
        ampm
      });
      if (this.props.onChange) this.props.onChange({
        hour,
        minutes,
        ampm
      });
    }

    renderOk() {
      return React$1__default.createElement("i", {
        className: "pi pi-check calendar-time-on",
        role: "link",
        tabIndex: "0",
        onKeyPress: e => e.keyCode === 13 && this.props.onTimeOK(e),
        onClick: this.props.onTimeOK
      });
    }

    render() {
      const hourOptions = [];

      for (let i = 1; i <= 12; i += 1) {
        hourOptions.push(React$1__default.createElement("option", {
          key: i,
          value: i
        }, i));
      }

      const minOptions = [];

      for (let i = 0; i < 60; i += this.minInc) {
        minOptions.push(React$1__default.createElement("option", {
          key: i,
          value: i
        }, i));
      }

      return React$1__default.createElement("div", {
        className: "time"
      }, React$1__default.createElement("select", {
        className: "hours",
        value: this.state.hour,
        onChange: this.onHourChange
      }, hourOptions), React$1__default.createElement("span", {
        className: "time-seperator"
      }, ":"), React$1__default.createElement("select", {
        className: "minutes",
        value: this.state.minutes,
        onChange: this.onMinuteChange
      }, minOptions), React$1__default.createElement("select", {
        className: "am-pm",
        value: this.state.ampm,
        onChange: this.onAMPMChange
      }, React$1__default.createElement("option", {
        key: "AM",
        value: "AM"
      }, "AM"), React$1__default.createElement("option", {
        key: "PM",
        value: "PM"
      }, "PM")), this.props.showok && this.renderOk());
    }

  }

  class Calendar$1 extends React$1.PureComponent {
    constructor(props) {
      super(props);
      this.weekdays = Calendar$1.getWeekDays().map(item => React$1__default.createElement("span", {
        className: "cell",
        key: item.label
      }, item.label));
      this.cellClick = this.cellClick.bind(this);
      this.minInc = this.props.minutesIncrement ? Number.parseInt(this.props.minutesIncrement, 10) : 15;
      const now = this.props.date ? this.props.date : moment();
      let hour = now.hour() % 12;
      hour = hour === 0 ? 12 : hour;
      const ampm = now.hour() >= 12 ? 'PM' : 'AM';
      const min = now.minutes();
      this.state = {
        month: now.month(),
        year: now.year(),
        time: {
          hour,
          minutes: min - min % this.minInc,
          ampm
        }
      };
      this.onMonthsChange = this.onMonthsChange.bind(this);
      this.onYearsChange = this.onYearsChange.bind(this);
      this.onLeftArrow = this.onLeftArrow.bind(this);
      this.onRightArrow = this.onRightArrow.bind(this);
      this.onTimeChange = this.onTimeChange.bind(this);
      this.onTimeOK = this.onTimeOK.bind(this);
    }

    onMonthsChange(e) {
      this.setState({
        month: parseInt(e.target.value, 10)
      });
    }

    onYearsChange(e) {
      this.setState({
        year: parseInt(e.target.value, 10)
      });
    }

    onTimeChange(value) {
      this.setState({
        time: value
      });
    }

    onTimeOK(e) {
      const newDate = moment();
      let hour = this.state.time.hour;
      const ampm = this.state.time.ampm;

      if (ampm === 'AM' && hour === 12) {
        hour = 0;
      }

      if (ampm === 'PM' && hour !== 12) {
        hour += 12;
      }

      newDate.hour(hour);
      newDate.minutes(this.state.time.minutes);

      if (this.props.setInputDate) {
        this.props.setInputDate(newDate);
      }

      e.stopPropagation();
    }

    onLeftArrow() {
      this.setState(prevState => ({
        year: prevState.year - 1
      }));
    }

    onRightArrow() {
      this.setState(prevState => ({
        year: prevState.year + 1
      }));
    }

    getDays() {
      const {
        minDate,
        maxDate,
        date
      } = this.props;
      const now = date || moment();
      now.month(this.state.month);
      now.year(this.state.year);
      const start = now.clone().startOf('month').weekday(0);
      const end = now.clone().endOf('month').weekday(6);
      const month = now.month();
      const today = moment();
      const currDay = now.date();
      const year = now.year();
      const days = [];

      for (let day = start; day.isSameOrBefore(end); day.add(1, 'day')) {
        days.push({
          label: day.format('DD'),
          prev: day.month() < month && !(day.year() > year) || day.year() < year,
          next: day.month() > month || day.year() > year,
          disabled: minDate && day.isBefore(minDate, 'day') || maxDate && day.isAfter(maxDate, 'day'),
          curr: day.date() === currDay && day.month() === month,
          today: day.date() === today.date() && day.month() === today.month() && day.year() === today.year()
        });
      }

      return days;
    }

    static getWeekDays() {
      return [0, 1, 2, 3, 4, 5, 6].map(i => ({
        label: moment().weekday(i).format('ddd')
      }));
    }

    static getMonths() {
      return moment.months().map(item => {
        return {
          label: item
        };
      });
    }

    static getClassString(item) {
      let classString = '';
      if (item.next) classString += 'next ';
      if (item.prev) classString += 'prev ';
      if (item.disabled) classString += 'disabled ';
      if (item.curr) classString += 'current ';
      if (item.today) classString += 'today ';
      return classString;
    }

    cellClick(e) {
      const cell = e.target;
      const date = parseInt(cell.innerHTML, 10);
      const newDate = this.props.date ? this.props.date.clone() : moment();
      if (Number.isNaN(date)) return;

      if (cell.className.indexOf('prev') > -1) {
        newDate.subtract(1, 'months');
      } else if (cell.className.indexOf('next') > -1) {
        newDate.add(1, 'months');
      }

      newDate.date(date);
      let hour = this.state.time.hour;
      const ampm = this.state.time.ampm;

      if (ampm === 'AM' && hour === 12) {
        hour = 0;
      }

      if (ampm === 'PM' && hour !== 12) {
        hour += 12;
      }

      newDate.hour(hour);
      newDate.minutes(this.state.time.minutes);

      if (this.props.setInputDate) {
        this.props.setInputDate(newDate);
      }

      e.stopPropagation();
    }

    renderMonths() {
      const options = Calendar$1.getMonths().map((item, i) => React$1__default.createElement("option", {
        key: item.label,
        value: i
      }, item.label));
      return React$1__default.createElement("select", {
        className: "months",
        value: this.state.month,
        onChange: this.onMonthsChange
      }, options);
    }

    renderYears() {
      const currYear = this.state.year;
      const options = [];

      for (let i = -20; i <= 20; i += 1) {
        const year = currYear + i;
        options.push(React$1__default.createElement("option", {
          key: year,
          value: year
        }, year));
      }

      return React$1__default.createElement("select", {
        className: "years",
        value: this.state.year,
        onChange: this.onYearsChange
      }, options);
    }

    renderTime() {
      return React$1__default.createElement(React$1.Fragment, null, React$1__default.createElement(Time, _extends({}, this.state.time, {
        minutesIncrement: this.minInc,
        onChange: this.onTimeChange,
        showok: this.props.istimeonly,
        onTimeOK: this.onTimeOK
      })));
    }

    renderCalendar() {
      const days = this.getDays().map(item => React$1__default.createElement("span", {
        key: `${item.next}${item.label}${item.prev}`,
        className: `day cell ${Calendar$1.getClassString(item)}`
      }, item.label));
      return React$1__default.createElement(React$1.Fragment, null, React$1__default.createElement("div", {
        className: "header"
      }, React$1__default.createElement("i", {
        className: "left-arrow",
        role: "link",
        tabIndex: "0",
        onKeyPress: e => e.keyCode === 13 && this.onLeftArrow(e),
        onClick: this.onLeftArrow
      }), this.renderMonths(), this.renderYears(), React$1__default.createElement("i", {
        className: "right-arrow",
        role: "link",
        tabIndex: "0",
        onKeyPress: e => e.keyCode === 13 && this.onRightArrow(e),
        onClick: this.onRightArrow
      })), React$1__default.createElement("div", {
        className: "weekdays"
      }, this.weekdays), React$1__default.createElement("div", {
        className: "days",
        role: "presentation",
        key: "days",
        onClick: this.cellClick
      }, days));
    }

    render() {
      return React$1__default.createElement("div", {
        className: "calendar"
      }, !this.props.istimeonly && this.renderCalendar(), (this.props.isdatetime || this.props.istimeonly) && this.renderTime());
    }

  }

  class DateTimePicker extends React$1.PureComponent {
    constructor(props) {
      super(props);
      const {
        datetime
      } = props;
      this.datetime = datetime || 'date';
      const selectedMoment = this.props.value ? moment(this.props.value) : moment();
      this.state = {
        calendarVisible: false,
        selectedDate: this.props.value || '',
        selectedMoment
      };
      this.hideCalendar = this.hideCalendar.bind(this);
      this.setInputDate = this.setInputDate.bind(this);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      document.body.addEventListener('click', this.hideCalendar);
    }

    componentWillUnmount() {
      document.body.removeEventListener('click', this.hideCalendar);
    }

    setInputDate(dateValue) {
      const isDateTime = this.datetime === 'dateTime';
      const isTimeOnly = this.datetime === 'time';
      const selectedMoment = moment(dateValue);
      let value;
      if (isDateTime) value = moment(dateValue).format('l LT');else if (isTimeOnly) value = moment(dateValue).format('LT');else value = moment(dateValue).format('l');
      this.setState({
        selectedDate: value,
        calendarVisible: false,
        selectedMoment
      });
      if (this.props.onChange) this.props.onChange({
        value
      });
    }

    showCalendar(e) {
      this.setState({
        calendarVisible: true
      });
      e.stopPropagation();
    }

    hideCalendar(e) {
      if (this.node.contains(e.target)) return;
      this.setState({
        calendarVisible: false
      });
    }

    handleChange(e) {
      const value = e.target.value;
      if (moment(value).isValid()) this.setInputDate(value);
    }

    renderCalendar() {
      const isdatetime = this.datetime === 'dateTime';
      const istimeonly = this.datetime === 'time';
      const props = {
        date: this.state.selectedMoment,
        isdatetime,
        istimeonly,
        setInputDate: this.setInputDate,
        minutesIncrement: this.props.minutesIncrement
      };
      return React$1__default.createElement(Calendar$1, props);
    }

    render() {
      return React$1__default.createElement("span", {
        className: "datetime-picker",
        ref: node => {
          this.node = node;
        }
      }, React$1__default.createElement("input", {
        type: "text",
        value: this.state.selectedDate,
        onBlur: this.props.onBlur,
        onChange: this.handleChange
      }), React$1__default.createElement("i", {
        className: `pi ${this.datetime !== 'date' ? 'pi-calendar-time' : 'pi-calendar'}`,
        role: "link",
        tabIndex: "0",
        onKeyPress: e => e.keyCode === 13 && this.showCalendar(e),
        onClick: e => this.showCalendar(e)
      }), this.state.calendarVisible && this.renderCalendar());
    }

  }

  class Drawer extends React$1.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false
      };
      bindAll(this, ['close', 'onTransitionend', 'onKeydown', 'onOuterClick']); // Need a ref for regular DOM access

      this.drawerRef = React$1.createRef();
    }

    componentDidMount() {
      document.addEventListener('keydown', this.onKeydown);
      document.addEventListener('click', this.onOuterClick);
      this.drawerRef.current.addEventListener('transitionend', this.onTransitionend);
      reflow(); // Open on mount with transition if passed true

      if (this.props.open) {
        // Having reflowed DOM above, adding class here will cause transition
        this.open();
      }
    }

    componentDidUpdate() {
      const method = this.props.open ? 'open' : 'close';
      const callback = this.props[`onBefore${cap(method)}`];
      if (isFunction(callback)) callback();
      this[method]();
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.onKeydown);
      document.removeEventListener('click', this.onOuterClick);
      this.drawerRef.current.removeEventListener('transitionend', this.onTransitionend);
    }

    onTransitionend(e) {
      const isRootEl = e.target === this.drawerRef.current;
      const isTransform = e.propertyName === 'transform';

      if (isRootEl && isTransform) {
        const f = this.state.isOpen ? 'In' : 'Out';
        this[`onTransitionend${f}`]();
      }
    }

    onTransitionendIn() {
      const onAfterOpen = this.props.onAfterOpen;

      if (isFunction(onAfterOpen)) {
        onAfterOpen();
      }
    }

    onTransitionendOut() {
      const onAfterClose = this.props.onAfterClose;

      if (isFunction(onAfterClose)) {
        onAfterClose();
      }
    }

    onKeydown(e) {
      const hasEscFn = isFunction(this.props.onEscKey);

      if (e.keyCode === 27 && hasEscFn) {
        this.props.onEscKey();
      }
    }

    onOuterClick(e) {
      const isDrawer = e.target === this.drawerRef.current;
      const isInDrawer = this.drawerRef.current.contains(e.target);
      const isOuterClick = !isDrawer || !isInDrawer;

      if (isOuterClick && isFunction(this.props.onOuterClick)) {
        this.props.onOuterClick();
      }
    }

    open() {
      this.setState({
        isOpen: true
      });
    }

    close() {
      this.setState({
        isOpen: false
      });
    }

    render() {
      const {
        children,
        classes: propClasses
      } = this.props;
      const classes = ['drawer', ...propClasses];

      if (this.state.isOpen) {
        classes.push('open');
      }

      return ReactDOM.createPortal(React$1__default.createElement("div", {
        className: classes.join(' '),
        ref: this.drawerRef
      }, children), document.body);
    }

  }

  class Dropdown extends React$1.PureComponent {
    static Item(props) {
      return React$1__default.createElement("div", {
        value: props.value,
        className: "cosmos-dropdown-item",
        key: props.value,
        role: "button",
        tabIndex: "0"
      }, props.label);
    }

    static Group(props) {
      if (props.selected) {
        return React$1__default.createElement("div", {
          className: "cosmos-dropdown-group-selected",
          value: props.label
        }, React$1__default.createElement("div", {
          className: "selected-group",
          role: "button",
          tabIndex: "0",
          onKeyPress: e => e.keyCode === 13 && props.onClick(),
          onClick: props.onClick,
          key: props.label
        }, React$1__default.createElement("i", {
          className: "pi pi-caret-left cosmos-dropdown-back"
        }), props.label), props.children);
      }

      return React$1__default.createElement("div", {
        className: "cosmos-dropdown-group",
        key: props.label,
        value: props.label
      }, props.label, React$1__default.createElement("i", {
        className: "pi pi-caret-right cosmos-dropdown-icon"
      }));
    }

    static isTextMatching(items, filterValue) {
      return items.some(item => {
        if (item.props.label.toLowerCase().indexOf(filterValue) > -1) {
          return true;
        }

        if (item.props.children) {
          return Dropdown.isTextMatching(item.props.children, filterValue);
        }

        return false;
      });
    }

    constructor(props) {
      super(props);
      this.state = {
        showOptions: false,
        value: props.value,
        filterValue: '',
        selectedGroup: ''
      };
      this.showOptions = this.showOptions.bind(this);
      this.hideOptions = this.hideOptions.bind(this);
      this.optionClick = this.optionClick.bind(this);
      this.clearOption = this.clearOption.bind(this);
      this.onFilterValueChange = this.onFilterValueChange.bind(this);
    }

    componentDidMount() {
      document.body.addEventListener('click', this.hideOptions);
    }

    componentWillUnmount() {
      document.body.removeEventListener('click', this.hideOptions);
    }

    onFilterValueChange(e) {
      this.setState({
        filterValue: e.target.value
      });
    }

    showOptions() {
      this.setState({
        showOptions: true
      });
    }

    hideOptions(e) {
      if (this.node.contains(e.target)) return;
      this.setState({
        showOptions: false,
        filterValue: '',
        selectedGroup: ''
      });
    }

    optionClick(e) {
      const value = e.target.getAttribute('value');

      if (e.target.className.indexOf('cosmos-dropdown-group') > -1) {
        this.setState({
          filterValue: '',
          selectedGroup: value
        });
      } else if (e.target.className.indexOf('cosmos-dropdown-item') > -1) {
        this.setState({
          showOptions: false,
          filterValue: '',
          selectedGroup: '',
          value
        });
        if (this.props.onChange) this.props.onChange({
          value
        });
        if (this.props.onBlur) this.props.onBlur({
          value
        });
      }
    }

    clearOption() {
      this.setState({
        filterValue: '',
        selectedGroup: ''
      });
    }

    renderSearchInput() {
      return React$1__default.createElement("div", {
        className: "cosmos-dropdown-search"
      }, React$1__default.createElement("input", {
        type: "text",
        value: this.state.filterValue,
        onChange: this.onFilterValueChange
      }));
    }

    renderOptions() {
      const filterValue = this.state.filterValue.toLowerCase();
      const selectedGroup = this.state.selectedGroup;
      const searchable = this.props.searchable;
      let children = this.props.children.filter(child => {
        if (selectedGroup) {
          if (child.type === Dropdown.Group && child.props.label === selectedGroup) {
            return true;
          }

          return false;
        }

        if (!searchable) return true;
        return Dropdown.isTextMatching([child], filterValue);
      });

      if (selectedGroup) {
        children = children.map(child => {
          if (child.type === Dropdown.Group && child.props.label === selectedGroup) {
            const childProps = {
              selected: true,
              onClick: this.clearOption,
              ...child.props
            };
            const gchildren = child.props.children.filter(gchild => {
              if (!searchable) return true;
              return Dropdown.isTextMatching([gchild], filterValue);
            });
            return React$1.cloneElement(child, childProps, gchildren);
          }

          return child;
        });
      }

      return React$1__default.createElement("div", {
        className: "cosmos-dropdown-options",
        role: "presentation",
        onClick: this.optionClick
      }, this.props.searchable && this.renderSearchInput(), children);
    }

    render() {
      return React$1__default.createElement("span", {
        className: `cosmos-dropdown ${this.props.className || ''}`,
        ref: node => {
          this.node = node;
        }
      }, React$1__default.createElement("span", {
        className: "cosmos-dropdown-input",
        role: "button",
        tabIndex: "0",
        onKeyPress: e => e.keyCode === 13 && this.showOptions(),
        onClick: this.showOptions
      }, this.state.value, React$1__default.createElement("i", {
        className: "pi pi-caret-down cosmos-dropdown-icon"
      })), this.state.showOptions && this.renderOptions());
    }

  }

  const propTypes$h = {
    variant: PropTypes.string,
    classes: PropTypes.arrayOf(PropTypes.string),
    fields: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      labelText: PropTypes.string,
      value: PropTypes.string
    })).isRequired
  };
  const defaultProps$g = {
    variant: 'inline',
    classes: []
  };

  function FieldValueList(props) {
    const {
      variant,
      fields,
      classes: PropClass
    } = props;
    const classes = ['field-value-list', variant, ...PropClass];
    return React$1__default.createElement("div", {
      className: classes.join(' ')
    }, fields.map(({
      id,
      name,
      value
    }) => React$1__default.createElement("div", {
      key: id,
      className: "field"
    }, React$1__default.createElement("div", {
      className: "name"
    }, name), React$1__default.createElement("div", {
      className: "value"
    }, value))));
  }

  FieldValueList.propTypes = propTypes$h;
  FieldValueList.defaultProps = defaultProps$g;

  const propTypes$i = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.arrayOf(PropTypes.string),
    variant: PropTypes.oneOf(['primary', 'simple', 'icon']),
    disabled: PropTypes.bool,
    accept: PropTypes.arrayOf(PropTypes.string),
    isMultiple: PropTypes.bool
  };
  const defaultProps$h = {
    classes: [],
    variant: 'primary',
    disabled: false,
    accept: ['.pdf', '.doc', '.docx', 'image/*'],
    isMultiple: false
  };
  const FileSelector = React$1.forwardRef((props, ref) => {
    const {
      variant,
      disabled,
      children,
      classes: propClasses,
      isMultiple,
      accept,
      ...restProps
    } = props;
    const classes = ['file-custom', 'file-selector'];
    return React$1__default.createElement("div", _extends({
      className: [...classes, ...propClasses].join(' ')
    }, restProps), React$1__default.createElement("input", {
      type: "file",
      accept: [...accept].join(','),
      name: "custom_file",
      id: "custom_file",
      multiple: isMultiple,
      ref: ref,
      disabled: disabled
    }), React$1__default.createElement("label", {
      htmlFor: "custom_file"
    }, React$1__default.createElement("span", {
      className: variant,
      role: "button"
    }, children)));
  });
  FileSelector.propTypes = propTypes$i;
  FileSelector.defaultProps = defaultProps$h;

  const propTypes$j = {
    children: PropTypes.node.isRequired,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$i = {
    classes: []
  };

  function FormFooter(props) {
    const {
      children,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement(Flex, _extends({
      container: true,
      item: true,
      as: "footer",
      justify: "between",
      classes: ['form-footer', ...classes]
    }, restProps), children);
  }

  FormFooter.propTypes = propTypes$j;
  FormFooter.defaultProps = defaultProps$i;

  const propTypes$k = {
    children: PropTypes.node.isRequired,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$j = {
    classes: []
  };

  function FormHeader(props) {
    const {
      children,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement(Flex, _extends({
      as: "header",
      classes: ['form-header', ...classes]
    }, restProps), children);
  }

  FormHeader.propTypes = propTypes$k;
  FormHeader.defaultProps = defaultProps$j;

  const propTypes$l = {
    children: PropTypes.oneOfType([PropTypes.element]).isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    valid: PropTypes.bool,
    inValid: PropTypes.bool,
    inline: PropTypes.bool
  };
  const defaultProps$k = {
    required: false,
    valid: false,
    inValid: false,
    inline: false
  };

  function FormField(props) {
    const {
      label,
      required,
      valid,
      inValid,
      inline,
      classes: propClasses,
      children,
      auxText,
      ...restProps
    } = props;
    const Child = React$1__default.Children.only(children);
    const classes = ['form-field'];
    if (!inline) restProps.direction = 'column';
    if (required) classes.push('required');
    if (valid && !inValid) classes.push('valid');
    if (inValid) classes.push('invalid');
    return React$1__default.createElement(Flex, _extends({
      container: true,
      item: true,
      grow: true,
      classes: classes.concat(propClasses)
    }, restProps), React$1__default.createElement(Child.type, Child.props), React$1__default.createElement(Flex, {
      item: true,
      grow: true,
      as: Label,
      htmlFor: Child.props.id
    }, label), auxText && React$1__default.createElement(Flex, {
      item: true,
      grow: true,
      as: Text,
      classes: ['aux-text']
    }, auxText));
  }

  FormField.propTypes = propTypes$l;
  FormField.defaultProps = defaultProps$k;

  const propTypes$m = {
    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$l = {
    classes: []
  };
  const Form = React$1.forwardRef((props, ref) => {
    const {
      classes,
      children,
      ...restProps
    } = props;
    const childArr = React$1__default.Children.toArray(children);
    const header = childArr.find(c => c.type === FormHeader);
    const footer = childArr.find(c => c.type === FormFooter);
    const content = childArr.filter(c => c.type !== FormHeader && c.type !== FormFooter);
    return React$1__default.createElement(Flex, _extends({
      as: "form",
      container: true,
      direction: "column",
      classes: ['form', ...classes],
      ref: ref
    }, restProps), header, React$1__default.createElement(Flex, {
      container: true,
      item: true,
      grow: true,
      wrap: "wrap",
      classes: ['form-content']
    }, content), footer);
  });
  Form.propTypes = propTypes$m;
  Form.defaultProps = defaultProps$l;
  Form.Header = FormHeader;
  Form.Footer = FormFooter;
  Form.Field = FormField;

  const propTypes$n = {
    /* Compatible src values: url/path, base64 etc... */
    src: PropTypes.string.isRequired,

    /* Text description of the image */
    alt: PropTypes.string.isRequired,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),
    onLoad: PropTypes.func,
    onError: PropTypes.func
  };
  const defaultProps$m = {
    classes: [],
    onLoad: null,
    onError: null
  };

  function Image(props) {
    const {
      classes,
      ...restProps
    } = props; // eslint-disable-next-line jsx-a11y/alt-text

    return React$1__default.createElement("img", _extends({
      className: ['image', ...classes].join(' ')
    }, restProps));
  }

  Image.propTypes = propTypes$n;
  Image.defaultProps = defaultProps$m;

  const propTypes$o = {
    /* Specifies the type of input to be used. Supporting all HTML5 types. Eg- text, number */
    type: PropTypes.oneOf(['text', 'password', 'datetime-local', 'date', 'month', 'time', 'week', 'number', 'email', 'url', 'search', 'tel', 'color']),

    /* Specifies the placeholder for input */
    placeholder: PropTypes.string,

    /* Creates an controlled input and sets the value. Requires an onChange handler to update value. */
    value: PropTypes.string,

    /* Creates an uncontrolled input and sets the initial value */
    defaultValue: PropTypes.string,

    /* Disables the input and makes it non editable */
    disabled: PropTypes.bool,

    /* Specifies the input as mandatory field */
    required: PropTypes.bool,

    /* Makes the input non editable and non clickable */
    readOnly: PropTypes.bool,

    /* Specifies the name of input */
    name: PropTypes.string,

    /* Holds the id of label corresponding to input for accessibility purposes */
    'aria-labelledby': PropTypes.string,

    /* Specifies if the input is a mandatory field to be filled in a form. Used for accessibility purposes */
    'aria-required': PropTypes.bool,

    /* Specifies the maximum length of characters that can be input */
    size: PropTypes.number,

    /* Specifies the minimum length of characters that can be input */
    minLength: PropTypes.number,

    /* Specifies the maximum length of characters that can be input */
    maxLength: PropTypes.number,

    /* Specifies the minimum value of input */
    min: PropTypes.number,

    /* Specifies the maximum value of input */
    max: PropTypes.number,

    /* Function called when input is in focus */
    onFocus: PropTypes.func,

    /* Function called when focussing out from input */
    onBlur: PropTypes.func,

    /* 'Controlled component': Use onChange fn to capture value from event target and reset value prop */
    onChange: PropTypes.func,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$n = {
    type: 'text',
    placeholder: '',
    disabled: false,
    required: false,
    readOnly: false,
    name: null,
    'aria-labelledby': '',
    'aria-required': false,
    size: null,
    minLength: null,
    maxLength: null,
    min: null,
    max: null,
    onFocus: null,
    onBlur: null,
    onChange: null,
    classes: []
  };

  function Input(props) {
    const {
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement("input", _extends({
      className: ['input', ...classes].join(' ')
    }, restProps));
  }

  Input.propTypes = propTypes$o;
  Input.defaultProps = defaultProps$n;

  const propTypes$p = {
    /* Choice animated visual. Set to null for message only(global & local).  */
    variant: PropTypes.oneOf(['ellipsis', 'spinner']),

    /* global: use for viewport/page level loading. local: use for section level loading. inline: Inline with text. */
    placement: PropTypes.oneOf(['global', 'local', 'inline']),

    /* Full, Partial: Optionally provide a message to the user. */
    message: PropTypes.string,

    /* When true, fade in occurs when component mounts.
     * When false, mounted component fades out then re-renders self and returns null, removing from DOM.
     * Technically not the same as unmounting via parent. Not sure yet that matters.
     */
    visible: PropTypes.bool,

    /* CSS compatible color. Value will be set to a local CSS variable used by the component. */
    color: PropTypes.string,

    /* Additional CSS classes applied to spinner element */
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$o = {
    variant: 'ellipsis',
    placement: 'global',
    message: null,
    visible: true,
    color: null,
    classes: []
  };
  const variants = {
    ellipsis() {
      return React$1__default.createElement("span", {
        className: "visual dots"
      }, React$1__default.createElement("span", {
        className: "dot"
      }), React$1__default.createElement("span", {
        className: "dot"
      }), React$1__default.createElement("span", {
        className: "dot"
      }));
    },

    spinner() {
      return React$1__default.createElement("span", {
        className: "visual circle"
      });
    }

  };

  function Loading(props) {
    const {
      visible,
      variant,
      placement,
      message,
      classes,
      ...restProps
    } = props;
    const [isVisible, setIsVisible] = React$1.useState(false);
    const [isNull, setIsNull] = React$1.useState(false);
    const ref = React$1.useRef();

    const onTransitionEnd = e => {
      if (e.target === ref.current && e.propertyName === 'opacity' && !visible) {
        setIsNull(true);
      }
    };

    React$1.useEffect(() => {
      setIsVisible(visible);
    }, [visible]);

    if (isNull) {
      if (visible) setIsNull(false);
      return null;
    }

    return React$1__default.createElement("span", {
      ref,
      className: ['loading', variant || 'message-only', message ? 'has-message' : '', placement, isVisible ? 'visible' : '', ...classes].join(' '),
      ...(message && variant !== 'inline' ? {
        'data-message': message
      } : {}),
      onTransitionEnd,
      ...restProps
    }, variant && variants[variant]());
  }

  Loading.propTypes = propTypes$p;
  Loading.defaultProps = defaultProps$o;

  const propTypes$q = {
    /* Once mounted, open controls transition in/out  */
    open: PropTypes.bool,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),

    /* Called before transition in */
    onBeforeOpen: PropTypes.func,

    /* Called after transition in */
    onAfterOpen: PropTypes.func,

    /* Called before transition out */
    onBeforeClose: PropTypes.func,

    /* Called after transition out */
    onAfterClose: PropTypes.func
  };
  const defaultProps$p = {
    open: false,
    classes: [],
    onBeforeOpen: null,
    onAfterOpen: null,
    onBeforeClose: null,
    onAfterClose: null
  }; // Add necessary body padding to offset scrollbar removal

  const addBodyStyle = () => {
    const scrollbarWidth = getScrollbarWidth();
    const needsPadding = testElForOverflow(document.body);
    window.requestAnimationFrame(() => {
      const bodyStyle = document.body.style;

      if (needsPadding) {
        bodyStyle.paddingRight = `${scrollbarWidth}px`;
      }

      bodyStyle.overflow = 'hidden';
    });
  }; // Remove any added adjustments. TODO: any existing styles should be cached and re-applied.


  const removeBodyStyle = () => {
    window.requestAnimationFrame(() => {
      const bodyStyle = document.body.style;
      bodyStyle.paddingRight = null;
      bodyStyle.overflow = null;
    });
  }; // Modal class


  class Modal extends React$1.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false
      };
      bindAll(this, ['close', 'onTransitionEnd', 'onKeydown', 'onOuterClick']); // Need a ref for regular DOM access

      this.rootRef = React$1.createRef();
    }

    componentDidMount() {
      document.addEventListener('keydown', this.onKeydown);
      document.addEventListener('click', this.onOuterClick); // Open on mount with transition if passed true

      if (this.props.open) {
        reflow(); // Having reflowed DOM, adding class here will cause transition

        this.open();
      }
    }

    componentDidUpdate(prevProps) {
      if (this.props.open === prevProps.open) return;
      const method = this.props.open ? 'open' : 'close';
      const callback = this.props[`onBefore${cap(method)}`];
      if (isFunction(callback)) callback();
      this[method]();
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.onKeydown);
      document.removeEventListener('click', this.onOuterClick);
    }

    onTransitionEnd(e) {
      const isRootEl = e.target === this.rootRef.current;
      const isOpacity = e.propertyName === 'opacity';

      if (isRootEl && isOpacity) {
        if (this.state.isOpen) {
          this.onTransitionEndIn();
        } else {
          this.onTransitionEndOut();
        }
      }
    }

    onTransitionEndIn() {
      const {
        onAfterOpen
      } = this.props;

      if (isFunction(onAfterOpen)) {
        onAfterOpen();
      }
    }

    onTransitionEndOut() {
      const {
        onAfterClose
      } = this.props;
      removeBodyStyle();

      if (isFunction(onAfterClose)) {
        onAfterClose();
      }
    }

    onKeydown(e) {
      if (e.keyCode === 27) this.close();
    }

    onOuterClick(e) {
      const isRootEl = e.target === this.rootRef.current;
      if (isRootEl) this.close();
    }

    open() {
      addBodyStyle();
      this.setState({
        isOpen: true
      });
    }

    close() {
      this.setState({
        isOpen: false
      });
    }

    render() {
      const {
        children,
        classes,
        ...restProps
      } = this.props;
      const modalRootClasses = ['modal-root'];
      const modalClasses = ['modal'];
      if (this.state.isOpen) modalRootClasses.push('open'); // Delete internal "config" props from restProps to avoid passing to DOM element

      Object.keys(Modal.defaultProps).forEach(configProp => {
        delete restProps[configProp];
      });
      return ReactDOM.createPortal(React$1__default.createElement("div", {
        className: modalRootClasses.join(' '),
        ref: this.rootRef,
        onTransitionEnd: this.onTransitionEnd
      }, React$1__default.createElement("div", _extends({
        className: [modalClasses, ...classes].join(' ')
      }, restProps), children)), document.body);
    }

  }

  Modal.propTypes = propTypes$q;
  Modal.defaultProps = defaultProps$p;

  const propTypes$r = {
    children: PropTypes.node.isRequired,
    text: PropTypes.string.isRequired,
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$q = {
    classes: []
  };

  function PageViewHeader(props) {
    const {
      children,
      classes,
      text,
      ...restProps
    } = props;
    return React$1__default.createElement("header", _extends({
      className: classes.join(' ') || null
    }, restProps), React$1__default.createElement("h1", null, text), children);
  }

  PageViewHeader.propTypes = propTypes$r;
  PageViewHeader.defaultProps = defaultProps$q;

  const propTypes$s = {
    children: PropTypes.node,
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$r = {
    children: null,
    classes: []
  };

  function PageViewContent(props) {
    const {
      children,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement("div", _extends({
      className: classes.join(' ') || null
    }, restProps), children);
  }

  PageViewContent.propTypes = propTypes$s;
  PageViewContent.defaultProps = defaultProps$r;

  const propTypes$t = {
    children: PropTypes.node.isRequired,
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$s = {
    classes: []
  };

  function PageViewActions(props) {
    const {
      children,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement(Flex, _extends({
      container: true,
      "align-items": "center",
      classes: ['page-actions', ...classes]
    }, restProps), children);
  }

  PageViewActions.propTypes = propTypes$t;
  PageViewActions.defaultProps = defaultProps$s;

  const propTypes$u = {
    children: PropTypes.node,
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$t = {
    children: null,
    classes: []
  };

  function PageView(props) {
    const {
      children,
      classes: propClasses,
      ...restProps
    } = props;
    const classes = ['page-view'];
    return React$1__default.createElement("article", _extends({
      className: [...classes, ...propClasses].join(' ')
    }, restProps), children);
  }

  PageView.propTypes = propTypes$u;
  PageView.defaultProps = defaultProps$t;
  PageView.Header = PageViewHeader;
  PageView.Content = PageViewContent;
  PageView.Actions = PageViewActions;

  class Item extends React$1.PureComponent {
    render() {
      const {
        name,
        selectedValue,
        onChange,
        onBlur,
        disabled
      } = this.context.radioGroup;
      const {
        value,
        label
      } = this.props;
      const optional = {};

      if (selectedValue !== undefined) {
        optional.checked = value === selectedValue;
      }

      if (disabled !== undefined) {
        optional.disabled = disabled;
      }

      if (typeof onChange === 'function') {
        optional.onChange = onChange.bind(null, value);
      }

      if (typeof onBlur === 'function') {
        optional.onBlur = onBlur;
      }

      return React$1__default.createElement("div", {
        className: "cosmos-radiogroup-item"
      }, React$1__default.createElement("label", {
        htmlFor: `${name}_${value}`
      }, React$1__default.createElement("input", _extends({
        type: "radio"
      }, this.inputProps, {
        name: name,
        value: value,
        id: `${name}_${value}`
      }, optional)), React$1__default.createElement("span", null, label)));
    }

  }

  Item.contextTypes = {
    radioGroup: () => null
  };

  class RadioButtons extends React$1.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        selectedValue: props.selectedValue
      };
      this.onValueChange = this.onValueChange.bind(this);
      this.getChildContext = this.getChildContext.bind(this);
    }

    getChildContext() {
      const {
        name,
        disabled
      } = this.props;
      return {
        radioGroup: {
          name,
          selectedValue: this.state.selectedValue,
          onChange: this.onValueChange,
          onBlur: this.props.onBlur,
          disabled
        }
      };
    }

    onValueChange(value) {
      this.setState({
        selectedValue: value
      });
      if (this.props.onChange) this.props.onChange({
        value
      });
    }

    render() {
      const {
        children
      } = this.props;
      const align = this.props.align || 'vertical';
      return React$1__default.createElement("span", {
        className: `cosmos-radiogroup standard ${align} ${this.props.className || ''}`
      }, children);
    }

  }

  RadioButtons.childContextTypes = {
    radioGroup: () => null
  };
  RadioButtons.Item = Item;

  function Slider(props) {
    const {
      min,
      max,
      step,
      value,
      label,
      onChange,
      onBlur
    } = props;
    const sliderRef = React$1.useRef();
    const [sliderWidth, setSliderWidth] = React$1.useState(0);
    const [sliderValue, setSliderValue] = React$1.useState(value || min);
    const [optionsUniq, setOptionsUniq] = React$1.useState(0);

    if (!optionsUniq) {
      setOptionsUniq(`options${Math.random() * 100}`);
    }

    React$1.useEffect(() => {
      if (sliderWidth === 0 && sliderRef.current) {
        const width = sliderRef.current.offsetWidth;
        setSliderWidth(width);
      }
    }, [sliderWidth]);

    const getOptions = (start, end, gap = 1) => {
      start = parseInt(start, 10);
      end = parseInt(end, 10);
      gap = parseInt(gap, 10);
      const options = [];
      let stepper = start;

      while (stepper <= end) {
        if (stepper == start || stepper == end) {
          options.push(React$1__default.createElement("option", {
            className: "option",
            key: stepper,
            value: stepper,
            label: stepper
          }));
        } else {
          options.push(React$1__default.createElement("option", {
            className: "option",
            key: stepper,
            value: stepper
          }));
        }

        stepper += gap;
      }

      return options;
    };

    const optionChange = event => {
      const {
        value: optionValue
      } = event.target;
      setSliderValue(optionValue);
      if (onChange) onChange(event);
    };

    return React$1__default.createElement(React$1.Fragment, null, React$1__default.createElement(Label, {
      label: label
    }), React$1__default.createElement("div", {
      ref: sliderRef,
      className: "sliderRef"
    }, React$1__default.createElement("input", {
      type: "range",
      className: "slider",
      value: sliderValue,
      min: min,
      max: max,
      step: step,
      list: optionsUniq,
      onChange: optionChange,
      onBlur: onBlur
    })), React$1__default.createElement("span", {
      className: "sliderValue"
    }, sliderValue), React$1__default.createElement("datalist", {
      id: optionsUniq,
      className: "sliderOptions"
    }, getOptions(min, max, step)));
  }

  Slider.propTypes = {
    min: PropTypes.string.isRequired,
    max: PropTypes.string.isRequired,
    step: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  };

  const propTypes$v = {
    /* Objects describing each stage and their state */
    stages: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      current: PropTypes.bool,
      required: PropTypes.bool,
      complete: PropTypes.bool
    })).isRequired
  };

  function Stages(props) {
    return React$1__default.createElement("div", {
      className: "stages"
    }, props.stages.map(stage => React$1__default.createElement("div", {
      className: `stage ${stage.current ? 'current' : ''}`,
      key: stage.name
    }, React$1__default.createElement("div", {
      className: "inner"
    }, stage.complete && React$1__default.createElement(Icon, {
      name: "check"
    }), stage.name))));
  }

  Stages.propTypes = propTypes$v;

  const propTypes$w = {
    /* HTML table element content */
    children: PropTypes.node.isRequired,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string),
    bordered: PropTypes.bool,
    striped: PropTypes.bool,
    hoverable: PropTypes.bool
  };
  const defaultProps$u = {
    classes: [],
    bordered: false,
    striped: false,
    hoverable: false
  };

  function Table(props) {
    const classes = ['table'];
    const {
      bordered,
      striped,
      hoverable,
      classes: propClasses,
      ...restProps
    } = props;
    if (bordered) classes.push('bordered');
    if (striped) classes.push('striped');
    if (hoverable) classes.push('hoverable');
    return React$1__default.createElement("table", _extends({
      className: classes.concat(propClasses).join(' ')
    }, restProps));
  }

  Table.propTypes = propTypes$w;
  Table.defaultProps = defaultProps$u;

  const propTypes$x = {
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['info', 'success', 'warn', 'fail'])
  };
  const defaultProps$v = {
    type: 'info'
  };

  function Tag(props) {
    const {
      text,
      type,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement("span", _extends({
      className: ['tag', `${type}-tag`, ...classes].join(' ')
    }, restProps), React$1__default.createElement(Text, null, text));
  }

  Tag.propTypes = propTypes$x;
  Tag.defaultProps = defaultProps$v;

  const propTypes$y = {
    /* The name of the template */
    name: PropTypes.string.isRequired,

    /* Additional CSS classes */
    classes: PropTypes.arrayOf(PropTypes.string)
  };
  const defaultProps$w = {
    classes: []
  }; // ColumnCreator

  function ColumnCreator(props) {
    const {
      name,
      colCnt,
      classes,
      ...restProps
    } = props; // Delete internal "config" props from restProps to avoid passing to DOM element

    Object.keys(restProps).filter(configProp => /^region-/.test(configProp)).forEach(configProp => {
      delete restProps[configProp];
    });
    return React$1__default.createElement(Flex, _extends({
      container: true,
      "data-template-name": name,
      classes: ['template'].concat(classes || [])
    }, restProps), Array.from({
      length: colCnt
    }).map((undef, i) => {
      const regionKey = `region-${i + 1}`;
      const regionContent = React$1.Children.toArray(props[regionKey]);
      return React$1__default.createElement(Flex, {
        container: true,
        item: true,
        grow: true,
        wrap: "wrap",
        key: regionKey
      }, regionContent.map((node, idx) => {
        return React$1__default.createElement(Flex, {
          item: true,
          grow: true,
          key: idx,
          xs: {
            width: '10-10'
          }
        }, node);
      }));
    }));
  } // OneColumnStacked


  function OneColumnStacked(props) {
    return ColumnCreator({ ...props,
      colCnt: 1
    });
  } // TwoColumnStacked


  function TwoColumnStacked(props) {
    return ColumnCreator({ ...props,
      colCnt: 2
    });
  } // ThreeColumnStacked


  function ThreeColumnStacked(props) {
    return ColumnCreator({ ...props,
      colCnt: 3
    });
  } // FourColumnStacked


  function FourColumnStacked(props) {
    return ColumnCreator({ ...props,
      colCnt: 4
    });
  } // Map Template names to components


  const templates = {
    OneColumnStacked,
    TwoColumnStacked,
    ThreeColumnStacked,
    FourColumnStacked
  };

  function Template(props) {
    const {
      name,
      classes,
      ...restProps
    } = props;
    const Tpl = templates[name];
    return React$1__default.createElement(Tpl, _extends({
      "data-template-name": name,
      classes: classes.join(' ')
    }, restProps));
  }

  Template.propTypes = propTypes$y;
  Template.defaultProps = defaultProps$w;

  const propTypes$z = {
    /* Specifies the unique ID of input for accessibility */
    id: PropTypes.string,

    /* Value for the input */
    value: PropTypes.string,

    /* Specifies the placeholder for input */
    placeholder: PropTypes.string,

    /* Disables the input and makes it non editable */
    disabled: PropTypes.bool,

    /* Specifies the input as mandatory field */
    required: PropTypes.bool,

    /* Specifies the name of input */
    name: PropTypes.string,

    /* Specifies the classes which gets added to input element */
    classes: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),

    /* Holds the id of label corresponding to input for accessibility purposes */
    'aria-labelledby': PropTypes.string,

    /* Specifies if the input is a mandatory field to be filled in a form. Used for accessibility purposes */
    'aria-required': PropTypes.bool,

    /* Specifies the maximum length of characters that can be input */
    maxLength: PropTypes.number,

    /* Specifies the number of rows to be present in the textarea */
    rows: PropTypes.number,

    /* Specifies the number of columns to be present in the textarea */
    cols: PropTypes.number,

    /* Function called when value in input box changes */
    onChange: PropTypes.func,

    /* Function called when focussing out from input */
    onBlur: PropTypes.func,

    /* Function called when clicking inside input */
    onClick: PropTypes.func,

    /* Function called when value in input box changes */
    onInput: PropTypes.func,

    /* Function called when input is in focus */
    onFocus: PropTypes.func,

    /* Function called when a key is pressed down */
    onKeyDown: PropTypes.func,

    /* Function called when key is released */
    onKeyUp: PropTypes.func
  };
  const defaultProps$x = {
    id: null,
    value: '',
    placeholder: '',
    disabled: false,
    required: false,
    name: null,
    maxLength: null,
    classes: []
  };

  function TextArea(props) {
    const {
      id,
      placeholder,
      value,
      disabled,
      maxLength,
      rows,
      cols,
      required,
      name,
      classes,
      onFocus,
      onBlur,
      onChange,
      onInput,
      onClick,
      onKeyUp,
      onKeyDown
    } = props;
    const className = typeof classes == 'object' ? classes.join(' ') : classes;
    return React$1__default.createElement("textarea", {
      id: id,
      placeholder: placeholder,
      value: value,
      disabled: disabled,
      required: required,
      name: name,
      className: className,
      maxLength: maxLength,
      rows: rows,
      cols: cols,
      "aria-labelledby": props['aria-labelledby'],
      "aria-required": props['aria-required'],
      onFocus: onFocus,
      onBlur: onBlur,
      onChange: onChange,
      onInput: onInput,
      onClick: onClick,
      onKeyUp: onKeyUp,
      onKeyDown: onKeyDown
    });
  }

  TextArea.propTypes = propTypes$z;
  TextArea.defaultProps = defaultProps$x;

  class Toaster extends React$1.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        messages: []
      };
    }

    componentDidMount() {
      // Reset key id on each mount as instance may persist
      this.keyId = 0;
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.messages.length === 0) {
        this.props.destroy();
        return;
      }

      if (prevState.messages.length !== this.state.messages.length) {
        // DOM reflow needed for transition after element appends
        reflow();
        this.updateStyleState();
      }
    }

    getKeyId() {
      // Use an incrementing int as unique list key
      this.keyId += 1;
      return this.keyId.toString();
    }

    getStyle(m) {
      const {
        cssUnits
      } = this.props;
      let transform = `translate3d(0${cssUnits}, ${m.translateY}${cssUnits}, 0${cssUnits})`;
      if (m.dismissed) transform += ' scale(0)';
      return {
        transform,
        opacity: m.dismissed ? 0 : m.opacity
      };
    }

    updateStyleState() {
      this.setState(state => {
        const messages = state.messages.map((m, i) => {
          const {
            messageHeight,
            messageMargin
          } = this.props;
          const msgSpace = Number((messageHeight + messageMargin).toFixed(1));
          const mult = this.state.messages.length - i;
          m.translateY = -(mult * msgSpace);
          m.opacity = m.dismissed ? 0 : 1;
          return m;
        });
        return {
          messages
        };
      });
    }

    push(text) {
      // Default message props
      const message = {
        text,
        id: this.getKeyId(),
        dismissed: false,
        translateY: 0,
        opacity: 0
      };

      if (typeof this.props.messageTimeout === 'number') {
        message.timeoutID = setTimeout(this.dismiss.bind(this), this.props.messageTimeout, message);
      }

      this.setState(state => {
        return {
          messages: state.messages.concat([message])
        };
      });
    }

    dismiss(message) {
      window.clearTimeout(message.timeoutID);
      if (message.dismissed) return;
      this.setState(state => {
        const messages = state.messages.map(m => {
          m.dismissed = m.dismissed || m.id === message.id;
          return m;
        });
        return {
          messages
        };
      });
    }

    dismissAll() {
      this.setState(state => {
        const messages = state.messages.map(m => {
          m.dismissed = true;
          return m;
        });
        return {
          messages
        };
      });
    }

    remove(message) {
      this.setState(state => {
        return {
          messages: state.messages.filter(m => m.id !== message.id)
        };
      });
    }

    handleTransEnd(e) {
      const target = e.target;
      const isDismissedEl = target.matches('.message.dismissed');

      if (isDismissedEl && e.propertyName === 'opacity') {
        const id = target.getAttribute('data-message-id');
        const message = this.state.messages.find(m => m.id === id);
        this.remove(message);
      }
    }

    render() {
      return React$1__default.createElement(React$1.Fragment, null, this.state.messages.map(m => {
        const classNames = ['message'];

        if (m.dismissed) {
          classNames.push('dismissed');
        }

        return React$1__default.createElement("div", {
          className: classNames.join(' '),
          style: this.getStyle(m),
          key: m.id,
          "data-message-id": m.id,
          onTransitionEnd: this.handleTransEnd.bind(this)
        }, React$1__default.createElement("div", {
          className: "text",
          title: m.text
        }, m.text), React$1__default.createElement(Button, {
          onClick: () => this.dismiss(m)
        }, React$1__default.createElement(Icon, {
          name: "times"
        })));
      }));
    }

  } // Export component instance interface


  var Toaster$1 = {
    component: null,
    settings: {
      messageHeight: 4.2,
      messageMargin: 0.8,
      cssUnits: 'rem',
      messageTimeout: 5000
    },

    push(text) {
      // If we have an instance use that
      if (this.component) {
        this.component.push(text);
        return this.component;
      } // Create a container element


      const toasterRoot = document.createElement('div');
      toasterRoot.className = 'toaster'; // Append to the real DOM

      document.body.appendChild(toasterRoot); // Cleanup for when all messages are dismissed

      const destroy = () => {
        ReactDOM.unmountComponentAtNode(toasterRoot);
        document.body.removeChild(toasterRoot);
        this.component = null;
      };

      const props = { ...this.settings,
        destroy
      }; // Render and store a reference to the component instance

      this.component = ReactDOM.render(React$1__default.createElement(Toaster, props), toasterRoot); // Push method is the way to add messages, not with props

      this.component.push(text);
      return this.component;
    }

  };

  const defaultProps$y = {
    /** Tooltip is going to be placed according to the value of this property */
    placement: 'top',

    /** Space seperated list of triggers (eg. 'click hover') */
    trigger: 'hover',
    variant: ''
  };
  const propTypes$A = {
    children: PropTypes.oneOfType([PropTypes.node]).isRequired,
    placement: PropTypes.oneOf(['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start']),
    trigger: PropTypes.string,
    text: PropTypes.string.isRequired,
    variant: PropTypes.string
  };

  class Tooltip extends React$1.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false
      };
      this.currentTarget = null;
      bindAll(this, ['toggle', 'addTargetEvents', 'removeTargetEvents', 'myRefHandler']);
      this.id = props.id || generateUniqueId();
      const statesAndEvents = {
        hover: ['mouseover', 'mouseout'],
        click: ['click'],
        focus: ['focus', 'blur']
      };
      const triggers = this.props.trigger.trim().split(/\s+/);
      this.triggerEvents = [];
      const that = this;
      triggers.forEach(trigger => {
        if (statesAndEvents[trigger]) {
          that.triggerEvents = that.triggerEvents.concat(statesAndEvents[trigger]);
        }
      });
    }

    componentDidMount() {
      this.addTargetEvents();
    }

    componentWillUnmount() {
      this.removeTargetEvents();
      this.currentTarget = null;
    }

    addTargetEvents() {
      if (this.props.trigger && this.currentTarget) {
        const that = this;
        this.triggerEvents.forEach(event => {
          that.currentTarget.addEventListener(event, that.toggle, true);
        });
      }
    }

    removeTargetEvents() {
      if (this.props.trigger && this.currentTarget) {
        const that = this;
        this.triggerEvents.forEach(event => {
          that.currentTarget.removeEventListener(event, that.toggle, true);
        });
      }
    }

    toggle() {
      this.setState(prevState => ({
        isOpen: !prevState.isOpen
      }));
    }

    myRefHandler(e) {
      this.currentTarget = e;
    }

    render() {
      return React$1__default.createElement(reactPopper.Manager, null, React$1__default.createElement(reactPopper.Reference, {
        innerRef: this.myRefHandler
      }, ({
        ref
      }) => React$1__default.createElement("div", {
        className: "refEle",
        ref: ref,
        "aria-describedby": this.id
      }, React$1__default.cloneElement(this.props.children))), this.state.isOpen && React$1__default.createElement(reactPopper.Popper, {
        placement: this.props.placement
      }, ({
        ref,
        style,
        placement,
        arrowProps
      }) => React$1__default.createElement("div", {
        id: this.id,
        ref: ref,
        style: style,
        "data-placement": placement,
        className: `tooltip ${this.props.variant}`,
        role: "tooltip"
      }, this.props.text, React$1__default.createElement("div", {
        className: "tooltip-arrow",
        ref: arrowProps.ref,
        style: arrowProps.style
      }))));
    }

  }

  Tooltip.defaultProps = defaultProps$y;
  Tooltip.propTypes = propTypes$A;

  const propTypes$B = {
    classes: PropTypes.arrayOf(PropTypes.string),
    headerText: PropTypes.string,
    headerIcon: PropTypes.node,
    headerActions: PropTypes.node
  };
  const defaultProps$z = {
    classes: [],
    headerText: null,
    headerIcon: null,
    headerActions: null
  };

  function Utility(props) {
    const {
      children,
      headerText,
      headerActions,
      headerIcon,
      classes,
      ...restProps
    } = props;
    return React$1__default.createElement(Card, _extends({
      variant: "cover",
      classes: ['utility', ...classes]
    }, restProps), React$1__default.createElement(Card.Header, null, headerIcon, React$1__default.createElement(Text, null, headerText), React$1__default.createElement(Card.Header.Actions, null, headerActions)), React$1__default.createElement(Card.Content, {
      classes: ['utility-content']
    }, children));
  }

  Utility.propTypes = propTypes$B;
  Utility.defaultProps = defaultProps$z;

  exports.AppShell = AppShell;
  exports.Assignments = Assignments;
  exports.Avatar = Avatar;
  exports.Button = Button;
  exports.Card = Card;
  exports.CaseView = CaseView;
  exports.Checkbox = Checkbox;
  exports.CheckboxGroup = CheckboxGroup;
  exports.Currency = Currency;
  exports.CurrencyInput = CurrencyInput;
  exports.DateRange = DateRange;
  exports.DateTimePicker = DateTimePicker;
  exports.Drawer = Drawer;
  exports.Dropdown = Dropdown;
  exports.ExpandCollapse = ExpandCollapse;
  exports.FieldValueList = FieldValueList;
  exports.FileSelector = FileSelector;
  exports.Flex = Flex;
  exports.Form = Form;
  exports.Icon = Icon;
  exports.Image = Image;
  exports.Input = Input;
  exports.Label = Label;
  exports.Link = Link;
  exports.Loading = Loading;
  exports.Modal = Modal;
  exports.PageView = PageView;
  exports.RadioButtons = RadioButtons;
  exports.Slider = Slider;
  exports.Stages = Stages;
  exports.Table = Table;
  exports.Tag = Tag;
  exports.Template = Template;
  exports.Text = Text;
  exports.TextArea = TextArea;
  exports.Toaster = Toaster$1;
  exports.Tooltip = Tooltip;
  exports.Utility = Utility;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cosmos.js.map
