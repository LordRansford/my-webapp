/**
 * Read Aloud system using SpeechSynthesis API
 * Browser-only, free, privacy-preserving
 */

export interface ReadAloudOptions {
  rate?: number;
  pitch?: number;
  voice?: SpeechSynthesisVoice;
  highlight?: boolean;
  onChunkStart?: (element: Element) => void;
  onChunkEnd?: (element: Element) => void;
}

export class ReadAloudEngine {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;
  private currentChunkIndex = 0;
  private chunks: Element[] = [];
  private highlightClass = "read-aloud-highlight";
  private options: ReadAloudOptions;

  constructor(options: ReadAloudOptions = {}) {
    this.synth = window.speechSynthesis;
    this.options = {
      rate: 1.0,
      pitch: 1.0,
      highlight: true,
      ...options,
    };
  }

  /**
   * Select the best available voice for the user's language
   */
  selectBestVoice(): SpeechSynthesisVoice | null {
    const voices = this.synth.getVoices();
    if (voices.length === 0) return null;

    const lang = navigator.language || "en-US";
    const preferredLang = lang.split("-")[0];

    // Prefer local voices over remote
    const localVoices = voices.filter((v) => v.localService);
    const candidates = localVoices.length > 0 ? localVoices : voices;

    // Try to find a voice matching the user's language
    let best = candidates.find((v) => v.lang.startsWith(preferredLang));
    if (best) return best;

    // Fall back to English
    best = candidates.find((v) => v.lang.startsWith("en"));
    if (best) return best;

    // Fall back to first available
    return candidates[0] || null;
  }

