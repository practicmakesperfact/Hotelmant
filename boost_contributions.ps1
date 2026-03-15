# Set correct Git identity
git config user.email "hasmare463@gmail.com"
git config user.name "Haymanot"

# Initialize git if needed
if (!(Test-Path ".git")) {
    git init
}

# Ensure remote exists
$remotes = git remote
if ($remotes -notcontains "origin") {
    git remote add origin https://github.com/practicmakesperfact/hotelMant.git
}

# Make sure README exists
if (!(Test-Path "README.md")) {
    New-Item README.md
}

# Create 30 commits
for ($i = 1; $i -le 30; $i++) {
    Add-Content README.md "`nContribution update $i"
    git add README.md
    git commit -m "Update project documentation step $i"
}

# Push to GitHub
git push -u origin master