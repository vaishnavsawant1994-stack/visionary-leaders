$ErrorActionPreference = "Stop"

$ReportDate = "2026-06-30"
$ProjectName = "Visionary Leaders Magazine Platform"
$OutputDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BaseName = "Magazine_Platform_Current_Status_Report_$ReportDate"
$DocxPath = Join-Path $OutputDir "$BaseName.docx"
$XlsxPath = Join-Path $OutputDir "$BaseName.xlsx"

function XmlEscape([string]$Value) {
  if ($null -eq $Value) { return "" }
  return [System.Security.SecurityElement]::Escape($Value)
}

function Reset-Dir([string]$Path) {
  if (Test-Path $Path) { Remove-Item -LiteralPath $Path -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $Path | Out-Null
}

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

function Zip-OfficePackage([string]$SourceDir, [string]$TargetPath) {
  $zipPath = "$TargetPath.zip"
  if (Test-Path $TargetPath) { Remove-Item -LiteralPath $TargetPath -Force }
  if (Test-Path $zipPath) { Remove-Item -LiteralPath $zipPath -Force }
  Compress-Archive -Path (Join-Path $SourceDir "*") -DestinationPath $zipPath -Force
  Move-Item -LiteralPath $zipPath -Destination $TargetPath -Force
}

$SummaryRows = @(
  @("Report date", $ReportDate),
  @("Project status", "In progress"),
  @("Overall completion estimate", "68%"),
  @("Frontend completion estimate", "78%"),
  @("Backend completion estimate", "73%"),
  @("Database/API completion estimate", "74%"),
  @("Testing completion estimate", "15%"),
  @("Deployment readiness estimate", "10%"),
  @("Current uncommitted change", "Navbar theme token refresh, search route cleanup, themed dropdown/search/subscribe controls"),
  @("Latest visible commits", "Theme system, magazine flow/category improvements, ratings analytics, PDF summary, admin preview system")
)

$Features = @(
  @("Project foundation", "Next.js frontend, Express backend, Prisma/PostgreSQL schema, route/controller structure, upload middleware, scheduler", "Mostly done", "Core structure is present across frontend and backend."),
  @("Public website", "Home, about, contact, articles, article detail, magazines, magazine reader, blogs, news, categories, search, newsletter", "In progress", "Public routes are implemented; remaining work is UI polish, API URL cleanup, and QA."),
  @("Admin CMS", "Admin dashboard plus article, magazine, blog, news, category, subscriber, rating analytics screens", "In progress", "Create/edit/list/preview pages exist for major content types."),
  @("Authentication", "Admin login, JWT token storage, protected backend routes, auth middleware", "Partial", "Needs RBAC hardening, session handling, and production security review."),
  @("Article management", "CRUD, featured image upload, category relation, tags, SEO fields, draft/published/scheduled workflow, preview", "Mostly done", "Scheduler publishes scheduled articles."),
  @("Magazine management", "CRUD, cover/PDF upload, category relation, featured flag, display date, PDF reader route, preview", "In progress", "Reader and admin flow exist; needs final QA and UX refinement."),
  @("Magazine reader", "Flipbook/PDF viewing, PDF worker, read route, download/read flow, PDF summary support", "In progress", "Uses PDF libraries and custom viewer components."),
  @("Blog management", "CRUD, author/category metadata, image upload, scheduled publish support, preview", "In progress", "Lifecycle parity with articles should be tightened."),
  @("News management", "CRUD, source/category metadata, image upload, scheduled publish support, preview", "In progress", "Lifecycle parity and validation need QA."),
  @("Categories", "Category CRUD, slug, descriptions, article/magazine relations, frontend category browsing/filtering", "Mostly done", "Category dropdown and pages are present."),
  @("Subscriber/newsletter", "Newsletter subscription API, subscriber storage, admin subscriber view", "Mostly done", "Needs duplicate/error state and consent/compliance review."),
  @("Search", "Navbar search redirects to search page; search page queries articles, magazines, blogs, and news", "In progress", "Current Navbar change simplifies encoded query routing."),
  @("Ratings", "Magazine rating APIs, rating aggregation, rating analytics route, admin analytics page with charts", "Done / needs testing", "Feature exists but needs regression and data validation."),
  @("AI summaries", "Gemini/OpenAI packages present, AI summarize API, article/blog/news summary calls, magazine PDF summary utility", "In progress", "Needs provider config and failure-mode testing."),
  @("Translation", "Translate API, translation utility, translate/reset controls on content detail pages", "In progress", "Encoding issues and provider limits remain active risks."),
  @("Theme system", "Light, dark, and corporate themes, ThemeContext, body classes, theme wrapper, Navbar theme select", "In progress", "Most recent committed and uncommitted work focuses here."),
  @("Scheduling", "Cron checks every minute and publishes scheduled articles, magazines, blogs, and news", "Implemented", "Timezone configured for Asia/Kolkata."),
  @("Uploads/static files", "Multer upload middleware and static serving for uploads/articles/magazines/blogs/news", "Implemented", "Production storage strategy should be confirmed."),
  @("Project tracking docs", "Existing Excel, Word, Markdown, TSV tracking files under docs", "Done", "New current-status report generated from current code state.")
)

$FrontendPages = @(
  @("Public", "/", "Home page with hero, latest content, featured magazines, categories, newsletter"),
  @("Public", "/about", "About page"),
  @("Public", "/contact", "Contact page"),
  @("Public", "/articles", "Article listing"),
  @("Public", "/articles/[id]", "Article detail with translation and AI summary controls"),
  @("Public", "/magazines", "Magazine listing with category filtering"),
  @("Public", "/magazines/[id]/read", "Magazine/PDF reader"),
  @("Public", "/blogs", "Blog listing"),
  @("Public", "/blogs/[id]", "Blog detail with translation and AI summary controls"),
  @("Public", "/news", "News listing"),
  @("Public", "/news/[id]", "News detail with translation and AI summary controls"),
  @("Public", "/categories", "Category-driven magazine browsing"),
  @("Public", "/search", "Unified search across major content types"),
  @("Public", "/subscribers", "Subscriber interaction/list page"),
  @("Admin", "/login", "Admin login"),
  @("Admin", "/admin", "Admin dashboard metrics"),
  @("Admin", "/admin/articles", "Article management"),
  @("Admin", "/admin/articles/create", "Create article"),
  @("Admin", "/admin/articles/edit/[id]", "Edit article"),
  @("Admin", "/admin/magazines", "Magazine management"),
  @("Admin", "/admin/magazines/create", "Create magazine"),
  @("Admin", "/admin/magazines/edit/[id]", "Edit magazine"),
  @("Admin", "/admin/blogs", "Blog management"),
  @("Admin", "/admin/blogs/create", "Create blog"),
  @("Admin", "/admin/blogs/edit/[id]", "Edit blog"),
  @("Admin", "/admin/news", "News management"),
  @("Admin", "/admin/news/create", "Create news"),
  @("Admin", "/admin/news/edit/[id]", "Edit news"),
  @("Admin", "/admin/categories", "Category management"),
  @("Admin", "/admin/subscribers", "Subscriber management"),
  @("Admin", "/admin/ratings", "Magazine rating analytics")
)

$BackendApis = @(
  @("/api/auth", "POST login/register", "Authentication and admin access"),
  @("/api/articles", "GET/POST/PUT/DELETE plus publish/schedule/archive/preview endpoints", "Article CRUD and lifecycle"),
  @("/api/categories", "GET/POST/PUT/DELETE", "Category CRUD"),
  @("/api/magazines", "GET/POST/PUT/DELETE plus latest/featured support", "Magazine CRUD and reader support"),
  @("/api/blogs", "GET/POST/PUT/DELETE plus preview/publish routes", "Blog CRUD and lifecycle"),
  @("/api/news", "GET/POST/PUT/DELETE plus preview/publish routes", "News CRUD and lifecycle"),
  @("/api/subscribers", "POST public subscribe, GET protected list", "Newsletter subscriber capture"),
  @("/api/ratings", "POST rating, GET magazine/all analytics", "Magazine rating capture"),
  @("/api/rating-analytics", "GET", "Admin rating analytics dashboard data"),
  @("/api/ai/summarize", "POST", "AI summary generation"),
  @("/api/translate", "POST", "Text translation")
)

$Models = @(
  @("User", "Admin/editor/writer accounts", "name, email, password, role, timestamps, articles"),
  @("Category", "Editorial taxonomy", "name, slug, description, articles, magazines"),
  @("Article", "Long-form content", "summary, aiSummary, SEO fields, tags, featured image, status, publish scheduling"),
  @("Magazine", "Magazine editions", "edition, description, aiSummary, cover image, PDF URL, featured, status, display date, ratings"),
  @("MagazineRating", "Reader rating data", "magazineId, rating, createdAt"),
  @("Blog", "Blog content", "excerpt, aiSummary, image, author, category, status, scheduling"),
  @("News", "News content", "aiSummary, image, author, category, source, status, scheduling"),
  @("Subscriber", "Newsletter subscription", "email and createdAt"),
  @("UserRole enum", "Role model", "ADMIN, EDITOR, WRITER")
)

$Changes = @(
  @("Navbar current working-tree change", "Reworked theme tokens for light/dark/corporate modes, themed dropdown/search/subscribe styling, compact search redirect, outside-click category dropdown handling", "frontend/components/Navbar.tsx", "Uncommitted"),
  @("Theme foundation", "ThemeContext persists theme in localStorage, applies body class, supports light/dark/corporate cycle", "frontend/context/ThemeContext.tsx and frontend/styles/themes.js", "Committed base plus ongoing UI integration"),
  @("Known encoding issue", "Emoji/comment labels show mojibake in several files, including server logs and theme/nav comments/options", "backend/server.js, frontend/components/Navbar.tsx, frontend/context/ThemeContext.tsx", "Needs cleanup"),
  @("API configuration issue", "Many frontend files still call http://localhost:5000 directly instead of environment-driven API helper", "frontend app/components/utils", "High priority before deployment")
)

$Risks = @(
  @("Hardcoded localhost API URLs", "Production deployment and staging builds can break", "High", "Centralize API base URL using env config and replace direct fetch URLs."),
  @("Unicode/encoding corruption", "Visible labels/logs may look broken and reduce quality", "High", "Clean affected source files and enforce UTF-8."),
  @("Limited automated tests", "Regression risk across CMS, scheduler, translation, AI, ratings", "High", "Add smoke/API tests and frontend workflow tests."),
  @("Auth/RBAC hardening pending", "Admin routes may be too broad for multi-role usage", "High", "Enforce role permissions and token expiry/session behavior."),
  @("Upload/storage strategy", "Local uploads may not fit production hosting", "Medium", "Confirm Cloudinary/object storage path and migrate static upload handling."),
  @("AI/translation provider failures", "Slow, costly, or failed content operations", "Medium", "Add chunking, timeout, retry, and graceful fallback UI."),
  @("UI consistency", "Public/admin experience may feel uneven", "Medium", "Continue theme-system rollout and responsive QA."),
  @("Deployment pipeline missing", "Release readiness remains low", "High", "Add env docs, build checks, seed/admin setup, deployment checklist.")
)

$Roadmap = @(
  @("1", "API configuration cleanup", "Replace hardcoded localhost URLs and align frontend API helpers", "High", "2-3 days"),
  @("2", "Encoding cleanup", "Fix corrupted emoji/text labels and standardize UTF-8 files", "High", "1 day"),
  @("3", "Theme/UI completion", "Apply light/dark/corporate styling consistently across public and admin screens", "High", "1 week"),
  @("4", "Translation stabilization", "Improve chunking, loading states, reset behavior, and error handling", "High", "3-5 days"),
  @("5", "Audio content", "Add read-aloud/TTS for articles, blogs, news, and magazine summaries", "Medium", "1 week"),
  @("6", "Advertiser dashboard", "Campaign model, CRUD APIs, placements, analytics, charts, reports", "Medium", "3 weeks"),
  @("7", "Test coverage", "Backend API smoke tests, frontend flow tests, scheduler tests", "High", "1-2 weeks"),
  @("8", "Deployment preparation", "Env setup, production storage, build pipeline, handover checklist", "High", "1 week")
)

$Verification = @(
  @("Source inventory", "Checked frontend app routes, components, backend routes/controllers, Prisma schema, package manifests", "Done"),
  @("Git status", "Detected one modified file: frontend/components/Navbar.tsx", "Done"),
  @("Recent history", "Reviewed latest commit subjects for theme, magazine, ratings, PDF summary, admin preview work", "Done"),
  @("Automated tests", "No test suite detected from package scripts or common test patterns", "Not run / gap"),
  @("Build verification", "Not run while generating documents", "Pending")
)

function WorksheetXml($Rows) {
  $rowXml = ""
  for ($r = 0; $r -lt $Rows.Count; $r++) {
    $rowNum = $r + 1
    $rowXml += "<row r=`"$rowNum`">"
    for ($c = 0; $c -lt $Rows[$r].Count; $c++) {
      $col = [char](65 + $c)
      $style = if ($r -eq 0) { " s=`"1`"" } else { "" }
      $rowXml += "<c r=`"$col$rowNum`" t=`"inlineStr`"$style><is><t>$(XmlEscape $Rows[$r][$c])</t></is></c>"
    }
    $rowXml += "</row>"
  }
  return "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><worksheet xmlns=`"http://schemas.openxmlformats.org/spreadsheetml/2006/main`"><cols><col min=`"1`" max=`"8`" width=`"28`" customWidth=`"1`"/></cols><sheetData>$rowXml</sheetData></worksheet>"
}

