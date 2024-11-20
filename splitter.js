import Split from 'split.js'

export default function (Alpine) {
    
    // Register our x-splitter directive
    Alpine.directive('splitter', (el, { modifiers, expression }) => {
        // Wait for Alpine to finish initializing the element
        Alpine.nextTick(() => {
            // Get all direct children
            const children = Array.from(el.children)
            
            if (children.length < 2) {
                console.warn('x-splitter requires at least 2 child elements')
                return
            }

            // Set up the element for Split.js
            el.style.display = 'flex'
            el.style.flexDirection = modifiers.includes('vertical') ? 'column' : 'row'
            el.style.height = '100%'
            el.style.width = '100%'

            // Parse options from attributes
            const options = {
                // Default to horizontal split
                direction: modifiers.includes('vertical') ? 'vertical' : 'horizontal',
                // Get sizes from data attribute or default to equal distribution
                sizes: el.dataset.sizes ? JSON.parse(el.dataset.sizes) : children.map(() => 100 / children.length),
                // Get min sizes from data attribute or default to 0
                minSize: el.dataset.minSize ? JSON.parse(el.dataset.minSize) : children.map(() => 0),
                // Get max sizes from data attribute
                maxSize: el.dataset.maxSize ? JSON.parse(el.dataset.maxSize) : undefined,
                // Get expand to min from data attribute
                expandToMin: el.dataset.expandToMin ? JSON.parse(el.dataset.expandToMin) : false,
                // Get gutterSize from data attribute or default to 10
                gutterSize: el.dataset.gutterSize ? parseInt(el.dataset.gutterSize) : 10,
                // Get gutterAlign from data attribute
                gutterAlign: el.dataset.gutterAlign || 'center',
                // Get snapOffset from data attribute or default to 30
                snapOffset: el.dataset.snapOffset ? parseInt(el.dataset.snapOffset) : 30,
                // Get dragInterval from data attribute
                dragInterval: el.dataset.dragInterval ? parseInt(el.dataset.dragInterval) : undefined,
                // Get cursor style from data attribute
                cursor: el.dataset.cursor || (modifiers.includes('vertical') ? 'row-resize' : 'col-resize'),
            }

            // Initialize Split.js
            const split = Split(children, options)

            // Store the Split instance on the element
            el._split = split

            // Add event listeners if provided
            if (el.dataset.onDrag) {
                split.on('drag', () => {
                    Alpine.evaluate(el, el.dataset.onDrag)
                })
            }

            if (el.dataset.onDragStart) {
                split.on('dragStart', () => {
                    Alpine.evaluate(el, el.dataset.onDragStart)
                })
            }

            if (el.dataset.onDragEnd) {
                split.on('dragEnd', () => {
                    Alpine.evaluate(el, el.dataset.onDragEnd)
                })
            }
        })
    })

    // Add a magic helper to access the Split instance
    Alpine.magic('split', (el) => {
        return () => el.closest('[x-splitter]')?._split
    })
}
