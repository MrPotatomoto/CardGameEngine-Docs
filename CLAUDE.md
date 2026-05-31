# CardGameEngine-Docs — Claude instructions

## On every new engine release

When a new engine version is tagged and published, update **all** of the following
version strings before pushing. Use the old version as the search term to avoid
missing any.

### Files that contain release-version strings

| File | What to update |
|------|----------------|
| `src/index.html` | Hero badge: `vX.Y — Now Available` |
| `src/index.html` | Install card description: `Locked to vX.Y.Z` |
| `src/index.html` | Download button label: `Download vX.Y.Z` |
| `src/docs/getting-started.html` | Lock description: `locked at vX.Y.Z` |
| `src/docs/getting-started.html` | Code block label: `Git URL — vX.Y.Z` |
| `src/docs/getting-started.html` | Tarball filename: `CardGameEngine-vX.Y.Z.tgz` |
| `src/docs/api-reference.html` | Front matter `description:` field |
| `src/docs/api-reference.html` | Lead paragraph `doc-lead` |

Run this grep before committing to confirm nothing is stale:

```
grep -rn "v[0-9]\+\.[0-9]\+" src/index.html src/docs/getting-started.html src/docs/api-reference.html
```

### Adding a new minor/major version's feature docs

For each version that adds new features (e.g. v6.2):

1. Create one docs page per feature in `src/docs/`.
2. Add a **"New in vX.Y"** `nav-section` block to `src/_includes/base.njk`, directly
   above the `Reference` section.
3. Update the **page-nav chain**: the last page of the previous version's section
   should point `Next →` to the first new page; the first new page should point
   `← Previous` back. The last new page should point `Next →` to `api-reference.html`.
4. Update `api-reference.html`'s `← Previous` link to the new last page.

### Page-nav chain (current)

```
... → format-legality → card-rendering → deck-builder-ui → puzzle-mode → campaign-system → api-reference
```

Update this comment whenever the chain changes.
