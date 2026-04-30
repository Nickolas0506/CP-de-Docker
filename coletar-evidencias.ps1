# Evidências — equipe Arquitetura DimDim + prints do PDF (ps, images, volumes, networks)
$ErrorActionPreference = "Continue"
$compose = Join-Path $PSScriptRoot "docker-compose.yml"
$app = "dimdim-app-564105"
$net = "dimdim-net"
$vol = "dimdim_pgdata_564105"

$outDir = Join-Path $PSScriptRoot "evidencias"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$ts = Get-Date -Format "yyyyMMdd-HHmmss"

function Save-Cmd {
    param([string]$Name, [string]$Command)
    $path = Join-Path $outDir "$Name-$ts.txt"
    "--- Comando: $Command ---`n" | Out-File -FilePath $path -Encoding utf8
    try {
        Invoke-Expression $Command 2>&1 | Out-File -FilePath $path -Append -Encoding utf8
    } catch {
        $_ | Out-File -FilePath $path -Append -Encoding utf8
    }
    Write-Host "Salvo: $path"
}

Write-Host "=== Evidências — Nickolas Davi RM 564105 ===" -ForegroundColor Cyan

Save-Cmd "01-docker-version" "docker version"
Save-Cmd "02-docker-compose-version" "docker compose version"
Save-Cmd "03-compose-config" "docker compose -f `"$compose`" config"
Save-Cmd "04-docker-ps" "docker ps -a"
Save-Cmd "05-docker-image-ls" "docker image ls"
Save-Cmd "06-docker-volume-ls" "docker volume ls"
Save-Cmd "07-docker-network-ls" "docker network ls"
Save-Cmd "08-compose-ps" "docker compose -f `"$compose`" ps -a"
Save-Cmd "09-exec-app-health" "docker exec $app wget -qO- http://127.0.0.1:3000/health 2>&1"
Save-Cmd "10-exec-app-hosts-db" "docker exec $app getent hosts db 2>&1"
Save-Cmd "11-inspect-network" "docker network inspect $net 2>&1"
Save-Cmd "12-inspect-volume" "docker volume inspect $vol 2>&1"

Write-Host "`nPasta: $outDir" -ForegroundColor Green
