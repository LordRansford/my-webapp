/**
 * Supported File Formats and Data Structures
 * 
 * Comprehensive guide to file formats, their structure, and usage examples
 */

export interface FileFormatInfo {
  extension: string;
  name: string;
  category: "image" | "document" | "audio" | "video" | "data" | "presentation" | "spreadsheet" | "text";
  description: string;
  structure: string;
  example: string;
  commonUse: string;
  dataStructure: string;
  childFriendlyExample: string;
}

export const supportedFormats: FileFormatInfo[] = [
  // Images
  {
    extension: ".jpg, .jpeg",
    name: "JPEG Image",
    category: "image",
    description: "A compressed image format commonly used for photographs. JPEG files are smaller than other formats, making them good for sharing photos online.",
    structure: "The file contains pixel data (coloured dots) arranged in rows and columns. Each pixel has a colour value stored as numbers.",
    example: "A photo of your family holiday, a picture of your pet, a screenshot of your computer screen.",
    commonUse: "Storing photographs, profile pictures, product images, screenshots.",
    dataStructure: "Rows of pixels (picture dots) with colour information. Like a grid where each square has a colour.",
    childFriendlyExample: "Think of it like a colouring book page. Each tiny square (pixel) has a colour, and when you put all the squares together, you get a picture. Like when you colour in a picture square by square."
  },
  {
    extension: ".png",
    name: "PNG Image",
    category: "image",
    description: "An image format that supports transparency (see-through areas) and is good for graphics with sharp edges, like logos or diagrams.",
    structure: "Similar to JPEG but can include transparency information, meaning some pixels can be invisible.",
    example: "A logo with a transparent background, a diagram or chart, a drawing with clear lines.",
    commonUse: "Logos, diagrams, graphics with text, images that need transparent backgrounds.",
    dataStructure: "Pixel grid with colour and transparency data. Some pixels can be completely see-through.",
    childFriendlyExample: "Like a sticker that you can stick on different backgrounds. Some parts of the sticker are see-through, so you can see what's behind it."
  },
  {
    extension: ".gif",
    name: "GIF Image",
    category: "image",
    description: "An image format that can contain multiple frames to create simple animations, like moving pictures.",
    structure: "Contains multiple image frames that play in sequence to create animation.",
    example: "A short animated clip, a moving logo, a simple animation.",
    commonUse: "Simple animations, memes, short video clips converted to GIF format.",
    dataStructure: "A series of still images (frames) that play one after another, like a flipbook.",
    childFriendlyExample: "Like a flipbook where you draw a picture on each page, and when you flip through the pages quickly, the picture appears to move."
  },
  
  // Documents
  {
    extension: ".pdf",
    name: "PDF Document",
    category: "document",
    description: "A document format that looks the same on any device. PDF stands for Portable Document Format. It preserves the exact layout, fonts, and formatting of a document.",
    structure: "Contains text, images, and formatting instructions arranged in pages. The structure is like a book with numbered pages.",
    example: "A report, an invoice, a form to fill out, a manual or guide, a contract.",
    commonUse: "Official documents, forms, reports, manuals, documents that need to look the same everywhere.",
    dataStructure: "Pages containing text blocks, images, and formatting. Each page is like a sheet of paper with content arranged on it.",
    childFriendlyExample: "Like a printed book or worksheet. It has pages with words and pictures arranged exactly as the author intended. You can read it, but you usually cannot change it easily."
  },
  {
    extension: ".doc, .docx",
    name: "Microsoft Word Document",
    category: "document",
    description: "A document format created by Microsoft Word. It can contain text, images, tables, and formatting. You can edit and change the content.",
    structure: "Contains paragraphs of text, images, tables, and formatting (like bold, italic, colours). The structure is like a notebook where you can write and edit.",
    example: "A letter, an essay, a report you are writing, a document with tables and images.",
    commonUse: "Writing letters, creating reports, drafting documents, documents that need editing.",
    dataStructure: "Text organised into paragraphs, with formatting applied. Can include embedded images and tables. Like a digital notebook.",
    childFriendlyExample: "Like a digital notebook where you can write stories, add pictures, make words bold or colourful, and change things whenever you want."
  },
  {
    extension: ".txt",
    name: "Text File",
    category: "text",
    description: "A simple file containing only text, with no formatting. It is the simplest type of document file.",
    structure: "Just plain text characters arranged in lines. No colours, no bold text, no images. Just words.",
    example: "A list of notes, a simple story, code instructions, a recipe written in plain text.",
    commonUse: "Simple notes, code files, data that needs to be read by computers, plain text lists.",
    dataStructure: "Lines of text characters. Each line ends with a special character that tells the computer to start a new line.",
    childFriendlyExample: "Like writing on a plain piece of paper with a pencil. Just words, no colours or decorations. Very simple and easy to read."
  },
  
  // Presentations
  {
    extension: ".ppt, .pptx",
    name: "PowerPoint Presentation",
    category: "presentation",
    description: "A presentation format created by Microsoft PowerPoint. It contains slides with text, images, and animations, like a digital slideshow.",
    structure: "Contains multiple slides, each with content like text, images, and shapes. Slides are arranged in order.",
    example: "A school presentation, a business pitch, a photo slideshow, a lesson or tutorial.",
    commonUse: "Presentations, slideshows, educational content, business pitches.",
    dataStructure: "An ordered list of slides. Each slide contains text boxes, images, and other elements positioned on the slide canvas.",
    childFriendlyExample: "Like a stack of cards, each with a picture and some words. You show them one at a time, like telling a story with picture cards."
  },
  
  // Audio
  {
    extension: ".mp3",
    name: "MP3 Audio",
    category: "audio",
    description: "A compressed audio format commonly used for music and sound recordings. MP3 files are smaller than other audio formats while maintaining good quality.",
    structure: "Contains sound wave data compressed into a digital format. The structure is like a recording of sound vibrations.",
    example: "A song, a voice recording, a podcast episode, sound effects, an audio book.",
    commonUse: "Music files, podcasts, voice recordings, audio books, sound effects.",
    dataStructure: "Sound wave samples recorded at regular intervals. Like taking a snapshot of the sound many times per second.",
    childFriendlyExample: "Like recording your voice on a tape recorder, but stored on a computer. It captures how sound waves move through the air and saves them as numbers."
  },
  {
    extension: ".wav",
    name: "WAV Audio",
    category: "audio",
    description: "An uncompressed audio format that preserves the original sound quality. WAV files are larger than MP3 but have better quality.",
    structure: "Contains raw sound wave data without compression. Like a high-quality recording.",
    example: "A high-quality music recording, a professional voice recording, audio for editing.",
    commonUse: "Professional audio recordings, music production, audio editing, high-quality sound files.",
    dataStructure: "Uncompressed sound samples. More detailed than MP3, like a high-resolution photograph versus a compressed one.",
    childFriendlyExample: "Like a very clear recording where you can hear every detail, like recording with a very good microphone that captures everything perfectly."
  },
  
  // Video
  {
    extension: ".mp4",
    name: "MP4 Video",
    category: "video",
    description: "A video format that combines moving pictures and sound. MP4 is widely supported and provides good quality with reasonable file sizes.",
    structure: "Contains video frames (still images) and audio tracks combined together. Like a film strip with sound.",
    example: "A video of your holiday, a tutorial video, a movie clip, a recorded presentation.",
    commonUse: "Video recordings, movies, tutorials, video presentations, video calls recordings.",
    dataStructure: "A sequence of video frames (images) played quickly, combined with audio. Like a flipbook with sound.",
    childFriendlyExample: "Like a movie or TV show. It has moving pictures (like a flipbook) and sound playing together, so you see and hear things happening."
  },
  
  // Data
  {
    extension: ".csv",
    name: "CSV (Comma Separated Values)",
    category: "data",
    description: "A simple text file format for storing data in tables. Each line is a row, and values are separated by commas. CSV stands for Comma Separated Values.",
    structure: "Text file where each line represents a row, and values are separated by commas. The first line often contains column names.",
    example: "A list of contacts with names and emails, sales data, a spreadsheet exported to CSV, survey results.",
    commonUse: "Data export from spreadsheets, simple databases, lists of information, data that needs to be shared between programs.",
    dataStructure: "Rows of text, with values separated by commas. Like a table written in plain text, where commas separate the columns.",
    childFriendlyExample: "Like writing a list in a notebook, where each line is a new item, and you use commas to separate different pieces of information. For example: Name, Age, Favourite Colour. Alice, 8, Blue. Bob, 9, Red."
  },
  {
    extension: ".json",
    name: "JSON (JavaScript Object Notation)",
    category: "data",
    description: "A text-based format for storing and sharing data. JSON is structured using curly braces and square brackets to organise information. It is commonly used by computer programs.",
    structure: "Uses curly braces {} for objects (things with properties) and square brackets [] for lists. Properties are written as 'name': 'value' pairs.",
    example: "Configuration settings, API data, structured information that programs need to read, data from websites.",
    commonUse: "Storing application settings, sharing data between programs, API responses, configuration files.",
    dataStructure: "Hierarchical structure using objects and arrays. Objects contain properties (like a person has a name and age), arrays contain lists of items.",
    childFriendlyExample: "Like organising information in boxes. A big box (object) can contain smaller boxes (properties), and you can have lists of boxes (arrays). For example: { 'name': 'Alice', 'age': 8, 'toys': ['doll', 'ball'] } means Alice is 8 years old and has a doll and a ball."
  },
  {
    extension: ".xlsx, .xls",
    name: "Excel Spreadsheet",
    category: "spreadsheet",
    description: "A spreadsheet format created by Microsoft Excel. It contains data organised in rows and columns, like a digital table. You can perform calculations and create charts.",
    structure: "Contains worksheets (tabs) with grids of cells. Each cell can contain text, numbers, or formulas that calculate values.",
    example: "A budget spreadsheet, a list of students and their grades, sales data with calculations, a schedule or calendar.",
    commonUse: "Financial records, data analysis, lists with calculations, charts and graphs, schedules.",
    dataStructure: "A grid of cells organised in rows and columns. Cells can contain values, formulas, or formatting. Like a digital table with calculations.",
    childFriendlyExample: "Like a big table where you can write numbers and words in boxes (cells). You can make the computer do maths for you, like adding up numbers in a column. It is like a calculator combined with a notebook."
  }
];

export function getFormatsByCategory(category: FileFormatInfo["category"]) {
  return supportedFormats.filter(f => f.category === category);
}

export function getFormatByExtension(extension: string): FileFormatInfo | undefined {
  const ext = extension.toLowerCase().replace(/^\./, "");
  return supportedFormats.find(f => 
    f.extension.toLowerCase().split(", ").some(e => e.replace(/^\./, "") === ext)
  );
}

export function getAllFormats(): FileFormatInfo[] {
  return supportedFormats;
}



