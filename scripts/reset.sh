#!/usr/bin/env bash
#
# Reset the demo back to its starting point.
#
# This force-pushes the commit tagged `demo-start` onto `main` on the
# remote, so a fresh clone (or a re-pull) starts from the demo's starting
# state again. It REWRITES remote `main` history — only run it against the
# throwaway demo repo.
#
# Usage:
#   scripts/reset.sh            # prompts for confirmation
#   scripts/reset.sh -y         # skip the prompt
#
set -euo pipefail

TAG="demo-start"
REMOTE="${REMOTE:-origin}"
BRANCH="main"

if ! git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "error: tag '$TAG' not found locally." >&2
  exit 1
fi

echo "This will force-push $TAG -> $REMOTE/$BRANCH, rewriting remote '$BRANCH'."
if [[ "${1:-}" != "-y" ]]; then
  read -r -p "Continue? [y/N] " reply
  case "$reply" in
    [yY] | [yY][eE][sS]) ;;
    *)
      echo "Aborted."
      exit 1
      ;;
  esac
fi

# Push the commit the annotated tag points at; a branch can't hold a tag object.
git push --force "$REMOTE" "${TAG}^{commit}:refs/heads/${BRANCH}"
echo "Done — $REMOTE/$BRANCH now points at $TAG."
echo "Remote refs (${BRANCH} should match ${TAG}^{}):"
git ls-remote "$REMOTE" "refs/heads/${BRANCH}" "refs/tags/${TAG}^{}"
