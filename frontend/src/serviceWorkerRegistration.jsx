

// Determine if running on localhost
const isLocalhost = Boolean(
	window.location.hostname === 'localhost' ||
	window.location.hostname === '[::1]' ||
	window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
	if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
		const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
		if (publicUrl.origin !== window.location.origin) {
			return;
		}
	}

		window.addEventListener('load', () => {
			const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

			if (isLocalhost) {
				// Skip registration on localhost
				return;
			}

			navigator.serviceWorker
				.register(swUrl)
				.then(registration => {
					if (config && config.onSuccess) {
						config.onSuccess(registration);
					}
				})
				.catch(error => {
					if (config && config.onError) {
						config.onError(error);
					}
				});
		});
	}