function Make-SheetRows($Headers, $Rows) {
  $result = @()
  $result += ,$Headers
  foreach ($row in $Rows) { $result += ,$row }
  return $result
}

$Sheets = @(
  @{ Name = "Executive Summary"; Rows = Make-SheetRows @("Metric", "Value") $SummaryRows },
  @{ Name = "Feature Inventory"; Rows = Make-SheetRows @("Feature Area", "Scope", "Status", "Notes") $Features },
  @{ Name = "Frontend Pages"; Rows = Make-SheetRows @("Area", "Route", "Purpose") $FrontendPages },
  @{ Name = "Backend APIs"; Rows = Make-SheetRows @("Route", "Methods", "Purpose") $BackendApis },
  @{ Name = "Data Models"; Rows = Make-SheetRows @("Model", "Purpose", "Important Fields") $Models },
  @{ Name = "Current Changes"; Rows = Make-SheetRows @("Item", "Details", "Files", "Status") $Changes },
  @{ Name = "Risks"; Rows = Make-SheetRows @("Risk", "Impact", "Priority", "Recommended Action") $Risks },
  @{ Name = "Roadmap"; Rows = Make-SheetRows @("Order", "Workstream", "Scope", "Priority", "Estimate") $Roadmap },
  @{ Name = "Verification"; Rows = Make-SheetRows @("Check", "Result", "Status") $Verification }
)

