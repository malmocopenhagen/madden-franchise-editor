const expect = require('chai').expect;
const EventEmitter = require('events').EventEmitter;
const proxyquire = require('proxyquire').noCallThru();

let chunks = [];
let expectedSchema;

const fsStub = {
  'createReadStream': function () {
    const e = new EventEmitter();

    setTimeout(() => {
      chunks.forEach((chunk) => {
        e.emit('data', chunk);
      });
  
      e.emit('close');
    }, 5);

    return e;
  },
  'writeFile': function () {}
};

const schemaGenerationServiceStub = {
  'generate': function (schema) {
    if (expectedSchema) {
      
      if (Array.isArray(expectedSchema)) {
        expect(schema).to.eql(expectedSchema[0]);
        expectedSchema.shift();
      }
      else {
        expect(schema).to.eql(expectedSchema);
      }
    }

    return Buffer.from([0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x46, 0x72, 0x61, 0x6E, 0x63, 0x68, 0x69, 0x73, 0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x4D, 0x61, 0x64, 0x64, 0x65, 0x6E, 0x32, 0x30, 0x5F, 0x47, 0x65, 0x6E, 0x34, 0x5F, 0x43, 0x46, 0x4D, 0x2E, 0x4D, 0x32, 0x30, 0x5F, 0x52, 0x4C, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x4D, 0x61, 0x6A, 0x6F, 0x72, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x3D, 0x22, 0x33, 0x37, 0x30, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x4D, 0x69, 0x6E, 0x6F, 0x72, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x3D, 0x22, 0x30, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x52, 0x65, 0x76, 0x69, 0x73, 0x69, 0x6F, 0x6E, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x3D, 0x22, 0x37, 0x22, 0x20, 0x69, 0x73, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x3D, 0x22, 0x54, 0x72, 0x75, 0x65, 0x22, 0x20, 0x6D, 0x61, 0x6A, 0x6F, 0x72, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x43, 0x52, 0x43, 0x3D, 0x22, 0x2D, 0x32, 0x30, 0x34, 0x34, 0x36, 0x36, 0x36, 0x30, 0x31, 0x36, 0x22, 0x20, 0x6D, 0x69, 0x6E, 0x6F, 0x72, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x43, 0x52, 0x43, 0x3D, 0x22, 0x31, 0x32, 0x31, 0x36, 0x39, 0x34, 0x30, 0x35, 0x36, 0x34, 0x22, 0x3E, 0x0D]);
  }
}

const schemaSearchService = proxyquire('../renderer/js/services/schemaSearchService.js', {
  'fs': fsStub,
  './schemaGenerationService': schemaGenerationServiceStub
});

const schemaStart = Buffer.from([0x00, 0x01, 0x00, 0x00, 0x09, 0x70]);
const schemaText = Buffer.from([0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73]);
const schemaEnd = Buffer.from([0x3C, 0x2F, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x3E]);

// X SCENARIO: schema start and schema text in one chunk, schema end in another. (Normal scenario)
const schemaStartInChunk = Buffer.from([0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x3D, 0x6C, 0xF0, 0x0A, 0xEF, 0xBB, 0xBF, 0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x15, 0x00, 0xF3, 0x07, 0x63, 0x68, 0x69, 0x73, 0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x21, 0x00, 0xF2, 0x09, 0x4D, 0x61, 0x64]);
const schemaEndInChunk = Buffer.from([0x00, 0x05, 0x2B, 0x09, 0x0C, 0x1B, 0x00, 0x0F, 0xDF, 0x3E, 0x14, 0x08, 0x2A, 0x09, 0x05, 0xCB, 0x14, 0x0C, 0x6E, 0x04, 0x0F, 0x49, 0x3D, 0x0C, 0x04, 0x7E, 0x04, 0xF0, 0x02, 0x73, 0x3E, 0x0D, 0x0A, 0x3C, 0x2F, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x3E]);

