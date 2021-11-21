import { Injectable } from '@angular/core';

import * as rangy from 'rangy';

import { TokenPoint } from '../token-point';
import { TokenLocation } from '../token-location';
import { TokenTextLayerLine, TextCoords } from '../models';

// requires rangy:
// npm install --save rangy
// npm install --save @types/rangy

interface TextRange {
  start: number;
  end: number;
}

/**
 * The selected range of text. This reflects rangy's Range useful properties;
 * in fact, you can just pass a Range to any method requiring this parameter type,
 * but this adds a level of indirection useful in testing.
 */
export interface SelectedRange {
  commonAncestorContainer: Node;
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
}

@Injectable({ providedIn: 'root' })
export class TextLayerService {
  private readonly _wsRegex: RegExp;

  constructor() {
    this._wsRegex = new RegExp('^\\s$', 'g');
  }

  private isWhitespace(c: string): boolean {
    if (!c) {
      return false;
    }
    if (c.length !== 1) {
      c = c.charAt(0);
    }
    return this._wsRegex.test(c);
  }

  /**
   * Extract the lines with their tokens from the specified text.
   * @param text the source text.
   * @returns lines.
   */
  public getLines(text: string): TokenTextLayerLine[] {
    const results: TokenTextLayerLine[] = [];
    if (!text) {
      return results;
    }
    const lines = text.split('\n');

    for (let y = 0; y < lines.length; y++) {
      const line = lines[y].trim();
      const l: TokenTextLayerLine = {
        y: y + 1,
        tokens: [],
      };
      let x = 0;
      let xBeg = 0;

      while (x < line.length) {
        if (this.isWhitespace(line.charAt(x))) {
          l.tokens.push(line.substr(xBeg, x - xBeg));
          x++;
          while (x < line.length && this.isWhitespace(line.charAt(x))) {
            x++;
          }
          xBeg = x;
        } else {
          x++;
        }
      }
      if (xBeg < x) {
        l.tokens.push(line.substr(xBeg));
      }
      results.push(l);
    }

    return results;
  }

  /*
   * Rendition: HTML rendering from a base text and a set of fragments locations.
   * Each line in the base text is rendered with p; each token in a line is
   * rendered with its text value, and tokens are separated by space. Layer
   * fragments are rendered inside a span, with an id equal to the fragment location
   * plus a suffix beginning with _, added only for the purpose of ensuring unique
   * IDs in the rendered HTML code. Example:
   * <div>
   *  <p id="y1">this is line 1.</p>
   *  <p id="y2">here's a <span id="f2.3_0">fragment</span>.</p>
   * </div>
   */

  /**
   * Render the opening span for a layer fragment.
   * @param loc location.
   * @param locPortion the index of the token's portion (0-N). This is used
   * to build a unique ID for each HTML span rendering a layer fragment.
   * @param sb the target strings array.
   * @param isSelected true if selected.
   */
  private renderOpeningSpan(
    loc: TokenLocation,
    locPortion: number,
    sb: string[],
    isSelected: boolean
  ): void {
    sb.push(
      `<span id="f${loc.toString()}_${locPortion}" class="fr${
        isSelected ? 'fr-sel' : ''
      }">`
    );
  }

  /**
   * Render the specified token intersecting the specified end-fragment location.
   * @param pt The point.
   * @param token The token.
   * @param sb The target array.
   */
  private renderTokenAtEnd(pt: TokenPoint, token: string, sb: string[]): void {
    if (pt.at) {
      // ...to]
      sb.push(token.substr(pt.at - 1, pt.run));
      sb.push('</span>');
      // ...ken
      if (pt.at - 1 + (pt.run || 0) < token.length) {
        sb.push(token.substr(pt.at - 1 + (pt.run || 0)));
      }
    } else {
      // ...token]
      sb.push(token);
      sb.push('</span>');
    }
  }

  /**
   * Render the specified token intersecting the specified single-point location.
   * The received token starts and ends a single-token range.
   * @param loc location.
   * @param token token.
   * @param sb target strings array.
   * @param isSelected True if the token is selected.
   */
  private renderTokenAtPointStart(
    loc: TokenLocation,
    token: string,
    sb: string[],
    isSelected: boolean
  ): void {
    // 1.token's left-part
    if (loc.primary.at) {
      // to...
      sb.push(token.substr(0, loc.primary.at - 1));
    }

    // 2.span: [
    this.renderOpeningSpan(loc, 0, sb, isSelected);

    // 3.token's right-part (...ken]/...ke]n or ...token])
    this.renderTokenAtEnd(loc.primary, token, sb);
  }

