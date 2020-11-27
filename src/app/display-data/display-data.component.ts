import {
  Component,
  Inject,
  OnInit,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { isPlatformServer } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { TreeNode } from './tree-node';

const STATE_KEY_ITEMS = makeStateKey('items');
@Component({
  selector: 'app-display-data',
  templateUrl: './display-data.component.html',
  styleUrls: ['./display-data.component.scss'],
})
export class DisplayDataComponent implements OnInit {
  treeControl = new NestedTreeControl<TreeNode>((node) => node.value);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  constructor(
    private state: TransferState,
    @Inject(PLATFORM_ID) private readonly platform: any,
    @Optional() @Inject(REQUEST) private readonly request: any
  ) {
    if (isPlatformServer(this.platform)) {
      const data = this.transform(this.request.auth ? JSON.parse(this.request.auth?.req) : []);
      this.state.set(STATE_KEY_ITEMS, data);
    }
    this.dataSource.data = this.state.get(STATE_KEY_ITEMS, []);
  }

  ngOnInit(): void {}
  private transform(obj: any): TreeNode[] {
    const parent = new Array();
    if (Array.isArray(obj)) {
      for (let index = 0; index < obj.length; index++) {
        const value = obj[index];
        let valueType: any;
        if (typeof value === 'string') {
          valueType = value;
        }
        if (typeof value === 'number') {
          valueType = value;
        }
        parent.push({ key: index, value: valueType || this.transform(value),
          type: Array.isArray(value) ? 'array' : typeof value });
      }
      return parent;
    }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        let valueType: any;
        if (typeof value === 'string') {
          valueType = value;
        }
        if (typeof value === 'number') {
          valueType = value;
        }
        parent.push({ key, value: valueType || this.transform(value), type: Array.isArray(value) ? 'array' : typeof value });
      }
    }
    return parent;
  }
  hasChild = (_: number, node: TreeNode) =>
    !!node.value && Array.isArray(node.value) && node.value.length > 0
}
