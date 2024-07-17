import * as React from "react"

export function useCombinedRef<T>(...refs: React.Ref<T>[]) {
	// cache the refs to avoid a dependency to useCallback,
	// which would invalidate every render
	const cache = React.useRef<typeof refs>(refs)

	// useInsertionEffect ensures this runs before other effects
	React.useInsertionEffect(() => {
		cache.current = refs
	})

	return React.useCallback((node: T | null) => {
		for (const ref of cache.current) {
			if (typeof ref === "function") {
				ref(node)
			} else if (ref) {
				;(ref as React.MutableRefObject<T | null>).current = node
			}
		}
	}, [])
}
