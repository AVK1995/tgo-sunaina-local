'use client';

/**
 * A dropdown in the site's own colours.
 *
 * A native <select> cannot be styled once it opens: Windows paints its list
 * grey with a bright blue highlight whatever the page asks for. So this is a
 * button plus a listbox, built to the WAI-ARIA listbox pattern:
 *
 *   Enter / Space / ArrowDown open it, ArrowUp / ArrowDown move, Enter picks,
 *   Escape or Tab closes, Home / End jump, a click outside closes.
 */
import { CaretDown, Check } from '@phosphor-icons/react/dist/ssr';
import { useEffect, useId, useRef, useState } from 'react';

import { C } from '../_landing/shared';

export type SelectOption = { value: string; label: string };

export default function ThemedSelect({
  value,
  options,
  onChange,
  placeholder = 'Select one',
  ariaLabel,
  invalid = false,
  renderValue,
  className = '',
  listClassName = '',
}: {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  invalid?: boolean;
  /** What the closed button shows, when it should be shorter than the label. */
  renderValue?: (option: SelectOption) => string;
  className?: string;
  listClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  /* Close on any click outside the control. */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  /* Keep the highlighted option in view as the keyboard moves it. */
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const openList = () => {
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => Math.min(options.length - 1, a + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        pick(active);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className="kz-select flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3 text-left text-[15px] outline-none"
        data-open={open ? 'true' : 'false'}
        style={{
          background: C.canvasAlt,
          color: selected ? C.ink : C.inkSoft,
          border: `1px solid ${invalid ? C.coralInk : C.line}`,
        }}
      >
        <span className="truncate">
          {selected ? (renderValue ? renderValue(selected) : selected.label) : placeholder}
        </span>
        <CaretDown
          weight="bold"
          className="h-4 w-4 shrink-0 transition-transform duration-200"
          style={{ color: C.goldDeep, transform: open ? 'rotate(180deg)' : undefined }}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-label={ariaLabel}
          className={`kz-select-list absolute left-0 z-30 mt-2 max-h-64 overflow-auto rounded-xl p-1.5 ${listClassName}`}
          style={{
            background: C.canvas,
            border: `1px solid ${C.lineStrong}`,
            boxShadow: '0 22px 44px -20px rgba(38, 48, 74, 0.45)',
          }}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            const isActive = i === active;
            return (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(i)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-[14.5px]"
                style={{
                  background: isActive ? C.plumBed : 'transparent',
                  color: C.ink,
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                <span>{o.label}</span>
                {isSelected && (
                  <Check weight="bold" className="h-4 w-4 shrink-0" style={{ color: C.goldDeep }} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