$XlsxTemp = Join-Path $env:TEMP "magazine_status_xlsx"
Reset-Dir $XlsxTemp
New-Item -ItemType Directory -Force -Path (Join-Path $XlsxTemp "_rels") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $XlsxTemp "docProps") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $XlsxTemp "xl\_rels") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $XlsxTemp "xl\worksheets") | Out-Null

$sheetDefs = ""
$relDefs = ""
$overrideDefs = ""
for ($i = 0; $i -lt $Sheets.Count; $i++) {
  $id = $i + 1
  Write-Utf8NoBom (Join-Path $XlsxTemp "xl\worksheets\sheet$id.xml") (WorksheetXml $Sheets[$i].Rows)
  $sheetDefs += "<sheet name=`"$(XmlEscape $Sheets[$i].Name)`" sheetId=`"$id`" r:id=`"rId$id`"/>"
  $relDefs += "<Relationship Id=`"rId$id`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet`" Target=`"worksheets/sheet$id.xml`"/>"
  $overrideDefs += "<Override PartName=`"/xl/worksheets/sheet$id.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml`"/>"
}

Write-Utf8NoBom (Join-Path $XlsxTemp "[Content_Types].xml") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><Types xmlns=`"http://schemas.openxmlformats.org/package/2006/content-types`"><Default Extension=`"rels`" ContentType=`"application/vnd.openxmlformats-package.relationships+xml`"/><Default Extension=`"xml`" ContentType=`"application/xml`"/><Override PartName=`"/xl/workbook.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml`"/><Override PartName=`"/xl/styles.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml`"/><Override PartName=`"/docProps/core.xml`" ContentType=`"application/vnd.openxmlformats-package.core-properties+xml`"/><Override PartName=`"/docProps/app.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.extended-properties+xml`"/>$overrideDefs</Types>"
Write-Utf8NoBom (Join-Path $XlsxTemp "_rels\.rels") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><Relationships xmlns=`"http://schemas.openxmlformats.org/package/2006/relationships`"><Relationship Id=`"rId1`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument`" Target=`"xl/workbook.xml`"/><Relationship Id=`"rId2`" Type=`"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties`" Target=`"docProps/core.xml`"/><Relationship Id=`"rId3`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties`" Target=`"docProps/app.xml`"/></Relationships>"
Write-Utf8NoBom (Join-Path $XlsxTemp "xl\workbook.xml") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><workbook xmlns=`"http://schemas.openxmlformats.org/spreadsheetml/2006/main`" xmlns:r=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships`"><sheets>$sheetDefs</sheets></workbook>"
Write-Utf8NoBom (Join-Path $XlsxTemp "xl\_rels\workbook.xml.rels") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><Relationships xmlns=`"http://schemas.openxmlformats.org/package/2006/relationships`">$relDefs<Relationship Id=`"rId$($Sheets.Count + 1)`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles`" Target=`"styles.xml`"/></Relationships>"
Write-Utf8NoBom (Join-Path $XlsxTemp "xl\styles.xml") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><styleSheet xmlns=`"http://schemas.openxmlformats.org/spreadsheetml/2006/main`"><fonts count=`"2`"><font><sz val=`"11`"/><name val=`"Calibri`"/></font><font><b/><sz val=`"11`"/><name val=`"Calibri`"/></font></fonts><fills count=`"2`"><fill><patternFill patternType=`"none`"/></fill><fill><patternFill patternType=`"gray125`"/></fill></fills><borders count=`"1`"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count=`"1`"><xf numFmtId=`"0`" fontId=`"0`" fillId=`"0`" borderId=`"0`"/></cellStyleXfs><cellXfs count=`"2`"><xf numFmtId=`"0`" fontId=`"0`" fillId=`"0`" borderId=`"0`" xfId=`"0`"/><xf numFmtId=`"0`" fontId=`"1`" fillId=`"0`" borderId=`"0`" xfId=`"0`" applyFont=`"1`"/></cellXfs></styleSheet>"
Write-Utf8NoBom (Join-Path $XlsxTemp "docProps\core.xml") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><cp:coreProperties xmlns:cp=`"http://schemas.openxmlformats.org/package/2006/metadata/core-properties`" xmlns:dc=`"http://purl.org/dc/elements/1.1/`" xmlns:dcterms=`"http://purl.org/dc/terms/`" xmlns:dcmitype=`"http://purl.org/dc/dcmitype/`" xmlns:xsi=`"http://www.w3.org/2001/XMLSchema-instance`"><dc:title>$ProjectName Current Status Report</dc:title><dc:creator>Codex</dc:creator><cp:lastModifiedBy>Codex</cp:lastModifiedBy><dcterms:created xsi:type=`"dcterms:W3CDTF`">$($ReportDate)T00:00:00Z</dcterms:created><dcterms:modified xsi:type=`"dcterms:W3CDTF`">$($ReportDate)T00:00:00Z</dcterms:modified></cp:coreProperties>"
Write-Utf8NoBom (Join-Path $XlsxTemp "docProps\app.xml") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><Properties xmlns=`"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties`" xmlns:vt=`"http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes`"><Application>Microsoft Excel</Application></Properties>"
Zip-OfficePackage $XlsxTemp $XlsxPath

function WText([string]$Text) {
  return "<w:p><w:r><w:t xml:space=`"preserve`">$(XmlEscape $Text)</w:t></w:r></w:p>"
}

