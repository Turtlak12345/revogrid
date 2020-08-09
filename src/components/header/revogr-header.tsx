import {Component, Element, Event, EventEmitter, h, Prop} from '@stencil/core';
import {HTMLStencilElement} from '@stencil/core/internal';

import {DATA_COL, HEADER_CLASS} from '../../utils/consts';
import moduleRegister from '../../services/moduleRegister';
import HeaderService from './headerService';
import {ColumnDataSchemaRegular, Pin, VirtualPositionItem} from "../../interfaces";
import columnProvider from "../../services/column.data.provider";

@Component({
  tag: 'revogr-header'
})
export class RevogrHeaderComponent {
  @Element() element!: HTMLStencilElement;
  @Prop() resize: boolean;
  @Prop() cols: VirtualPositionItem[];
  @Prop() pinned: Pin;
  @Event() headerClick: EventEmitter<ColumnDataSchemaRegular>;

  connectedCallback(): void {
    const service: HeaderService = new HeaderService(`${moduleRegister.baseClass} .${HEADER_CLASS}`, {
      resize: this.resize,
      headerClick: (col: ColumnDataSchemaRegular): void => {
        this.headerClick.emit(col);
      }
    });
    moduleRegister.register('headResize', service);
  }

  disconnectedCallback(): void {
    moduleRegister.unregister('headResize');
  }

  render() {
    const cells:HTMLElement[] = [];
    for (let col of this.cols) {
      const dataProps = {
        [DATA_COL]: col.itemIndex,
        class: HEADER_CLASS,
        style: { width:  `${col.size}px`, transform: `translateX(${col.start}px)` }
      };
      cells.push(<div {...dataProps}>{columnProvider.data(col.itemIndex, this.pinned)}</div>);
    }
    return cells;
  }
}
