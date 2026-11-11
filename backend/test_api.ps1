$base = "http://127.0.0.1:8000"
$json = "application/json"

function Show($name, $block) {
    Write-Host "`n=== $name ===" -ForegroundColor Cyan
    try { & $block | ConvertTo-Json -Depth 6 }
    catch { Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red }
}

Show "health" { Invoke-RestMethod "$base/health" }
Show "profile save" { Invoke-RestMethod -Method Put "$base/profile/asha" -ContentType $json -Body '{"name":"Asha","needs":"blind,screenreader"}' }
Show "profile get" { Invoke-RestMethod "$base/profile/asha" }
Show "note add" { Invoke-RestMethod -Method Post "$base/workspace/notes" -ContentType $json -Body '{"user_id":"asha","text":"My topic: online learning for blind students"}' }
Show "notes list" { Invoke-RestMethod "$base/workspace/notes/asha" }
Show "source add" { Invoke-RestMethod -Method Post "$base/workspace/sources" -ContentType $json -Body '{"user_id":"asha","title":"Sample paper","url":"https://example.com","notes":"read abstract"}' }
Show "sources list" { Invoke-RestMethod "$base/workspace/sources/asha" }
Show "progress set" { Invoke-RestMethod -Method Post "$base/progress" -ContentType $json -Body '{"user_id":"asha","module":1,"completed":true}' }
Show "progress get" { Invoke-RestMethod "$base/progress/asha" }
Show "coach" { Invoke-RestMethod -Method Post "$base/coach" -ContentType $json -Body '{"idea":"I want to research online learning"}' }
Show "summarize" { Invoke-RestMethod -Method Post "$base/summarize" -ContentType $json -Body '{"text":"This study examines the heterogeneous effects of asynchronous pedagogical modalities on longitudinal retention among tertiary-level learners. Findings indicate statistically significant improvements in retention when multimodal scaffolding is employed.","level":"simple"}' }
Show "quiz" { Invoke-RestMethod -Method Post "$base/quiz" -ContentType $json -Body '{"lesson_text":"A good research question is specific, answerable and relevant. Too broad questions cannot be answered in one study.","count":2}' }
Show "credibility" { Invoke-RestMethod -Method Post "$base/credibility" -ContentType $json -Body '{"source_text":"A blog post from 2012 claiming online classes always fail, with no author listed."}' }
Show "mentor" { Invoke-RestMethod -Method Post "$base/mentor/feedback" -ContentType $json -Body '{"user_id":"asha","draft":"My research question is how students learn online."}' }