function WHeading([string]$Text, [int]$Level = 1) {
  $style = if ($Level -eq 1) { "Heading1" } else { "Heading2" }
  return "<w:p><w:pPr><w:pStyle w:val=`"$style`"/></w:pPr><w:r><w:t>$(XmlEscape $Text)</w:t></w:r></w:p>"
}

function WTable($Headers, $Rows) {
  $xml = "<w:tbl><w:tblPr><w:tblW w:w=`"0`" w:type=`"auto`"/><w:tblBorders><w:top w:val=`"single`" w:sz=`"4`"/><w:left w:val=`"single`" w:sz=`"4`"/><w:bottom w:val=`"single`" w:sz=`"4`"/><w:right w:val=`"single`" w:sz=`"4`"/><w:insideH w:val=`"single`" w:sz=`"4`"/><w:insideV w:val=`"single`" w:sz=`"4`"/></w:tblBorders></w:tblPr>"
  $allRows = @()
  $allRows += ,$Headers
  foreach ($row in $Rows) { $allRows += ,$row }
  foreach ($row in $allRows) {
    $xml += "<w:tr>"
    foreach ($cell in $row) {
      $xml += "<w:tc><w:tcPr><w:tcW w:w=`"2400`" w:type=`"dxa`"/></w:tcPr><w:p><w:r><w:t xml:space=`"preserve`">$(XmlEscape $cell)</w:t></w:r></w:p></w:tc>"
    }
    $xml += "</w:tr>"
  }
  $xml += "</w:tbl>"
  return $xml
}

