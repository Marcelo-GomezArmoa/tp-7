#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verificador de Proyecto - Food Store Full Stack
Verifica que el proyecto esta listo para entrega
"""

import os
import sys
from pathlib import Path

class Verificador:
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.success = []
        self.root = Path.cwd()

    def check_file_exists(self, path: str, name: str = None) -> bool:
        """Verifica que un archivo existe"""
        name = name or path
        full_path = self.root / path
        if full_path.exists():
            self.success.append(f"[OK] {name}")
            return True
        else:
            self.errors.append(f"[FALTA] {name}")
            return False

    def check_folder_exists(self, path: str, name: str = None) -> bool:
        """Verifica que una carpeta existe"""
        name = name or path
        full_path = self.root / path
        if full_path.is_dir():
            self.success.append(f"[OK] Carpeta {name}/")
            return True
        else:
            self.errors.append(f"[FALTA] Carpeta: {name}/")
            return False

    def check_folder_not_exists(self, path: str, name: str = None) -> bool:
        """Verifica que una carpeta NO existe (para limpieza)"""
        name = name or path
        full_path = self.root / path
        if not full_path.exists():
            self.success.append(f"[OK] {name}/ no presente (limpio)")
            return True
        else:
            self.warnings.append(f"[PRESENTE] {name}/ debe ser eliminado antes de ZIP")
            return False

    def run(self):
        """Ejecuta todas las verificaciones"""
        print("=" * 70)
        print("VERIFICADOR DE PROYECTO - Food Store Full Stack")
        print("=" * 70)
        print()

        # 1. Archivos documentacion
        print("DOCUMENTACION")
        print("-" * 70)
        self.check_file_exists("README.md")
        self.check_file_exists("ENTREGA_ACADEMICA.md")
        self.check_file_exists("RESUMEN_EJECUTIVO.md")
        self.check_file_exists("API_ENDPOINTS_REFERENCE.py")
        self.check_file_exists("clean-project.ps1")
        self.check_file_exists("backend/.env.example")
        print()

        # 2. Backend
        print("BACKEND (Python)")
        print("-" * 70)
        self.check_folder_exists("backend/app")
        self.check_folder_exists("backend/app/core")
        self.check_folder_exists("backend/app/categoria")
        self.check_folder_exists("backend/app/producto")
        
        self.check_file_exists("backend/app/main.py")
        self.check_file_exists("backend/app/core/database.py")
        self.check_file_exists("backend/app/categoria/model.py")
        self.check_file_exists("backend/app/categoria/schema.py")
        self.check_file_exists("backend/app/categoria/service.py")
        self.check_file_exists("backend/app/categoria/router.py")
        self.check_file_exists("backend/app/producto/model.py")
        self.check_file_exists("backend/app/producto/schema.py")
        self.check_file_exists("backend/app/producto/service.py")
        self.check_file_exists("backend/app/producto/router.py")
        self.check_file_exists("backend/requirements.txt")
        
        # Verificar que NO existen carpetas que deben ser limpias
        self.check_folder_not_exists("backend/.venv", "backend/.venv")
        self.check_folder_not_exists("backend/__pycache__", "backend/__pycache__")
        print()

        # 3. Frontend
        print("FRONTEND (React + TypeScript)")
        print("-" * 70)
        self.check_folder_exists("frontend/src")
        self.check_folder_exists("frontend/src/types")
        self.check_folder_exists("frontend/src/services")
        self.check_folder_exists("frontend/src/components")
        self.check_folder_exists("frontend/src/pages")
        
        self.check_file_exists("frontend/src/main.tsx")
        self.check_file_exists("frontend/src/App.tsx")
        self.check_file_exists("frontend/src/types/categoria.ts")
        self.check_file_exists("frontend/src/types/producto.ts")
        self.check_file_exists("frontend/src/services/api.ts")
        self.check_file_exists("frontend/src/services/categoriaService.ts")
        self.check_file_exists("frontend/src/services/productoService.ts")
        self.check_file_exists("frontend/src/components/Navbar.tsx")
        self.check_file_exists("frontend/src/pages/HomePage.tsx")
        self.check_file_exists("frontend/src/pages/CategoriasPage.tsx")
        self.check_file_exists("frontend/src/pages/ProductsPage.tsx")
        
        self.check_file_exists("frontend/package.json")
        self.check_file_exists("frontend/tsconfig.app.json")
        self.check_file_exists("frontend/vite.config.ts")
        self.check_file_exists("frontend/tailwind.config.js")
        
        # Verificar que NO existen carpetas que deben ser limpias
        self.check_folder_not_exists("frontend/node_modules", "frontend/node_modules")
        self.check_folder_not_exists("frontend/dist", "frontend/dist")
        print()

        # 4. Resumen
        print("=" * 70)
        print("RESUMEN")
        print("=" * 70)
        print("Verificaciones exitosas:  {}".format(len(self.success)))
        print("Advertencias:             {}".format(len(self.warnings)))
        print("Errores encontrados:      {}".format(len(self.errors)))
        print()

        if self.errors:
            print("ERRORES (deben ser arreglados):")
            for error in self.errors:
                print("   {}".format(error))
            print()

        if self.warnings:
            print("ADVERTENCIAS (limpiar antes de ZIP):")
            for warning in self.warnings:
                print("   {}".format(warning))
            print()
            print("   Ejecutar: .\\clean-project.ps1")
            print()

        # Veredicto
        print("=" * 70)
        if not self.errors:
            if not self.warnings:
                print("PROYECTO LISTO PARA ENTREGA")
                print("=" * 70)
                return 0
            else:
                print("PROYECTO CASI LISTO (ejecutar limpieza)")
                print("=" * 70)
                return 0
        else:
            print("PROYECTO NO LISTO (arreglar errores primero)")
            print("=" * 70)
            return 1

if __name__ == "__main__":
    verificador = Verificador()
    sys.exit(verificador.run())
