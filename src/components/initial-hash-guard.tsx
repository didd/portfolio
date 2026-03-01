type InitialHashGuardProps = {
  ids: string[];
};

export function InitialHashGuard({ ids }: InitialHashGuardProps) {
  const serializedIds = JSON.stringify(ids);

  return (
    <script
      id="initial-hash-guard"
      dangerouslySetInnerHTML={{
        __html: `
          (function () {
            if (window.location.hash.length <= 1) return;

            var allowedIds = ${serializedIds};
            var hash = window.location.hash.slice(1);
            if (!allowedIds.includes(hash)) return;

            window.__portfolioInitialHash__ = hash;
            window.history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search,
            );
          })();
        `,
      }}
    />
  );
}