// X SCENARIO: schema start is split between two chunks
const schemaStartSplit1 = Buffer.from([0x00, 0x11, 0x00, 0x08, 0x0C, 0x87, 0x12, 0x00, 0x00, 0x43, 0x40, 0x40, 0xD0, 0x03, 0x5B, 0x1D, 0x20, 0xC3, 0xA2, 0x38, 0x00, 0x2C, 0xF3, 0xF2, 0x15, 0x01, 0x04, 0xE0, 0x00, 0x0F, 0x30, 0x09, 0x05, 0x80, 0xC4, 0x51, 0x00, 0x00, 0x3E, 0x16, 0x1F, 0x2B, 0x00, 0x01, 0x00, 0x00]);
const schemaStartSplit2 = Buffer.from([0x09, 0x70, 0x3D, 0x6E, 0xF0, 0x07, 0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x15, 0x00, 0xF3, 0x07, 0x63, 0x68, 0x69, 0x73, 0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73]);

// X SCENARIO: schema end is split between two chunks
const schemaEndSplit1 = Buffer.from([0x08, 0x2A, 0x09, 0x05, 0xCB, 0x14, 0x0C, 0x6E, 0x04, 0x0F, 0x49, 0x3D, 0x0C, 0x04, 0x7E, 0x04, 0xF0, 0x02, 0x73, 0x3E, 0x0D, 0x0A, 0x3C, 0x2F, 0x46]);
const schemaEndSplit2 = Buffer.from([0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x3E, 0x00, 0x00, 0x00, 0xB3, 0x09, 0x70, 0x00, 0x93, 0xF0, 0x23, 0xEF, 0xBB, 0xBF, 0x3C, 0x3F, 0x78, 0x6D, 0x6C, 0x20, 0x76]);

// X SCENARIO: schema start and part of schema text in one chunk, rest of schema text in the other chunk
const startAndSchemaSplit1 = Buffer.from([0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x3D, 0x6E, 0xF0, 0x07, 0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x15, 0x00, 0xF3, 0x07, 0x63, 0x68, 0x69, 0x73]);
const startAndSchemaSplit2 = Buffer.from([0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x21, 0x00, 0xF2, 0x09, 0x4D, 0x61, 0x64, 0x64, 0x65, 0x6E, 0x32, 0x30, 0x5F, 0x47, 0x65, 0x6E, 0x34, 0x5F, 0x43, 0x46, 0x4D, 0x2E, 0x4D, 0x32, 0x30, 0x5F, 0x4D, 0x4C, 0x28, 0x00, 0xF3, 0x02, 0x4D, 0x61, 0x6A, 0x6F, 0x72, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x3D, 0x22, 0x33, 0x34]);

// X SCENARIO: schema text is split between two chunks
const schemaTextSplit1 = Buffer.from([0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x3D, 0x6E, 0xF0, 0x07, 0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x15, 0x00, 0xF3, 0x07, 0x63, 0x68, 0x69, 0x73, 0x65, 0x2D]);
const schemaTextSplit2 = Buffer.from([0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x21, 0x00, 0xF2, 0x09, 0x4D, 0x61, 0x64, 0x64, 0x65, 0x6E, 0x32, 0x30, 0x5F, 0x47, 0x65, 0x6E]);

// X SCENARIO: schema start is in the chunk, but the schema text is not
const schemaStartFalsePositive = Buffer.from([0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x42, 0x87, 0xF7, 0x11, 0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x22, 0x20, 0x69, 0x64, 0x78, 0x3D, 0x22, 0x32, 0x30, 0x22, 0x20, 0x76, 0x61, 0x6C, 0x75, 0x65, 0x3D, 0x22, 0x31, 0x38, 0x22, 0x11, 0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x22, 0x20, 0x69, 0x64, 0x78, 0x3D, 0x22, 0x32, 0x30, 0x22, 0x20, 0x76, 0x61, 0x6C, 0x75, 0x65, 0x3D, 0x22, 0x31, 0x38, 0x22, 0x11, 0x43, 0x6F, 0x6C, 0x6F, 0x72, 0x22, 0x20, 0x69, 0x64, 0x78, 0x3D, 0x22, 0x32, 0x30, 0x22, 0x20, 0x76, 0x61, 0x6C, 0x75, 0x65, 0x3D, 0x22, 0x31, 0x38, 0x22]);

