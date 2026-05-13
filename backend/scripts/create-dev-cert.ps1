param(
  [string]$DnsName = "localhost",
  [string]$IpAddress = "127.0.0.1"
)

$certDir = Join-Path $PSScriptRoot "..\certs"
New-Item -ItemType Directory -Force -Path $certDir | Out-Null

$cert = New-SelfSignedCertificate `
  -DnsName $DnsName `
  -CertStoreLocation "Cert:\CurrentUser\My" `
  -KeyAlgorithm RSA `
  -KeyLength 2048 `
  -NotAfter (Get-Date).AddYears(1) `
  -TextExtension @("2.5.29.17={text}DNS=$DnsName&IPAddress=$IpAddress")

$pfxPath = Join-Path $certDir "server.pfx"
$password = ConvertTo-SecureString -String "glow-dev-cert" -Force -AsPlainText
Export-PfxCertificate -Cert $cert -FilePath $pfxPath -Password $password | Out-Null

Write-Host "Created development certificate at $pfxPath"
Write-Host "The backend will use this PFX automatically when you run npm start from the backend folder."
