import './index.css'
import './splitter.css'

import Alpine from 'alpinejs'
console.log('Alpine imported:', Alpine);

window.Alpine = Alpine

import splitter from './splitter.js'
console.log('Splitter imported:', splitter);

// Register the plugin
Alpine.plugin(splitter)
console.log('Plugin registered');

document.addEventListener('alpine:init', () => {
    console.log('Alpine initialized');
});

Alpine.start()
console.log('Alpine started');
