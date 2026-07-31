# Quick Holidays - Standalone Video Compressor Script
# This script automatically downloads FFmpeg and optimizes raw client reviews for web streaming.

$ErrorActionPreference = "Stop"

# Create a bin folder for the static FFmpeg binary
$binDir = Join-Path $PSScriptRoot "bin"
if (!(Test-Path $binDir)) {
    New-Item -ItemType Directory -Path $binDir | Out-Null
}

$ffmpegExe = Join-Path $binDir "ffmpeg.exe"

# If FFmpeg isn't present, download the essentials build
if (!(Test-Path $ffmpegExe)) {
    Write-Host "--------------------------------------------------------" -ForegroundColor Gold
    Write-Host "FFmpeg converter utility not found."
    Write-Host "Downloading standalone FFmpeg binary (approx. 60MB)..." -ForegroundColor Cyan
    Write-Host "This is a one-time download."
    Write-Host "--------------------------------------------------------"

    $zipUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
    $zipPath = Join-Path $binDir "ffmpeg.zip"
    $extractPath = Join-Path $binDir "temp_extract"

    Write-Host "Downloading from gyan.dev..."
    Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UserAgent "Mozilla/5.0"

    Write-Host "Extracting archive..." -ForegroundColor Cyan
    Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

    # Find the nested ffmpeg.exe inside the extracted folder
    $extractedExe = Get-ChildItem -Path $extractPath -Filter "ffmpeg.exe" -Recurse | Select-Object -First 1
    if ($extractedExe) {
        Copy-Item -Path $extractedExe.FullName -Destination $ffmpegExe -Force
        Write-Host "Standalone FFmpeg successfully installed locally!" -ForegroundColor Green
    } else {
        throw "Could not locate ffmpeg.exe in the downloaded archive."
    }

    # Clean up temporary files
    Remove-Item -Path $zipPath -Force | Out-Null
    Remove-Item -Path $extractPath -Recurse -Force | Out-Null
}

Write-Host "`n========================================================" -ForegroundColor Gold
Write-Host "       Quick Holidays - Web Video Testimonial Optimizer" -ForegroundColor Gold
Write-Host "========================================================"

# Prompt for video input
$inputPath = Read-Host "Drag and drop your raw video file (.mp4, .mov, etc.) here, then press Enter"
# Strip any leading/trailing quotes added by drag and drop
$inputPath = $inputPath.Trim().Trim('"').Trim("'")

if (!(Test-Path $inputPath)) {
    Write-Host "Error: The specified file does not exist at path: $inputPath" -ForegroundColor Red
    Exit
}

$inputItem = Get-Item $inputPath
$dir = $inputItem.DirectoryName
$baseName = $inputItem.BaseName
$ext = $inputItem.Extension

$outputPath = Join-Path $dir "$($baseName)_optimized$ext"

Write-Host "`nOptimizing video..." -ForegroundColor Cyan
Write-Host "Input size: $(([Math]::Round($inputItem.Length / 1MB, 2))) MB"

# Run FFmpeg optimization:
# -vf "scale=720:-2": Resize width to 720px, height auto (keeping aspect ratio, must be divisible by 2)
# -c:v libx264 -crf 24: H.264 video codec with quality target 24 (excellent balance)
# -preset fast: Faster compression speed
# -c:a aac -b:a 128k: High-quality AAC audio format at 128kbps
# -y: Overwrite output if exists
& $ffmpegExe -y -i $inputPath -vf "scale=720:-2" -c:v libx264 -crf 24 -preset fast -c:a aac -b:a 128k $outputPath

if (Test-Path $outputPath) {
    $outputItem = Get-Item $outputPath
    Write-Host "`nSuccess! Optimized video saved to:" -ForegroundColor Green
    Write-Host $outputPath -ForegroundColor Yellow
    Write-Host "Original size:  $(([Math]::Round($inputItem.Length / 1MB, 2))) MB"
    Write-Host "Optimized size: $(([Math]::Round($outputItem.Length / 1MB, 2))) MB" -ForegroundColor Green
    Write-Host "Compression:    $(([Math]::Round((1 - ($outputItem.Length / $inputItem.Length)) * 100, 1)))% reduction!" -ForegroundColor Cyan
    Write-Host "`nYou can now upload this optimized file directly to Supabase Storage!" -ForegroundColor Gold
} else {
    Write-Host "Error: Video optimization failed." -ForegroundColor Red
}

Write-Host "`nPress any key to exit..."
[void]$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
