type Child = string | HTMLElement | HTMLElement[];
type Styles = Partial<CSSStyleDeclaration>;

interface Events {
	onChange: (event: Event) => void;
}

const h = <T extends keyof HTMLElementTagNameMap>(
	name: T | (() => HTMLElement),
	props: Partial<HTMLElementTagNameMap[T]> & Events,
	...children: Child[]
) => {
	if (typeof name === 'function') {
		return name();
	}

	const element = document.createElement(name);

	appendChild(element, children);

	if (props && props.onChange) {
		element.addEventListener('change', props.onChange);
		Reflect.deleteProperty(props, 'onChange');
	}

	Object.assign(element, props);

	return element;
};

const append = (element: HTMLElement, parent: HTMLElement) => {
	parent.appendChild(element);
};

const appendChild = (element: HTMLElement, children: Child | Child[]) => {
	if (Array.isArray(children)) {
		children.forEach((child) => {
			appendChild(element, child);
		});
	} else if (children instanceof HTMLElement) {
		element.appendChild(children);
	} else {
		element.appendChild(document.createTextNode(children));
	}
};

const setStyles = (element: HTMLElement, styles: Styles) => {
	Object.assign(element.style, styles);
	return element;
};

const replaceContent = (element: HTMLElement, children: Child | Child[]) => {
	element.innerHTML = '';
	appendChild(element, children);
};

export { append, replaceContent, setStyles };

export default h;