  /**
   * Render the specified token intersecting the specified range start location.
   * The received token starts a multi-tokens range.
   * @param loc location.
   * @param locPortion the index of the token's portion (0-N). This is used
   * to build a unique ID for each HTML span rendering a layer fragment.
   * @param token token.
   * @param sb target strings array.
   * @param isSelected True if the token is selected.
   */
  private renderTokenAtRangeStart(
    loc: TokenLocation,
    token: string,
    sb: string[],
    isSelected: boolean
  ): void {
    // 1.token's left-part (=before at)
    if (loc.primary.at) {
      // to...
      sb.push(token.substr(0, loc.primary.at - 1));
    }

    // 2.span: [
    this.renderOpeningSpan(loc, 0, sb, isSelected);

    // 3.token's right-part (...ken or ...token)
    if (loc.primary.at) {
      // ...ken
      sb.push(token.substr(loc.primary.at - 1));
    } else {
      // ...token
      sb.push(token);
    }
  }

  private renderTokenAtStart(
    loc: TokenLocation,
    token: string,
    sb: string[],
    isSelected: boolean
  ): boolean {
    if (!loc.secondary) {
      // single
      this.renderTokenAtPointStart(loc, token, sb, isSelected);
      return false;
    } else {
      // range
      this.renderTokenAtRangeStart(loc, token, sb, isSelected);
      return true;
    }
  }

  /**
   * Render to HTML the base text decorated with its layer fragments.
   * @param text The base text.
   * @param locations The locations of all the fragments
   * of the same type to be rendered on top of the base text.
   * @param selectedLoc The optional location of the selected
   * fragment if any. The selected fragment gets decorated with an additional
   * class value.
   */
  public render(
    text: string,
    locations?: TokenLocation[],
    selectedLoc?: TokenLocation
  ): string {
    if (!text) {
      return '<div></div>';
    }

    // get lines from text
    const sb: string[] = [];
    const lines = this.getLines(text);
    let loc: TokenLocation | undefined = undefined;
    let tokenSelected = false;

    if (!locations) {
      locations = [];
    }

    // for each line in text
    sb.push('<div>');
    for (let y = 0; y < lines.length; y++) {
      sb.push(`<p id="y${y + 1}">`);

      // reopen a span if continuing a fragment from prev line
      if (loc) {
        this.renderOpeningSpan(loc, y + 1 - loc.primary.y, sb, tokenSelected);
      }

      // for each token in line
      const line = lines[y];
      for (let x = 0; x < line.tokens.length; x++) {
        // add separator if required
        if (x > 0) {
          sb.push(' ');
        }

        const token = line.tokens[x];

        // if inside a fragment, check if this token is the last
        if (loc && loc.secondary) {
          if (loc.secondary.y === y + 1 && loc.secondary.x === x + 1) {
            this.renderTokenAtEnd(loc.secondary, token, sb);
            loc = undefined;
          } else {
            sb.push(token);
          }
        } else {
          // else, check if this token starts a fragment
          loc = locations.find((l) => {
            return l.primary.y === y + 1 && l.primary.x === x + 1;
          });
          if (loc) {
            tokenSelected = selectedLoc ? loc.overlaps(selectedLoc) : false;
            if (!this.renderTokenAtStart(loc, token, sb, tokenSelected)) {
              loc = undefined;
            }
          } else {
            sb.push(token);
          }
        }
      }

      // close a span if pending at p end
      if (loc) {
        sb.push('</span>');
      }
      sb.push('</p>');
    }
    sb.push('</div>');
    return sb.join('');
  }

  /*
    Location: starting from user selection on a rendered text, get the corresponding
    layer fragment location. This differs according to the purpose of the location
    to be got: if getting a location for an existing fragment, at least 1 decorated
    text (span) should be included in the selection, which does not require to be
    exact; if getting a location for a new fragment, no decorated text (span) can be
    included in the selection (two fragments in the same layer can never overlap),
    which must be exact.
  */

