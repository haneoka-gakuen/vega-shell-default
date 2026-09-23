type UiLocale = "en" | "ja" | "zh-CN" | "zh-TW" | "ko";
const text: Readonly<Record<string, readonly [string, string, string, string]>> = {
  "Back to game": ["ゲームに戻る", "返回故事", "返回故事", "게임으로 돌아가기"],
  "Esc · Back": ["Esc · 戻る", "Esc · 返回", "Esc · 返回", "Esc · 돌아가기"],
  "Choose a chapter of your story": [
    "新しい物語を始めましょう",
    "开启属于你的故事",
    "開啟屬於你的故事",
    "새로운 이야기를 시작하세요",
  ],
  "Manual saves": ["セーブデータ", "手动存档", "手動存檔", "저장 데이터"],
  "Quick saves": ["クイックセーブ", "快速存档", "快速存檔", "빠른 저장"],
  "Empty slot": ["未使用", "空白存档", "空白存檔", "빈 슬롯"],
  "Save here": ["ここにセーブ", "点击保存当前进度", "點擊儲存目前進度", "현재 진행 저장"],
  "No saved progress": ["セーブデータがありません", "暂无存档", "暫無存檔", "저장 데이터가 없습니다"],
  "Choose a slot to save your progress.": [
    "セーブ先を選んでください。",
    "选择一个位置保存当前进度。",
    "選擇一個位置儲存目前進度。",
    "진행 상황을 저장할 슬롯을 선택하세요.",
  ],
  "Choose a save to continue the story.": [
    "再開するデータを選んでください。",
    "选择存档，继续故事。",
    "選擇存檔，繼續故事。",
    "저장된 이야기에서 계속하세요.",
  ],
  "Saved successfully": ["セーブしました", "已保存", "已儲存", "저장했습니다"],
  "Load this save? Current unsaved progress will be lost.": [
    "このデータをロードしますか？未保存の進行は失われます。",
    "读取这份存档？当前未保存的进度将丢失。",
    "讀取這份存檔？目前未儲存的進度將遺失。",
    "이 저장을 불러올까요? 저장하지 않은 진행은 사라집니다.",
  ],
  "Overwrite this save?": ["このデータを上書きしますか？", "覆盖这份存档？", "覆寫這份存檔？", "이 저장을 덮어쓸까요?"],
  "Delete this save?": ["このデータを削除しますか？", "删除这份存档？", "刪除這份存檔？", "이 저장을 삭제할까요?"],
  "Return to the title screen? Unsaved progress will be lost.": [
    "タイトルに戻りますか？未保存の進行は失われます。",
    "返回标题画面？当前未保存的进度将丢失。",
    "返回標題畫面？目前未儲存的進度將遺失。",
    "타이틀로 돌아갈까요? 저장하지 않은 진행은 사라집니다.",
  ],
  "Search dialogue": ["会話を検索", "搜索对话", "搜尋對話", "대화 검색"],
  "No matching dialogue": ["一致する会話がありません", "没有匹配的对话", "沒有符合的對話", "일치하는 대화가 없습니다"],
  "The backlog is empty.": [
    "まだ会話はありません。",
    "还没有对话记录。",
    "還沒有對話記錄。",
    "아직 대화 기록이 없습니다.",
  ],
  "Replay voice": ["ボイス再生", "重播语音", "重播語音", "음성 재생"],
  Return: ["ここから再開", "从此处继续", "從此處繼續", "여기서 계속"],
  Narration: ["モノローグ", "旁白", "旁白", "독백"],
  "Preview text": [
    "文字表示のプレビューです。",
    "在这里预览文字的显示效果。",
    "在這裡預覽文字的顯示效果。",
    "텍스트 표시 미리보기입니다.",
  ],
  "Save pages": ["セーブページ", "存档分页", "存檔分頁", "저장 페이지"],
  Images: ["CG鑑賞", "插画鉴赏", "插畫鑑賞", "CG 감상"],
  Music: ["音楽鑑賞", "音乐鉴赏", "音樂鑑賞", "음악 감상"],
  "No gallery entries are configured.": [
    "鑑賞データがありません。",
    "暂无鉴赏内容。",
    "暫無鑑賞內容。",
    "감상할 콘텐츠가 없습니다.",
  ],
  "Text and playback": ["テキスト・進行", "文本与播放", "文字與播放", "텍스트 및 재생"],
  Sound: ["音声", "声音", "聲音", "소리"],
  Display: ["画面", "显示", "顯示", "화면"],
  Language: ["言語", "语言", "語言", "언어"],
  Title: ["タイトル", "标题画面", "標題畫面", "타이틀"],
  Menu: ["メニュー", "菜单", "選單", "메뉴"],
  Save: ["セーブ", "保存进度", "儲存進度", "저장"],
  "Save / Load": ["セーブ／ロード", "存档／读档", "存檔／讀檔", "저장 / 불러오기"],
  Load: ["ロード", "读取存档", "讀取存檔", "불러오기"],
  Settings: ["環境設定", "系统设置", "系統設定", "환경 설정"],
  Backlog: ["バックログ", "对话记录", "對話記錄", "대화 기록"],
  Log: ["バックログ", "对话记录", "對話記錄", "대화 기록"],
  Extra: ["鑑賞", "鉴赏模式", "鑑賞模式", "감상"],
  Flowchart: ["フローチャート", "剧情流程图", "劇情流程圖", "스토리 흐름도"],
  Close: ["閉じる", "关闭", "關閉", "닫기"],
  Back: ["戻る", "返回", "返回", "돌아가기"],
  Continue: ["続きから", "继续游戏", "繼續遊戲", "계속하기"],
  "New game": ["最初から", "新的故事", "新的故事", "새 게임"],
  "New Game": ["最初から", "新的故事", "新的故事", "새 게임"],
  Start: ["最初から", "新的故事", "新的故事", "새 게임"],
  Resume: ["ゲームに戻る", "返回游戏", "返回遊戲", "게임으로 돌아가기"],
  "Return to title": ["タイトルに戻る", "返回标题画面", "返回標題畫面", "타이틀로 돌아가기"],
  "Quick save": ["クイックセーブ", "快速保存", "快速儲存", "빠른 저장"],
  "Quick load": ["クイックロード", "快速读取", "快速讀取", "빠른 불러오기"],
  Auto: ["オート", "自动播放", "自動播放", "자동 진행"],
  "Auto play": ["オート", "自动播放", "自動播放", "자동 진행"],
  Skip: ["スキップ", "快进", "快轉", "스킵"],
  "Fast forward": ["スキップ", "快进", "快轉", "스킵"],
  Exit: ["終了", "退出游戏", "結束遊戲", "종료"],
  Appearance: ["表示モード", "显示模式", "顯示模式", "표시 모드"],
  Light: ["ライト", "浅色", "淺色", "밝게"],
  Dark: ["ダーク", "深色", "深色", "어둡게"],
  System: ["システム設定", "跟随系统", "跟隨系統", "시스템 설정"],
  "Interface language": ["表示言語", "界面语言", "介面語言", "표시 언어"],
  "Story language": ["テキスト言語", "剧情语言", "劇情語言", "텍스트 언어"],
  Automatic: ["自動", "自动", "自動", "자동"],
  "Text speed": ["文字表示速度", "文字显示速度", "文字顯示速度", "텍스트 표시 속도"],
  "Text size": ["文字サイズ", "文字大小", "文字大小", "글자 크기"],
  "Instant text": ["テキスト即時表示", "即时显示文字", "即時顯示文字", "텍스트 즉시 표시"],
  Subtitles: ["字幕", "字幕", "字幕", "자막"],
  "Enable music": ["BGMを有効にする", "启用背景音乐", "啟用背景音樂", "배경 음악 사용"],
  "Auto delay": ["オート待ち時間", "自动播放间隔", "自動播放間隔", "자동 진행 대기 시간"],
  "Master volume": ["マスター音量", "主音量", "主音量", "전체 음량"],
  "Music volume": ["BGM音量", "背景音乐音量", "背景音樂音量", "배경 음악 음량"],
  "Voice volume": ["ボイス音量", "语音音量", "語音音量", "음성 음량"],
  "Effects volume": ["効果音音量", "音效音量", "音效音量", "효과음 음량"],
  "Reduce motion": ["動きを減らす", "减少动态效果", "減少動態效果", "움직임 줄이기"],
  "High contrast": ["ハイコントラスト", "高对比度", "高對比度", "고대비"],
  Overwrite: ["上書き", "覆盖存档", "覆寫存檔", "덮어쓰기"],
  Delete: ["削除", "删除", "刪除", "삭제"],
  Cancel: ["キャンセル", "取消", "取消", "취소"],
  Confirm: ["決定", "确认", "確認", "확인"],
  Fullscreen: ["フルスクリーン", "全屏显示", "全螢幕顯示", "전체 화면"],
  "Visual novel menu": ["ゲームメニュー", "游戏菜单", "遊戲選單", "게임 메뉴"],
  "Game menu pages": ["メニュー切り替え", "游戏菜单导航", "遊戲選單導覽", "게임 메뉴 탐색"],
  Locked: ["未解放", "未解锁", "未解鎖", "잠김"],
};

