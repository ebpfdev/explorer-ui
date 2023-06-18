import {MapEntryFormat} from "../../graphql/graphql";
import React, {useState} from "react";

export interface EditableCellProps {
  format?: MapEntryFormat;
  isEditing?: boolean;
  value: string;
  onMove?: (direction: 'up' | 'down') => void;
  onActivate?: () => void;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
  onBlur?: (newValue: string) => 'restore' | 'keep';
}

export function EditableCell({value, format, isEditing, onMove, onActivate, onSubmit, onCancel, onBlur}: EditableCellProps) {
  const [editingValue, setEditingValue] = useState(value);

  function doOnCancel(elem: HTMLSpanElement) {
    elem.innerText = value;
    setEditingValue(value);
    onCancel && onCancel()
  }

  return <td><span
    onBlur={e => {
      if (!(onBlur && onBlur(editingValue) === 'keep')) {
        doOnCancel(e.target);
      }
    }}
    contentEditable={isEditing}
    onClick={e => {
      if (isEditing) return;
      setEditingValue(value);
      onActivate && onActivate()
      if (format === MapEntryFormat.Number) {
        const range = document.createRange();
        // @ts-ignore
        range.selectNodeContents(e.target);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setTimeout(() => {
        // @ts-ignore
        e.target.focus();
      }, 10);
    }}
    onKeyDown={e => {
      if (e.key === 'Enter') {
        onSubmit && onSubmit(editingValue);
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }}
    onKeyUp={e => {
      if (e.key === 'Escape') {
        // @ts-ignore
        doOnCancel(e.target);
      } else if (e.key === 'ArrowUp') {
        onMove && onMove('up');
      } else if (e.key === 'ArrowDown') {
        onMove && onMove('down');
      }
    }}
    onInput={(e) => {
      // @ts-ignore
      setEditingValue(e.target.innerText)
    }}
  >{value}</span></td>;
}
