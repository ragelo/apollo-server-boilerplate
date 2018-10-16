import { nodeDefinitions } from 'graphql-relay';
import { getUserById } from '../../models/user';

enum Node {
    User = 'User',
    Viewer = 'Viewer'
}

type NodeType = Extract<keyof typeof Node, string>

export function toGlobalId(nodeName: NodeType, id: string | number): string {
  return Buffer.from(`${nodeName}:${id}`).toString('base64');
}

export interface NodeInfo {
    id: number | string;
    nodeName: string;
}

export function fromGlobalId(globalId: string, nodeNamesToCheck?: NodeType[]| NodeType): NodeInfo {
  const encodedStr = Buffer.from(globalId, 'base64').toString('ascii');
  const [nodeName, idString] = encodedStr.split(':');

  const id = !isNaN(Number(idString)) ? Number(idString) : idString;

  if (nodeNamesToCheck) {
    if (typeof nodeNamesToCheck === 'string') {
      nodeNamesToCheck = [nodeNamesToCheck]
    }

    if (nodeNamesToCheck.indexOf(nodeName as any) < 0) {
      throw new Error(`Invalid id. Expected: ${nodeNamesToCheck}, found: ${nodeName}`);
    }
  }

  return {id, nodeName};
}

const {nodeInterface, nodeField: NodeGQLType} = nodeDefinitions(
    (globalId: string) => {
        const {id, nodeName} = fromGlobalId(globalId);

        if (nodeName === 'User' && typeof(id) === 'number') {
            return getUserById(id);
        }

        throw new Error('Invalid type or ref');
    },
    (obj) => {
        // TODO
        return 'User';
    },
)

export const NodeGQLInterface = nodeInterface
export default NodeGQLType;
