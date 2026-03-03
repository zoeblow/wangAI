# Release Checklist

## Pre-check

1. Confirm npm auth:
```bash
npm whoami
```

2. Run CLI smoke test:
```bash
node ./bin/wangai.js --help
node ./bin/wangai.js init --workflow all --stack next --router y --ts y --eslint y --state redux --git-exclude n --yes
```

3. Check publish payload:
```bash
npm pack --dry-run
```

4. Optional security check:
```bash
npm audit
```

## Version & publish

1. Optional manual changelog section creation:
```bash
npm run changelog:new -- --version 0.1.1
```

2. Bump version:
```bash
npm version patch
```
Note: `npm version` now auto-updates both `CHANGELOG.md` and `CHANGELOG-cn.md`.

3. Publish:
```bash
npm publish --access public
```

## Post-publish

1. Verify package on npm:
```bash
npm view @wangai/cli version
```

2. Verify install:
```bash
npx @wangai/cli --help
```
