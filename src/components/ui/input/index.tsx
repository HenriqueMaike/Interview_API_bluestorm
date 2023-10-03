import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styles from './style.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { }

export function Input({ ...rest }: InputProps) {
    return (
        <input className={styles.input} {...rest} />
    )
}

export function TextArea({ ...rest }: TextAreaProps) {
    return (
        <textarea className={styles.input} {...rest} />
    )
}

export function Select({ ...rest }: SelectProps) {
    return (
        <select className={styles.select} {...rest} />
    )
}