// app/lib/utils.ts

import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

/**
 * クラス名を結合し、Tailwind CSSのクラスを適切にマージする関数
 *
 * @param {...ClassValue[]} inputs - 結合するクラス名。クラス名の配列、オブジェクト、または文字列を渡すことができる。
 * @returns {string} - マージされたクラス名の文字列
 *
 * @example
 * ```
 * cn('bg-red-500', 'text-white', 'hover:bg-red-700');
 * // => 'bg-red-500 text-white hover:bg-red-700'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
    // clsxでクラス名を結合し、twMergeでTailwind CSSクラスの競合を解決して返す
    return twMerge(clsx(inputs));
}