  /**
   * Get the Y bounds from the specified selection.
   * @param range The selection range.
   * @param forNew True if getting bounds for a new fragment.
   * @returns Range, inclusive, or undefined.
   */
  private getYBoundsFromRange(
    range: SelectedRange,
    forNew: boolean
  ): TextRange | null {
    let p: Element | null = null;

    switch (range.commonAncestorContainer.nodeType) {
      case Node.TEXT_NODE:
        // single-p selection, parent=p
        p = range.commonAncestorContainer.parentElement;
        if (forNew && (p?.nodeName !== 'P' || !p.hasAttribute('id'))) {
          return null;
        }
        if (p?.nodeName === 'SPAN') {
          p = p.parentElement;
        }
        const y = parseInt(p!.getAttribute('id')!.substr(1), 10);
        // return [y, y];
        return { start: y, end: y };

      case Node.ELEMENT_NODE:
        // div only is allowed; in this case, it's a multi-p range
        if (range.commonAncestorContainer.nodeName !== 'DIV') {
          return null;
        }
        // for each div's child p element:
        let yMin = 0;
        let yMax = 0;
        let inside = false;
        for (
          let i = 0;
          i < range.commonAncestorContainer.childNodes.length;
          i++
        ) {
          const child = range.commonAncestorContainer.childNodes[i];
          if (child.nodeType !== Node.ELEMENT_NODE || child.nodeName !== 'P') {
            continue;
          }
          // check if we're entering the start-p
          if (!inside && child.contains(range.startContainer)) {
            inside = true;
          }
          // collect y if inside
          if (inside) {
            const iy = parseInt(
              (child as Element)!.getAttribute('id')!.substr(1),
              10
            );
            if (!yMin || iy < yMin) {
              yMin = iy;
            }
            if (!yMax || iy > yMax) {
              yMax = iy;
            }
            // check if we have exited the last p
            if (child.contains(range.endContainer)) {
              break;
            }
          }
        }
        return {
          start: yMin,
          end: yMax,
        };
    }
    return null;
  }

  private locatePrevSpace(line: string, index: number): number {
    while (index > -1 && line.charAt(index) !== ' ') {
      index--;
    }
    return index;
  }

  private locateNextSpace(line: string, index: number): number {
    while (index < line.length && line.charAt(index) !== ' ') {
      index++;
    }
    return index === line.length ? -1 : index;
  }

  /**
   * Get the bounds of the token any character of which is indexed
   * by index.
   * @param line The text line.
   * @param index The index to the text line to start from.
   * @returns Bounds where start=index of the first character of the token,
   * and end=index of the character past the token's last character;
   * or null if index was not valid.
   */
  private getTokenBounds(line: string, index: number): TextRange | null {
    if (line.charAt(index) === ' ') {
      return null;
    }
    let start = this.locatePrevSpace(line, index);
    if (start === -1) {
      start = 0;
    } else {
      start++;
    }
    let end = this.locateNextSpace(line, index);
    if (end === -1) {
      end = line.length;
    }
    // return [start, end];
    return {
      start,
      end,
    };
  }

  /**
   * Return the received selection bounds, adjusted to exclude spaces.
   */
  private getAdjustedSelectionBounds(
    selStart: number,
    selEnd: number,
    line: string
  ): TextRange {
    // corner case: if on space, move to right
    if (line.charAt(selStart) === ' ') {
      selStart++;
    }
    // corner case: if included trailing space, move to left
    if (selEnd > 0 && line.charAt(selEnd - 1) === ' ') {
      selEnd--;
    }
    // return [selStart, selEnd];
    return {
      start: selStart,
      end: selEnd,
    };
  }

  /**
   * Get the start coordinates for the selected range and line.
   * @param range The selected range.
   * @param line The reference text line.
   */
  private getStartCoordsFromRange(
    selStart: number,
    selEnd: number,
    line: string
  ): TextCoords {
    // get adjusted selection bounds
    const selBounds = this.getAdjustedSelectionBounds(selStart, selEnd, line);

    // get the bounds of the first selected token
    const tokBounds = this.getTokenBounds(line, selBounds.start)!;

    // calculate x by counting the tokens before the target token
    let x = 1;
    let j = tokBounds.start - 1;
    while (j > -1) {
      if (line.charAt(j) === ' ') {
        x++;
      }
      j--;
    }

    // calculate at,run only when either of these is true:
    // (a) selection starts past the 1st char of the token (al[pha);
    // (b) selection ends before the last char of the token (al]pha);
    // run is calculated only if (b) is true.
    let at = 0;
    let run = 0;
    if (selBounds.start > tokBounds.start || selBounds.end < tokBounds.end) {
      at = 1 + selBounds.start - tokBounds.start;
      run =
        (selBounds.end < tokBounds.end
          ? selBounds.end // al]pha
          : tokBounds.end) - // alpha]
        Math.max(tokBounds.start, selBounds.start);
    }

    return {
      y: 0,
      x,
      at,
      run,
    };
  }

