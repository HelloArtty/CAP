export function updateURLParams(params: Record<string, string>) {
    const url = new URL(window.location.href);
    Object.keys(params).forEach(key => url.searchParams.set(key, params[key]));
    window.history.pushState({}, '', url);
}