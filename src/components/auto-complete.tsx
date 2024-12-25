// ref: https://github.com/Balastrong/shadcn-autocomplete-demo

import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command';
import { Input } from './ui/input';
import { Popover, PopoverAnchor, PopoverContent } from './ui/popover';
import { Skeleton } from './ui/skeleton';
import useInputStore from '@/stores/Input';

type Props<T extends string> = {
	selectedValue: T;
	onSelectedValueChange: (value: T) => void;
	searchValue: string;
	onSearchValueChange: (value: string) => void;
	items: { value: T; label: string }[];
	isLoading?: boolean;
	emptyMessage?: string;
	placeholder?: string;
	filterFunction?: (item: { value: T; label: string }, inputText: string) => boolean;
	id?: string;
};

export function AutoComplete<T extends string>({
	selectedValue,
	onSelectedValueChange,
	searchValue,
	onSearchValueChange,
	items,
	isLoading,
	emptyMessage = 'No items.',
	placeholder = 'Search...',
	filterFunction,
	id,
}: Props<T>) {
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const setIsInput = useInputStore((state) => state.setIsInput);

	const labels = useMemo(
		() =>
			items.reduce(
				(acc, item) => {
					acc[item.value] = item.label;
					return acc;
				},
				{} as Record<string, string>,
			),
		[items],
	);

	/*
  const reset = () => {
		onSelectedValueChange('' as T);
		onSearchValueChange('');
	};
  */

	const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (!e.relatedTarget?.hasAttribute('cmdk-list') && labels[selectedValue] !== searchValue) {
			// reset();
		}
	};

	const onSelectItem = (inputValue: string) => {
		onSelectedValueChange(inputValue as T);
		onSearchValueChange(labels[inputValue] ?? '');

		setOpen(false);
		inputRef.current?.blur();
	};

	return (
		<div className="flex items-center" id={id}>
			<Popover open={open} onOpenChange={setOpen}>
				<Command shouldFilter={false}>
					<PopoverAnchor asChild>
						<CommandPrimitive.Input
							asChild
							value={searchValue}
							onValueChange={onSearchValueChange}
							onKeyDown={(e) => setOpen(e.key !== 'Escape')}
							onMouseDown={() => setOpen((open) => !!searchValue || !open)}
							onFocus={() => setOpen(true)}
							onBlur={onInputBlur}
						>
							<Input
								placeholder={placeholder}
								ref={inputRef}
								onFocus={() => {
									setIsInput(true);
								}}
								onBlur={() => {
									setIsInput(false);
								}}
							/>
						</CommandPrimitive.Input>
					</PopoverAnchor>
					{!open && <CommandList aria-hidden="true" className="hidden" />}
					<PopoverContent
						asChild
						onOpenAutoFocus={(e) => e.preventDefault()}
						onInteractOutside={(e) => {
							if (e.target instanceof Element && e.target.hasAttribute('cmdk-input')) {
								e.preventDefault();
							}
						}}
						className="w-[--radix-popover-trigger-width] p-0"
					>
						<CommandList>
							{isLoading && (
								<CommandPrimitive.Loading>
									<div className="p-1">
										<Skeleton className="h-6 w-full" />
									</div>
								</CommandPrimitive.Loading>
							)}
							{items.length > 0 && !isLoading ? (
								<CommandGroup>
									{items
										.filter((item) => (filterFunction ? filterFunction(item, searchValue) : true))
										.map((option) => (
											<CommandItem
												key={option.value}
												value={option.value}
												onMouseDown={(e) => e.preventDefault()}
												onSelect={onSelectItem}
											>
												<Check
													className={cn('mr-2 h-4 w-4', selectedValue === option.value ? 'opacity-100' : 'opacity-0')}
												/>
												{option.label}
											</CommandItem>
										))}
								</CommandGroup>
							) : null}
							{!isLoading ? <CommandEmpty>{emptyMessage ?? 'No items.'}</CommandEmpty> : null}
						</CommandList>
					</PopoverContent>
				</Command>
			</Popover>
		</div>
	);
}
