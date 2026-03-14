
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Reset git to ensure a clean 30-commit history as requested
if (Test-Path .git) {
    Remove-Item -Path .git -Recurse -Force
}
git init
git remote add origin https://github.com/practicmakesperfact/hotelMant.git
git config user.email "user@example.com"
git config user.name "Project Contributor"

# Get all files and filter them using .gitignore patterns manually to be safe for the list
# but git add will also respect .gitignore.
$allFiles = Get-ChildItem -Recurse -File | Where-Object { 
    $_.FullName -notmatch "node_modules" -and 
    $_.FullName -notmatch "\\\.next\\" -and 
    $_.FullName -notmatch "\\\.git\\" -and
    $_.FullName -notmatch "pnpm-lock.yaml" -and
    $_.FullName -notmatch "package-lock.json" -and
    $_.Name -ne ".env" -and
    $_.Name -notmatch "^\.env\."
}

$fileCount = $allFiles.Count
Write-Host "Total files to process: $fileCount"

# We want exactly 30 commits.
# We'll partition the files into 29 batches, and the 30th will be any remaining + final checks.
$batchSize = [Math]::Max(1, [Math]::Floor($fileCount / 30))

for ($i = 0; $i -lt 30; $i++) {
    $commitNum = $i + 1
    Write-Host "Preparing batch $commitNum of 30..."
    
    if ($i -lt 29) {
        $start = $i * $batchSize
        $end = $start + $batchSize - 1
        
        if ($start -lt $fileCount) {
            for ($j = $start; $j -le [Math]::Min($end, $fileCount - 1); $j++) {
                $file = $allFiles[$j].FullName
                git add "$file"
            }
        }
    } else {
        # Last batch: add everything else (Git will respect .gitignore)
        git add .
    }
    
    # Ensure there's something to commit (add a small comment to README if batch was empty)
    $status = git status --porcelain
    if (-not $status) {
        Add-Content -Path "README.md" -Value "`n<!-- contribution check $commitNum -->"
        git add README.md
    }

    git commit -m "Deploy Hotel Management System - Part $commitNum of 30"
    
    Write-Host "Pushing batch $commitNum..."
    # Note: This will prompt for credentials if not saved.
    git push origin master -f
}
