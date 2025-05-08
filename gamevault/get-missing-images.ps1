$ErrorActionPreference = "Stop"

# Create directory if it doesn't exist
$imagesDir = ".\public\assets\games"
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force
}

# Define the missing game images with reliable sources
$gameImages = @(
    @{
        Name = "valorant.jpg"
        Url = "https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg"
    },
    @{
        Name = "world-of-warcraft.jpg"
        Url = "https://images.pexels.com/photos/7919/pexels-photo.jpg"
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
