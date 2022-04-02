import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import { resolve } from "path";

const isProduction = !process.env.ROLLUP_WATCH;

const OUTDIR = resolve(__dirname, '../public/lib/playground-hooks.js');
const INPUT = resolve(__dirname, 'playground-hooks/index.ts');

const dev = {
    file: OUTDIR,
    format: 'iife',
}

const production = {
    file: OUTDIR,
    format: 'iife',
    plugins: [
        terser(),
    ],
}

export default {
    input: INPUT,
    output: isProduction ? production : dev,
    plugins: [
        nodeResolve(),
        typescript({ compilerOptions: {lib: ["DOM", "DOM.Iterable", "es5"], target: "es5"}}),
        commonjs(),
    ],
}