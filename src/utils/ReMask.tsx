import { toPattern } from 'vanilla-masker';

export const unMask = (value:string) => value.replace(/\W/g, '');

const masker = (value: string, pattern: string) =>
	toPattern(value, { pattern })

const multimasker = (value: string, patterns: string[]) =>
	masker(
		value,
		patterns.reduce(
			(memo, pattern) => (value.length <= unMask(memo).length ? memo : pattern),
			patterns[0]
		)
	)

export const mask = (value: string, pattern: string | string[]) =>
	typeof pattern === 'string'
		? masker(value, pattern || '')
		: multimasker(value, pattern)