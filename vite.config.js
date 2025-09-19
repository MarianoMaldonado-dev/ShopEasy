/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/ShopEasy/',
    plugins: [react()],
})*/

/*
* NOTA: Éste archivo de configuración es necesario para el deploy de GitHub Pages.
*/

/* Esta siguiente configuración es para que no dé error al intentar lanzar el proyecto en local */import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: process.env.NODE_ENV === 'production' ? '/ShopEasy/' : '/'
})