$body = ""
$body += WHeading "$ProjectName - Current Status Report" 1
$body += WText "Report date: $ReportDate"
$body += WText "Status: In progress. Estimated overall completion: 68%."
$body += WText "This report is based on the current repository structure, recent git history, active working-tree changes, backend schema/routes, and frontend pages/components."
$body += WHeading "Executive Summary" 2
$body += WTable @("Metric", "Value") $SummaryRows
$body += WHeading "Feature Inventory" 2
$body += WTable @("Feature Area", "Scope", "Status", "Notes") $Features
$body += WHeading "Frontend Pages" 2
$body += WTable @("Area", "Route", "Purpose") $FrontendPages
$body += WHeading "Backend APIs" 2
$body += WTable @("Route", "Methods", "Purpose") $BackendApis
$body += WHeading "Database Models" 2
$body += WTable @("Model", "Purpose", "Important Fields") $Models
$body += WHeading "Current Changes And Observations" 2
$body += WTable @("Item", "Details", "Files", "Status") $Changes
$body += WHeading "Risks And Gaps" 2
$body += WTable @("Risk", "Impact", "Priority", "Recommended Action") $Risks
$body += WHeading "Recommended Roadmap" 2
$body += WTable @("Order", "Workstream", "Scope", "Priority", "Estimate") $Roadmap
$body += WHeading "Verification Notes" 2
$body += WTable @("Check", "Result", "Status") $Verification
$body += WText "Recommended immediate order: clean API configuration, fix encoding issues, finish theme/UI consistency, stabilize translation, add focused tests, then prepare deployment."

