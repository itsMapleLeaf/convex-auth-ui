import { LucideUserCircle2 } from "lucide-react"
import * as React from "react"
import { Menu, MenuButton, MenuItem, MenuPanel } from "./internal/menu.tsx"

export interface UserMenuProps extends React.ComponentProps<"button"> {
	children?: React.ReactNode
}

/**
 * A button that opens a menu with user actions.
 *
 * If no children are provided, a user icon will be rendered. Pass `null` to
 * render nothing.
 */
export const UserMenu: React.ForwardRefExoticComponent<UserMenuProps> =
	React.forwardRef(function UserMenu(props, forwardedRef) {
		return (
			<Menu>
				<MenuButton {...props} ref={forwardedRef}>
					{props.children === undefined ? (
						<LucideUserCircle2 style={{ width: 24, height: 24 }} />
					) : (
						props.children
					)}
				</MenuButton>
				<MenuPanel>
					<MenuItem>Settings</MenuItem>
					<MenuItem>Sign out</MenuItem>
				</MenuPanel>
			</Menu>
		)
	})