  private getEndCoordsFromRange(
    selStart: number,
    selEnd: number,
    line: string
  ): TextCoords {
    // get adjusted selection bounds
    const selBounds = this.getAdjustedSelectionBounds(selStart, selEnd, line);
    // get the bounds of the last selected token
    const tokBounds = this.getTokenBounds(line, selBounds.end - 1)!;

    // calculate x by counting the tokens before the target token
    let x = 1;
    let j = selBounds.end - 1;
    while (j > -1) {
      if (line.charAt(j) === ' ') {
        x++;
      }
      j--;
    }

    // calculate at,run only when selection ends before the 1st char of the token
    // (al]pha); run is calculated only if at is calculated.
    let at = 0;
    let run = 0;
    if (selBounds.end < tokBounds.end) {
      at =
        selBounds.start > tokBounds.start
          ? 1 + selBounds.start - tokBounds.start
          : 1;
      run = selBounds.end - tokBounds.start;
    }

    return {
      y: 0,
      x,
      at,
      run,
    };
  }

  private getSpanLocFromId(id: string): TokenLocation | null {
    if (!id) {
      return null;
    }
    const r = new RegExp('^f([-\\d+.@x]+)', 'g');
    const m = r.exec(id);
    if (!m) {
      return null;
    }
    return TokenLocation.parse(m[1]);
  }

