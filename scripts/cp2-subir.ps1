# Script de criação/subida: rede, volume e containers via Docker Compose (Nickolas Davi, RM 564105)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
docker compose up -d --build
Write-Host "Pronto. API: http://localhost:3000 — Postgres: localhost:5432" -ForegroundColor Green
