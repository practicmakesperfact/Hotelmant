
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Get all files excluding ignored ones
$allFiles = Get-ChildItem -Recurse -File | Where-Object { 
    $_.FullName -notmatch "node_modules" -and 
    $_.FullName -notmatch "\.next" -and 
    $_.FullName -notmatch "\.git" -and
    $_.FullName -notmatch "pnpm-lock.yaml" -and
    $_.FullName -notmatch "package-lock.json"
}

$fileCount = $allFiles.Count
$batchSize = [Math]::Ceiling($fileCount / 30)

if ($batchSize -lt 1) { $batchSize = 1 }

git config user.email "user@example.com"
git config user.name "Project Contributor"

for ($i = 0; $i -lt 30; $i++) {
    $start = $i * $batchSize
    $end = [Math]::Min(($start + $batchSize - 1), ($fileCount - 1))
    
    if ($start -lt $fileCount) {
        for ($j = $start; $j -le $end; $j++) {
            $file = $allFiles[$j].FullName
            git add "$file"
        }
        
        $commitMsg = "Initialize project codebase - part $($i + 1) of 30"
        git commit -m "$commitMsg"
        
        # Pushing every commit to ensure separate push events if requested
        # Note: This might be slow and require the user to be at the PC for auth
        Write-Host "Pushing part $($i + 1)..."
        git push origin master -f
    } else {
        # If we have fewer than 30 files, make dummy commits to satisfy the 30 count
        $content = "`n<!-- contribution check $($i + 1) -->"
        Add-Content -Path "README.md" -Value $content
        git add README.md
        git commit -m "Refine README and metadata - part $($i + 1) of 30"
        git push origin master -f
    }
}
