import { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

const Config = () => {
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

	return <div></div>;
};

export default Config;