// X SCENARIO: part of the schema start is in the first chunk, but the second chunk doesn't include the rest of the match.
const schemaStartSplitFalsePositive1 = schemaStartSplit1;
const schemaStartSplitFalsePositive2 = schemaTextSplit2;

// X SCENARIO: part of the schema end is in the first chunk, but the next chunk doesn't include the rest of the match.
const schemaEndSplitFalsePositive1 = schemaEndSplit1;
const schemaEndSplitFalsePositive2 = schemaTextSplit2;

// X SCENARIO: part of the schema text is in the first chunk, but the next chunk doesn't include the rest of the match.
const schemaTextSplitFalsePositive1 = schemaTextSplit1;
const schemaTextSplitFalsePositive2 = startAndSchemaSplit1;

// X SCENARIO: the first chunk contains part of the schema start, the next chunk contains the rest, but there is a partial match before the real match starts.
const schemaStartSplitMisleading1 = Buffer.from([0x00, 0x11, 0x00, 0x08, 0x0C, 0x87, 0x12, 0x00, 0x00, 0x43, 0x40, 0x40, 0xD0, 0x03, 0x5B, 0x1D, 0x20, 0xC3, 0xA2, 0x38, 0x00, 0x2C, 0xF3, 0xF2, 0x15, 0x01, 0x04, 0xE0, 0x00, 0x0F, 0x30, 0x09, 0x05, 0x80, 0xC4, 0x51, 0x00, 0x00, 0x3E, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00]);
const schemaStartSplitMisleading2 = schemaStartSplit2;

// X SCENARIO: schema start is in one chunk and schema text is in another
const schemaStartAndTextSplit1 = Buffer.from([0x03, 0x5B, 0x1D, 0x20, 0xC3, 0xA2, 0x38, 0x00, 0x2C, 0xF3, 0xF2, 0x15, 0x01, 0x04, 0xE0, 0x00, 0x0F, 0x30, 0x09, 0x05, 0x80, 0xC4, 0x51, 0x00, 0x00, 0x3E, 0x16, 0x1F, 0x2B, 0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x3D, 0x6E, 0xF0, 0x07]);
const schemaStartAndTextSplit2 = Buffer.from([0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x15, 0x00, 0xF3, 0x07, 0x63, 0x68, 0x69, 0x73, 0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x21, 0x00, 0xF2, 0x09, 0x4D, 0x61, 0x64, 0x64, 0x65, 0x6E, 0x32, 0x30, 0x5F, 0x47, 0x65]);

