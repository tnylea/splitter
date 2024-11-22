import Split from 'split.js';

class PinesSplitter extends HTMLElement {
  constructor() {
    super();
    this.addStyles();
  }

  addStyles() {
    // Only add styles once to the document
    if (!document.querySelector('#pines-splitter-styles')) {
      const style = document.createElement('style');
      style.id = 'pines-splitter-styles';
      style.textContent = `
        pines-splitter {
          display: flex;
          width: 100%;
          height: 100%;
        }

        pines-splitter[direction="vertical"] {
          flex-direction: column;
        }

        pines-splitter > * {
          height: 100%;
          min-height: 0;
          min-width: 0;
        }

        .gutter {
          background-color: #e2e8f0;
          background-repeat: no-repeat;
          background-position: 50%;
          flex-shrink: 0;
        }

        .gutter:hover {
          background-color: #94a3b8;
        }

        .gutter.gutter-horizontal {
          cursor: col-resize;
          width: 4px;
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
        }

        .gutter.gutter-vertical {
          cursor: row-resize;
          height: 4px;
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
        }
      `;
      document.head.appendChild(style);
    }
  }

  static get observedAttributes() {
    return ['direction'];
  }

  get direction() {
    return this.getAttribute('direction') === 'vertical' ? 'vertical' : 'horizontal';
  }

  set direction(value) {
    this.setAttribute('direction', value);
  }

  connectedCallback() {
    // Wait for children to be parsed
    requestAnimationFrame(() => {
      this.initializeSplit();
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'direction' && oldValue !== newValue && this.split) {
      this.split.destroy();
      requestAnimationFrame(() => {
        this.initializeSplit();
      });
    }
  }

  initializeSplit() {
    if (this.childElementCount < 2) return;

    const children = Array.from(this.children);
    const sizes = new Array(children.length).fill(100 / children.length);

    // Initialize Split.js
    this.split = Split(children, {
      sizes,
      minSize: 0,
      gutterSize: 4,
      direction: this.direction,
      elementStyle: (dimension, size, gutterSize) => {
        return {
          'flex-basis': `calc(${size}% - ${gutterSize}px)`,
          'min-height': '0',
          'min-width': '0'
        };
      },
      gutterStyle: (dimension, gutterSize) => ({
        'flex-basis': `${gutterSize}px`,
      }),
    });
  }

  disconnectedCallback() {
    if (this.split) {
      this.split.destroy();
    }
  }
}

customElements.define('pines-splitter', PinesSplitter);
