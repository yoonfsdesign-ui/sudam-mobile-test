#!/usr/bin/env python3
"""SUDAM v5.42: idempotent patch for the EXISTING index.html.

Run from the project root after extracting the ZIP. Copies the original HTML
into a backup before editing. Never modifies images, URLs, or subpages.
"""
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parent
idx = root / 'index.html'
if not idx.exists():
    sys.exit('오류: 현재 폴더에 index.html이 없습니다. 기존 사이트 최상위 폴더에 ZIP을 풀어 주세요.')
source = idx.read_text(encoding='utf-8')
if 'polish-v5.40.css' not in source or 'polish-v5.40.js' not in source:
    sys.exit('오류: 이 파일은 수담 v5.40/v5.41 소스가 아닙니다. 작업 버전을 확인해 주세요.')
if not (root/'css/polish-v5.42.css').exists() or not (root/'js/polish-v5.42.js').exists():
    sys.exit('오류: v5.42 CSS 또는 JS 파일이 없습니다. ZIP의 폴더 구조를 유지해야 합니다.')
backup = root / 'index.html.before-v5.42.bak'
if not backup.exists(): backup.write_text(source,encoding='utf-8')
# Remove any incorrectly injected explicit 5.41 link, though normally none exists.
source = re.sub(r'<link\b(?=[^>]*\bpolish-v5\.41\.css)[^>]*>', '', source)
source = re.sub(r'<script\b(?=[^>]*\bpolish-v5\.41\.js)[^>]*>\s*</script>', '', source)
# Restore HTML source of Blue Ribbon trust (no dependence on JS hydration).
source = source.replace('블루리본 4회 선정','블루리본 5회 선정')
source = source.replace('2025·2026 연속 선정','2025·2026·2027 연속 선정')
source = source.replace('2025–2027 3년 연속 선정','2025·2026·2027 연속 선정')
# Remove any previous explicit v5.42 refs, so repeat invocation is safe.
source = re.sub(r'<link\b(?=[^>]*\bpolish-v5\.42\.css)[^>]*>', '', source)
source = re.sub(r'<script\b(?=[^>]*\bpolish-v5\.42\.js)[^>]*>\s*</script>', '', source)
# CSS is explicitly loaded, reliably ordered after every previous stylesheet.
source = source.replace('</head>', '<link rel="stylesheet" href="./css/polish-v5.42.css?v=20261126-542"/>\n</head>',1)
# Move v5.40 script URL to a fresh version to prevent stale 5.41 dynamic code.
source,n = re.subn(r'(src="\./js/polish-v5\.40\.js)(?:\?[^\"]*)?("\s*></script>)',
                   r'\g<1>?v=20261126-540-restored\2', source, count=1)
if n!=1:sys.exit('오류: v5.40 JavaScript 참조를 찾지 못했습니다.')
source = source.replace('</body>', '<script src="./js/polish-v5.42.js?v=20261126-542"></script>\n</body>',1)
assert source.count('polish-v5.42.css')==1 and source.count('polish-v5.42.js')==1
idx.write_text(source,encoding='utf-8')
print('완료: index.html 업데이트 / 원본 백업: index.html.before-v5.42.bak')
print('배포 파일: index.html, css/polish-v5.42.css, js/polish-v5.42.js, js/polish-v5.40.js')