export function shellUiLocale(language: string, document: Document): UiLocale {
  const value =
    language === "auto" ? document.documentElement.lang || document.defaultView?.navigator.language || "en" : language;
  if (/^zh/iu.test(value)) return /Hant|TW|HK/iu.test(value) ? "zh-TW" : "zh-CN";
  if (/^ja/iu.test(value)) return "ja";
  if (/^ko/iu.test(value)) return "ko";
  return "en";
}

export function shellText(value: string, locale: UiLocale): string {
  if (locale === "en") return value;
  const index = (["ja", "zh-CN", "zh-TW", "ko"] as const).indexOf(locale);
  return text[value]?.[index] ?? value;
}

/** Localize only shell-owned controls; story titles, dialogue and gallery labels stay authored. */
export function localizeShellControls(root: HTMLElement, language: string): void {
  const locale = shellUiLocale(language, root.ownerDocument);
  root.lang = locale;
  for (const element of root.querySelectorAll<HTMLElement>(
    ".vega-shell__button-label, .vega-shell__row > span, option, [data-shell-ui-text]",
  )) {
    if (element.closest(".vega-shell__gallery, .vega-shell__backlog")) continue;
    const original = element.dataset.shellUiText ?? element.textContent ?? "";
    if (!(original in text)) continue;
    element.dataset.shellUiText = original;
    element.textContent = shellText(original, locale);
  }
  if (root.dataset.screen !== "title") {
    const heading = root.querySelector<HTMLElement>(".vega-shell__heading h2");
    if (heading) heading.textContent = shellText(heading.textContent || "", locale);
  }
  for (const element of [root, ...root.querySelectorAll<HTMLElement>("[aria-label]")]) {
    const original = element.dataset.shellUiAria ?? element.getAttribute("aria-label") ?? "";
    const close = /^Close (Title|Menu|Save|Load|Settings|Backlog|Extra|Flowchart)$/u.exec(original);
    if (original in text || close) {
      element.dataset.shellUiAria = original;
      element.setAttribute(
        "aria-label",
        close ? `${shellText("Close", locale)} · ${shellText(close[1]!, locale)}` : shellText(original, locale),
      );
    }
  }
}
