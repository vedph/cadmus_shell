import { Injectable } from '@angular/core';
import { ApparatusEntry, ApparatusFragment } from '../apparatus-fragment';

@Injectable({
  providedIn: 'root',
})
export class ApparatusEntrySummaryService {
  // https://newbedev.com/array-groupby-in-typescript

  /**
   * Group the specified list by some key.
   *
   * @param list The list to group.
   * @param getKey The function returning a key for each item in list.
   * @returns Object with a property named after each group key, being
   * an array of grouped items.
   */
  private groupBy<T, K extends keyof any>(list: T[], getKey: (item: T) => K) {
    list.reduce((previous, currentItem) => {
      const group = getKey(currentItem);
      if (!previous[group]) previous[group] = [];
      previous[group].push(currentItem);
      return previous;
    }, {} as Record<K, T[]>);
  }

  private appendTextSpan(classes: string, content: string, sb: string[]): void {
    sb.push(`<span class="${classes}">${content}</span>`);
  }

  private appendEntry(entry: ApparatusEntry, sb: string[]): void {
    // tag
    if (entry.tag) {
      this.appendTextSpan('adpar-etag', entry.tag, sb);
    }

    // value (normValue) where isAccepted is a class
    if (entry.value) {
      sb.push(' ');
      this.appendTextSpan(
        'adpar-value' + (entry.isAccepted ? ' adpar-accepted' : ''),
        entry.value,
        sb
      );
      if (entry.normValue) {
        sb.push(' (');
        this.appendTextSpan('adpar-norm-value', entry.normValue, sb);
        sb.push(')');
      }
    }

    // note
    if (entry.note) {
      sb.push(' ');
      this.appendTextSpan('adpar-note', entry.note, sb);
    }

    // witnesses
    if (entry.witnesses?.length) {
      for (let i = 0; i < entry.witnesses.length; i++) {
        sb.push(' ');
        const witness = entry.witnesses[i];
        this.appendTextSpan('adpar-wit-v', witness.value, sb);
        if (witness.note) {
          sb.push(' ');
          this.appendTextSpan('adpar-wit-n', witness.note, sb);
        }
      }
    }

    // authors
    if (entry.authors?.length) {
      for (let i = 0; i < entry.authors.length; i++) {
        sb.push(' ');
        const author = entry.authors[i];

        // tag
        if (author.tag) {
          this.appendTextSpan('adpar-aut-t', author.tag, sb);
        }
        // value
        this.appendTextSpan('adpar-aut-v', author.value, sb);
        // note
        if (author.note) {
          sb.push(' ');
          this.appendTextSpan('adpar-aut-n', author.note, sb);
        }
        // location
        if (author.location) {
          sb.push(' ');
          this.appendTextSpan('adpar-aut-l', author.location, sb);
        }
      }
    }
  }

  /**
   * Build the summary for the specified apparatus fragment.
   *
   * @param fr The fragment to build summary of.
   * @returns HTML code representing the summary.
   */
  public build(fr: ApparatusFragment): string {
    if (!fr?.entries || !fr.entries.length) {
      return '';
    }

    const sb: string[] = [];
    sb.push('<article class="apparatus-summary">');

    // location
    this.appendTextSpan('adpar-loc', fr.location, sb);
    // tag
    if (fr.tag) {
      sb.push(' ');
      this.appendTextSpan('adpar-tag', fr.tag, sb);
      sb.push(' ');
    }

    // entries
    if (fr.entries.some((e) => e.groupId)) {
      const groups: any = this.groupBy(
        fr.entries,
        (entry) => entry.groupId || ''
      );
      for (let groupId in groups) {
        if (groups.hasOwnProperty(groupId)) {
          this.appendTextSpan('adpar-group', '[' + groupId + ']', sb);
          sb.push(': ');
          const entries = groups[groupId] as ApparatusEntry[];
          for (let i = 0; i < entries.length; i++) {
            if (i > 0) {
              sb.push(' | ');
            }
            this.appendEntry(entries[i], sb);
          }
        }
      }
    } else {
      for (let i = 0; i < fr.entries.length; i++) {
        if (i > 0) {
          sb.push(' | ');
        }
        this.appendEntry(fr.entries[i], sb);
      }
    }

    sb.push('</article');
    return sb.join('');
  }
}
