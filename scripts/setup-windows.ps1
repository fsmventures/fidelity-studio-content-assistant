# Fidelity Studio Content Assistant - Windows installer
#
# This script only prepares Codex, Git, and the public plugin. Account sign-ins
# remain separate so that each OAuth callback can finish before the next one
# starts.

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$MarketplaceName = "fidelity-studio-content-assistant"
$MarketplaceSource = "fsmventures/fidelity-studio-content-assistant"
$PluginSelector = "fidelity-studio-content-assistant@fidelity-studio-content-assistant"
$ExpectedPluginVersion = "0.4.1"
$StandaloneCodex = Join-Path $env:LOCALAPPDATA "Programs\OpenAI\Codex\bin\codex.exe"

function Write-Step {
    param([Parameter(Mandatory = $true)][string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Refresh-ProcessPath {
    $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    $paths = @($machinePath, $userPath) | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    $env:Path = $paths -join [IO.Path]::PathSeparator
}

function Invoke-Checked {
    param(
        [Parameter(Mandatory = $true)][string]$Executable,
        [Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments
    )

    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code $LASTEXITCODE`: $Executable $($Arguments -join ' ')"
    }
}

function Test-CodexExecutable {
    param([Parameter(Mandatory = $true)][string]$Path)

    if ($Path -match "(?i)\\WindowsApps\\") {
        return $false
    }
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        return $false
    }

    try {
        & $Path --version | Out-Null
        return $LASTEXITCODE -eq 0
    }
    catch [System.UnauthorizedAccessException] {
        return $false
    }
    catch {
        if ($_.Exception.Message -match "(?i)access.*denied|zugriff.*verweigert") {
            return $false
        }
        throw
    }
}

if ($env:OS -ne "Windows_NT") {
    throw "This bootstrap is only for native Windows. Use the manual Codex plugin commands on macOS or Linux."
}

if ([Environment]::Is64BitOperatingSystem -and -not [Environment]::Is64BitProcess) {
    throw "Run this setup in 64-bit Windows PowerShell. Do not run it through WSL or 32-bit PowerShell."
}

Write-Step "Checking for an executable Codex CLI outside WindowsApps"
$resolvedCodex = $null
$codexCommand = Get-Command codex.exe -ErrorAction SilentlyContinue | Select-Object -First 1
if ($codexCommand) {
    $candidate = $codexCommand.Source
    if (Test-CodexExecutable -Path $candidate) {
        $resolvedCodex = (Resolve-Path -LiteralPath $candidate).Path
    }
    elseif ($candidate -match "(?i)\\WindowsApps\\") {
        Write-Warning "The packaged Codex executable is protected by WindowsApps and cannot be used for setup. Approval mode or sandbox elevation does not repair this file ACL."
    }
}

if (-not $resolvedCodex -and (Test-CodexExecutable -Path $StandaloneCodex)) {
    $resolvedCodex = (Resolve-Path -LiteralPath $StandaloneCodex).Path
}

if (-not $resolvedCodex) {
    Write-Step "Installing the official standalone Codex CLI"
    $installer = Invoke-RestMethod -Uri "https://chatgpt.com/codex/install.ps1"
    Invoke-Expression $installer
    Refresh-ProcessPath

    if (-not (Test-CodexExecutable -Path $StandaloneCodex)) {
        throw "The official installer completed, but Codex was not executable at $StandaloneCodex. Stop here and report this exact path; do not install Node/npm or change the PowerShell execution policy."
    }
    $resolvedCodex = (Resolve-Path -LiteralPath $StandaloneCodex).Path
}

if ($resolvedCodex -match "(?i)\\WindowsApps\\") {
    throw "Refusing to continue with the protected WindowsApps Codex executable: $resolvedCodex"
}
Write-Host "Codex CLI: $resolvedCodex"
Invoke-Checked $resolvedCodex --version

Write-Step "Checking Git for the repository-backed plugin marketplace"
$gitCommand = Get-Command git.exe -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $gitCommand) {
    $winget = Get-Command winget.exe -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $winget) {
        throw "Git is required for this owner/repo marketplace, and winget is unavailable. Install Git for Windows, then run this bootstrap again."
    }

    Invoke-Checked $winget.Source install --id Git.Git --exact --source winget --accept-package-agreements --accept-source-agreements --silent
    Refresh-ProcessPath
    $gitCommand = Get-Command git.exe -ErrorAction SilentlyContinue | Select-Object -First 1

    if (-not $gitCommand) {
        $gitCandidates = @(
            (Join-Path $env:ProgramFiles "Git\cmd\git.exe"),
            (Join-Path $env:LOCALAPPDATA "Programs\Git\cmd\git.exe")
        )
        if (${env:ProgramFiles(x86)}) {
            $gitCandidates += Join-Path ${env:ProgramFiles(x86)} "Git\cmd\git.exe"
        }
        $installedGit = $gitCandidates | Where-Object {
            Test-Path -LiteralPath $_ -PathType Leaf
        } | Select-Object -First 1
        if ($installedGit) {
            $gitDirectory = Split-Path -Parent $installedGit
            $env:Path = "$gitDirectory$([IO.Path]::PathSeparator)$env:Path"
            $gitCommand = Get-Command git.exe -ErrorAction SilentlyContinue | Select-Object -First 1
        }
    }
}

if (-not $gitCommand) {
    throw "Git for Windows was installed but is not visible in this process. Stop here and report the Git path instead of retrying the marketplace command."
}
Write-Host "Git: $($gitCommand.Source)"
Invoke-Checked $gitCommand.Source --version

Write-Step "Adding or refreshing the Fidelity Studio marketplace"
$marketplacesRaw = & $resolvedCodex plugin marketplace list --json
if ($LASTEXITCODE -ne 0) {
    throw "Could not list Codex plugin marketplaces."
}
$marketplaces = $marketplacesRaw | ConvertFrom-Json
$hasMarketplace = @($marketplaces.marketplaces) | Where-Object { $_.name -eq $MarketplaceName }

if ($hasMarketplace) {
    $source = $hasMarketplace.marketplaceSource.source
    if ($source -and $source -notmatch "(?i)fsmventures/fidelity-studio-content-assistant(?:\.git)?$") {
        throw "The configured $MarketplaceName marketplace points to an unexpected source: $source"
    }
    Invoke-Checked $resolvedCodex plugin marketplace upgrade $MarketplaceName --json
}
else {
    Invoke-Checked $resolvedCodex plugin marketplace add $MarketplaceSource --ref main --json
}

Write-Step "Installing a fresh copy of the plugin"
$pluginListRaw = & $resolvedCodex plugin list --marketplace $MarketplaceName --json
if ($LASTEXITCODE -ne 0) {
    throw "Could not inspect the Fidelity Studio plugin marketplace."
}
$pluginList = $pluginListRaw | ConvertFrom-Json
$installed = @($pluginList.installed) | Where-Object { $_.pluginId -eq $PluginSelector -and $_.installed }
if ($installed) {
    Invoke-Checked $resolvedCodex plugin remove $PluginSelector --json
}
Invoke-Checked $resolvedCodex plugin add $PluginSelector --json

Write-Step "Verifying the installed plugin and MCP registrations"
$verifiedPluginRaw = & $resolvedCodex plugin list --marketplace $MarketplaceName --json
if ($LASTEXITCODE -ne 0) {
    throw "Could not verify the installed Fidelity Studio plugin."
}
$verifiedPlugin = $verifiedPluginRaw | ConvertFrom-Json
$plugin = @($verifiedPlugin.installed) | Where-Object {
    $_.pluginId -eq $PluginSelector -and $_.installed -and $_.enabled
} | Select-Object -First 1
if (-not $plugin) {
    throw "The Fidelity Studio plugin is not installed and enabled after setup."
}
if ($plugin.version -ne $ExpectedPluginVersion) {
    throw "Expected plugin version $ExpectedPluginVersion, but Codex reports $($plugin.version). Stop here and report the stale plugin cache."
}

$mcpRaw = & $resolvedCodex mcp list --json
if ($LASTEXITCODE -ne 0) {
    throw "Could not verify MCP registrations."
}
$mcpServers = @($mcpRaw | ConvertFrom-Json)
foreach ($serverName in @("fidelity-studio-content-assistant", "resend")) {
    $server = $mcpServers | Where-Object { $_.name -eq $serverName -and $_.enabled } | Select-Object -First 1
    if (-not $server) {
        throw "The $serverName MCP registration is missing or disabled."
    }
}

Write-Host "`nSetup completed." -ForegroundColor Green
Write-Host "Plugin version: $($plugin.version) (verified)"
Write-Host "Codex CLI: $resolvedCodex"
Write-Host "Start exactly one Fidelity Studio login next:"
Write-Host "  `"$resolvedCodex`" mcp login fidelity-studio-content-assistant"
Write-Host "Wait for its browser callback to finish. Do not start Resend login yet."
Write-Host "After Fidelity succeeds, start a fresh ChatGPT Work task, load get_project_context, and only connect Resend if that context explicitly declares newsletter provider Resend."
