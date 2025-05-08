$ErrorActionPreference = "Stop"

# Create directory if it doesn't exist
$imagesDir = ".\public\assets\games"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force
}

# Define the game images to download with more reliable sources
$gameImages = @(
    @{
        Name = "valorant.jpg"
        Url = "https://www.riotgames.com/darkroom/1440/d0807e131a84f2e42c7a303bda672789:3d02afa7e0bfb75f645d97467765b24c/valorant-offwhitelaunch-keyart.jpg"
    },
    @{
        Name = "world-of-warcraft.jpg"
        Url = "https://www.gamespot.com/a/uploads/original/1179/11799911/3383839-wow.jpg"
    }
)

# Download each image
foreach ($image in $gameImages) {
    $outputPath = Join-Path $imagesDir $image.Name
    Write-Host "Downloading $($image.Name) to $outputPath"
    
    try {
        Invoke-WebRequest -Uri $image.Url -OutFile $outputPath
        Write-Host "Successfully downloaded $($image.Name)" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download $($image.Name): $_" -ForegroundColor Red
    }
}

Write-Host "All downloads completed!" -ForegroundColor Cyan
