import { debounce } from "../utils";
import { useRef } from 'react';

export default function useDebounce(callback: (...args: any[]) => void, delay: number = 400) {
	return useRef(debounce(callback, delay)).current;
}