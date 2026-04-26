# Release Guide (`@wangai/sync`)

## 1. Update version

Edit `packages/sync/package.json`:

```json
{
  "version": "0.x.y"
}
```

Update `packages/sync/CHANGELOG.md`.

## 2. Local verify

```bash
cd packages/sync
npm run check
npm pack --dry-run --cache ../../.tmp-npm-cache
```

## 3. Commit

```bash
git add packages/sync
git commit -m "chore(sync): release v0.x.y"
```

## 4. Tag and push

Use sync tag prefix (required by release workflow):

```bash
git tag sync-v0.x.y
git push origin sync-v0.x.y
```

## 5. CI/CD publish

GitHub Action workflow `release.yml` will publish `@wangai/sync` when tag starts with `sync-v`.