describe('schema search service - unit tests', () => {
  beforeEach(() => {
    chunks = [];
    expectedSchema = null;
  });

  describe('normal scenarios', () => {
    it('start and text in one chunk, end in another chunk', async () => {
      chunks = [
        schemaStartInChunk,
        schemaEndInChunk
      ];
  
      expectedSchema = Buffer.concat(chunks);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it('start in one chunk, text in another, and end in a third', async () => {
      chunks = [
        schemaStartAndTextSplit1,
        schemaStartAndTextSplit2,
        schemaEnd
      ];

      expectedSchema = Buffer.concat([Buffer.from([0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x3D, 0x6E, 0xF0, 0x07]), schemaStartAndTextSplit2, schemaEnd]);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it('schema start is in the chunk, but the schema text is not', async () => {
      chunks = [
        schemaStartFalsePositive,
        schemaEnd
      ];

      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(0);
    });

    it('schema start is in the chunk, but text is not found in the next chunk', async () => {
      // slightly different case because the beginning check is found at the end of the chunk, so we need to check for the schema text in the next chunk
      // in the test case above, the beginning check is found at the beginning of the chunk, so no extra check is necessary
      chunks = [
        schemaStartFalsePositive.slice(0, 20),
        schemaEnd
      ];

      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(0);
    });
  });

  describe('rare scenarios', () => {
    it('schema start split between two chunks', async () => {
      chunks = [
        schemaStartSplit1,
        schemaStartSplit2,
        schemaEnd
      ];

      expectedSchema = Buffer.concat([Buffer.from([0x00, 0x01, 0x00, 0x00]), schemaStartSplit2, schemaEnd]);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it ('schema end split between two chunks', async () => {
      chunks = [
        schemaStart,
        schemaText,
        schemaEndSplit1,
        schemaEndSplit2
      ];

      expectedSchema = Buffer.concat([schemaStart, schemaText, schemaEndSplit1, Buffer.from([0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x3E])]);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it('schema text is split between two chunks', async () => {
      chunks = [
        schemaTextSplit1,
        schemaTextSplit2,
        schemaEnd
      ];

      expectedSchema = Buffer.concat(chunks);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it('part of the schema start is in the first chunk, but the next chunk does not match', async () => {
      chunks = [
        schemaStartSplitFalsePositive1,
        schemaStartSplitFalsePositive2,
        schemaEnd
      ];

      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(0);
    });

    it('part of the schema end is in the first chunk, but the next chunk doesnt include the rest of the match.', async () => {
      chunks = [
        schemaStartInChunk,
        schemaEndSplitFalsePositive1,
        schemaEndSplitFalsePositive2,
        schemaEnd
      ];

      expectedSchema = Buffer.concat(chunks);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it('part of the schema text is in the first chunk, but the next chunk doesnt include the rest of the match.', async () => {
      chunks = [
        schemaTextSplitFalsePositive1,
        schemaTextSplitFalsePositive2,
        schemaEnd
      ];

      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(0);
    });

    it('partial match before real match, beginning in one chunk and text in the next', async () => {
      chunks = [
        schemaStartSplitMisleading1,
        schemaStartSplitMisleading2,
        schemaEnd
      ];

      expectedSchema = Buffer.concat([Buffer.from([0x00, 0x01, 0x00, 0x00]), schemaStartSplitMisleading2, schemaEnd]);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it('chunk beginning and end index before schema text in same chunk', async () => {
      // When the chunk begins and the schema file ends, and then a new schema file starts with the schema text all in the same chunk. 
      // The chunk beginning and schema end should not be included. This should result in two files, but the example below should not result in any files.
      chunks = [
        Buffer.concat([schemaStart, Buffer.from([0x2A, 0x09, 0x05, 0xCB, 0x14, 0x0C, 0x6E, 0x04, 0x0F, 0x49, 0x3D, 0x0C, 0x04, 0x7E, 0x04, 0xF0, 0x02, 0x73, 0x3E, 0x0D, 0x0A, 0x3C, 0x2F, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x3E, 0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x3D, 0x62, 0xF0, 0x07, 0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x15, 0x00, 0xF3, 0x07, 0x63, 0x68, 0x69, 0x73, 0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x21, 0x00, 0xF2, 0x09, 0x4D, 0x61, 0x64, 0x64, 0x65, 0x6E, 0x32, 0x30, 0x5F, 0x47, 0x65, 0x6E, 0x34, 0x5F, 0x43, 0x46, 0x4D, 0x2E, 0x4D, 0x32, 0x30, 0x5F, 0x52, 0x4C, 0x28, 0x00, 0xF3, 0x02, 0x4D, 0x61, 0x6A, 0x6F, 0x72, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x3D, 0x22, 0x33, 0x36, 0x38, 0x17, 0x00, 0x27, 0x69, 0x6E, 0x17, 0x00, 0x12, 0x30, 0x15, 0x00, 0x40, 0x52, 0x65, 0x76, 0x69, 0x28, 0x00, 0x05, 0x2F, 0x00, 0x52, 0x36, 0x22, 0x20, 0x69])])
      ];

      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(0);
    });

    it('two instances of the chunk start happen in the same chunk', async () => {
      chunks = [
        Buffer.concat([
          schemaStart, 
          Buffer.from([0x2A, 0x09, 0x05, 0xCB, 0x14, 0x0C, 0x6E, 0x04, 0x0F, 0x49, 0x3D, 0x0C, 0x04, 0x7E, 0x04, 0xF0, 0x02, 0x73, 0x3E, 0x0D, 0x0A, 0x3C, 0x2F, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x3E, 0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x3D, 0x62, 0xF0, 0x07, 0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x15, 0x00, 0xF3, 0x07, 0x63, 0x68, 0x69, 0x73, 0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x21, 0x00, 0xF2, 0x09, 0x4D, 0x61, 0x64, 0x64, 0x65, 0x6E, 0x32, 0x30, 0x5F, 0x47, 0x65, 0x6E, 0x34, 0x5F, 0x43, 0x46, 0x4D, 0x2E, 0x4D, 0x32, 0x30, 0x5F, 0x52, 0x4C, 0x28, 0x00, 0xF3, 0x02, 0x4D, 0x61, 0x6A, 0x6F, 0x72, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x3D, 0x22, 0x33, 0x36, 0x38, 0x17, 0x00, 0x27, 0x69, 0x6E, 0x17, 0x00, 0x12, 0x30, 0x15, 0x00, 0x40, 0x52, 0x65, 0x76, 0x69, 0x28, 0x00, 0x05, 0x2F, 0x00, 0x52, 0x36, 0x22, 0x20, 0x69])
        ]),
        schemaEnd
      ];

      expectedSchema = Buffer.concat([Buffer.from([0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x3D, 0x62, 0xF0, 0x07, 0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x15, 0x00, 0xF3, 0x07, 0x63, 0x68, 0x69, 0x73, 0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x21, 0x00, 0xF2, 0x09, 0x4D, 0x61, 0x64, 0x64, 0x65, 0x6E, 0x32, 0x30, 0x5F, 0x47, 0x65, 0x6E, 0x34, 0x5F, 0x43, 0x46, 0x4D, 0x2E, 0x4D, 0x32, 0x30, 0x5F, 0x52, 0x4C, 0x28, 0x00, 0xF3, 0x02, 0x4D, 0x61, 0x6A, 0x6F, 0x72, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x3D, 0x22, 0x33, 0x36, 0x38, 0x17, 0x00, 0x27, 0x69, 0x6E, 0x17, 0x00, 0x12, 0x30, 0x15, 0x00, 0x40, 0x52, 0x65, 0x76, 0x69, 0x28, 0x00, 0x05, 0x2F, 0x00, 0x52, 0x36, 0x22, 0x20, 0x69]), schemaEnd]);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it('two schemas start and end next to each other. the end and start are in the same chunk', async () => {
      chunks = [
        schemaStart,
        schemaText,
        Buffer.from([0x2A, 0x09, 0x05, 0xCB, 0x14, 0x0C, 0x6E, 0x04, 0x0F, 0x49, 0x3D, 0x0C, 0x04, 0x7E, 0x04, 0xF0, 0x02, 0x73, 0x3E, 0x0D, 0x0A, 0x3C, 0x2F, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x3E, 0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x3D, 0x62, 0xF0, 0x07, 0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x15, 0x00, 0xF3, 0x07, 0x63, 0x68, 0x69, 0x73, 0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x21, 0x00, 0xF2, 0x09, 0x4D, 0x61, 0x64, 0x64, 0x65, 0x6E, 0x32, 0x30, 0x5F, 0x47, 0x65, 0x6E, 0x34, 0x5F, 0x43, 0x46, 0x4D, 0x2E, 0x4D, 0x32, 0x30, 0x5F, 0x52, 0x4C, 0x28, 0x00, 0xF3, 0x02, 0x4D, 0x61, 0x6A, 0x6F, 0x72, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x3D, 0x22, 0x33, 0x36, 0x38, 0x17, 0x00, 0x27, 0x69, 0x6E, 0x17, 0x00, 0x12, 0x30, 0x15, 0x00, 0x40, 0x52, 0x65, 0x76, 0x69, 0x28, 0x00, 0x05, 0x2F, 0x00, 0x52, 0x36, 0x22, 0x20, 0x69]),
        schemaEnd
      ];

      expectedSchema = [
        Buffer.concat([schemaStart, schemaText, Buffer.from([0x2A, 0x09, 0x05, 0xCB, 0x14, 0x0C, 0x6E, 0x04, 0x0F, 0x49, 0x3D, 0x0C, 0x04, 0x7E, 0x04, 0xF0, 0x02, 0x73, 0x3E, 0x0D, 0x0A, 0x3C, 0x2F, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x3E])]),
        Buffer.concat([Buffer.from([0x00, 0x01, 0x00, 0x00, 0x09, 0x70, 0x3D, 0x62, 0xF0, 0x07, 0x3C, 0x46, 0x72, 0x61, 0x6E, 0x54, 0x6B, 0x44, 0x61, 0x74, 0x61, 0x20, 0x66, 0x69, 0x6C, 0x65, 0x4E, 0x61, 0x6D, 0x65, 0x3D, 0x22, 0x15, 0x00, 0xF3, 0x07, 0x63, 0x68, 0x69, 0x73, 0x65, 0x2D, 0x53, 0x63, 0x68, 0x65, 0x6D, 0x61, 0x73, 0x22, 0x20, 0x64, 0x61, 0x74, 0x61, 0x62, 0x61, 0x73, 0x21, 0x00, 0xF2, 0x09, 0x4D, 0x61, 0x64, 0x64, 0x65, 0x6E, 0x32, 0x30, 0x5F, 0x47, 0x65, 0x6E, 0x34, 0x5F, 0x43, 0x46, 0x4D, 0x2E, 0x4D, 0x32, 0x30, 0x5F, 0x52, 0x4C, 0x28, 0x00, 0xF3, 0x02, 0x4D, 0x61, 0x6A, 0x6F, 0x72, 0x56, 0x65, 0x72, 0x73, 0x69, 0x6F, 0x6E, 0x3D, 0x22, 0x33, 0x36, 0x38, 0x17, 0x00, 0x27, 0x69, 0x6E, 0x17, 0x00, 0x12, 0x30, 0x15, 0x00, 0x40, 0x52, 0x65, 0x76, 0x69, 0x28, 0x00, 0x05, 0x2F, 0x00, 0x52, 0x36, 0x22, 0x20, 0x69]), schemaEnd])
      ];

      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(2);
    });

    it('chunk start exists without schema text. actual check and schema text happens after in a different chunk', async () => {
      chunks = [
        schemaStart,
        schemaStartInChunk,
        schemaEndInChunk
      ];

      expectedSchema = Buffer.concat([schemaStartInChunk, schemaEndInChunk]);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it('end, text, and beginning all appear in the chunk but out of order', async () => {
      chunks = [
        Buffer.concat([schemaEndInChunk, schemaStartInChunk, schemaStart]),
        schemaEndInChunk
      ];

      expectedSchema = Buffer.concat([schemaStartInChunk, schemaStart, schemaEndInChunk]);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it('multiple chunk starts happen in one chunk, but only one contains the schema text', async () => {
      chunks = [
        Buffer.concat([schemaStart, schemaStart, schemaStartInChunk]),
        schemaEndInChunk
      ];

      expectedSchema = Buffer.concat([schemaStartInChunk, schemaEndInChunk]);
      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(1);
    });

    it('part of the schema start is in one chunk, the next chunk matches, but does not contain the schema text', async () => {
      chunks = [
        schemaStartSplit1,
        Buffer.from([0x09, 0x70, 0x00, 0x07, 0x57, 0x00, 0x00, 0x02, 0x00, 0xA3, 0x3C, 0x61, 0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65]),
        schemaEndInChunk
      ];

      let s = await schemaSearchService.getSchemasInFile();
      expect(s.length).to.equal(0);
    });
  });
});