import { offset, shift, useFloating } from "@floating-ui/react-dom"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { FocusOn } from "react-focus-on"
import type { ReactFocusOnProps } from "react-focus-on/dist/es5/types"
import { useCombinedRef } from "./useCombinedRef.ts"

interface MenuState extends ReturnType<typeof useMenu> {}

function useMenu() {
	const [open, setOpen] = React.useState(false)
	const buttonShardRef = React.useRef<HTMLButtonElement>(null)

	const floating = useFloating<HTMLButtonElement>({
		open,
		placement: "bottom-end",
		middleware: [offset(8), shift({ padding: 8 })],
	})

	return {
		open,
		setOpen,
		buttonReferenceRef: floating.refs.reference,
		buttonShardRef,
		panelRef: floating.refs.floating,
	}
}

const MenuContext = React.createContext<MenuState | null>(null)

function useMenuContext() {
	const menu = React.useContext(MenuContext)
	if (!menu) {
		throw new Error("useMenuContext must be used within a MenuContext.Provider")
	}
	return menu
}

export function Menu({ children }: { children: React.ReactNode }) {
	const menu = useMenu()
	return <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
}

export interface MenuButtonProps extends React.ComponentProps<"button"> {}

export const MenuButton: React.ForwardRefExoticComponent<MenuButtonProps> =
	React.forwardRef(function MenuButton(props, forwardedRef) {
		const store = useMenuContext()
		const ref = useCombinedRef(
			forwardedRef,
			store.buttonReferenceRef,
			store.buttonShardRef,
		)
		return (
			<button
				type="button"
				{...props}
				ref={ref}
				onClick={(event) => {
					props.onClick?.(event)
					if (event.defaultPrevented) return
					store.setOpen((open) => !open)
				}}
			/>
		)
	})

export interface MenuPanelProps
	extends Omit<React.ComponentProps<"div">, "children">,
		ReactFocusOnProps {}

export const MenuPanel: React.ForwardRefExoticComponent<MenuPanelProps> =
	React.forwardRef(function MenuPanel(props, forwardedRef) {
		const store = useMenuContext()
		const ref = useCombinedRef(forwardedRef, store.panelRef)
		return ReactDOM.createPortal(
			<FocusOn
				{...props}
				enabled={store.open}
				shards={[store.buttonShardRef]}
				ref={ref}
				style={{
					transitionDuration: "150ms",
					transitionProperty: "opacity, transform",
					transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
					opacity: store.open ? 1 : 0,
					transform: store.open ? `translateY(0px)` : `translateY(8px)`,
				}}
				onClickOutside={() => {
					store.setOpen(false)
				}}
				onEscapeKey={() => {
					store.setOpen(false)
				}}
			/>,
			document.body,
		)
	})

export interface MenuItemProps extends React.ComponentProps<"button"> {}

export const MenuItem: React.ForwardRefExoticComponent<MenuItemProps> =
	React.forwardRef(function MenuItem(props, forwardedRef) {
		const store = useMenuContext()
		return (
			<button
				type="button"
				{...props}
				ref={forwardedRef}
				onClick={(event) => {
					event.preventDefault()
					store.setOpen(false)
				}}
			/>
		)
	})
