{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Read",
      "Bash(ls *)",
      "Bash(npx *)",
      "Bash(cat *)",
      "Bash(head *)",
      "Bash(tail *)",
      "Bash(wc *)",
      "Bash(find *)",
      "Bash(grep *)",
      "Bash(echo *)",
      "Bash(mkdir *)",
      "Bash(git status)",
      "Bash(git log *)",
      "Bash(git diff *)",
      "Bash(git branch *)",
      "Bash(git show *)",
      "Bash(node --version)",
      "Bash(npm --version)",
      "Bash(npm install:*)",
      "Bash(pkill:*)",
      "Bash(npm run:*)",
      "Bash(npm show:*)",
      "mcp__chrome-devtools__navigate_page",
      "mcp__chrome-devtools__wait_for",
      "mcp__chrome-devtools__take_screenshot",
      "mcp__chrome-devtools__list_console_messages",
      "mcp__chrome-devtools__click",
      "mcp__chrome-devtools__evaluate_script",
      "Bash(npx tsc --noEmit)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Read(./.env*)",
      "Read(./secrets/**)",
      "Read(./**/credentials*)",
      "Edit(./.env*)",
      "Edit(./secrets/**)",
      "WebFetch"
    ]
  }
}