  /**
   * Extract meaningful text content from main element
   * Excludes navigation, headers, footers, and interactive elements
   * Reads top-down, everything on the screen
   */
  extractContent(mainElement: HTMLElement | null): Element[] {
    if (!mainElement) {
      // Fallback to body if no element provided
      mainElement = document.body;
    }

    const chunks: Element[] = [];
    const walker = document.createTreeWalker(
      mainElement,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Handle element nodes
          if (node.nodeType === 1) { // Node.ELEMENT_NODE
            const el = node as Element;
            const tagName = el.tagName.toLowerCase();
            
            // Skip hidden or script elements
            if (
              ["script", "style", "noscript", "iframe", "svg", "canvas"].includes(tagName) ||
              el.hasAttribute("hidden") ||
              el.getAttribute("aria-hidden") === "true" ||
              el.classList.contains("read-aloud-highlight")
            ) {
              return NodeFilter.FILTER_REJECT;
            }

            // Skip navigation, headers, footers when reading main content
            // But allow them if we're reading from body (fallback)
            if (mainElement !== document.body) {
              if (
                el.closest("nav, header, footer, aside[role='complementary'], .skip-link") !== null
              ) {
                return NodeFilter.FILTER_REJECT;
              }
            }

            // Include headings, paragraphs, list items, and other meaningful content
            if (
              ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote", "dd", "dt", "td", "th", "div", "section", "article"].includes(
                tagName
              )
            ) {
              // Only include if it has meaningful text content
              const text = el.textContent?.trim() || "";
              if (text.length > 0 && !el.querySelector("script, style, canvas")) {
                return NodeFilter.FILTER_ACCEPT;
              }
            }
          }

          // Handle text nodes
          if (node.nodeType === 3) { // Node.TEXT_NODE
            const text = node.textContent?.trim() || "";
            if (text.length > 5) {
              // Include substantial text nodes
              return NodeFilter.FILTER_ACCEPT;
            }
          }

          return NodeFilter.FILTER_SKIP;
        },
      }
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 1) { // Node.ELEMENT_NODE
        const el = node as Element;
        const text = el.textContent?.trim() || "";
        // Only add if it's a direct text container or has no nested text containers
        if (text.length > 0) {
          const hasNestedTextElements = el.querySelector("h1, h2, h3, h4, h5, h6, p, li");
          if (!hasNestedTextElements || ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li"].includes(el.tagName.toLowerCase())) {
            chunks.push(el);
          }
        }
      } else if (node.nodeType === 3) { // Node.TEXT_NODE
        const text = node.textContent?.trim() || "";
        if (text.length > 5) {
          // Wrap text node in a span for highlighting
          const span = document.createElement("span");
          span.textContent = text;
          const parent = node.parentNode;
          if (parent) {
            parent.replaceChild(span, node);
            chunks.push(span);
          }
        }
      }
    }

    return chunks;
  }

  /**
   * Extract text from selected content
   */
  extractSelection(): Element[] {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return [];

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    // Get the parent element
    const parent =
      container.nodeType === 3 // Node.TEXT_NODE
        ? (container.parentElement as HTMLElement)
        : (container as HTMLElement);

    if (!parent) return [];

    // Extract text from the selected range
    const text = range.toString().trim();
    if (text.length === 0) return [];

    // Create a temporary span for the selection
    const span = document.createElement("span");
    span.textContent = text;
    return [span];
  }

  /**
   * Chunk text for better fluency with natural pauses
   */
  chunkText(text: string): string[] {
    // Split by sentence boundaries
    const sentences = text.split(/([.!?]+\s+)/).filter((s) => s.trim().length > 0);

    const chunks: string[] = [];
    let currentChunk = "";

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      currentChunk += sentence;

      // Create chunks of 2-3 sentences for natural pauses
      if ((i + 1) % 2 === 0 || currentChunk.length > 200) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text];
  }

  /**
   * Start reading content
   */
  async readContent(mainElement: HTMLElement | null, useSelection = false): Promise<void> {
    if (this.isPlaying) {
      this.stop();
      return;
    }

    // Wait for voices to load
    await this.waitForVoices();

    const chunks = useSelection ? this.extractSelection() : this.extractContent(mainElement);
    if (chunks.length === 0) {
      console.warn("No content to read");
      return;
    }

    this.chunks = chunks;
    this.currentChunkIndex = 0;
    this.isPlaying = true;

    // Remove existing highlights
    this.clearHighlights();

    this.readNextChunk();
  }

  private async waitForVoices(): Promise<void> {
    return new Promise((resolve) => {
      if (this.synth.getVoices().length > 0) {
        resolve();
        return;
      }

      this.synth.onvoiceschanged = () => {
        resolve();
      };

      // Timeout after 1 second
      setTimeout(resolve, 1000);
    });
  }

  private readNextChunk(): void {
    if (this.currentChunkIndex >= this.chunks.length) {
      this.isPlaying = false;
      this.clearHighlights();
      return;
    }

    const chunk = this.chunks[this.currentChunkIndex];
    const text = chunk.textContent?.trim() || "";

    if (text.length === 0) {
      this.currentChunkIndex++;
      this.readNextChunk();
      return;
    }

    // Highlight current chunk
    if (this.options.highlight) {
      chunk.classList.add(this.highlightClass);
      chunk.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    this.options.onChunkStart?.(chunk);

    // Create utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = this.options.rate || 1.0;
    this.utterance.pitch = this.options.pitch || 1.0;
    this.utterance.voice = this.options.voice || this.selectBestVoice();

    // Add pause between chunks for fluency
    this.utterance.rate = (this.options.rate || 1.0) * 0.95; // Slightly slower for natural pauses

    this.utterance.onend = () => {
      this.options.onChunkEnd?.(chunk);
      if (this.options.highlight) {
        chunk.classList.remove(this.highlightClass);
      }
      this.currentChunkIndex++;
      // Small delay between chunks
      setTimeout(() => {
        if (this.isPlaying) {
          this.readNextChunk();
        }
      }, 100);
    };

    this.utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      this.stop();
    };

    this.synth.speak(this.utterance);
  }

  /**
   * Stop reading
   */
  stop(): void {
    this.isPlaying = false;
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.clearHighlights();
    this.utterance = null;
    this.currentChunkIndex = 0;
    this.chunks = [];
  }

  /**
   * Pause reading
   */
  pause(): void {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  /**
   * Resume reading
   */
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Clear all highlights
   */
  private clearHighlights(): void {
    document.querySelectorAll(`.${this.highlightClass}`).forEach((el) => {
      el.classList.remove(this.highlightClass);
    });
  }

  /**
   * Check if currently playing
   */
  get playing(): boolean {
    return this.isPlaying;
  }
}

