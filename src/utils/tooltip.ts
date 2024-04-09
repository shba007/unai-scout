let isInit = true;

(async () => {
	const [tab] = await chrome.tabs.query({ active: true });

	if (isInit)
		return

	chrome.scripting.executeScript({
		target: { tabId: tab.id! },
		func: () => {
			const injectTailwind = () => {
				const tailwindScript = document.createElement('script');
				tailwindScript.src = 'https://cdn.tailwindcss.com';
				document.head.appendChild(tailwindScript);
			}
			injectTailwind()

			const createTooltip = () => {
				const rootElem = document.createElement('div')

				rootElem.innerHTML = `
					<button
						class="flex gap-2 justify-center items-center rounded-full p-1 pr-3 bg-gray-900 hover:bg-gray-800">
						<span class="rounded-full p-1 size-6">
							<img src="a" class="w-full h-full" />
						</span>
						<span class="mb-0.5 capitalize">content</span>
					</button>
				`
				return rootElem
			}

			function injectElement() {
				const targetElements = document.querySelectorAll('img');

				targetElements.forEach(targetElement => {
					const rootElem = document.createElement('div');
					rootElem.classList.add('dm-wrapper')

					rootElem.appendChild(targetElement.cloneNode(true));
					rootElem.appendChild(createTooltip())

					// @ts-ignore
					targetElement.parentNode.replaceChild(rootElem, targetElement);
				});
			}
			injectElement()
		}
	}, () => {
		isInit = true
	});
})()