import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/ShopEasy/',
    plugins: [react()],
})

/*
* NOTA: Éste archivo de configuración es necesario para el deploy de GitHub Pages.
*/