  private visitNodes(node: Node, visitor: (current: Node) => boolean): void {
    if (!visitor(node)) {
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        this.visitNodes(child, visitor);
      }
    }
  }

  private findFirstDescendantSpan(range: SelectedRange): Element | null {
    let inside = false;
    let span = null;

    this.visitNodes(range.commonAncestorContainer, (current) => {
      if (current === range.startContainer) {
        inside = true;
      }
      if (
        current.nodeType === Node.ELEMENT_NODE &&
        current.nodeName === 'SPAN'
      ) {
        span = current;
        return false;
      }
      if (current === range.endContainer) {
        inside = false;
      }
      return true;
    });

    return span;
  }

  /**
   * Get the base offset for the specified node. This is used
   * when the start container of the selected range has any
   * preceding sibling node, which happens only when you have
   * any spans in the p element (=the line). In this case,
   * the selection offset starts from the start container node,
   * which is preceded by other nodes including other text.
   * As we must get the line-based offset, we have to start
   * from a base offset equal to the sum of the lengths of
   * all the preceding siblings.
   */
  private getNodeBaseOffset(node: Node): number {
    let offset = 0;
    let n: Node | null = node;
    n = node.previousSibling;
    while (n) {
      offset +=
        n.nodeType === Node.ELEMENT_NODE
          ? (n as any).innerText?.length || 0
          : n.textContent?.length || 0;
      n = n.previousSibling;
    }
    return offset;
  }

  /**
   * Get the location corresponding to the user selection,
   * for editing the first fragment included in it.
   * @param range The selected range. You can get it from the
   * current selection using getSelectedRange().
   * @returns The token location or null.
   */
  public getSelectedLocationForEdit(
    range: SelectedRange
  ): TokenLocation | null {
    if (!range) {
      return null;
    }
    // just find the first descendant span in selection
    let span: Element | null = null;
    switch (range.commonAncestorContainer.nodeType) {
      case Node.ELEMENT_NODE:
        span = range.commonAncestorContainer as Element;
        if (span.nodeName !== 'SPAN') {
          span = this.findFirstDescendantSpan(range);
        }
        break;
      case Node.TEXT_NODE:
        span = range.commonAncestorContainer.parentElement;
        if (
          span &&
          (span.nodeType !== Node.ELEMENT_NODE || span.nodeName !== 'SPAN')
        ) {
          span = null;
        }
        break;
    }

    return span ? this.getSpanLocFromId(span.getAttribute('id')!) : null;
  }

  private textLineToString(line: TokenTextLayerLine): string {
    if (!line || !line.tokens) {
      return '';
    }
    return line.tokens.join(' ');
  }

  private buildCoords(
    start: TextCoords,
    end: TextCoords,
    singleToken: boolean
  ): string {
    const sb = [];
    // start: y.x
    sb.push(`${start.y}.${start.x}`);

    if (singleToken) {
      // single token: check for at,run
      if (start.at) {
        sb.push(`@${start.at}`);
        if (start.run && start.run > 1) {
          sb.push(`x${start.run}`);
        }
      }
    } else {
      // not a single token
      // first token
      if (start.at) {
        sb.push(`@${start.at}x${start.run}`);
      }
      // last token
      sb.push(`-${end.y}.${end.x}`);
      if (end.at) {
        sb.push(`@1x${end.run}`);
      }
    }
    return sb.join('');
  }

  /**
   * Recursively find the node matching the specified matcher
   * function, starting from the specified node (included).
   *
   * @param node The node to start from.
   * @param matcher The matcher function, which receives a node
   * to match, and returns 1=match, 0=no match, -1=stop the
   * find operation with a no match.
   */
  private findNode(node: Node, matcher: (n: Node) => number): Node | null {
    // self
    const n = matcher(node);
    if (n === 1) {
      return node;
    }
    if (n === -1) {
      return null;
    }

    // children
    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        const found = this.findNode(child, matcher);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  private selHasAnySpan(range: SelectedRange): boolean {
    let inside = false;
    if (
      // the selected text node must not be child of a span
      range.startContainer.parentElement?.tagName === 'SPAN' ||
      range.startContainer.parentElement?.tagName === 'SPAN' ||
      // the nodes tree from the common ancestor, from the start node
      // up to the end node, must not include any span
      this.findNode(range.commonAncestorContainer, (node: Node) => {
        // start checking only when start node reached
        if (node === range.startContainer) {
          inside = true;
        }
        if (!inside) {
          return 0;
        }
        // stop checking when end node reached
        if (node === range.endContainer) {
          return -1;
        }
        // node cannot be a span
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          (node as Element).tagName === 'SPAN'
        ) {
          return 1;
        }
        return 0;
      })
    ) {
      return true;
    }
    return false;
  }

  /**
   * Get the location corresponding to the user selection,
   * for adding a new fragment with the same extension.
   * @param range The selected range. You can get it from the
   * current selection using getSelectedRange().
   * @param text The full base text.
   * @returns TokenLocation The token location or undefined.
   */
  public getSelectedLocationForNew(
    range: SelectedRange,
    text: string
  ): TokenLocation | null {
    if (!range || this.selHasAnySpan(range)) {
      return null;
    }

    // get y bounds (min, max; equal if single-line)
    const yBounds = this.getYBoundsFromRange(range, true);
    if (!yBounds) {
      return null;
    }

    // get lines and calculate start/end coords
    const lines = this.getLines(text);
    const startLine = this.textLineToString(lines[yBounds.start - 1]);
    const endLine = this.textLineToString(lines[yBounds.end - 1]);

    // get the base offsets
    const startBaseOffset = this.getNodeBaseOffset(range.startContainer);
    const endBaseOffset = this.getNodeBaseOffset(range.endContainer);

    // get the start (including the base offset)
    const startLineEndOffset =
      yBounds.start !== yBounds.end
        ? startLine.length
        : range.endOffset + startBaseOffset;

    const start = this.getStartCoordsFromRange(
      range.startOffset + startBaseOffset,
      startLineEndOffset,
      startLine
    );
    start.y = yBounds.start;

    // get the end (including the base offset)
    const end =
      yBounds.start !== yBounds.end
        ? this.getEndCoordsFromRange(
            0,
            range.endOffset + endBaseOffset,
            endLine
          )
        : this.getEndCoordsFromRange(
            range.startOffset + endBaseOffset,
            range.endOffset + endBaseOffset,
            endLine
          );
    end.y = yBounds.end;
    const singleLine = start.y === end.y;
    const singleToken = singleLine && start.x === end.x;

    const coords = this.buildCoords(start, end, singleToken);
    return TokenLocation.parse(coords);
  }

  /**
   * Get the currently selected range in the browser's document.
   * This uses the rangy library.
   */
  public getSelectedRange(): Range | null {
    const sel = rangy.getSelection();
    if (sel.isCollapsed) {
      return null;
    }
    return sel.getRangeAt(0);
  }
}
