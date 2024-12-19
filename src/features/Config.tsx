import { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

const Config = () => {
	const [isOpen, setIsOpen] = useState(false);

	const [lang, setLang] = useState<(typeof languages)[number]>({
		lang: 'English',
		code: 'en_US',
	});
	const handleSetLangClick = useCallback(async () => {
		try {
			await invoke<void>('set_language', { lang });
		} catch (e) {
			console.error(e);
		}
	}, [lang]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<Settings className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Configuration</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex items-center justify-between">
						<ModeToggle />
					</div>
					<div className="flex flex-col gap-2">
						<label
							htmlFor="language-select"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Language
						</label>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default Config;
