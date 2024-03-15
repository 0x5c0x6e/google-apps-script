import { numberHeaders } from "../../src/docs/HeadingNumberer";

interface MockParagraph {
  setText: jest.Mock;
  getHeading: jest.Mock;
  getText: jest.Mock;
}

interface MockElement {
  asParagraph: () => MockParagraph;
  getType: jest.Mock;
}

interface MockBody {
  getNumChildren: jest.Mock;
  getChild: jest.Mock;
}

interface MockDocument {
  getBody: () => MockBody;
}

interface MockDocumentApp {
  getActiveDocument: () => MockDocument;
}

const createMockParagraph = (heading: string, text: string): MockParagraph => ({
  setText: jest.fn(),
  getHeading: jest.fn().mockReturnValue(heading),
  getText: jest.fn().mockReturnValue(text),
});

const createMockElement = (paragraph: MockParagraph): MockElement => ({
  asParagraph: jest.fn(() => paragraph),
  getType: jest.fn().mockReturnValue("PARAGRAPH"), // Reflecting the PARAGRAPH type
});

const createMockBody = (children: MockElement[]): MockBody => ({
  getNumChildren: jest.fn(() => children.length),
  getChild: jest.fn((index: number) => children[index]),
});

const createMockDocument = (body: MockBody): MockDocument => ({
  getBody: jest.fn(() => body),
});

const createMockDocumentApp = (document: MockDocument): MockDocumentApp => ({
  getActiveDocument: jest.fn(() => document),
});

let DocumentApp: MockDocumentApp;

beforeEach(() => {
  const paragraph1 = createMockParagraph("HEADING1", "Heading One");
  const paragraph2 = createMockParagraph("HEADING2", "Heading Two");

  const element1 = createMockElement(paragraph1);
  const element2 = createMockElement(paragraph2);

  const body = createMockBody([element1, element2]);
  const document = createMockDocument(body);

  DocumentApp = createMockDocumentApp(document);
});

describe('numberHeaders', () => {
  let doc: MockDocument;

  beforeEach(() => {
    const paragraph1 = createMockParagraph("HEADING1", "Heading One");
    const paragraph2 = createMockParagraph("HEADING2", "Heading Two 1");
    const paragraph3 = createMockParagraph("HEADING2", "Heading Two 2");
    const paragraph4 = createMockParagraph("HEADING3", "Heading Three");
    const paragraph5 = createMockParagraph("NORMAL", "Normal text");
    const paragraph6 = createMockParagraph("HEADING1", "Another Heading One");
    const paragraph7 = createMockParagraph("HEADING2", "Another Heading Two");

    const element1 = createMockElement(paragraph1);
    const element2 = createMockElement(paragraph2);
    const element3 = createMockElement(paragraph3);
    const element4 = createMockElement(paragraph4);
    const element5 = createMockElement(paragraph5);
    const element6 = createMockElement(paragraph6);
    const element7 = createMockElement(paragraph7);

    const body = createMockBody([element1, element2, element3, element4, element5, element6, element7]);
    doc = createMockDocument(body);
    DocumentApp = createMockDocumentApp(doc);
  });

  it('should correctly number headers in the document', () => {
    numberHeaders(doc as unknown as GoogleAppsScript.Document.Document);

    const firstParagraph = doc.getBody().getChild(0).asParagraph();
    const secondParagraph = doc.getBody().getChild(1).asParagraph();

    expect(firstParagraph.setText).toHaveBeenCalledWith('1 Heading One');
    expect(secondParagraph.setText).toHaveBeenCalledWith('1.1 Heading Two 1');
  });

  it('should correctly handle multiple levels of headings', () => {
    numberHeaders(doc as unknown as GoogleAppsScript.Document.Document);

    const secondParagraph = doc.getBody().getChild(1).asParagraph();
    const thirdParagraph = doc.getBody().getChild(2).asParagraph();
    const fourthParagraph = doc.getBody().getChild(3).asParagraph();

    expect(secondParagraph.setText).toHaveBeenCalledWith('1.1 Heading Two 1');
    expect(thirdParagraph.setText).toHaveBeenCalledWith('1.2 Heading Two 2');
    expect(fourthParagraph.setText).toHaveBeenCalledWith('1.2.1 Heading Three');
  });

  it('should ignore normal text paragraphs', () => {
    numberHeaders(doc as unknown as GoogleAppsScript.Document.Document);

    const fifthParagraph = doc.getBody().getChild(4).asParagraph();

    expect(fifthParagraph.setText).not.toHaveBeenCalled();
  });

  it('should reset counters correctly for new main headings', () => {
    numberHeaders(doc as unknown as GoogleAppsScript.Document.Document);

    const sixthParagraph = doc.getBody().getChild(5).asParagraph();
    const seventhParagraph = doc.getBody().getChild(6).asParagraph();

    expect(sixthParagraph.setText).toHaveBeenCalledWith('2 Another Heading One');
    expect(seventhParagraph.setText).toHaveBeenCalledWith('2.1 Another Heading Two');
  });
});



