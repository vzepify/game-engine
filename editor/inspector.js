class Inspector {
    static createProperty(label, value, type = 'text', onchange = null) {
        const prop = document.createElement('div');
        prop.className = 'property';

        const labelEl = document.createElement('div');
        labelEl.className = 'property-label';
        labelEl.textContent = label;
        prop.appendChild(labelEl);

        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        if (onchange) {
            input.onchange = onchange;
        }
        prop.appendChild(input);

        return prop;
    }
}