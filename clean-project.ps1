# ========================================================================
# Script de Limpieza - Food Store Full Stack
# ========================================================================
# Ejecuta este script antes de empaquetar el proyecto en ZIP
# 
# Uso: 
# 1. Abre PowerShell en la carpeta C:\Users\Usuario\Desktop\Programacion IV\tp-7
# 2. Ejecuta: .\clean-project.ps1
#
# IMPORTANTE: Este script ELIMINA carpetas que se pueden regenerar
# Git, cambios locales y .git se eliminan - asegúrate de haber hecho commit primero!
# ========================================================================

Write-Host "🧹 Iniciando limpieza de proyecto Food Store..." -ForegroundColor Green
Write-Host ""

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde la raíz del proyecto (tp-7)" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Limpiando carpeta Frontend..." -ForegroundColor Yellow

# Limpiar node_modules del frontend
if (Test-Path "frontend\node_modules") {
    Write-Host "  Eliminando frontend/node_modules..." -ForegroundColor Gray
    Remove-Item "frontend\node_modules" -Recurse -Force
    Write-Host "  ✓ node_modules eliminado" -ForegroundColor Green
}

# Limpiar dist del frontend
if (Test-Path "frontend\dist") {
    Write-Host "  Eliminando frontend/dist..." -ForegroundColor Gray
    Remove-Item "frontend\dist" -Recurse -Force
    Write-Host "  ✓ dist eliminado" -ForegroundColor Green
}

# Limpiar .vscode si es local (no comprometer configuración)
if (Test-Path "frontend\.vscode") {
    Write-Host "  Eliminando frontend/.vscode..." -ForegroundColor Gray
    Remove-Item "frontend\.vscode" -Recurse -Force
    Write-Host "  ✓ .vscode eliminado" -ForegroundColor Green
}

# Limpiar .idea (JetBrains)
if (Test-Path "frontend\.idea") {
    Write-Host "  Eliminando frontend/.idea..." -ForegroundColor Gray
    Remove-Item "frontend\.idea" -Recurse -Force
    Write-Host "  ✓ .idea eliminado" -ForegroundColor Green
}

Write-Host ""
Write-Host "📁 Limpiando carpeta Backend..." -ForegroundColor Yellow

# Limpiar entorno virtual del backend
if (Test-Path "backend\.venv") {
    Write-Host "  Eliminando backend/.venv..." -ForegroundColor Gray
    Remove-Item "backend\.venv" -Recurse -Force
    Write-Host "  ✓ .venv eliminado" -ForegroundColor Green
}

# Limpiar __pycache__ en backend
$pycacheItems = Get-ChildItem -Path "backend" -Filter "__pycache__" -Recurse -Directory
if ($pycacheItems.Count -gt 0) {
    Write-Host "  Eliminando archivos __pycache__..." -ForegroundColor Gray
    Remove-Item @($pycacheItems) -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ __pycache__ eliminados" -ForegroundColor Green
}

# Limpiar archivos .pyc
$pycFiles = Get-ChildItem -Path "backend" -Filter "*.pyc" -Recurse
if ($pycFiles.Count -gt 0) {
    Write-Host "  Eliminando archivos .pyc..." -ForegroundColor Gray
    Remove-Item @($pycFiles) -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Archivos .pyc eliminados" -ForegroundColor Green
}

# Limpiar .vscode si es local
if (Test-Path "backend\.vscode") {
    Write-Host "  Eliminando backend/.vscode..." -ForegroundColor Gray
    Remove-Item "backend\.vscode" -Recurse -Force
    Write-Host "  ✓ .vscode eliminado" -ForegroundColor Green
}

# Limpiar .idea (JetBrains)
if (Test-Path "backend\.idea") {
    Write-Host "  Eliminando backend/.idea..." -ForegroundColor Gray
    Remove-Item "backend\.idea" -Recurse -Force
    Write-Host "  ✓ .idea eliminado" -ForegroundColor Green
}

# Limpiar test.db si existe
if (Test-Path "backend\test.db") {
    Write-Host "  Eliminando backend/test.db..." -ForegroundColor Gray
    Remove-Item "backend\test.db" -Force
    Write-Host "  ✓ test.db eliminado (se regenerará en primera ejecución)" -ForegroundColor Green
}

Write-Host ""
Write-Host "📁 Limpiando raíz del proyecto..." -ForegroundColor Yellow

# Limpiar carpeta anterior
if (Test-Path "tp6_Programacion4") {
    Write-Host "  Eliminando tp6_Programacion4..." -ForegroundColor Gray
    Remove-Item "tp6_Programacion4" -Recurse -Force
    Write-Host "  ✓ Carpeta anterior eliminada" -ForegroundColor Green
}

# Limpiar archivos ZIP antiguos
$zipFiles = Get-ChildItem -Path "." -Filter "*.zip" -ErrorAction SilentlyContinue
if ($zipFiles.Count -gt 0) {
    Write-Host "  Eliminando archivos ZIP antiguos..." -ForegroundColor Gray
    Remove-Item @($zipFiles) -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ ZIP antiguos eliminados" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ LIMPIEZA COMPLETADA" -ForegroundColor Green
Write-Host ""

# Calcular tamaño aproximado
$backendSize = (Get-ChildItem -Path "backend" -Recurse -Force | Measure-Object -Property Length -Sum).Sum / 1MB
$frontendSize = (Get-ChildItem -Path "frontend" -Recurse -Force | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "📊 Tamaño estimado del proyecto:" -ForegroundColor Cyan
Write-Host "   Backend:  ~$([math]::Round($backendSize, 2)) MB" -ForegroundColor Gray
Write-Host "   Frontend: ~$([math]::Round($frontendSize, 2)) MB" -ForegroundColor Gray
Write-Host "   Total:    ~$([math]::Round($backendSize + $frontendSize, 2)) MB" -ForegroundColor Gray

Write-Host ""
Write-Host "🚀 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Verificar que el proyecto funciona:"
Write-Host "      - Backend: cd backend && fastapi dev app/main.py"
Write-Host "      - Frontend: cd frontend && npm install && npm run dev"
Write-Host ""
Write-Host "   2. Comprimir el proyecto:"
Write-Host "      - Click derecho en tp-7 → Enviar a → Carpeta comprimida (ZIP)"
Write-Host "      - Renombrar como TP7_FoodStore_[TuNombre].zip"
Write-Host ""
Write-Host "   3. Verificar que el ZIP se puede descomprimir sin errores"
Write-Host ""
