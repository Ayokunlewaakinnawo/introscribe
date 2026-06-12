# Introscribe

## Running With Docker

Prereqs: [Docker Desktop](https://docs.docker.com/desktop/) installed and running.

```bash
# Build the production image and start nginx on port 8080
docker compose up --build
```

The site becomes available at http://localhost:8080. Use `docker compose down` to stop the container.

## Desktop Release Downloads

The frontend uses stable public GCP URLs for desktop installers:

```txt
https://storage.googleapis.com/introscribe_bucket/download/win_os/introscribe-windows.exe
https://storage.googleapis.com/introscribe_bucket/download/mac_os/introscribe-mac.pkg
```

Do not commit generated `.exe`, `.pkg`, `.dmg`, `.zip`, `.blockmap`, `latest.yml`, or `latest-mac.yml` files to this frontend repo. Upload release artifacts to the GCP downloads bucket instead.

Recommended bucket layout:

```txt
gs://introscribe_bucket/download/win_os/
gs://introscribe_bucket/download/mac_os/
```

Each release should:

1. Upload versioned Windows artifacts to `download/win_os/`.
2. Upload versioned macOS artifacts to `download/mac_os/`.
3. Overwrite `download/win_os/introscribe-windows.exe` and `download/mac_os/introscribe-mac.pkg` with the newest installers, setting `Content-Disposition` so browsers save the original versioned filename.
4. Upload `download/win_os/latest.yml` and `download/mac_os/latest-mac.yml` last with `no-cache` headers.

Manual stable alias commands for version `{1.2.3.4}`:

```bash
gcloud storage cp \
  --cache-control="no-cache" \
  --content-disposition='attachment; filename="introscribe-Setup-{1.2.3.4}.exe"' \
  gs://introscribe_bucket/download/win_os/introscribe-Setup-{1.2.3.4}.exe \
  gs://introscribe_bucket/download/win_os/introscribe-windows.exe
```

```bash
gcloud storage cp \
  --cache-control="no-cache" \
  --content-disposition='attachment; filename="introscribe-{1.2.3.4}-arm64.pkg"' \
  gs://introscribe_bucket/download/mac_os/introscribe-{1.2.3.4}-arm64.pkg \
  gs://introscribe_bucket/download/mac_os/introscribe-mac.pkg
```

The generated Electron updater metadata must point at files that exist in the same OS folder. For example, `download/mac_os/latest-mac.yml` can reference `introscribe-1.0.34-arm64-mac.zip` if that zip is also in `download/mac_os/`.
