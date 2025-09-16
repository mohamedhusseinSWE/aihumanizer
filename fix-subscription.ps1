# PowerShell script to fix subscription
$body = @{
    userId = "rX38N1DFFLwOwX6iyKPn0Lt2TblheIK9"
    planId = 1
} | ConvertTo-Json

Write-Host "🔧 Fixing subscription for user: rX38N1DFFLwOwX6iyKPn0Lt2TblheIK9, plan: 1"
Write-Host "📋 Request body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/fix-subscription" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✅ Response received:"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}
