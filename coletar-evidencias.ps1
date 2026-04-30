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
    "--- $Command ---`n" | Out-File -FilePath $path -Encoding utf8
    try {
        Invoke-Expression $Command 2>&1 | Out-File -FilePath $path -Append -Encoding utf8
    } catch {
        $_ | Out-File -FilePath $path -Append -Encoding utf8
    }
}

Save-Cmd "docker-version" "docker version"
Save-Cmd "compose-config" "docker compose -f `"$compose`" config"
Save-Cmd "docker-ps" "docker ps -a"
Save-Cmd "docker-images" "docker image ls"
Save-Cmd "docker-volumes" "docker volume ls"
Save-Cmd "docker-networks" "docker network ls"
Save-Cmd "compose-ps" "docker compose -f `"$compose`" ps -a"
Save-Cmd "curl-app" "docker exec $app wget -qO- http://127.0.0.1:3000/ 2>&1"
Save-Cmd "hosts-db" "docker exec $app getent hosts db 2>&1"
Save-Cmd "inspect-net" "docker network inspect $net 2>&1"
Save-Cmd "inspect-vol" "docker volume inspect $vol 2>&1"