$DocxTemp = Join-Path $env:TEMP "magazine_status_docx"
Reset-Dir $DocxTemp
New-Item -ItemType Directory -Force -Path (Join-Path $DocxTemp "_rels") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $DocxTemp "word") | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $DocxTemp "docProps") | Out-Null

Write-Utf8NoBom (Join-Path $DocxTemp "[Content_Types].xml") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><Types xmlns=`"http://schemas.openxmlformats.org/package/2006/content-types`"><Default Extension=`"rels`" ContentType=`"application/vnd.openxmlformats-package.relationships+xml`"/><Default Extension=`"xml`" ContentType=`"application/xml`"/><Override PartName=`"/word/document.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml`"/><Override PartName=`"/word/styles.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml`"/><Override PartName=`"/docProps/core.xml`" ContentType=`"application/vnd.openxmlformats-package.core-properties+xml`"/><Override PartName=`"/docProps/app.xml`" ContentType=`"application/vnd.openxmlformats-officedocument.extended-properties+xml`"/></Types>"
Write-Utf8NoBom (Join-Path $DocxTemp "_rels\.rels") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><Relationships xmlns=`"http://schemas.openxmlformats.org/package/2006/relationships`"><Relationship Id=`"rId1`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument`" Target=`"word/document.xml`"/><Relationship Id=`"rId2`" Type=`"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties`" Target=`"docProps/core.xml`"/><Relationship Id=`"rId3`" Type=`"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties`" Target=`"docProps/app.xml`"/></Relationships>"
Write-Utf8NoBom (Join-Path $DocxTemp "word\document.xml") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><w:document xmlns:w=`"http://schemas.openxmlformats.org/wordprocessingml/2006/main`"><w:body>$body<w:sectPr><w:pgSz w:w=`"12240`" w:h=`"15840`"/><w:pgMar w:top=`"720`" w:right=`"720`" w:bottom=`"720`" w:left=`"720`"/></w:sectPr></w:body></w:document>"
Write-Utf8NoBom (Join-Path $DocxTemp "word\styles.xml") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><w:styles xmlns:w=`"http://schemas.openxmlformats.org/wordprocessingml/2006/main`"><w:style w:type=`"paragraph`" w:styleId=`"Normal`"><w:name w:val=`"Normal`"/><w:rPr><w:sz w:val=`"22`"/></w:rPr></w:style><w:style w:type=`"paragraph`" w:styleId=`"Heading1`"><w:name w:val=`"heading 1`"/><w:basedOn w:val=`"Normal`"/><w:rPr><w:b/><w:sz w:val=`"32`"/></w:rPr></w:style><w:style w:type=`"paragraph`" w:styleId=`"Heading2`"><w:name w:val=`"heading 2`"/><w:basedOn w:val=`"Normal`"/><w:rPr><w:b/><w:sz w:val=`"26`"/></w:rPr></w:style></w:styles>"
Write-Utf8NoBom (Join-Path $DocxTemp "docProps\core.xml") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><cp:coreProperties xmlns:cp=`"http://schemas.openxmlformats.org/package/2006/metadata/core-properties`" xmlns:dc=`"http://purl.org/dc/elements/1.1/`" xmlns:dcterms=`"http://purl.org/dc/terms/`" xmlns:dcmitype=`"http://purl.org/dc/dcmitype/`" xmlns:xsi=`"http://www.w3.org/2001/XMLSchema-instance`"><dc:title>$ProjectName Current Status Report</dc:title><dc:creator>Codex</dc:creator><cp:lastModifiedBy>Codex</cp:lastModifiedBy><dcterms:created xsi:type=`"dcterms:W3CDTF`">$($ReportDate)T00:00:00Z</dcterms:created><dcterms:modified xsi:type=`"dcterms:W3CDTF`">$($ReportDate)T00:00:00Z</dcterms:modified></cp:coreProperties>"
Write-Utf8NoBom (Join-Path $DocxTemp "docProps\app.xml") "<?xml version=`"1.0`" encoding=`"UTF-8`" standalone=`"yes`"?><Properties xmlns=`"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties`" xmlns:vt=`"http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes`"><Application>Microsoft Word</Application></Properties>"
Zip-OfficePackage $DocxTemp $DocxPath

Write-Host "Generated:"
Write-Host $XlsxPath
Write-Host $DocxPath
