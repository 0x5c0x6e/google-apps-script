
export function onOpen(e: GoogleAppsScript.Events.DocsOnOpen) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Add Numbers to Headings', 'selectDocument')
    .addToUi();
}

export function onInstall(e: GoogleAppsScript.Events.DocsOnOpen) {
  onOpen(e);
}

export function numberHeadersRoot() {
  const document: GoogleAppsScript.Document.Document = DocumentApp.getActiveDocument();
  numberHeaders(document)
}

export function numberHeaders(document: GoogleAppsScript.Document.Document) {
  const headingCounters: number[] = [0, 0, 0, 0, 0, 0];
  for (let index = 0; index < document.getBody().getNumChildren(); index++) {
    const child: GoogleAppsScript.Document.Element = document.getBody().getChild(index);
    if (child && child.getType().toString() === "PARAGRAPH") {
      processHeading(headingCounters, child.asParagraph());
    }
  }
}

function processHeading(headingCounters: number[], paragraph: GoogleAppsScript.Document.Paragraph) {
  const headingLevel = getHeadingLevel(paragraph) - 1;
  if (headingLevel >= 0 && headingLevel < 6) {
    updateHeadingCounters(headingCounters, headingLevel);
    const expectedPrefix = generateHeadingText(headingCounters, headingLevel);
    const currentText = paragraph.getText();
    const currentPrefix = extractCurrentPrefix(currentText);
    updateHeadingText(paragraph, currentPrefix, expectedPrefix, currentText);
  }
}

function getHeadingLevel(paragraph: GoogleAppsScript.Document.Paragraph) {
  const heading = paragraph.getHeading().toString();
  switch (heading) {
    case "HEADING1":
      return 1;
    case "HEADING2":
      return 2;
    case "HEADING3":
      return 3;
    case "HEADING4":
      return 4;
    case "HEADING5":
      return 5;
    case "HEADING6":
      return 6;
    default:
      return -1;
  }
}

function updateHeadingCounters(headingCounters: number[], headingLevel: number) {
  headingCounters[headingLevel]++;
  headingCounters.fill(0, headingLevel + 1);
}

function generateHeadingText(headingCounters: number[], headingLevel: number) {
  return headingCounters.slice(0, headingLevel + 1).join('.');
}

function extractCurrentPrefix(text: string) {
  const match = text.match(/^(\d+(\.\d+)*)\s+/);
  return match ? match[1] : null;
}

function updateHeadingText(paragraph: GoogleAppsScript.Document.Paragraph, currentPrefix: string | null, expectedPrefix: string, currentText: string) {
  if (currentPrefix !== expectedPrefix) {
    const newText = `${expectedPrefix} ${currentText.replace(/^\d+(\.\d+)*\s+/, '')}`;
    paragraph.setText(newText);
  }
}
