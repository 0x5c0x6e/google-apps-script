// Assuming the import path is correct
import { numberHeaders } from "../src/HeadingNumberer";

// Simplified mock interfaces directly reflecting Google Apps Script structures
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

// Mock factories for each part of the document structure
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
  it('should correctly number headers in the document', () => {
    const doc: MockDocument = DocumentApp.getActiveDocument();
    numberHeaders(doc as unknown as GoogleAppsScript.Document.Document);

    const firstParagraph = doc.getBody().getChild(0).asParagraph();
    const secondParagraph = doc.getBody().getChild(1).asParagraph();

    expect(firstParagraph.setText).toHaveBeenCalledWith('1 Heading One');
    expect(secondParagraph.setText).toHaveBeenCalledWith('1.1 Heading Two');
  });
});
