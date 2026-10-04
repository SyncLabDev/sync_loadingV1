param(
    [string]$Version = '1.0.0',
    [switch]$SkipChecks
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$releaseRoot = Join-Path $projectRoot 'release'
$stageRoot = Join-Path $releaseRoot 'sync_loading'
$archivePath = Join-Path $releaseRoot "sync_loading-v$Version.zip"
$checksumPath = "$archivePath.sha256"

Push-Location $projectRoot
try {
    if (-not $SkipChecks) {
        & corepack pnpm --dir web build
        if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed.' }

        & corepack pnpm --dir web test
        if ($LASTEXITCODE -ne 0) { throw 'Unit tests failed.' }

        & corepack pnpm --dir web lint
        if ($LASTEXITCODE -ne 0) { throw 'Lint checks failed.' }

        & corepack pnpm --dir web check:lua
        if ($LASTEXITCODE -ne 0) { throw 'Lua checks failed.' }

        & corepack pnpm --dir web check:package
        if ($LASTEXITCODE -ne 0) { throw 'Production package checks failed.' }
    }

    if (Test-Path -LiteralPath $stageRoot) { Remove-Item -LiteralPath $stageRoot -Recurse -Force }
    if (Test-Path -LiteralPath $archivePath) { Remove-Item -LiteralPath $archivePath -Force }
    if (Test-Path -LiteralPath $checksumPath) { Remove-Item -LiteralPath $checksumPath -Force }

    New-Item -ItemType Directory -Path $stageRoot -Force | Out-Null

    foreach ($directory in @('client', 'server', 'docs')) {
        Copy-Item -LiteralPath (Join-Path $projectRoot $directory) -Destination $stageRoot -Recurse
    }

    $webStage = Join-Path $stageRoot 'web'
    New-Item -ItemType Directory -Path $webStage -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $projectRoot 'web/dist') -Destination $webStage -Recurse

    foreach ($file in @('config.lua', 'fxmanifest.lua', 'LICENSE.md', 'README.md')) {
        Copy-Item -LiteralPath (Join-Path $projectRoot $file) -Destination $stageRoot
    }

    Compress-Archive -LiteralPath $stageRoot -DestinationPath $archivePath -CompressionLevel Optimal
    $hash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
    Set-Content -LiteralPath $checksumPath -Value "$hash  $(Split-Path -Leaf $archivePath)" -Encoding ascii

    Write-Host "Release created: $archivePath"
    Write-Host "SHA-256: $hash"
}
finally {
    Pop-Location
}
