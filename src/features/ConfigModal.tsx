import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ModeToggle } from '@/components/mode-toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { languages } from '@/utils/langs';
import useConfigStore from '@/stores/Config';

const ConfigModal = ({ children }: { children: (props: { onClick: () => void }) => React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
	};

	const { language, setLang } = useConfigStore();

	const handleSetLangClick = async (lang_code: string) => {
		const prevLang = structuredClone(language);
		try {
			const lang = languages.find((l) => l.code === lang_code);
			if (lang) {
				setLang(lang);
				await invoke<void>('set_language', { lang: lang_code });
			} else {
				// show error toast
			}
		} catch (e) {
			// show error toast here
			console.error(e);
			if (prevLang !== language) setLang(prevLang);
		}
	};

	useEffect(() => {
		console.log(language);
	}, [language]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children({ onClick: () => handleOpenChange(true) })}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogDescription />
				<DialogHeader>
					<DialogTitle>Configuration</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex items-center justify-between">
						<ModeToggle />
					</div>
					<div className="flex flex-col gap-2">
						<Label
							htmlFor="language-select"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Language
						</Label>
						<Select
							onValueChange={async (val) => {
								await handleSetLangClick(val);
							}}
							value={language.code}
						>
							<SelectTrigger id="language-select">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent>
								{languages.map((l) => (
									<SelectItem value={l.code} key={l.code}>
										{l.lang}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ConfigModal;
