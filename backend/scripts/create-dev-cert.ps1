param(
  [string]$IpAddress = "127.0.0.1"
)

$ErrorActionPreference = "Stop"

$certDir = Join-Path $PSScriptRoot "..\certs"
New-Item -ItemType Directory -Force -Path $certDir | Out-Null

$rsa = [System.Security.Cryptography.RSA]::Create(2048)
$request = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
  "CN=GlowLocalDev",
  $rsa,
  [System.Security.Cryptography.HashAlgorithmName]::SHA256,
  [System.Security.Cryptography.RSASignaturePadding]::Pkcs1
)

$san = [System.Security.Cryptography.X509Certificates.SubjectAlternativeNameBuilder]::new()
$san.AddDnsName("localhost")
$san.AddIpAddress([System.Net.IPAddress]::Parse("127.0.0.1"))
$san.AddIpAddress([System.Net.IPAddress]::Parse($IpAddress))
$request.CertificateExtensions.Add($san.Build())
$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($false, $false, 0, $true)
)
$request.CertificateExtensions.Add(
  [System.Security.Cryptography.X509Certificates.X509KeyUsageExtension]::new(
    [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::DigitalSignature -bor
    [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::KeyEncipherment,
    $true
  )
)

$cert = $request.CreateSelfSigned([DateTimeOffset]::Now.AddDays(-1), [DateTimeOffset]::Now.AddYears(2))

function Write-Pem($path, $label, [byte[]]$bytes) {
  $base64 = [Convert]::ToBase64String($bytes)
  $lines = for ($i = 0; $i -lt $base64.Length; $i += 64) {
    $base64.Substring($i, [Math]::Min(64, $base64.Length - $i))
  }
  $pem = "-----BEGIN $label-----`n$($lines -join "`n")`n-----END $label-----`n"
  [System.IO.File]::WriteAllText($path, $pem)
}

Write-Pem (Join-Path $certDir "localhost-cert.pem") "CERTIFICATE" $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
[System.IO.File]::WriteAllBytes(
  (Join-Path $certDir "localhost.pfx"),
  $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Pfx, "")
)

Write-Host "Created HTTPS certs in $certDir for localhost, 127.0.0.1 and $IpAddress"
