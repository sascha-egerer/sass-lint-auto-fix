import BaseResolver from './base-resolver';
import AbstractSyntaxTree, { TreeNode } from './typings/abstract-syntax-tree';

const gonzales = require('gonzales-pe-sl');

export default class SpaceBeforeBang extends BaseResolver {
  fix(): AbstractSyntaxTree {
    const { ast } = this;

    ast.traverseByTypes(
      ['important', 'default', 'global', 'optional'],
      (_: any, index: number, parent: TreeNode) => {
        const prev = parent.content[index - 1];
        const isSpace = prev.is('space');

        if (this.shouldAddSpaceBeforeBang()) {
          if (!isSpace) {
            const spaceNode = gonzales.createNode({
              type: 'space',
              content: ' ',
            });
            parent.content.splice(index, 0, spaceNode);
          }
        } else if (isSpace) {
          parent.removeChild(index - 1);
        }
      },
    );
    return ast;
  }

  shouldAddSpaceBeforeBang(): boolean {
    return this.parser.options.include;
  }
}
