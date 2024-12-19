import { useTheme } from '@/components/theme-provider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<div className="flex items-center space-x-2">
			<Switch
				checked={theme === 'dark'}
				onCheckedChange={(checked) => {
					setTheme(checked ? 'dark' : 'light');
				}}
				id="dark-mode-toggle"
			/>
			<Label htmlFor="dark-mode-toggle">Dark mode</Label>
		</div>
	);
}
