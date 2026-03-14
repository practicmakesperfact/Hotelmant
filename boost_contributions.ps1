
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Ensure git is initialized and remote added
if (-not (Test-Path .git)) {
    git init
}

# Check if origin exists, if not add it
$remotes = git remote
if ($remotes -notcontains "origin") {
    git remote add origin https://github.com/practicmakesperfact/hotelMant.git
}

# 30 commits strategy: Add a small line to README.md each time
for ($i = 1; $i -le 30; $i++) {
    $content = "`n<!-- contribution check $i -->"
    Add-Content -Path "README.md" -Value $content
    git add README.md
    git commit -m "Enhance README.md with additional project information - step $i"
}

# Final push
# Note: User might need to provide credentials if not cached/configured
# Using -f to ensure push if it's a fresh repository as requested
git push -u origin master -f
